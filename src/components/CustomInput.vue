<script setup>
import { computed } from "@vue/reactivity";
import CustomToggleSwitch from "./CustomToggleSwitch.vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  currency: {
    type: Boolean,
  },
  toggle: {
    type: Boolean,
  },
  isUsed: {
    type: Boolean,
  },
  inputType: {
    type: String,
    required: true,
    default: "number",
  },
});
defineEmits(["update:modelValue"]);

const idFor = computed(() => props.label.toLowerCase().replace(/ /g, "-"));
</script>
<template>
  <div class="flex flex-row items-end justify-end mt-1 text-right">
    <label class="mr-2" :for="idFor">{{ label }}</label>
    <div class="border border-slate-500 rounded-md p-0.5 flex">
      <div v-if="currency" class="mx-2">$</div>
      <input
        :id="idFor"
        class="outline-none"
        :value="modelValue"
        :type="inputType"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div v-if="toggle" class="ml-2">%</div>
      <CustomToggleSwitch v-if="toggle" />
    </div>
    <div v-if="isUsed" class="flex items-center ml-1 cursor-pointer pb-1">
      X
    </div>
  </div>
</template>

<style>
input::focus-visible {
  @apply border-0;
}
</style>
