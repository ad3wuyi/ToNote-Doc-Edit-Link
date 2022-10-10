<template>
  <div class="app container my-3 p-3 border border-dark">
    <!-- <TestChild /> -->
    <!-- <TestChild /> -->
    <!-- <PanZoom1 /> -->
    <div class="divider"></div>
    <!-- <PanZoom /> -->
    <div class="divider"></div>
    <RenderDocument />
  </div>
</template>

<script setup>
// import TestChild from './TestChild.vue';
import RenderDocument from './RenderDocument.vue';
// import PanZoom from './PanZoom.vue';
// import PanZoom1 from './PanZoom1.vue';

</script>

<style scoped>
.app {
  width: 100vw;
  /* height: 100vh; */
  display: grid;
  place-items: center;
}
</style>
