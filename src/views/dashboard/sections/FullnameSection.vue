<template>
  <ServiceSection
    :isLoading="isLoading"
    :errorMsg="errorMsg"
    :results="filteredResults"
    @search="executeSearch"
    @copy="copyResults"
  >
    <template #fields>
      <div class="space-y-8 py-4">
        <div class="mb-2">
          <h2 class="text-[20px] font-light tracking-[-0.02em] text-[var(--text-primary)] leading-tight">
            Búsqueda por <span class="font-medium text-[var(--accent-color)]">Nombre</span>
          </h2>
          <p class="text-[11px] uppercase tracking-[0.15em] opacity-40 mt-1 font-medium">Identificación de Personas Naturales</p>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <div class="relative group input-container">
            <input v-model="name" type="text" id="name" placeholder=" " class="custom-input peer" />
            <label for="name">Nombres Completos</label>
            <div class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-500 group-focus-within:w-full"></div>
          </div>
          
          <div class="relative group input-container">
            <input v-model="lastname" type="text" id="lastname" placeholder=" " class="custom-input peer" />
            <label for="lastname">Apellidos Completos</label>
            <div class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-500 group-focus-within:w-full"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Panel de filtros — Rediseño Bento Premium -->
    <template #filters>
      <transition
        enter-active-class="transition duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        enter-from-class="opacity-0 translate-y-8 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="rawResults && rawResults.length > 0" class="mt-10 space-y-8">
          <div class="flex items-end justify-between border-b border-[var(--border-color)] pb-4">
            <div>
              <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--accent-color)] opacity-30">Filtros Inteligentes</span>
              <h3 class="text-sm font-medium tracking-tight mt-1">Refinar resultados actuales</h3>
            </div>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-[10px] font-bold tracking-widest uppercase text-[var(--accent-color)] hover:opacity-100 transition-all border-b border-[var(--accent-color)]/40 pb-0.5"
            >
              Resetear Filtros
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <!-- Bloque: Búsqueda Rápida Interna -->
            <div class="glass-panel p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow duration-500">
               <div class="flex items-center gap-2 mb-1">
                 <svg class="w-3.5 h-3.5 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70">Búsqueda Interna</span>
               </div>
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input v-model="filterName" type="text" placeholder="Filtrar nombre..." class="w-full bg-transparent border-b border-[var(--border-color)] py-2 text-xs outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
                 <input v-model="filterLastname" type="text" placeholder="Filtrar apellido..." class="w-full bg-transparent border-b border-[var(--border-color)] py-2 text-xs outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70 mb-3">Cédula / RUC</span>
                <input v-model="filterCedula" type="text" placeholder="0000000000" class="bg-transparent border-b border-[var(--border-color)] py-2 text-xs outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
              </div>
              <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70 mb-3">Localidad</span>
                <input v-model="filterCity" type="text" placeholder="Ciudad..." class="bg-transparent border-b border-[var(--border-color)] py-2 text-xs outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]" />
              </div>
            </div>

            <div class="glass-panel p-5 rounded-2xl shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70">Rango de Edad</span>
                <span class="text-[10px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/5 px-2 py-0.5 rounded-lg">{{ filterAgeMin || 0 }} — {{ filterAgeMax || 100 }}</span>
              </div>
              <div class="flex items-center gap-4">
                <input v-model.number="filterAgeMin" type="number" placeholder="Mín" class="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[11px] outline-none focus:border-[var(--accent-color)] text-center transition-all text-[var(--text-primary)]" />
                <div class="w-4 h-[1px] bg-[var(--border-color)]"></div>
                <input v-model.number="filterAgeMax" type="number" placeholder="Máx" class="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[11px] outline-none focus:border-[var(--accent-color)] text-center transition-all text-[var(--text-primary)]" />
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="availableGenders.length > 0" class="glass-panel p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-4">
                   <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70">Género</span>
                   <span v-if="filterGender" class="text-[8px] bg-[var(--accent-color)] text-[var(--bg-color)] px-2 py-0.5 rounded-full font-bold">1 SELECCIONADO</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button v-for="g in availableGenders" :key="g" @click="filterGender = filterGender === g ? '' : g" :class="['px-4 py-2 rounded-full text-[10px] tracking-wider transition-all duration-300 uppercase font-bold border-2', filterGender === g ? 'bg-[var(--accent-color)] text-[var(--accent-inverse)] border-[var(--accent-color)] shadow-md' : 'bg-white border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)]']">{{ g }}</button>
                </div>
              </div>

              <div v-if="availableNationalities.length > 0" class="glass-panel p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-4">
                   <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70">Nacionalidad</span>
                   <span v-if="filterNationalities.length > 0" class="text-[8px] bg-[var(--accent-color)] text-[var(--accent-inverse)] px-2 py-0.5 rounded-full font-bold">{{ filterNationalities.length }} SELECCIONADOS</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button v-for="nat in availableNationalities" :key="nat" @click="toggleNationality(nat)" :class="['px-4 py-2 rounded-full text-[10px] tracking-wider transition-all duration-300 uppercase font-bold border-2', filterNationalities.includes(nat) ? 'bg-[var(--accent-color)] text-[var(--accent-inverse)] border-[var(--accent-color)] shadow-md' : 'bg-white border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)]']">{{ nat }}</button>
                </div>
              </div>

              <div v-if="availableMaritalStatuses.length > 0" class="glass-panel p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-4">
                   <span class="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] opacity-70">Estado Civil</span>
                   <span v-if="filterMaritalStatus" class="text-[8px] bg-[var(--accent-color)] text-[var(--accent-inverse)] px-2 py-0.5 rounded-full font-bold">1 SELECCIONADO</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button v-for="ms in availableMaritalStatuses" :key="ms" @click="filterMaritalStatus = filterMaritalStatus === ms ? '' : ms" :class="['px-4 py-2 rounded-full text-[10px] tracking-wider transition-all duration-300 uppercase font-bold border-2', filterMaritalStatus === ms ? 'bg-[var(--accent-color)] text-[var(--accent-inverse)] border-[var(--accent-color)] shadow-md' : 'bg-white border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)]']">{{ ms }}</button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <div class="bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
              <p class="text-[9px] text-[var(--accent-color)] uppercase tracking-[0.2em] font-bold">
                Mostrando {{ filteredResults?.length ?? 0 }} de {{ rawResults.length }} encontrados
              </p>
            </div>
          </div>
        </div>
      </transition>
    </template>

    <template #results="{ data }">
      <div v-if="Array.isArray(data)" class="grid grid-cols-1 gap-6 animate-fade-in-up">
        <div v-for="(item, idx) in data" :key="idx" class="group relative bg-[var(--input-bg)]/40 p-6 rounded-3xl border border-[var(--border-color)]/60 hover:border-[var(--accent-color)]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--accent-color)]/5 overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-[var(--accent-color)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent-color)]/10 transition-colors"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
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
