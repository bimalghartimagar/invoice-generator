<script setup>
import { computed, reactive, watch, ref } from "vue";
import CustomText from "./CustomText.vue";
import CustomButton from "./CustomButton.vue";
import CustomInput from "./CustomInput.vue";
import LineItems from "./LineItems.vue";
import WithLabel from "./WithLabel.vue";
import Logo from "./Logo.vue";
import CustomToggleSwitch from "./CustomToggleSwitch.vue";
import { useInvoice } from "../composables/useInvoice";
import useState from "../composables/useInvoiceStorage";
import { useRoute } from "vue-router";
import router from "../router";
import { Status } from "../types/index.type";

const state = useState();
const route = useRoute();

const message = ref("");

const {
  invoice,
  subtotal,
  total,
  balance,

  isSenderInvalid,
  isBuyerInvalid,

  addLineItem,
  updateLineItem,
  removeLineItem,
  resetInvoice
} = useInvoice(route.params.invoiceId);

const statusList = Object.keys(Status).filter(x => isNaN(x)).map(x=>({label: x, value: Status[x]}))

const isEdit = ref(false);
if (route.params.invoiceId) {
  isEdit.value = true;
} else {
  isEdit.value = false;
}

watch(
  () => route.params.invoiceId,
  (newVal) => {
    message.value = "";
    if (newVal === undefined) {
      isEdit.value = false;
      resetInvoice();
    } else {
      isEdit.value = true;
    }
  }
)


/**
 * Print function to trigger browser print
 */
const print = () => window.print();

const saveInvoiceToStorage = () => {
  if (isEdit.value) {
    state.updateInvoice(invoice);
    message.value = "Invoice Updated";
  } else {
    state.saveInvoice(invoice);
    router.push(`/invoice/edit/${invoice.number}`)
    message.value = "Invoice Saved";
  }
}
</script>
<template>
  <section
    class="my-4 p-1 flex flex-col mx-auto w-11/12 xl:w-9/12 print:w-full rounded border border-gray-400 shadow-md shadow-slate-400 print:mx-auto print:shadow-none"
  >
    <div class="my-2 h-12 grid-cols-12 bg-slate-50 print:w-full px-4">
      <CustomInput
        v-model="invoice.name"
        type="text"
        class="text-3xl w-full text-center print:text-2xl"
        placeholder="Enter Company Name"
      />
    </div>
    <div
      v-if="isEdit"
      class="bg-yellow-500 text-black font-bold text-center rounded-lg my-2 py-1"
    >Editing Invoice #{{ invoice.number }}</div>
    <div class="bg-slate-50 grid lg:grid-cols-2 gap-0 py-1 px-4 h-fit">
      <div>
        <Logo />

        <!-- <CustomText
            v-model="invoice.sender"
            placeholder="Sender Details"
            class="text-sm"
            label="Sender"
            :is-required="true"
            :is-invalid="isSenderInvalid"
          /> -->



        <CustomText
          v-model="invoice.buyer"
          placeholder="Contact Detail"
          class="text-sm"
          label="Contact"
          :is-required="true"
          :is-invalid="isBuyerInvalid"
        />
      </div>

      <div class="flex flex-col lg:justify-end self-center">
        <WithLabel label="Invoice Status"  v-if="isEdit" class="print:hidden">
          <div class="border border-slate-500 rounded p-0.5  print:hidden w-full">
            <select v-model="invoice.status">
              <option
                v-for="status in statusList"
                :value="status.value"
              >{{ status.label }}</option>
            </select>
          </div>
        </WithLabel>

        <WithLabel label="Invoice Number">
          <CustomInput
            v-model="invoice.number"
            label="Invoice Number"
            disabled
          />
        </WithLabel>

        <WithLabel label="PO Number">
          <CustomInput
            v-model="invoice.ponumber"
            label="PO Number"
            type="text"
          />
        </WithLabel>

        <WithLabel label="Date">
          <CustomInput
            v-model="invoice.date"
            label="Date"
            type="date"
          />
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

    <div class="bg-slate-50 mx-auto w-11/12 lg:w-8/12">
      <LineItems
        class="mt-4"
        :items="invoice.items"
        @update-item="updateLineItem"
        @close="removeLineItem"
        @add-item="addLineItem"
      />
    </div>

    <div class="bg-slate-50 grid lg:grid-cols-2 gap-0 py-1 px-4 h-fit">
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

      <div class="flex flex-col justify-end -order-1 lg:order-1">
        <div class="subtotal flex flex-row items-end justify-end my-1">
          <label
            for="subtotal"
            class="mr-2 text-lg font-semibold"
          >Subtotal:</label>
          <div class="w-32 text-right print:w-24">$ {{ subtotal.toFixed(2) }}</div>
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
          >Add Discount</CustomButton>
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
          >Add Tax</CustomButton>
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
          >Add Shipping</CustomButton>
        </template>

        <div class="grandtotal flex flex-row items-end justify-end my-1">
          <label
            for="grandtotal"
            class="mr-2 text-lg font-semibold"
          >Total:</label>
          <div class="w-32 text-right print:w-24">$ {{ total.toFixed(2) }}</div>
        </div>
        <WithLabel label="Amount Paid">
          <CustomInput
            v-model.number="invoice.paid"
            label="Amount Paid"
            currency
          />
        </WithLabel>
        <div class="balance-due-row flex flex-row items-end justify-end my-1">
          <label
            for="balance-due"
            class="mr-2 text-lg font-semibold"
          >Balance Due:</label>
          <div class="w-32 text-right print:w-24">$ {{ balance.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <CustomButton
        class="w-full my-3"
        large
        :disabled="isSenderInvalid || isBuyerInvalid"
        @click="saveInvoiceToStorage"
      >
        {{ isEdit ? "Update" : "Save" }}
      </CustomButton>
      <CustomButton
        v-if="isEdit"
        class="w-full my-3"
        large
        :disabled="isSenderInvalid || isBuyerInvalid"
        @click="print"
      >
        Print
      </CustomButton>
    </div>
    <div
      v-if="message"
      class="bg-green-500 p-2 text-center text-base font-bold rounded-lg"
    >{{ message }}</div>
  </section>
</template>