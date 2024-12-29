export interface InvoiceItem {
    id: number,
    description: string,
    rate: number,
    quantity: number,
}

export enum Status {
    Draft = 1,
    Paid,
    Overdue,
    Issued
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

export interface InvoiceStore {
    currentInvoiceNumber: number;
    invoices: { [invoiceNumber: string]: Invoice };
}
export default {}