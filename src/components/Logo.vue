<template>
    <div class="logo relative">
        <label
            v-if="!fileUrl"
            for="invoiceLogo"
            class="logo-placeholder w-48 h-28 bg-gray-200 grid place-items-center text-slate-500 text-6xl font-bold print:hidden"
        >
            LOGO
        </label>
        <img
            v-if="fileUrl"
            :src="fileUrl"
            alt=""
            class="logo w-auto h-40"
            @click="fileInputRef.click()"
        />
        <input
            type="file"
            class="logo-file hidden bg-gray-200"
            id="invoiceLogo"
            @change="createObjectUrl"
            @cancel="canceledFile"
            ref="fileInputRef"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const file = ref(null);
const fileInputRef = ref();
const fileUrl = ref('');
function createObjectUrl(event) {
    file.value = event.target.files[0];
    if (file.value) {
        fileUrl.value = window.URL.createObjectURL(file.value);
    } else {
        fileUrl.value = null;
    }
}
function canceledFile() {
    console.log('canceled')
}
</script>