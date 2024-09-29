<script setup>
import { computed } from "@vue/reactivity";

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
    default: "w-full",
  }
});
defineEmits(["update:modelValue", "close"]);

const idFor = computed(() => props.label.toLowerCase().replace(/ /g, "-"));

const printValue = computed(() => {
  return `${props.currency ? "$" : ""}${
    props.modelValue == undefined ? props.value : props.modelValue
  }${props.toggle && !props.currency ? "%" : ""}`;
});
</script>
<script>
// stop inherting attrs for ignoring fragment warning
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="border border-slate-500 rounded p-0.5 flex print:hidden w-full">
    <div v-show="currency" class="mx-2">$</div>
    <input
      :id="idFor"
      class="outline-none"
      :class="{
        [inputClass]: true,
        'text-right':
          !currency && $attrs['type'] !== 'text' && $attrs['type'] !== 'date',
      }"
      :value="modelValue == undefined ? value : modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-show="toggle && !currency" class="ml-2">%</div>
    <slot></slot>
  </div>
  <div
    v-if="isUsed"
    class="flex items-center ml-1 cursor-pointer pb-1 absolute -right-3 top-1 print:hidden text-sm"
    @click="$emit('close')"
  >
    x
  </div>
  <div class="hidden print:block">{{ printValue }}</div>
</template>

<style>
input::focus-visible {
  @apply border-0;
}
</style>
