<template>
  <template v-if="tool.append_print == null">
    <Vue3DraggableResizable v-show="dashboard.enableAnno" :key="tool.id" :initH="100" :initW="100"
      :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" v-model:h="h"
      v-model:w="w" :parent="true"
      :draggable="profile.id == tool.user_id || userDocument.is_the_owner_of_document == true" :resizable="false"
      @drag-end="onDragEnd($event, tool)" class="image-area" :handles="['tl', 'tr', 'bl', 'br']"
      :data-can-drag-tool="tool.can_drag_tool" :data-can-delete-tool="tool.can_delete_tool" :class="tool.tool_class"
      :id="tool.tool_id" :data-doc="tool.document_upload_id" :data-name="tool.tool_name" :data-user="tool.user_id"
      :data-print-id="tool?.append_print?.id" :data-id="tool.id" :data-class="tool.tool_class"
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
      <template v-if="owner.user.id == tool.user_id || owner.isOwner == true">
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

          <span title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
            @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })" :data-id="tool.id">
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
    </Vue3DraggableResizable>
  </template>

  <template v-else>
    <Vue3DraggableResizable v-show="dashboard.enableAnno" :key="tool.id" :initH="Number(tool.tool_width)"
      :initW="Number(tool.tool_width)" :minW="100" :minH="100" :x="Number(tool.tool_pos_left)"
      :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x" v-model:y="y" v-model:h="h" v-model:w="w"
      :draggable="profile.id == tool.user_id || userDocument.is_the_owner_of_document == true" :resizable="
      profile.id == tool.user_id || userDocument.is_the_owner_of_document == true" @drag-end="onDragEnd($event, tool)"
      @resize-end="onResizeEnd(tool, w, h)" class="image-area" :lockAspectRatio="false"
      :handles="['tl', 'tr', 'bl', 'br']" class-name-active="active-class" class-name-dragging="dragging-class"
      class-name-handle="handle-class" class-name-resizing="resizing-class" @dblclick="getUserId({
        user: tool.user_id,
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
      ">
      <img :src="tool.append_print.file" class="w-100 h-100 obj-fit" :data-name="tool.tool_name"
        :data-doc="tool.document_upload_id" :data-print-id="tool.append_print.id" />
      <template v-if="profile.id == tool.user_id || isOwner">
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

          <span title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
            @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })" :data-id="tool.id">
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
    </Vue3DraggableResizable>
  </template>

  <Teleport to="body">
    <ModalComp :show="uploadImage" :footer="false" :size="'modal-lg'" @close="uploadImage = false">
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
import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";
import { dashboard } from "@/store/dashboard";

import { ref, defineProps, defineEmits } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const props = defineProps({ tool: Object, owner: Object });

const { profile, userDocument } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
});

const { editTools, editToolWithAsset } = useActions({
  editToolWithAsset: "document/editToolWithAsset",
  editTools: "document/editTools",
});

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));
const w = ref(Number(props.tool.tool_width));
const h = ref(Number(props.tool.tool_width));

const savePrint = (params) => {
  const formData = {
    append_print_id: params.append_print_id,
    document_upload_id: props.tool.document_upload_id,
    tool_name: props.tool.tool_name,
    tool_class: "main-element photo-style",
  };

  editToolWithAsset({ id: props.tool.id, payload: formData });
};

const emit = defineEmits(["remove"]);
const remove = (params) => { emit("remove", params) };

const uploadImage = ref(false);
const getUserId = (params) => {
  if (params.user != profile.value.id)
    return toast.error("Sorry, you cannot upload this image", {
      timeout: 5000,
      position: "top-right",
    });

  if (params.toolName == "Photo") uploadImage.value = true;
};

const onDragEnd = (e, tool) => {
  let toLocal = {
    id: tool.id,
    tool_pos_left: e.x.toString(),
    tool_pos_top: e.y.toString(),
  };
  const dragToUpdate = {
    append_print_id: tool?.append_print?.id == undefined ? "" : tool?.append_print?.id,
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

.obj-fit {
  object-fit: scale-down !important;
}
</style>
