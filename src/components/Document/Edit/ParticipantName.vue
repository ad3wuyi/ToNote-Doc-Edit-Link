<template>
  <div
    class="name-style fw-normal"
    v-for="(participant, index) in userDocument.participants"
    :key="index"
  >
    <template v-if="userId === participant.user.id">
      {{ participant.user.first_name }}
    </template>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

const { useGetters } = createNamespacedHelpers("document");
const { userDocument } = useGetters(["userDocument"]);

defineProps({ userId: String });
</script>

<style scoped></style>
