import { useStorage } from '@vueuse/core'
import { reactive } from 'vue';
import { Invoice, InvoiceStore } from '../types/index.type';

const storage = useStorage<InvoiceStore>('invoice-store', {
    currentInvoiceNumber: 10000,
    invoices: {}
}, localStorage);

export default function useState() {
    const state = reactive(storage);

    function saveInvoice(invoice: Invoice) {
        state.value.invoices[invoice.number] = { ...invoice };
        state.value.currentInvoiceNumber = invoice.number + 1;
    }

    function updateInvoice(invoice: Invoice) {
        state.value.invoices[invoice.number] = { ...invoice };
    }

    function deleteInvoice(invoiceId: number) {
        // delete state.value.invoices[invoiceId];
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
    return {
        // variables
        storage: state,

        // methods
        saveInvoice,
        updateInvoice,
        deleteInvoice,
        findInvoices
    }
}
