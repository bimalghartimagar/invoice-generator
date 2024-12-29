<template>
    <div class="card">
        <div class="card--header">
            <slot name="header"></slot>
        </div>
        <div class="card--body">
            <slot></slot>
        </div>
        <div class="card--footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    @apply p-3 ring-1 shadow ring-gray-200 rounded w-full;

    &--header{
        @apply text-lg font-semibold;
    }
    &--body{
        @apply font-mono font-black text-3xl mt-3;
    }
    &--footer{}
}
</style>