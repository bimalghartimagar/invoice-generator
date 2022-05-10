<script setup>
import { computed } from "@vue/reactivity";
import CustomToggleSwitch from "./CustomToggleSwitch.vue";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: undefined,
    required: false,
  },
  label: {
    type: String,
    default: "",
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
    default: "number",
  },
  value: {
    type: [Number, String],
    default: "",
    required: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
});
defineEmits(["update:modelValue"]);

const idFor = computed(() => props.label.toLowerCase().replace(/ /g, "-"));
</script>
<script>
// used to stop inherting attrs to fragment warning
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="border border-slate-500 rounded-md p-0.5 flex">
    <div v-if="currency" class="mx-2">$</div>
    <input
      :id="idFor"
      class="outline-none w-full"
      :class="inputClass"
      :value="modelValue == undefined ? value : modelValue"
      :type="inputType"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="toggle" class="ml-2">%</div>
    <CustomToggleSwitch v-if="toggle" />
  </div>
  <div v-if="isUsed" class="flex items-center ml-1 cursor-pointer pb-1">X</div>
</template>

<style>
input::focus-visible {
  @apply border-0;
}
</style>
