<template>
  <div class="tool bg-white" style="height: 100vh">
    <li class="btn blue" @click="isSignerSelected({ toolId: 'textTool', tool_name: 'Textarea', })">
      Text Area
      <ToolTextIcon />
    </li>

    <li class="btn blue" @click="isSignerSelected({ toolId: 'signTool', tool_name: 'Signature', })">
      Signature
      <ToolSignatureIcon />
    </li>

    <li class="btn blue" @click="isSignerSelected({ toolId: 'photoTool', tool_name: 'Photo', })">
      Image
      <ToolImageIcon />
    </li>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import ToolTextIcon from "@/assets/icons/ToolTextIcon.vue"
import ToolSignatureIcon from "@/assets/icons/ToolSignatureIcon.vue"
import ToolImageIcon from "@/assets/icons/ToolImageIcon.vue"

const emit = defineEmits(["bindTools"]);

const isSignerSelected = (params) => {
  emit("bindTool", params);
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
