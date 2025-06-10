<script setup lang="ts">
import { ResponsiveLayout, Input, SnSelect } from "screen-ui";
</script>

<template>
  <responsive-layout>
    <div class="app">
      <sn-select />
    </div>
  </responsive-layout>
</template>

<style scoped>
.app {
  height: 100%;
  color: white;
}
</style>
