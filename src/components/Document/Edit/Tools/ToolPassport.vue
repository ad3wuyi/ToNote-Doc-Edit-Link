<template>
  <Vue3DraggableResizable v-if="photo64 == null" :key="tool.id" :initH="100" :initW="100"
    :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
    v-model:w="w" :parent="true" :draggable="profile?.id" :resizable="false" @drag-end="dragEnd($event, tool)"
    :handles="['tl', 'tr', 'bl', 'br']" class-name-active="active-class" class-name-dragging="dragging-class"
    class-name-handle="handle-class" class="image-area" :class="tool.tool_class" :id="tool.tool_id">
    <div
      @click="getUserId({ user: tool.user_id, toolName: tool.tool_name, docUpId: tool.document_upload_id, toolId: tool.id, })">
      <img src="@/assets/noimage.png" class="img-fluid" id="imagePreview" alt="Preview" />
    </div>

    <span title="Drag" class="drag-me">
      <span class="btn btn-xs btn-secondary rounded-0 movement">
        <MoveIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })">
        <DeleteIcon />
      </span>
    </span>
  </Vue3DraggableResizable>
  <Vue3DraggableResizable v-else :initH="Number(tool.tool_width)" :initW="Number(tool.tool_width)" :minW="100"
    :minH="100" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x"
    v-model:y="y" v-model:h="h" v-model:w="w" :draggable="profile?.id" :resizable="profile?.id"
    @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)" :lockAspectRatio="false"
    :handles="['tl', 'tr', 'bl', 'br']" class="image-area" class-name-active="active-class"
    class-name-dragging="dragging-class" class-name-handle="handle-class" class-name-resizing="resizing-class"
    @dblclick="getUserId({ user: tool.user_id, toolName: tool.tool_name, docUpId: tool.document_upload_id, toolId: tool.id, })">

    <img :src="tool.value" class="w-100 h-100 obj-fit" />

    <span title="Drag" class="drag-me">
      <span class="btn btn-xs btn-secondary rounded-0 movement">
        <MoveIcon />
      </span>

      <span title="Edit" class="btn btn-xs btn-secondary rounded-0 edit" @click="uploadImage = true">
        <EditIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })">
        <DeleteIcon />
      </span>
    </span>
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
import MoveIcon from "@/icons/MoveIcon.vue"
import EditIcon from "@/icons/EditIcon.vue"
import DeleteIcon from "@/icons/DeleteIcon.vue"

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
