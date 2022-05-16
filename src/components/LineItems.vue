<template>
  <div class="bg-slate-50 mx-auto h-min w-8/12">
    <div class="flex bg-slate-200 rounded">
      <div class="p-0.5 m-0.5 flex-auto w-52">Description</div>
      <div class="p-0.5 m-0.5 flex-none w-32">Quantity</div>
      <div class="p-0.5 m-0.5 flex-none w-32">Rate</div>
      <div class="p-0.5 m-0.5 flex-none w-32">Amount</div>
    </div>
    <template v-for="(item, index) in items" :key="item.id">
      <LineItem
        :item="item"
        :index="index"
        :hide-close="index === 0 && items.length <= 1"
        @update-item="$emit('udpate-item')"
        @close="$emit('close')"
      />
    </template>

    <CustomButton class="mt-1 float-left ml-1" @click="$emit('add-item')">
      Add Item
    </CustomButton>
  </div>
</template>

<script setup>
import LineItem from "./LineItem.vue";
import CustomButton from "./CustomButton.vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});
defineEmits(["udpate-item", "close", "add-item"]);
</script>
