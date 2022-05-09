<script setup>
import { computed, reactive } from "vue";
import CustomText from "./CustomText.vue";
import CustomButton from "./CustomButton.vue";
import CustomInput from "./CustomInput.vue";

const invoice = reactive({
  logo: "",
  name: "XYZ IT",
  number: "1",
  ponumber: "12AC",
  date: "2022-01-01",
  duedate: "2022-01-07",
  sender: "Vendor Sender details",
  buyer: "Buyer details",
  items: [
    {
      description: "item 1",
      rate: 12.5,
      quantity: 3,
    },
    {
      description: "item 1",
      rate: 11,
      quantity: 5,
    },
    {
      description: "item 1",
      rate: 35,
      quantity: 4,
    },
  ],
  notes: "First month payment",
  terms: "Payment should be done within a week",
  discount: {
    isUsed: false,
    isPercentage: false,
    value: 0,
  },
  tax: {
    isUsed: false,
    isPercentage: false,
    value: 0,
  },
  shipping: 0,
  paid: 0,
});

const isInvalid = (x) => x === null || x?.trim().length === 0;
const isSenderInvalid = computed(() => isInvalid(invoice.sender));
const isBuyerInvalid = computed(() => isInvalid(invoice.buyer));
</script>
<template>
  <main class="h-screen w-screen bg-slate-50">
    <nav class="h-20 bg-slate-600 text-white text-5xl pt-3 print:hidden">
      Invoice Generator
    </nav>
    <aside
      class="complement-height border-l w-4/12 bg-slate-200 float-right py-12 print:hidden"
    >
      <CustomButton large :disabled="isSenderInvalid || isBuyerInvalid">
        Download
      </CustomButton>
    </aside>
    <div class="h-12 bg-slate-50 w-8/12 print:w-full">
      <input
        v-model="invoice.name"
        type="text"
        class="h-12 text-5xl border border-slate-100 hover:cursor-pointer text-center"
      />
    </div>
    <section class="flex flex-col w-8/12 print:w-full">
      <div
        class="complement-height bg-slate-50 grid grid-cols-2 gap-0 py-1 px-4 h-fit"
      >
        <div>
          <div class="logo">
            <div
              class="logo-placeholder w-48 h-28 bg-gray-200 grid place-items-center text-slate-500 text-6xl font-bold"
            >
              LOGO
            </div>
            <img src="" alt="" class="logo" />
          </div>

          <CustomText
            v-model="invoice.sender"
            class="text-sm"
            label="Sender:"
            :is-required="true"
            :is-invalid="isSenderInvalid"
          />

          <CustomText
            v-model="invoice.buyer"
            class="text-sm"
            label="Buyer:"
            :is-required="true"
            :is-invalid="isBuyerInvalid"
          />
        </div>

        <div class="flex flex-col justify-end self-center">
          <CustomInput v-model="invoice.number" label="Invoice Number:" />
          <CustomInput v-model="invoice.ponumber" label="PO Number:" />
          <CustomInput
            v-model="invoice.date"
            label="Date:"
            :input-type="date"
          />
          <CustomInput
            v-model="invoice.duedate"
            label="Due Date:"
            :input-type="date"
          />
        </div>
      </div>

      <div class="bg-slate-50 mx-auto px-1 pb-1 h-min w-full">
        <table class="border-collapse table-auto w-10/12 mx-auto">
          <thead>
            <tr>
              <th
                class="border-b border-slate-600 bg-slate-300 font-semibold pl-8 pt-0 text-slate-500 text-left"
              >
                Description
              </th>
              <th
                class="border-b border-slate-600 bg-slate-300 font-semibold pl-8 pt-0 text-slate-500 text-left"
              >
                Rate
              </th>
              <th
                class="border-b border-slate-600 bg-slate-300 font-semibold pl-8 pt-0 text-slate-500 text-left"
              >
                Quantity
              </th>
              <th
                class="border-b border-slate-600 bg-slate-300 font-semibold pl-8 pt-0 text-slate-500 text-left"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody class="bg-slate-200">
            <tr>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                Desc 1
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                12
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                10
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                120
              </td>
            </tr>
            <tr>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                Desc 2
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                24
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                3
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                72
              </td>
            </tr>
            <tr>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                Desc 3
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                8
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                5
              </td>
              <td
                class="border-b border-slate-700 pl-8 text-slate-500 dark:text-slate-400 text-left"
              >
                40
              </td>
            </tr>
          </tbody>
        </table>
        <CustomButton class="mt-1 float-left ml-1"> Add Item </CustomButton>
      </div>

      <div
        class="complement-height bg-slate-50 grid grid-cols-2 gap-0 py-1 px-4 h-fit"
      >
        <div class="">
          <CustomText v-model="invoice.notes" class="text-sm" label="Notes:" />
          <CustomText v-model="invoice.terms" class="text-sm" label="Terms:" />
        </div>

        <div class="flex flex-col justify-end">
          <div class="subtotal flex flex-row items-end justify-end my-1">
            <label for="subtotal" class="mr-2 text-lg font-semibold"
              >Subtotal:</label
            >
            <div class="w-4/12 text-right">$</div>
          </div>
          <CustomInput v-model="invoice.discount.value" label="Discount:" />

          <CustomInput v-model="invoice.tax.value" label="Tax:" />

          <CustomInput v-model="invoice.shipping.value" label="Shipping:" />

          <div class="grandtotal flex flex-row items-end justify-end my-1">
            <label for="grandtotal" class="mr-2 text-lg font-semibold"
              >Total:</label
            >
            <div class="w-4/12 text-right">$</div>
          </div>
          <CustomInput v-model="invoice.paid" label="Amount Paid:" />

          <div class="balance-due-row flex flex-row items-end justify-end my-1">
            <label for="balance-due" class="mr-2 text-lg font-semibold"
              >Balance Due:</label
            >
            <div class="w-4/12 text-right">$</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.complement-height {
  height: calc(100vh - theme("height.20"));
}
</style>
