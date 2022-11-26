<!-- eslint-disable vue/no-mutating-props -->
<template>
  <template v-if="tool.value == null">
    <Vue3DraggableResizable :key="tool.id" :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
      :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
      v-model:w="w" :parent="true" @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)"
      class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
      class-name-resizing="resizing-class">

      <div class="text-wrapper">
        <input type="text" v-model="tool.value" class="textareaTool w-100 h-100" :data-id="tool.id"
          @blur="textInput($event.target, x, y)" placeholder="Input text here" required
          style="border: none; outline: none" />

        <span class="drag-me">
          <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
            <MoveIcon />
          </span>

          <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove" @click="
          remove({ printId: tool?.append_print?.id, toolId: tool.id, })">
            <DeleteIcon />
          </span>
        </span>
      </div>
    </Vue3DraggableResizable>
  </template>
  <template v-else>
    <Vue3DraggableResizable :key="tool.id" :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
      :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
      v-model:w="w" :parent="true" @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)"
      class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
      class-name-resizing="resizing-class">
      <div class="text-wrapper">
        <input type="text" v-model="tool.value" class="textareaTool w-100 h-100" :data-id="tool.id"
          @blur="textInput($event.target, x, y)" placeholder="Input text here" required
          style="border: none; outline: none" />

        <span class="drag-me">
          <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
            <MoveIcon />
          </span>

          <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove" @click="
          remove({ printId: tool?.append_print?.id, toolId: tool.id, })">
            <DeleteIcon />
          </span>
        </span>
      </div>
    </Vue3DraggableResizable>
  </template>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useDragResizeComposable } from "@/composables/useDragResize";
import MoveIcon from "@/icons/MoveIcon.vue"
import DeleteIcon from "@/icons/DeleteIcon.vue"

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
