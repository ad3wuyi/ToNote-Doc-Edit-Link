<template>
  <router-view v-slot="{ Component }">
    <transition-page>
      <component :is="Component" />
    </transition-page>
  </router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>

</style>
