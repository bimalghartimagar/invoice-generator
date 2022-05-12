<script setup>
defineProps({
  modelValue: {
    type: Boolean,
  },
  forValue: {
    type: String,
    required: true,
  },
});
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex justify-center mx-2">
    <label :for="forValue" class="flex items-center cursor-pointer">
      <div class="relative">
        <input
          :id="forValue"
          type="checkbox"
          class="sr-only"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <div class="block bg-gray-600 w-6 h-4 rounded-full"></div>
        <div
          class="dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition"
        ></div>
      </div>
    </label>
  </div>
</template>
<style>
input:checked ~ .dot {
  transform: translateX(100%);
  @apply bg-green-500;
}
</style>
