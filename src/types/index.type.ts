export interface InvoiceItem {
    id: string,
    description: string,
    rate: number,
    quantity: number,
}
    export interface Invoice {
    logo: string,
    name: string,
    number: string,
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
    paid: number,
}
export default {}