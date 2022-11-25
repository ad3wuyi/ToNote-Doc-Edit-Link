<template>
  <Vue3DraggableResizable v-if="photo64 == null" :key="tool.id" :initH="100" :initW="100"
    :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
    v-model:w="w" :parent="true" :draggable="profile?.id" :resizable="false" @drag-end="dragEnd($event, tool)"
    class="image-area" :handles="['tl', 'tr', 'bl', 'br']" :class="tool.tool_class" :id="tool.tool_id"
    :data-doc="tool.document_upload_id" :data-name="tool.tool_name" :data-id="tool.id" :data-class="tool.tool_class"
    class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class">
    <div @click="
      getUserId({
        user: tool.user_id,
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
    ">
      <img src="@/assets/noimage.png" class="img-fluid" id="imagePreview" alt="Preview" />
    </div>
    <span title="Drag" class="drag-me">
      <span class="btn btn-xs btn-secondary rounded-0 movement">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
          <polyline points="5 9 2 12 5 15"></polyline>
          <polyline points="9 5 12 2 15 5"></polyline>
          <polyline points="15 19 12 22 9 19"></polyline>
          <polyline points="19 9 22 12 19 15"></polyline>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })" :data-id="tool.id">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </span>
    </span>
    <!-- <ParticipantName :userId="tool.user_id" /> -->
  </Vue3DraggableResizable>
  <Vue3DraggableResizable v-else :initH="Number(tool.tool_width)" :initW="Number(tool.tool_width)" :minW="100"
    :minH="100" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x"
    v-model:y="y" v-model:h="h" v-model:w="w" :draggable="profile?.id" :resizable="profile?.id"
    @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)" class="image-area" :lockAspectRatio="false"
    :handles="['tl', 'tr', 'bl', 'br']" class-name-active="active-class" class-name-dragging="dragging-class"
    class-name-handle="handle-class" class-name-resizing="resizing-class" @dblclick="
      getUserId({
        user: tool.user_id,
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
    ">
    <!-- <img :src="tool.value" class="w-100 h-100 obj-fit" :data-name="tool.tool_name" :data-doc="tool.document_upload_id"
        :data-print-id="tool.append_print.id" /> -->
    <img :src="tool.value" class="w-100 h-100 obj-fit" />

    <span title="Drag" class="drag-me">
      <span class="btn btn-xs btn-secondary rounded-0 movement">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
          <polyline points="5 9 2 12 5 15"></polyline>
          <polyline points="9 5 12 2 15 5"></polyline>
          <polyline points="15 19 12 22 9 19"></polyline>
          <polyline points="19 9 22 12 19 15"></polyline>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>
      </span>

      <span title="Edit" class="btn btn-xs btn-secondary rounded-0 edit" @click="uploadImage = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="feather feather-edit">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })" :data-id="tool.id">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg></span>
    </span>
    <!-- <ParticipantName :userId="tool.user_id" /> -->
  </Vue3DraggableResizable>

  <Teleport to="body">
    <ModalComp :show="uploadImage" :footer="false" :size="'modal-md'" @close="uploadImage = false">
      <template #header>
        <h4 class="modal-title">Image management</h4>
      </template>

      <template #body>
        <PassportPhotograph @close="uploadImage = false" @selectedPassport="savePrint" />
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import PassportPhotograph from "@/components/Passport/PassportPhotograph.vue";
import { useDragResizeComposable } from "@/composables/useDragResize";

import { ref, defineProps, defineEmits, watch } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { dragEnd, resizeEnd } = useDragResizeComposable()

const props = defineProps({ tool: Object, owner: Object });

const { profile } = useGetters({
  profile: "auth/profile",
});

const { editToolWithAsset } = useActions({
  editToolWithAsset: "signLink/editToolWithAsset",
  editTools: "signLink/editTools",
  editPublicTools: "signLink/editPublicTools",
});

const photo64 = ref(props.tool.value)
watch(() => props.tool.value,
  (newTool) => {
    if (newTool) {
      photo64.value = newTool
    }
  })

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));
const w = ref(Number(props.tool.tool_width));
const h = ref(Number(props.tool.tool_width));

const savePrint = (params) => {
  const formData = {
    document_id: props.tool?.document_id,
    document_upload_id: props.tool.document_upload_id,
    id: props.tool?.id,
    signed: false,
    tool_class: "main-element photo-style",
    tool_name: 'Photo',
    tool_width: w.value.toString(),
    tool_height: h.value.toString(),
    tool_pos_left: x.value.toString(),
    tool_pos_top: y.value.toString(),
    value: params.value,
  }

  editToolWithAsset({ id: props.tool.id, payload: formData, hasAsset: true, hasProfile: profile?.id });
  uploadImage.value = false
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

const uploadImage = ref(false);
const getUserId = (params) => {
  if (params.toolName == "Photo") uploadImage.value = true;
};
</script>

<style scoped>
.vdr-container {
  z-index: 1;
}

.obj-fit {
  object-fit: scale-down !important;
}
</style>
