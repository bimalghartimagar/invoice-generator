<template>
  <div class="">
    <div class="lg:flex bg-slate-200 rounded hidden print:flex print:justify-around">
      <div class="p-0.5 m-0.5 flex-auto w-full lg:w-52 print:w-22 ">Description</div>
      <div class="p-0.5 m-0.5 flex-none w-10 lg:w-32 print:w-32 ">Quantity</div>
      <div class="p-0.5 m-0.5 flex-none w-10 lg:w-32 print:w-32 ">Rate</div>
      <div class="p-0.5 m-0.5 flex-none w-10 lg:w-32 print:w-32 ">Amount</div>
    </div>
    <div class="lg:hidden bg-slate-200 rounded print:hidden">Line Items</div>
    <div class="overflow-y-auto max-h-48 print:h-auto">
      <template
        v-for="(item, index) in items"
        :key="item.id"
      >
        <LineItem
          :item="item"
          :index="index"
          :hide-close="index === 0 && items.length <= 1"
          :invoice-id="invoiceId"
          @update-item="updateItem"
          @close="removeItem"
        />
      </template>
    </div>
    <CustomButton
      class="mt-1 float-left ml-1 text-sm"
      @click="$emit('add-item')"
    >
      Add Item
    </CustomButton>
  </div>
</template>

<script setup lang="ts">
import LineItem from "./LineItem.vue";
import CustomButton from "./CustomButton.vue";
import { Invoice, InvoiceItem } from "../types/index.type";

defineProps<{
  items: InvoiceItem[];
  invoiceId: number;
}>();
const emits = defineEmits<{
  (event: "update-item", item: InvoiceItem, index: number): void
  (event: "close", payload: any): void
  (event: "add-item"): void
}>();

function removeItem(payload) {
  emits("close", payload)
}

function updateItem(item: InvoiceItem, index: number) {
  emits('update-item', item, index)
}
</script>
