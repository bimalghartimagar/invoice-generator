import { computed, reactive, ref, watch } from 'vue';
import { format } from "date-fns";

import useState from './useInvoiceStorage';
import { Invoice, InvoiceItem, Status } from '../types/index.type';

const state = useState();
const date = new Date();
export function useInvoice(invoiceId?: number) {

    const invoice = reactive<Invoice>({
        logo: "",
        name: "",
        number: state.storage.value.currentInvoiceNumber,
        ponumber: "",
        date: format(date, "yyyy-MM-dd"),
        duedate: "",
        sender: "",
        buyer: "",
        items: [
            {
                id: 1,
                description: "",
                rate: 0,
                quantity: 0,
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
        total: 0,
        paid: 0,
        sentToContact: false,
        status: Status.Draft,
    });

    // If the invoice is already in the storage, use it
    if(invoiceId){
        const invoiceToUse = state.storage.value.invoices[invoiceId];
        if(invoiceToUse) Object.assign(invoice, invoiceToUse);
    }

    const isSenderInvalid = ref(false);
    const isBuyerInvalid = ref(false);
    
    const isInvalid = (x: string | null) => x === null || x?.trim().length === 0;

    function resetInvoice() {
        invoice.logo = "";
        invoice.name = "";
        invoice.number = state.storage.value.currentInvoiceNumber;
        invoice.ponumber = "";
        invoice.date = "";
        invoice.duedate = "";
        invoice.sender = "";
        invoice.buyer = "";
        invoice.items =
            [{
                id: 1,
                description: "0",
                rate: 0,
                quantity: 0,
            }];
        invoice.notes = "";
        invoice.terms = "";
        invoice.discount = {
            isUsed: false,
            isPercentage: false,
            value: 0,
        };
        invoice.tax = {
            isUsed: false,
            isPercentage: false,
            value: 0,
        };
        invoice.shipping = {
            isUsed: false,
            value: 0,
        };
        invoice.paid = 0;
    }

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
        return +afterShipping.value.toFixed(2);
    });

    const balance = computed(() => total.value - invoice.paid);
    
    /**
     * update invoice total property
     */ 
    watch(
        balance,
        (newVal) => invoice.total = newVal
    )

    /**
     * 
     * @param {invoice line item} value 
     * @param {index of invoice line item} index 
     * @returns 
     */
    const updateLineItem = (value: InvoiceItem, index: number) => (invoice.items[index] = { ...value });

    /**
     * Add a line item to the invoice line items array
     */
    const addLineItem = () => {
        invoice.items.push({
            id: invoice.items.length + 1,
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

    return {
        // data helpers
        invoice,
        subtotal,
        afterDiscount,
        afterTax,
        afterShipping,
        total,
        balance,

        // UI helpers
        isSenderInvalid,
        isBuyerInvalid,

        // Methods
        addLineItem,
        updateLineItem,
        removeLineItem,
        resetInvoice
    }
}

