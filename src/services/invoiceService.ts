import { Invoice, InvoiceItem } from "../types/index.type"
import axios from "./"
export default {
    getInvoices: async () => {
        return await axios.get('invoice')
    },
    getInvoice: async (id) => {
        return await axios.get(`invoice/${id}`)
    },
    saveInvoice: async (data: Invoice) => {
        return await axios.post('invoice', data)
    },
    deleteInvoice: async (id: number) => {
        return await axios.delete(`invoice/${id}`)
    },
    updateInvoice: async (id: number, data: Invoice) => {
        return await axios.put(`invoice/${id}`, data)
    },
    uploadLogo: async (invoiceId, file) => {
        const formData = new FormData();
        formData.append("imageFile", file);
        return axios.put(`invoice/${invoiceId}/upload-logo`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    addLineItem: async (id: number, data: InvoiceItem) => {
        return await axios.post(`invoice/${id}/detail/`, data);
    },
    updateLineItem: async (id: number, lineId: number, data: InvoiceItem) => {
        return await axios.put(`invoice/${id}/detail/${lineId}`, data)
    },
    deleteLineItem: async (id: number, lineId: number) => {
        return await axios.delete(`invoice/${id}/detail/${lineId}`)
    },
}