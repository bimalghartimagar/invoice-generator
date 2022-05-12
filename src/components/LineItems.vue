<script setup>
import { computed, ref } from "@vue/reactivity";
import { watch } from "vue";
import CustomInput from "./CustomInput.vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["update-item", "close"]);
const lineItem = ref(props.item);
const amount = computed(() => lineItem.value.rate * lineItem.value.quantity);

watch(lineItem, () => {
  emits("update-item", lineItem, props.index);
});
const removeItem = () => {
  emits("close", props.index);
};
</script>
<template>
  <div class="flex">
    <div class="m-0.5 flex-auto w-52">
      <CustomInput
        v-model="lineItem.description"
        input-type="text"
        label="Description"
      />
    </div>
    <div class="m-0.5 flex-none w-32">
      <CustomInput v-model="lineItem.quantity" />
    </div>
    <div class="m-0.5 flex-none w-32">
      <CustomInput v-model="lineItem.rate" currency />
    </div>
    <div class="m-0.5 flex-none w-32 flex">
      <CustomInput
        v-model="amount"
        currency
        is-used
        disabled
        @close="removeItem"
      />
    </div>
  </div>
</template>
