<script setup>
import { computed, reactive } from "vue";
import CustomText from "./CustomText.vue";
import CustomButton from "./CustomButton.vue";
import CustomInput from "./CustomInput.vue";
import LineItems from "./LineItems.vue";
import WithLabel from "./WithLabel.vue";

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
  shipping: {
    isUsed: false,
    value: 0,
  },
  paid: 0,
});

const isInvalid = (x) => x === null || x?.trim().length === 0;
const isSenderInvalid = computed(() => isInvalid(invoice.sender));
const isBuyerInvalid = computed(() => isInvalid(invoice.buyer));

const updateLineItem = (value, index) => (invoice.items[index] = { ...value });

const subtotal = computed(() =>
  invoice.items.reduce((prev, acc) => prev + acc.rate * acc.quantity, 0)
);

const total = computed(
  () =>
    subtotal.value -
    invoice.discount.value +
    invoice.tax.value +
    invoice.shipping.value
);

const balance = computed(() => total.value - invoice.paid);
</script>
<template>
  <main class="h-screen w-screen bg-slate-50">
    <nav class="h-20 bg-slate-600 text-white text-5xl pt-3 print:hidden">
      Invoice Generator
    </nav>
    <aside
      class="complement-height border-l w-3/12 bg-slate-200 float-right py-12 print:hidden"
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
          <WithLabel label="Invoice Number:">
            <CustomInput v-model="invoice.number" label="Invoice Number:" />
          </WithLabel>

          <WithLabel label="PO Number:">
            <CustomInput v-model="invoice.ponumber" label="PO Number:" />
          </WithLabel>

          <WithLabel label="Date:">
            <CustomInput
              v-model="invoice.date"
              label="Date:"
              input-type="date"
            />
          </WithLabel>

          <WithLabel label="Due Date:">
            <CustomInput
              v-model="invoice.duedate"
              label="Due Date:"
              input-type="date"
            />
          </WithLabel>
        </div>
      </div>

      <div class="bg-slate-50 mx-auto px-1 pb-1 h-min w-8/12">
        <div class="flex">
          <div class="p-0.5 m-0.5 flex-auto w-52">Description</div>
          <div class="p-0.5 m-0.5 flex-none w-32">Quantity</div>
          <div class="p-0.5 m-0.5 flex-none w-32">Rate</div>
          <div class="p-0.5 m-0.5 flex-none w-32">Amount</div>
        </div>
        <template v-for="(item, index) in invoice.items" :key="index">
          <LineItems
            :item="item"
            :index="index"
            @update-item="updateLineItem"
          />
        </template>

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
            <div class="w-4/12 text-right">$ {{ subtotal }}</div>
          </div>
          <WithLabel label="Discount:">
            <CustomInput
              v-model.number="invoice.discount.value"
              label="Discount:"
            />
          </WithLabel>
          <WithLabel label="Tax:">
            <CustomInput v-model.number="invoice.tax.value" label="Tax:" />
          </WithLabel>

          <WithLabel label="Shipping:">
            <CustomInput
              v-model.number="invoice.shipping.value"
              label="Shipping:"
              currency
            />
          </WithLabel>
          <div class="grandtotal flex flex-row items-end justify-end my-1">
            <label for="grandtotal" class="mr-2 text-lg font-semibold"
              >Total:</label
            >
            <div class="w-4/12 text-right">$ {{ total }}</div>
          </div>
          <WithLabel label="Amount Paid:">
            <CustomInput
              v-model.number="invoice.paid"
              label="Amount Paid:"
              currency
            />
          </WithLabel>
          <div class="balance-due-row flex flex-row items-end justify-end my-1">
            <label for="balance-due" class="mr-2 text-lg font-semibold"
              >Balance Due:</label
            >
            <div class="w-4/12 text-right">$ {{ balance }}</div>
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
