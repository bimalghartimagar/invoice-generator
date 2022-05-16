<script setup>
import { computed, reactive, watch, ref } from "vue";
import CustomText from "./CustomText.vue";
import CustomButton from "./CustomButton.vue";
import CustomInput from "./CustomInput.vue";
import LineItems from "./LineItems.vue";
import WithLabel from "./WithLabel.vue";
import CustomToggleSwitch from "./CustomToggleSwitch.vue";

const invoice = reactive({
  logo: "",
  name: "XYZ IT",
  number: "1",
  ponumber: "12AC",
  date: "2022-01-01",
  duedate: "2022-01-07",
  sender: "",
  buyer: "",
  items: [
    {
      id: "item1",
      description: "Item 1",
      rate: 20,
      quantity: 5,
    },
  ],
  notes: "",
  terms: "",
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
const isSenderInvalid = ref(false);
const isBuyerInvalid = ref(false);

watch(
  () => invoice.sender,
  (newVal) => {
    isSenderInvalid.value = isInvalid(newVal);
  }
);

watch(
  () => invoice.buyer,
  (newVal) => {
    isBuyerInvalid.value = isInvalid(newVal);
  }
);

const updateLineItem = (value, index) => (invoice.items[index] = { ...value });

const subtotal = computed(() =>
  invoice.items.reduce((prev, acc) => prev + acc.rate * acc.quantity, 0)
);

/**
 * Compute total value after applying discount
 * based on `discount` percentage or value and `subtotal` value
 */
const afterDiscount = computed(() => {
  if (invoice.discount.isUsed) {
    if (invoice.discount.isPercentage) {
      return subtotal.value - (subtotal.value * invoice.discount.value) / 100;
    } else {
      return subtotal.value - invoice.discount.value;
    }
  }
  return subtotal.value;
});

/**
 * Compute total value after applying tax
 * based on `tax` percentage or value and `afterDiscount` value
 */
const afterTax = computed(() => {
  if (invoice.tax.isUsed) {
    if (invoice.tax.isPercentage) {
      return (
        afterDiscount.value + (afterDiscount.value * invoice.tax.value) / 100
      );
    } else {
      return afterDiscount.value + invoice.tax.value;
    }
  }
  return afterDiscount.value;
});

/**
 * Compute total value after applying shipping
 * based on `shipping` value and `afterTax` value
 */
const afterShipping = computed(() => {
  if (invoice.shipping.isUsed) {
    return afterTax.value + invoice.shipping.value;
  }
  return afterTax.value;
});

const total = computed(() => {
  return afterShipping.value;
});

const balance = computed(() => total.value - invoice.paid);

/**
 * Add a line item to the invoice line items array
 */
const addLineItem = () => {
  invoice.items.push({
    id: `item${invoice.items.length}`,
    description: "",
    rate: 0,
    quantity: 0,
  });
};

/**
 * Remove items from invoice items array
 * @param {*} index index of item to remove
 */
const removeLineItem = (index) => {
  invoice.items.splice(index, 1);
};

/**
 * Print function to trigger browser print
 */
const print = () => window.print();
</script>
<template>
  <main class="h-screen w-screen bg-slate-50">
    <nav class="h-12 bg-slate-600 text-white text-2xl pt-3 print:hidden">
      Invoice Generator
    </nav>
    <aside
      v-if="false"
      class="complement-height border-l w-3/12 bg-slate-200 float-right py-12 print:hidden"
    >
      <CustomButton
        large
        :disabled="isSenderInvalid || isBuyerInvalid"
        @click="window.print()"
      >
        Download
      </CustomButton>
    </aside>

    <section
      class="m-4 p-1 flex flex-col mx-auto w-8/12 print:w-full rounded border border-gray-400 shadow-md shadow-slate-400 print:mx-auto print:shadow-none"
    >
      <div class="my-2 h-12 grid-cols-12 bg-slate-50 print:w-full px-4">
        <CustomInput
          v-model="invoice.name"
          type="text"
          input-class="text-3xl w-full text-center"
        />
      </div>
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
            placeholder="Sender Details"
            class="text-sm"
            label="Sender"
            :is-required="true"
            :is-invalid="isSenderInvalid"
          />

          <CustomText
            v-model="invoice.buyer"
            placeholder="Buyer Detail"
            class="text-sm"
            label="Buyer"
            :is-required="true"
            :is-invalid="isBuyerInvalid"
          />
        </div>

        <div class="flex flex-col justify-end self-center">
          <WithLabel label="Invoice Number">
            <CustomInput v-model="invoice.number" label="Invoice Number" />
          </WithLabel>

          <WithLabel label="PO Number">
            <CustomInput
              v-model="invoice.ponumber"
              label="PO Number"
              type="text"
            />
          </WithLabel>

          <WithLabel label="Date">
            <CustomInput v-model="invoice.date" label="Date" type="date" />
          </WithLabel>

          <WithLabel label="Due Date">
            <CustomInput
              v-model="invoice.duedate"
              label="Due Date"
              type="date"
            />
          </WithLabel>
        </div>
      </div>

      <div class="px-4">
        <LineItems
          class="mt-4"
          :items="invoice.items"
          @update-item="updateLineItem"
          @close="removeLineItem"
          @add-item="addLineItem"
        />
      </div>
      <div
        class="complement-height bg-slate-50 grid grid-cols-2 gap-0 py-1 px-4 h-fit"
      >
        <div class="">
          <CustomText
            v-model="invoice.notes"
            placeholder="Notes regarding invoice"
            class="text-sm"
            label="Notes"
          />
          <CustomText
            v-model="invoice.terms"
            placeholder="Terms regarding invoice"
            class="text-sm"
            label="Terms"
          />
        </div>

        <div class="flex flex-col justify-end">
          <div class="subtotal flex flex-row items-end justify-end my-1">
            <label for="subtotal" class="mr-2 text-lg font-semibold"
              >Subtotal:</label
            >
            <div class="w-32 text-right print:w-24">$ {{ subtotal }}</div>
          </div>

          <template v-if="invoice.discount.isUsed">
            <WithLabel label="Discount">
              <CustomInput
                v-model.number="invoice.discount.value"
                is-used
                label="Discount"
                toggle
                :currency="!invoice.discount.isPercentage"
                @close="invoice.discount.isUsed = false"
              >
                <CustomToggleSwitch
                  v-model="invoice.discount.isPercentage"
                  :for-value="'invoice-discount'"
                />
              </CustomInput>
            </WithLabel>
          </template>
          <template v-else>
            <CustomButton
              class="my-1 self-end"
              small
              @click="invoice.discount.isUsed = true"
              >Add Discount</CustomButton
            >
          </template>

          <template v-if="invoice.tax.isUsed">
            <WithLabel label="Tax">
              <CustomInput
                v-model.number="invoice.tax.value"
                is-used
                label="Tax"
                toggle
                :currency="!invoice.tax.isPercentage"
                @close="invoice.tax.isUsed = false"
              >
                <CustomToggleSwitch
                  v-model="invoice.tax.isPercentage"
                  :for-value="'invoice-tax'"
                />
              </CustomInput>
            </WithLabel>
          </template>
          <template v-else>
            <CustomButton
              class="my-1 self-end"
              small
              @click="invoice.tax.isUsed = true"
              >Add Tax</CustomButton
            >
          </template>

          <template v-if="invoice.shipping.isUsed">
            <WithLabel label="Shipping">
              <CustomInput
                v-model.number="invoice.shipping.value"
                label="Shipping"
                is-used
                currency
                @close="invoice.shipping.isUsed = false"
              >
              </CustomInput>
            </WithLabel>
          </template>
          <template v-else>
            <CustomButton
              class="my-1 self-end"
              small
              @click="invoice.shipping.isUsed = true"
              >Add Shipping</CustomButton
            >
          </template>

          <div class="grandtotal flex flex-row items-end justify-end my-1">
            <label for="grandtotal" class="mr-2 text-lg font-semibold"
              >Total:</label
            >
            <div class="w-32 text-right print:w-24">$ {{ total }}</div>
          </div>
          <WithLabel label="Amount Paid">
            <CustomInput
              v-model.number="invoice.paid"
              label="Amount Paid"
              currency
            />
          </WithLabel>
          <div class="balance-due-row flex flex-row items-end justify-end my-1">
            <label for="balance-due" class="mr-2 text-lg font-semibold"
              >Balance Due:</label
            >
            <div class="w-32 text-right print:w-24">$ {{ balance }}</div>
          </div>
        </div>
      </div>
      <div>
        <CustomButton
          class="w-full my-3"
          large
          :disabled="isSenderInvalid || isBuyerInvalid"
          @click="print"
        >
          Print
        </CustomButton>
      </div>
    </section>
  </main>
</template>

<style>
.complement-height {
  height: calc(100vh - theme("height.12"));
}
</style>
