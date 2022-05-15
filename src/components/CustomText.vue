<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: null,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isInvalid: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex flex-col items-start mt-4">
    <label
      for="details"
      :class="isRequired && isInvalid ? 'text-red-600' : 'text-slate-500'"
      >{{ label }}</label
    ><textarea
      id="details"
      :value="modelValue"
      name=""
      cols="30"
      rows="2"
      class="border rounded-md p-0.5"
      :class="isRequired && isInvalid ? 'border-red-600' : 'border-slate-500'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="hidden print:inline-block text-left">{{ modelValue }}</div>
  </div>
</template>
