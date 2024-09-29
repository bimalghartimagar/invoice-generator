import { computed, reactive, ref, watch } from 'vue';
export function useInvoice() {
    const invoice = reactive({
        logo: "",
        name: "",
        number: "1",
        ponumber: "",
        date: "",
        duedate: "",
        sender: "",
        buyer: "",
        items: [
            {
                id: "0",
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
     * 
     * @param {invoice line item} value 
     * @param {index of invoice line item} index 
     * @returns 
     */
    const updateLineItem = (value, index) => (invoice.items[index] = { ...value });

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
        removeLineItem
    }
}

