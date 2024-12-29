Learning Vue 3 composables by creating invoice generator

### Introduction
 Vue 3, which is latest major version of Vue, has new features that are not present in Vue 2, such as Teleport, Suspense and multiple root elements per template. Vue 3 provides smaller bundle sizes, better performance, better scalability and better TS/IDE support.


### What is Vue 3 composables?
Writing repetitive code can be a real pain in the frontend development realm. We can use Vue 3 [composables](https://vuejs.org/guide/reusability/composables) to encapsulate and reuse stateful logic to our components. In this post, we will look at how we can use composables to reuse business by building invoice generator.

An invoice generator, in simple words, is an application that helps creating invoices and manging invoices. In this blog post, we will focus on creating Vue 3 composables and how to use it properly for separting the business logic and re using it across different features.

### Prerequisites
- Basic understanding of:
    - Vue 3 and Composition API
    - JS/TS fundamentals
    - Node.js and npm installed
- Tools:
    - Vite
    - Optional: Tailwindcss

### Setting up the project
- Initialize Vue 3 project
```
$ npm create vite@latest ep-invoice-generator
Need to install the following packages:
create-vite@6.0.1
Ok to proceed? (y) y
√ Select a framework: » Vue
√ Select a variant: » JavaScript

Scaffolding project in G:\PersonalWork\blog\ep-invoice-generator...

Done. Now run:

  cd ep-invoice-generator
  npm install
  npm run dev
```

- Project Sturcture:
    - `src/`
        
        - `components/`

        - `composables/`
        
        - `views/`

### Requirements for Invoice Generator
- Add/Edit/Remove Invoice
- Add/Edit/Remove Invoice items ( product name, quantity, price)
- Apply discount and tax percentage wise or amount wise
- Calculate totals dynamically as well as apply discount, tax and shipping
- Generate PDF for invoice

### Add interface for Invoice and Invoice Items
```typescript
export interface InvoiceItem {
    id: number,
    description: string,
    rate: number,
    quantity: number,
}

export interface Invoice {
    logo: string,
    name: string,
    number: number,
    ponumber: string,
    date: string,
    duedate: string,
    sender: string,
    buyer: string,
    items: InvoiceItem[];
    notes: string,
    terms: string,
    discount: {
        isUsed: boolean,
        isPercentage: boolean,
        value: number,
    },
    tax: {
        isUsed: boolean,
        isPercentage: boolean,
        value: number,
    },
    shipping: {
        isUsed: boolean,
        value: number,
    },
    total: number,
    paid: number,

    sentToContact: boolean,
    status: Status,
}
```

### Create composable for Invoice

The composable is named useInvoice.ts and it will have following purposes:

- Handle invoice and invoice items state
- Add methods for adding, editing and removing invoice items
- Calculate totals automatically
- Reset invoice

First we create invoice object to use for creating or editing invoice. The code `state.storage.value.currentInvoiceNumber` gets the current invoice number to use for the new invoice, we will learn more about it later.
```typescript
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

```

After that, we add methods to add, update and remove invoice items

```typescript
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
     * @param {invoice line item} value 
     * @param {index of invoice line item} index 
     * @returns 
     */
    const updateLineItem = (value: InvoiceItem, index: number) => (invoice.items[index] = { ...value });

    /**
     * Remove items from invoice items array
     * @param {*} index index of item to remove
     */
    const removeLineItem = (index) => {
        invoice.items.splice(index, 1);
    };

```
Based on the invoice items we then calculate
- subtotal
- subtotal after discount if available
- subtotal after tax if available
- subtotal after shipping if available

Moreover, discount and tax can be put as amount or percentage value, so we update the logic to evaluate discount and tax based on the entered values and calculate subtotal.

```typescript
// useInvoice.ts
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

    // later if we track the payment done for the clients, we can easily
    // come up with the balance based on the payment and invoices
    const balance = computed(() => total.value - invoice.paid);
```

We return the 

```typescript
    return {
        // data helpers
        invoice,
        subtotal,
        afterDiscount,
        afterTax,
        afterShipping,
        total,
        balance,

        // Methods
        addLineItem,
        updateLineItem,
        removeLineItem,
    }
```

