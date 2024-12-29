<script setup lang="ts">
import "./index.css";
import Layout from './components/shared/Layout.vue';
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>

<style>

#app {
  font-family: Lato,sAvenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

textarea,
input {
  @apply print:hidden;
}
</style>
