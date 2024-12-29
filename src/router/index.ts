import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import Invoices from "../views/Invoices.vue";
import Invoice from "../views/Invoice.vue";
import Dashboard from "../views/Dashboard.vue";
const routes = [
    { path: '/', component: Dashboard },
    { path: '/invoices', component: Invoices },
    { path: '/invoice/edit/:invoiceId', component: Invoice },
    { path: '/invoice/new',  component: Invoice },
]
export default createRouter({
    history: createWebHistory(),
    routes
})