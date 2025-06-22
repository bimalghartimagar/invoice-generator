<template>
    <section class="max-w-[1800px] mx-auto">
        <div class="grid grid-cols-4 gap-x-4 mt-4">
            <Card>
                <template #header>Total Amount</template>
                <span>${{ totalInvoiceAmount }}</span>
                <template #footer></template>
            </Card>
            <Card>
                <template #header>Paid Amount</template>
                <span>${{ totalPaid }}</span>
                <template #footer></template>
            </Card>
            <Card>
                <template #header>Due Amount</template>
                <span>${{ totalDue }}</span>
                <template #footer></template>
            </Card>
            <Card>
                <template #header>Drafted Amount</template>
                <span>${{ totalDrafted }}</span>
                <template #footer></template>
            </Card>
        </div>
        <Invoices />
    </section>
</template>

<script setup lang="ts">

import Card from '../components/shared/Card.vue';
import { useDashboardData } from '../composables/useDashboardData';
import invoiceService from '../services/invoiceService';
import Invoices from './Invoices.vue';

const { totalInvoiceAmount, totalPaid, totalDue, totalDrafted, } = useDashboardData();


</script>