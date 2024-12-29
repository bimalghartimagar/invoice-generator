<script setup lang="ts">
defineProps({
  disabled: Boolean,
  large: Boolean,
  small: Boolean,
});
</script>
<template>
  <button
    class="w-fit"
    :class="{
      'bg-gray-400 pointer-events-none text-gray-500': disabled,
      'bg-slate-600 hover:bg-slate-700 text-white': !disabled,
      'px-2 py-1': !large && !small,
      'px-4 py-2': large && !small,
      'px-1 py-0.5 text-xs': small && !large,
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  @apply rounded-md shadow-md shadow-slate-500 hover:shadow-slate-600 font-semibold tracking-wider print:hidden;
}
</style>
