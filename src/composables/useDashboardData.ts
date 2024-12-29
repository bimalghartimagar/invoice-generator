import { computed } from "vue";
import useState from "./useInvoiceStorage";
import { Status } from "../types/index.type";

export function useDashboardData() {
    const state = useState();

    const totalInvoiceAmount = computed(() => {
        const invoices = state.storage.value.invoices;
        const amount = Object.keys(invoices).reduce((acc, item) => acc + invoices[item].total, 0);
        return amount.toFixed(2)
    })

    const totalPaid = computed(() => {
        const invoices = state.storage.value.invoices;
        const amount = Object.keys(invoices).reduce((acc, item) => {
            if (invoices[item].status === Status.Paid) {
                return acc + invoices[item].total
            }
            return acc;
        }, 0);
        return amount.toFixed(2);
    })

    const totalDue = computed(() => {
        const invoices = state.storage.value.invoices;
        const amount = Object.keys(invoices).reduce((acc, item) => {
            if (invoices[item].status === Status.Overdue) {
                return acc + invoices[item].total
            }
            return acc;
        }, 0);
        return amount.toFixed(2);
    })

    const totalDrafted = computed(() => {
        const invoices = state.storage.value.invoices;
        const amount = Object.keys(invoices).reduce((acc, item) => {
            if (invoices[item].status === Status.Draft) {
                return acc + invoices[item].total
            }
            return acc;
        }, 0);
        return amount.toFixed(2);
    })

    return {
        // variables
        totalInvoiceAmount,
        totalPaid,
        totalDue,
        totalDrafted
    }
}