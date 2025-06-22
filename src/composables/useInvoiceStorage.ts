import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue';
import { Invoice, InvoiceStore } from '../types/index.type';
import invoiceService from '../services/invoiceService';

const storage = useStorage<InvoiceStore>('invoice-store', {
    currentInvoiceNumber: "10000",
}, localStorage);
const state = ref({
    ...storage.value,
    invoices: {},
});
export default function useState() {

    function saveInvoice(invoice: Invoice) {
        state.value.invoices[invoice.number] = { ...invoice };
        state.value.currentInvoiceNumber = `${+invoice.number + 1}`;
        invoiceService.saveInvoice(invoice);
    }

    function updateInvoice(id: number, invoice: Invoice) {
        state.value.invoices[invoice.number] = { ...invoice };
        invoiceService.updateInvoice(id, invoice);
    }

    async function deleteInvoice(invoiceId: number) {
        // delete state.value.invoices[invoiceId];
        await invoiceService.deleteInvoice(invoiceId);
        state.value.invoices = Object.keys(state.value.invoices).filter(x => x != invoiceId.toString()).reduce((acc, curr) => {
            return {
                ...acc,
                [curr]: state.value.invoices[curr]
            }
        }, {})
    }

    function findInvoices(searchText: string) {
        searchText = searchText.toLowerCase();
        return Object.keys(state.value.invoices).filter(x => {
            const invoice = state.value.invoices[x];
            return invoice.number.toString().indexOf(searchText) > -1
                || invoice.buyer.toString().toLowerCase().indexOf(searchText) > - 1
                || invoice.date.toString().toLowerCase().indexOf(searchText) > - 1
                || invoice.total.toString().indexOf(searchText) > - 1
        })
            .map(x => ({ ...state.value.invoices[x] }))


    }

    async function fetchInvoices() {
        const result = await invoiceService.getInvoices();
        state.value.invoices = result.data.reduce((acc, curr) => {
            return { ...acc, [curr.id]: curr }
        }, {})
    }
    async function fetchInvoice(id) {
        const result = await invoiceService.getInvoice(id);
        console.log(result);
        state.value.invoices[result.data.id] = result.data;
        console.log(state.value.invoices);
        return result.data;
    }
    return {
        // variables
        storage: state,
        invoices: computed(() => state.value.invoices),

        // methods
        saveInvoice,
        updateInvoice,
        deleteInvoice,
        findInvoices,
        fetchInvoices,
        fetchInvoice
    }
}
