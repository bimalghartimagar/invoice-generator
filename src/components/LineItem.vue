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
  hideClose: Boolean,
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
  <div class="flex flex-wrap border border-slate-400 lg:border-0 lg:p-0 my-1 py-1 px-3 rounded">
    <div class="m-0.5 lg:flex-auto w-full lg:w-52">
      <CustomInput
        v-model="lineItem.description"
        type="text"
        label="Description"
      />
    </div>
    <div class="m-0.5 flex-1 lg:flex-none lg:w-32 mt-2 lg:mt-auto">
      <CustomInput v-model="lineItem.quantity" placeholder="Quantity" />
    </div>
    <div class="flex-1 grow-0 self-center lg:hidden  mt-2 lg:mt-auto">x</div>
    <div class="m-0.5 flex-1 lg:flex-none lg:w-32  mt-2 lg:mt-auto">
      <CustomInput v-model="lineItem.rate" currency placeholder="Rate" />
    </div>
    <div class="m-0.5 flex-1 lg:flex-none lg:w-32 lg:flex relative hidden">
      <CustomInput
        v-model="amount"
        currency
        :is-used="!hideClose"
        disabled
        @close="removeItem"
      />
    </div>
    <div class=" mt-2 lg:mt-auto flex-1 self-center lg:hidden">Amount: {{ amount }} <span v-show="!hideClose" class="float-right cursor-pointer px-2 rounded-full border border-black shadow-lg" @click="removeItem">x</span></div>
    
  </div>
</template>
