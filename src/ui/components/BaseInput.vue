<template>
  <div class="space-y-xs">
    <div class="relative input-container">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :required="required"
        :maxlength="maxlength"
        :inputmode="inputmode"
        :aria-describedby="ayuda || error ? `${id}-ayuda` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        placeholder=" "
        class="custom-input peer"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <label :for="id">{{ label }}</label>
    </div>

    <!--
      Microcopy: explica por que se pide el dato. En campos sensibles evita que
      el usuario abandone por desconfianza.
    -->
    <p v-if="ayuda && !error" :id="`${id}-ayuda`" class="text-caption text-[var(--text-muted)]">
      {{ ayuda }}
    </p>

    <!-- El error nunca se comunica solo con color: lleva icono y texto. -->
    <p v-if="error" :id="`${id}-ayuda`" class="flex items-start gap-xs text-caption" style="color: var(--estado-error);">
      <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string | number;
  type?: string;
  required?: boolean;
  maxlength?: number;
  inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'search' | 'url' | 'decimal' | 'none';
  /** Por que se pide este dato. */
  ayuda?: string;
  error?: string;
}>();

defineEmits<{ (e: 'update:modelValue', v: string): void }>();
</script>
