<template>
  <ServiceSection
    :isLoading="isLoading"
    :errorMsg="errorMsg"
    :results="filteredResults"
    @search="executeSearch"
    @copy="copyResults"
  >
    <template #fields>
      <div class="space-y-xl py-md">
        <div class="mb-sm">
          <h2 class="text-lead font-light tracking-[-0.02em] text-[var(--text-primary)] leading-tight">
            Búsqueda por <span class="font-medium text-[var(--accent-color)]">Nombre</span>
          </h2>
          <p class="text-body uppercase tracking-[0.15em] text-[var(--text-muted)] mt-xs font-medium">Identificación de Personas Naturales</p>
        </div>

        <div class="grid grid-cols-1 gap-xl">
          <div class="relative group input-container">
            <input v-model="name" type="text" id="name" placeholder=" " class="custom-input peer" />
            <label for="name">Nombres Completos</label>
            <div class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-base group-focus-within:w-full"></div>
          </div>
          
          <div class="relative group input-container">
            <input v-model="lastname" type="text" id="lastname" placeholder=" " class="custom-input peer" />
            <label for="lastname">Apellidos Completos</label>
            <div class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-base group-focus-within:w-full"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Panel de filtros — Rediseño Bento Premium -->
    <template #filters>
      <transition
        enter-active-class="transition duration-base ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        enter-from-class="opacity-0 translate-y-8 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-base ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="rawResults && rawResults.length > 0" class="mt-2xl space-y-xl">
          <div class="flex items-end justify-between border-b border-[var(--border-color)] pb-md">
            <div>
              <span class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)]">Filtros Inteligentes</span>
              <h3 class="text-body font-medium tracking-tight mt-xs">Refinar resultados actuales</h3>
            </div>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] transition-all border-b border-[var(--accent-color)]/40 pb-xs"
            >
              Resetear Filtros
            </button>
          </div>

          <div class="grid grid-cols-1 gap-md">
            <!-- Bloque: Búsqueda Rápida Interna -->
            <div class="glass-panel p-lg rounded-base space-y-md shadow-sm hover:shadow-md transition-shadow duration-base">
               <div class="flex items-center gap-sm mb-xs">
                 <svg class="w-3.5 h-3.5 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">Búsqueda Interna</span>
               </div>
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-md">
                 <input v-model="filterName" type="text" placeholder="Filtrar nombre..." class="w-full bg-transparent border-b border-[var(--border-color)] py-sm text-caption outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
                 <input v-model="filterLastname" type="text" placeholder="Filtrar apellido..." class="w-full bg-transparent border-b border-[var(--border-color)] py-sm text-caption outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div class="glass-panel p-lg rounded-base flex flex-col justify-between shadow-sm">
                <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)] mb-md">Cédula / RUC</span>
                <input v-model="filterCedula" type="text" placeholder="0000000000" class="bg-transparent border-b border-[var(--border-color)] py-sm text-caption outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
              </div>
              <div class="glass-panel p-lg rounded-base flex flex-col justify-between shadow-sm">
                <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)] mb-md">Localidad</span>
                <input v-model="filterCity" type="text" placeholder="Ciudad..." class="bg-transparent border-b border-[var(--border-color)] py-sm text-caption outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
              </div>
            </div>

            <div class="glass-panel p-lg rounded-base shadow-sm">
              <div class="flex items-center justify-between mb-md">
                <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">Rango de Edad</span>
                <span class="text-caption font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/5 px-sm py-xs rounded-base">{{ filterAgeMin || 0 }} — {{ filterAgeMax || 100 }}</span>
              </div>
              <div class="flex items-center gap-md">
                <input v-model.number="filterAgeMin" type="number" placeholder="Mín" class="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-base px-md py-sm text-body outline-none focus:border-[var(--accent-color)] text-center transition-all text-[var(--text-primary)]" />
                <div class="w-4 h-[1px] bg-[var(--border-color)]"></div>
                <input v-model.number="filterAgeMax" type="number" placeholder="Máx" class="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-base px-md py-sm text-body outline-none focus:border-[var(--accent-color)] text-center transition-all text-[var(--text-primary)]" />
              </div>
            </div>

            <div class="space-y-md">
              <div v-if="availableGenders.length > 0" class="glass-panel p-lg rounded-base shadow-sm">
                <div class="flex items-center justify-between mb-md">
                   <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">Género</span>
                   <span v-if="filterGender" class="text-caption bg-[var(--accent-color)] text-[var(--bg-color)] px-sm py-xs rounded-full font-bold">1 SELECCIONADO</span>
                </div>
                <div class="flex flex-wrap gap-sm">
                  <button v-for="g in availableGenders" :key="g" @click="filterGender = filterGender === g ? '' : g" class="chip" :aria-pressed="filterGender === g">{{ g }}</button>
                </div>
              </div>

              <div v-if="availableNationalities.length > 0" class="glass-panel p-lg rounded-base shadow-sm">
                <div class="flex items-center justify-between mb-md">
                   <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">Nacionalidad</span>
                   <span v-if="filterNationalities.length > 0" class="text-caption bg-[var(--accent-color)] text-[var(--accent-inverse)] px-sm py-xs rounded-full font-bold">{{ filterNationalities.length }} SELECCIONADOS</span>
                </div>
                <div class="flex flex-wrap gap-sm">
                  <button v-for="nat in availableNationalities" :key="nat" @click="toggleNationality(nat)" class="chip" :aria-pressed="filterNationalities.includes(nat)">{{ nat }}</button>
                </div>
              </div>

              <div v-if="availableMaritalStatuses.length > 0" class="glass-panel p-lg rounded-base shadow-sm">
                <div class="flex items-center justify-between mb-md">
                   <span class="text-caption font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">Estado Civil</span>
                   <span v-if="filterMaritalStatus" class="text-caption bg-[var(--accent-color)] text-[var(--accent-inverse)] px-sm py-xs rounded-full font-bold">1 SELECCIONADO</span>
                </div>
                <div class="flex flex-wrap gap-sm">
                  <button v-for="ms in availableMaritalStatuses" :key="ms" @click="filterMaritalStatus = filterMaritalStatus === ms ? '' : ms" class="chip" :aria-pressed="filterMaritalStatus === ms">{{ ms }}</button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-md">
            <div class="bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/10 px-md py-sm rounded-base flex items-center gap-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
              <p class="text-overline text-[var(--accent-color)] uppercase tracking-[0.14em] font-bold">
                Mostrando {{ filteredResults?.length ?? 0 }} de {{ rawResults.length }} encontrados
              </p>
            </div>
          </div>
        </div>
      </transition>
    </template>

    <template #results="{ data }">
      <!--
        Con muchas coincidencias, volcar todos los campos de cada persona
        producia un muro imposible de recorrer. Ahora cada resultado es una
        fila con lo justo para identificarla, y se despliega para ver el resto.
      -->
      <div v-if="Array.isArray(data)" class="space-y-sm animate-fade-in-up">
        <div class="flex items-center justify-between gap-md pb-sm">
          <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {{ data.length }} {{ data.length === 1 ? 'coincidencia' : 'coincidencias' }}
          </p>
          <!--
            Solo se ofrece con pocas coincidencias: cada ficha desplegada son
            una docena de tarjetas, asi que abrir cien de golpe congelaria la
            vista un instante sin que el usuario sepa por que.
          -->
          <button
            v-if="data.length > 1 && data.length <= LIMITE_EXPANDIR"
            type="button"
            class="btn-tertiary"
            @click="expandido = expandido === -2 ? -1 : -2"
          >
            {{ expandido === -2 ? 'Contraer todo' : 'Expandir todo' }}
          </button>
        </div>

        <div
          v-for="(item, idx) in data" :key="idx"
          class="glass-card overflow-hidden"
        >
          <button
            type="button"
            class="w-full flex items-center gap-md p-md text-left transition-colors"
            :aria-expanded="estaAbierto(idx)"
            @click="alternar(idx)"
          >
            <span class="flex-1 min-w-0">
              <span class="block text-body font-semibold truncate">{{ nombreCompleto(item) }}</span>
              <span class="block text-overline font-mono text-[var(--text-muted)] mt-xs">
                {{ getValue(item, 'Ci') || 'Sin cédula' }}
              </span>
            </span>

            <span class="hidden md:flex items-center gap-xs shrink-0">
              <span v-for="c in resumen(item)" :key="c" class="badge-base text-overline">{{ c }}</span>
            </span>

            <svg
              class="w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-base"
              :class="estaAbierto(idx) ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="estaAbierto(idx)"
            class="border-t border-[var(--border-color)] px-md pb-md pt-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-xl gap-y-sm"
          >
            <ResultCard v-for="(v, k) in item" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <ResultCard v-for="(v, k) in data" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
      </div>
    </template>
  </ServiceSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ServiceSection from '../components/ServiceSection.vue';
