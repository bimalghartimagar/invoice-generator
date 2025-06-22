<template>
    <section class="mx-auto w-4/5">
        <h1 class="my-3 text-xl">Invoices</h1>
        <div class="outline outline-1 outline-gray-200 rounded p-2">
            <WithLabel label="Search Invoices (Number, Date, Customer, Total)" class="mb-2">
                <CustomInput v-model="searchText" type="text" />
            </WithLabel>
            <table class="w-full">
                <thead>
                    <tr class="text-left">
                        <th>Number</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in invoiceKeys" @click="viewInvoice(item)">
                        <td class="font-semibold">#{{ invoices[item]?.number }}</td>
                        <td>
                            <span class="ring-1 ring-gray-300 rounded-full px-3 py-1 text-sm font-semibold" :class="{
                                'bg-red-400': invoices[item]?.status === Status.Overdue,
                                'bg-green-400': invoices[item]?.status === Status.Paid,
                                'bg-yellow-300': (invoices[item]?.status === Status.Draft
                                    || invoices[item]?.status === Status.Issued),
                            }">
                                {{ Status[invoices[item]?.status?.toString()] }}
                            </span>
                        </td>
                        <td>{{ invoices[item]?.date }}</td>
                        <td>{{ invoices[item]?.buyer }}</td>
                        <td class="font-mono font-semibold text-right">${{ invoices[item]?.totalAmount }}</td>
                        <td>
                            <span class="text-sm ml-2 text-red-600" @click.stop="proceedDeleteInvoice(+item)">Delete</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-200">
                    <tr>
                        <td colspan="4" class="text-right font-semibold">Total</td>
                        <td class="font-mono font-semibold text-right">${{ tableTotal.toFixed(2) }}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useState from '../composables/useInvoiceStorage';
import router from '../router';
import { Status } from '../types/index.type';
import WithLabel from '../components/WithLabel.vue';
import CustomInput from '../components/CustomInput.vue';

const { storage, fetchInvoices, findInvoices, invoices, deleteInvoice } = useState();
fetchInvoices()
const invoiceKeys = ref(Object.keys(invoices));

const searchText = ref('');

watch(() => searchText.value, (newVal) => {
    if (newVal) {
        const foundItems = findInvoices(newVal);
        invoiceKeys.value = foundItems.map(x => x.number.toString())
    } else {
        invoiceKeys.value = Object.keys(storage.value.invoices)
    }
})
watch(() => storage.value.invoices, (newVal) => {
    invoiceKeys.value = Object.keys(newVal)
})

const tableTotal = computed(() => {
    return invoiceKeys.value.reduce((acc, curr) => acc + storage.value.invoices[curr]?.totalAmount, 0)
})

const viewInvoice = (invoiceId) => {
    router.push(`/invoice/edit/${invoiceId}`);
}

const proceedDeleteInvoice = (invoiceId: number) => {
    deleteInvoice(invoiceId)
}
</script>

<style scoped>
thead tr {
    @apply bg-[#ebeef3] rounded-full;
}

thead tr th {
    @apply py-2 px-2;
}

table tbody tr {
    @apply hover:bg-[#f7f7f7] hover:cursor-pointer
}

table tbody tr td {
    @apply py-2 px-2 border-b border-[#ebeef3];
}
</style>