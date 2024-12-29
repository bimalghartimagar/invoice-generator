<template>
    <main class="h-screen w-screen bg-slate-50">
        <nav class="bg-slate-600 text-white text-2xl print:hidden px-8 py-2 flex justify-start items-baseline">
            <span>
                <RouterLink to="/">Invoice Generator</RouterLink>
            </span>

            <RouterLink
                class="text-base ml-8"
                to="/invoices"
            >Invoices</RouterLink>

            <RouterLink
                class="text-base ml-auto bg-[#ebeef3] rounded text-black px-2 py-1"
                to="/invoice/new"
            >Create Invoice</RouterLink>
        </nav>
        <aside
            v-if="false"
            class="complement-height border-l w-3/12 bg-slate-200 float-right py-12 print:hidden"
        >
        </aside>
        <div>
            <slot></slot>
        </div>
    </main>
</template>
<style scoped>
.complement-height {
    height: calc(100vh - theme("height.12"));
}
</style>
