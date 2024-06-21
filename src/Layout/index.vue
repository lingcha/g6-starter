<template>
  <div class="layout">
    <AppNav />
    <router-view></router-view>
  </div>
</template>

<script setup>
import AppNav from './AppNav/AppNav.vue'
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>