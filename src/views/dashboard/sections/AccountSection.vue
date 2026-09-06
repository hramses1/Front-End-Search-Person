<template>
  <div class="space-y-xl animate-fade-in max-w-3xl">
    <div>
      <h2 class="text-h4 font-light tracking-tight mb-xs">Mis datos</h2>
      <p class="text-body text-[var(--text-secondary)]">
        Descarga todo lo que guardamos de ti, o borra tu cuenta.
      </p>
    </div>

    <!-- Portabilidad -->
    <section class="glass-card p-lg">
      <h3 class="text-body font-medium mb-xs">Descargar mis datos</h3>
      <p class="text-body leading-relaxed text-[var(--text-secondary)] mb-lg prose-limit">
        Un archivo JSON con tu cuenta, tu plan y tu historial de consultas. Es tu derecho de
        portabilidad: los datos son tuyos y puedes llevártelos cuando quieras.
      </p>

      <button type="button" class="btn-secondary" :disabled="exportando" @click="exportar">
        <span v-if="exportando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current"></span>
        {{ exportando ? 'Preparando…' : 'Descargar mis datos' }}
      </button>

      <p v-if="errorExport" class="text-caption text-[var(--estado-error)] mt-md">{{ errorExport }}</p>
      <p v-else-if="descargado" class="text-caption text-[var(--estado-exito)] mt-md">
        Descarga lista. Revisa tu carpeta de descargas.
      </p>
    </section>

    <!--
      Borrado. Va en dos pasos y con la palabra escrita a mano: es
      irreversible, y un solo clic de confirmacion es demasiado poco para algo
      que no se puede deshacer.
    -->
    <section class="glass-card p-lg border-[var(--estado-error)]/30">
      <h3 class="text-body font-medium mb-xs" style="color: var(--estado-error);">Eliminar mi cuenta</h3>
      <p class="text-body leading-relaxed text-[var(--text-secondary)] mb-lg prose-limit">
        Se borran tu cuenta, tu plan y tu historial de consultas. La acción es permanente y no se
        puede deshacer. Si solo quieres una copia de tus datos, descárgalos antes.
      </p>

      <template v-if="!confirmando">
        <button
          type="button"
          class="inline-flex items-center justify-center min-h-[3rem] px-lg rounded-base border text-caption font-medium transition-all"
          style="border-color: var(--estado-error); color: var(--estado-error);"
          @click="confirmando = true"
        >
          Quiero eliminar mi cuenta
        </button>
      </template>

      <template v-else>
        <div class="rounded-base border p-lg" style="border-color: var(--estado-error); background-color: color-mix(in srgb, var(--estado-error) 6%, transparent);">
          <p class="text-body font-medium mb-md" style="color: var(--estado-error);">
            Esto no se puede deshacer
          </p>

          <label for="confirmacion" class="!static !translate-y-0 !scale-100 block text-caption text-[var(--text-secondary)] mb-sm">
            Escribe <strong class="text-[var(--text-primary)]">ELIMINAR</strong> para confirmar
          </label>
          <input
            id="confirmacion"
            v-model="palabra"
            type="text"
            autocomplete="off"
            placeholder="ELIMINAR"
            class="w-full min-h-[3rem] px-md rounded-base border bg-transparent text-body text-[var(--text-primary)] mb-lg"
            style="border-color: var(--border-color);"
          />

          <p v-if="errorBorrado" class="text-caption text-[var(--estado-error)] mb-md">{{ errorBorrado }}</p>

          <div class="flex flex-wrap gap-md">
            <button type="button" class="btn-secondary" :disabled="borrando" @click="cancelar">
              Cancelar
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-sm min-h-[3rem] px-lg rounded-base text-caption font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style="background-color: var(--estado-error);"
              :disabled="palabra.trim().toUpperCase() !== 'ELIMINAR' || borrando"
              @click="eliminar"
            >
              <span v-if="borrando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current"></span>
              {{ borrando ? 'Eliminando…' : 'Eliminar definitivamente' }}
            </button>
          </div>

          <!--
            El motivo del bloqueo se dice junto al control, no en un tooltip:
            si el boton esta apagado, hay que poder leer por que.
          -->
          <p v-if="palabra.trim().toUpperCase() !== 'ELIMINAR'" class="text-caption text-[var(--text-muted)] mt-md">
            El botón se activa cuando escribas la palabra exacta.
          </p>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '../../../api/authService';
import { useAuth } from '../../../composables/useAuth';

const { logout } = useAuth();

const exportando = ref(false);
const descargado = ref(false);
const errorExport = ref('');

const confirmando = ref(false);
const palabra = ref('');
const borrando = ref(false);
const errorBorrado = ref('');

const exportar = async () => {
  exportando.value = true;
  errorExport.value = '';
  descargado.value = false;
  try {
    const datos = await authService.exportarCuenta();
    /*
     * La descarga se arma en el navegador con un blob, y la URL se revoca
     * despues: si no, el objeto queda retenido en memoria hasta recargar.
     */
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    descargado.value = true;
  } catch (e: any) {
    errorExport.value = e?.message || 'No se pudo preparar la descarga.';
  } finally {
    exportando.value = false;
  }
};

const cancelar = () => {
  confirmando.value = false;
  palabra.value = '';
  errorBorrado.value = '';
};

const eliminar = async () => {
  if (palabra.value.trim().toUpperCase() !== 'ELIMINAR') return;
  borrando.value = true;
  errorBorrado.value = '';
  try {
    await authService.eliminarCuenta();
    // La sesion ya no vale para nada: se limpia antes de salir, para que no
    // quede un token de una cuenta que ya no existe.
    logout();
    window.location.href = '/';
  } catch (e: any) {
    errorBorrado.value = e?.message || 'No se pudo eliminar la cuenta.';
    borrando.value = false;
  }
};
</script>
