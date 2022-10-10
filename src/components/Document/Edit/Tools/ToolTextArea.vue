<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Vue3DraggableResizable v-show="dashboard.enableAnno" :key="tool.id" :initH="Number(tool.tool_height)"
    :initW="Number(tool.tool_width)" :minW="70" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)"
    v-model:x="x" v-model:y="y" v-model:h="h" v-model:w="w" :parent="true" @drag-end="onDragEnd($event, tool)"
    @resize-end="onResizeEnd(tool, w, h)" :data-can-drag-tool="tool.can_drag_tool" :data-user="tool.user_id"
    :data-doc="tool.document_upload_id" :data-id="tool.id" :data-print-id="tool.append_print.id"
    class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
    class-name-resizing="resizing-class">

    <div class="text-wrapper">
      <input type="text" v-model="tool.append_print.value" class="textareaTool w-100 h-100"
        :data-doc="tool.document_upload_id" :data-id="tool.id" :data-print-id="tool.append_print.id"
        :data-name="tool.tool_name" @blur="textInput($event.target, x, y)" placeholder="Input text here" required
        style="border: none; outline: none" />

      <template v-if="owner.user.id == tool.user_id || owner.isOwner == true">
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

          <span title="Remove" class="btn btn-xs btn-secondary rounded-0 remove" @click="
            remove({
              printId: tool.append_print.id,
              toolId: tool.id,
              can_delete: tool.can_delete_tool,
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
      </template>
      <ParticipantName :userId="tool.user_id" />
    </div>
  </Vue3DraggableResizable>
</template>

<script setup>
import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";

import { defineProps, ref } from "vue";
import { useActions } from "vuex-composition-helpers/dist";
import { dashboard } from "@/store/dashboard";

const props = defineProps({ tool: Object, owner: Object });

let x = ref(Number(props.tool.tool_pos_left));
let y = ref(Number(props.tool.tool_pos_top));
let w = ref(Number(props.tool.tool_width));
let h = ref(Number(props.tool.tool_height));

const { editTools, editToolWithAsset, removeTool } = useActions({
  editTools: "document/editTools",
  editToolWithAsset: "document/editToolWithAsset",
  removeTool: "document/removeTool",
});

const remove = (params) => { return removeTool(params.toolId) };

const textInput = (e) => {
  editToolWithAsset({
    id: e.dataset.id,
    payload: {
      append_print_id: e.dataset.printId,
      value: e.value,
      document_upload_id: e.dataset.doc,
      type: "Text",
      category: "Type",
    },
  });
};

const onDragEnd = (e, tool) => {
  let toLocal = {
    id: tool.id,
    tool_pos_left: e.x.toString(),
    tool_pos_top: e.y.toString(),
  };
  const dragToUpdate = {
    append_print_id: tool.append_print.id == undefined ? "" : tool.append_print.id,
    document_upload_id: tool.document_upload_id,
    tool_pos_left: e.x.toString(),
    tool_pos_top: e.y.toString(),
  };
  editTools({ id: tool.id, payload: dragToUpdate, toLocal });
};

const onResizeEnd = (tool, w, h) => {
  let toLocal = {
    id: tool.id,
    tool_width: w.toString(),
    tool_height: h.toString(),
  };

  const resizeToUpdate = {
    append_print_id: tool.append_print.id == undefined ? "" : tool.append_print.id,
    document_upload_id: tool.document_upload_id,
    tool_width: w.toString(),
    tool_height: h.toString(),
  };
  editTools({ id: tool.id, payload: resizeToUpdate, toLocal });
};
</script>

<style scoped>
.vdr-container {
  z-index: 1;
}
</style>
