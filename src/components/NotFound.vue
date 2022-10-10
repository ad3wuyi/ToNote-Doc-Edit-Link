<template>
  <div class="grid">
    <div>
      <h1 class="fw-light text-uppercase text-start" style="font-size: 56px">Sorry</h1>
      <h1 class="fw-light mb-2">
        It looks like the page you're looking for doesn't exist.
      </h1>
      <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1)">
        &leftarrow; Go back
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 100vh !important;
  width: 100%;
  text-align: center;
}
</style>
