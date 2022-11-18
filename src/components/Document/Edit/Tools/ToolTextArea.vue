<!-- eslint-disable vue/no-mutating-props -->
<template>
  <template v-if="tool.value == null">
    <Vue3DraggableResizable :key="tool.id" :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
      :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
      v-model:w="w" :parent="true" @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)"
      :data-doc="tool.document_upload_id" :data-id="tool.id" class-name-active="active-class"
      class-name-dragging="dragging-class" class-name-handle="handle-class" class-name-resizing="resizing-class">

      <div class="text-wrapper">
        <input type="text" v-model="tool.value" class="textareaTool w-100 h-100" :data-doc="tool.document_upload_id"
          :data-id="tool.id" :data-name="tool.tool_name" @blur="textInput($event.target, x, y)"
          placeholder="Input text here" required style="border: none; outline: none" />

        <span class="drag-me">
          <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
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

          <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove" @click="
            remove({
              printId: tool?.append_print?.id,
              toolId: tool.id,
            })
          ">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg></span>
        </span>
        <!-- <ParticipantName :userId="tool.user_id" /> -->
      </div>
    </Vue3DraggableResizable>
  </template>
  <template v-else>
    <Vue3DraggableResizable :key="tool.id" :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
      :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
      v-model:w="w" :parent="true" @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)"
      :data-doc="tool.document_upload_id" :data-id="tool.id" class-name-active="active-class"
      class-name-dragging="dragging-class" class-name-handle="handle-class" class-name-resizing="resizing-class">
      <div class="text-wrapper">
        <input type="text" v-model="tool.value" class="textareaTool w-100 h-100" :data-doc="tool.document_upload_id"
          :data-id="tool.id" :data-name="tool.tool_name" @blur="textInput($event.target, x, y)"
          placeholder="Input text here" required style="border: none; outline: none" />

        <span class="drag-me">
          <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
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

          <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove" @click="
  remove({
    printId: tool?.append_print?.id,
    toolId: tool.id,
  })
          ">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg></span>
        </span>
        <!-- <ParticipantName :userId="tool.user_id" /> -->
      </div>
    </Vue3DraggableResizable>
  </template>
</template>

<script setup>
// // import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";

import { defineProps, ref } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useDragResizeComposable } from "@/composables/useDragResize";

const { dragEnd, resizeEnd } = useDragResizeComposable()

const props = defineProps({ tool: Object, owner: Object });

let x = ref(Number(props.tool.tool_pos_left));
let y = ref(Number(props.tool.tool_pos_top));
let w = ref(Number(props.tool.tool_width));
let h = ref(Number(props.tool.tool_height));

const { profile } = useGetters({
  profile: "auth/profile",
});

const { editToolWithAsset, removeTool } = useActions({
  editToolWithAsset: "signLink/editToolWithAsset",
  removeTool: "signLink/removeTool",
});

const remove = (params) => {
  return removeTool(params.toolId);
};

const textInput = (e) => {
  editToolWithAsset({
    id: e.dataset.id,
    payload: {
      document_id: props.tool?.document_id,
      document_upload_id: props.tool.document_upload_id,
      tool_pos_left: x.value.toString(),
      tool_pos_top: y.value.toString(),
      value: e.value,
    },
    hasProfile: profile?.id
  });
};
</script>

<style scoped>
.vdr-container {
  z-index: 1;
}
</style>
