<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
});
const idFor = computed(() => props.label.toLowerCase().replace(/ /g, "-"));
</script>
<template>
  <div class="flex flex-row items-end justify-end mt-1 text-right">
    <label class="mr-2" :for="idFor">{{ label }}:</label>
    <div
      class="w-52 flex flex-row justify-end items-end relative print:min-w-min"
    >
      <slot></slot>
    </div>
  </div>
</template>