import ResultCard from '../../../components/ResultCard.vue';
import { apiService } from '../../../api/apiService';
import { mapKey, detectType } from '../../../utils/formatters';

// ── Búsqueda principal ──────────────────────────────────────
const name = ref('');
const lastname = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const rawResults = ref<any[] | null>(null);

// ── Filtros ─────────────────────────────────────────────────
const filterName = ref('');
const filterLastname = ref('');
const filterCedula = ref('');
const filterCity = ref('');
const filterAgeMin = ref<number | ''>('');
const filterAgeMax = ref<number | ''>('');
const filterGender = ref('');
const filterNationalities = ref<string[]>([]);
const filterMaritalStatus = ref('');

const emit = defineEmits(['refresh-stats']);

// ── Helpers robustos ───────────────────────────────────────────
const normalize = (text: any): string => {
  if (text == null || text === "'") return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

// Devuelve el valor exacto del JSON según la clave
/**
 * Indice de la fila desplegada. -1 ninguna, -2 todas.
 */
const expandido = ref(-1);

/** Por encima de esto no se ofrece abrir todas a la vez. */
const LIMITE_EXPANDIR = 15;
const estaAbierto = (idx: number) => expandido.value === -2 || expandido.value === idx;
const alternar = (idx: number) => {
  expandido.value = estaAbierto(idx) && expandido.value !== -2 ? -1 : idx;
};

/** Nombre y apellidos en una linea, para la cabecera de la fila. */
const nombreCompleto = (item: any): string => {
  const n = [getValue(item, 'Nombre'), getValue(item, 'Apellido')].filter(Boolean).join(' ');
  return n || 'Sin nombre registrado';
};

/** Tres datos que distinguen a una persona de otra de un vistazo. */
const resumen = (item: any): string[] => {
  const edad = getValue(item, 'Edad');
  return [
    edad ? `${edad} años` : '',
    getValue(item, 'Ciudad'),
    getValue(item, 'EstadoCivil')
  ].filter(Boolean).slice(0, 3);
};

const getValue = (item: any, key: string): string => {
  if (!item) return '';
  const val = item[key];
  return (val != null && val !== "'") ? String(val).trim() : '';
};

const getAge = (item: any): number | null => {
  // Priorizar campo 'Edad' del JSON
  if (item && typeof item.Edad === 'number') return item.Edad;
  if (item && item.Edad && !isNaN(parseInt(item.Edad))) return parseInt(item.Edad);
  return null;
};

// ── Valores únicos dinámicos para los Chips de Filtro ──────────
const availableGenders = computed(() => {
  if (!rawResults.value?.length) return [];
  const vals = new Set<string>();
  rawResults.value.forEach(item => {
    const v = getValue(item, 'Genero');
    if (v) vals.add(v.toUpperCase());
  });
  return [...vals].sort();
});

const availableNationalities = computed(() => {
  if (!rawResults.value?.length) return [];
  const vals = new Set<string>();
  rawResults.value.forEach(item => {
    const v = getValue(item, 'Nacionalidad');
    if (v) vals.add(v.toUpperCase());
  });
  return [...vals].sort();
});

const availableMaritalStatuses = computed(() => {
  if (!rawResults.value?.length) return [];
  const vals = new Set<string>();
  rawResults.value.forEach(item => {
    const v = getValue(item, 'EstadoCivil');
    if (v) vals.add(v.toUpperCase());
  });
  return [...vals].sort();
});

// ── Lógica de Filtrado Estricta ───────────────────────────────
const filteredResults = computed(() => {
  // Si no hay resultados base, no hay nada que filtrar
  if (!rawResults.value || rawResults.value.length === 0) return null;
  
  let results = [...rawResults.value];

  // 1. Filtro de Nombre
  if (filterName.value.trim()) {
    const q = normalize(filterName.value);
    results = results.filter(item => normalize(getValue(item, 'Nombre')).includes(q));
  }

  // 2. Filtro de Apellido
  if (filterLastname.value.trim()) {
    const q = normalize(filterLastname.value);
    results = results.filter(item => normalize(getValue(item, 'Apellido')).includes(q));
  }

  // 3. Filtro de Cédula
  if (filterCedula.value.trim()) {
    const q = filterCedula.value.trim();
    results = results.filter(item => getValue(item, 'Ci').includes(q));
  }

  // 4. Filtro de Ciudad
  if (filterCity.value.trim()) {
    const q = normalize(filterCity.value);
    results = results.filter(item => normalize(getValue(item, 'Ciudad')).includes(q));
  }

  // 5. Filtro de Edad
  if (filterAgeMin.value !== '' || filterAgeMax.value !== '') {
    results = results.filter(item => {
      const age = getAge(item);
      if (age === null) return false;
      if (filterAgeMin.value !== '' && age < (filterAgeMin.value as number)) return false;
      if (filterAgeMax.value !== '' && age > (filterAgeMax.value as number)) return false;
      return true;
    });
  }

  // 6. Filtro de Género
  if (filterGender.value) {
    results = results.filter(item => {
      const val = getValue(item, 'Genero').toUpperCase();
      return val === filterGender.value.toUpperCase();
    });
  }

  // 7. Filtro de Nacionalidad (Multi-selección)
  if (filterNationalities.value.length > 0) {
    const selected = filterNationalities.value.map(n => n.toUpperCase());
    results = results.filter(item => {
      const val = getValue(item, 'Nacionalidad').toUpperCase();
      return selected.includes(val);
    });
  }

  // 8. Filtro de Estado Civil
  if (filterMaritalStatus.value) {
    results = results.filter(item => {
      const val = getValue(item, 'EstadoCivil').toUpperCase();
      return val === filterMaritalStatus.value.toUpperCase();
    });
  }

  return results;
});

const hasActiveFilters = computed(() =>
  filterName.value.trim() !== '' ||
  filterLastname.value.trim() !== '' ||
  filterCedula.value.trim() !== '' ||
  filterCity.value.trim() !== '' ||
  filterAgeMin.value !== '' ||
  filterAgeMax.value !== '' ||
  filterGender.value !== '' ||
  filterNationalities.value.length > 0 ||
  filterMaritalStatus.value !== ''
);

const toggleNationality = (nat: string) => {
  const idx = filterNationalities.value.indexOf(nat);
  if (idx === -1) {
    filterNationalities.value = [...filterNationalities.value, nat];
  } else {
    filterNationalities.value = filterNationalities.value.filter(n => n !== nat);
  }
};

const clearFilters = () => {
  filterName.value = '';
  filterLastname.value = '';
  filterCedula.value = '';
  filterCity.value = '';
  filterAgeMin.value = '';
  filterAgeMax.value = '';
  filterGender.value = '';
  filterNationalities.value = [];
  filterMaritalStatus.value = '';
};

// ── Búsqueda ─────────────────────────────────────────────────
const executeSearch = async () => {
  const cleanName = name.value.trim();
  const cleanLastname = lastname.value.trim();

  if (!cleanName && !cleanLastname) {
    errorMsg.value = 'Ingrese al menos un nombre o un apellido.';
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  // No limpiamos los filtros aquí para permitir que se apliquen al cargar
  // rawResults.value = null; 

  const apiName     = cleanName     || ' ';
  const apiLastname = cleanLastname || ' ';

  try {
    const data = await apiService.getFullname(apiName, apiLastname);
    // Aseguramos que sea un array y forzamos la reactividad
    rawResults.value = Array.isArray(data) ? [...data] : data ? [{...data}] : [];
    emit('refresh-stats');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'No se encontraron registros.';
    rawResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

const copyResults = () => {
  if (filteredResults.value) {
    navigator.clipboard.writeText(JSON.stringify(filteredResults.value, null, 2));
  }
};
</script>
