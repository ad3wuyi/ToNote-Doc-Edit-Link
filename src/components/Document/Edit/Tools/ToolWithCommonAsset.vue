<template>
  <Vue3DraggableResizable v-show="dashboard.enableAnno" :key="tool.id" :initH="Number(tool.tool_height)"
    :initW="Number(tool.tool_width)" :minW="70" :minH="30" :x="Number(tool.tool_pos_left)"
    :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x" v-model:y="y" v-model:h="h" v-model:w="w"
    :draggable="profile.id == tool.user_id || userDocument.is_the_owner_of_document == true"
    :resizable="profile.id == tool.user_id || userDocument.is_the_owner_of_document == true"
    @drag-end="onDragEnd($event, tool)" @resize-end="onResizeEnd(tool, w, h)" class="image-area"
    :lockAspectRatio="['Seal', 'Stamp'].includes(tool.tool_name) ? true : false" :handles="['tl', 'tr', 'bl', 'br']"
    class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
    class-name-resizing="resizing-class" @dblclick="
      getUserId({
        user: tool.user_id,
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
    " :data-can-drag-tool="tool.can_drag_tool" :data-user="tool.user_id" :data-can-delete-tool="tool.can_delete_tool"
    :data-id="tool.id" :data-doc="tool.document_upload_id" :data-print-id="tool.append_print.id"
    :data-name="tool.tool_name">
    <img :src="tool.append_print.file" class="w-100 h-100"
      :style="[['Draw', 'Upload'].includes(tool.append_print.category) ? 'object-fit: scale-down' : '']" />

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

<script setup>
import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";
import { dashboard } from "@/store/dashboard";

import { defineProps, defineEmits, ref } from "vue";

import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const props = defineProps({ tool: Object, owner: Object });

let x = ref(Number(props.tool.tool_pos_left));
let y = ref(Number(props.tool.tool_pos_top));
let w = ref(Number(props.tool.tool_width));
let h = ref(Number(props.tool.tool_height));

const { profile, userDocument } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
});

const { editTools } = useActions({ editTools: "document/editTools" });

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

const getUserId = (params) => {
  if (params.user != profile.value.id) {
    if (params.toolName == 'Signature' || params.toolName == 'Initial') {
      return toast.error("Sorry, you are not permitted to sign here", {
        timeout: 5000,
        position: "top-right",
      });
    }
    if (params.toolName == 'Seal') {
      return toast.error("Sorry, you cannot upload this seal", {
        timeout: 5000,
        position: "top-right",
      });
    }
    if (params.toolName == 'Stamp') {
      return toast.error("Sorry, you cannot upload this stamp", {
        timeout: 5000,
        position: "top-right",
      });
    }
  }
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

<style>
.active-class {
  border: 1px solid #003bb3;
}

.handle-class {
  background: #003bb3;
  border: 1px solid #003bb3;
  border-radius: 50%;
}

.dragging-class {
  border: 1px solid orange;
}

.resizing-class {
  border: 1px solid orange;
}

.dragging-class .handle-class {
  background: orange;
  border: 1px solid orange;
}

.resizing-class .handle-class {
  background: orange;
  border: 1px solid orange;
}

@media screen and (max-width: 991.5px) {
  .vdr-handle {
    width: 12px !important;
    height: 12px !important;
  }

  .vdr-handle-tl {
    top: -6px;
    left: -7px;
    cursor: nw-resize;
  }

  .vdr-handle-tr {
    top: -6px;
    right: -6px;
    cursor: ne-resize;
  }

  .vdr-handle-br {
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
  }

  .vdr-handle-bl {
    bottom: -6px;
    left: -7px;
    cursor: sw-resize;
  }

  .vdr-handle-tm {
    top: -7px;
    cursor: n-resize;
  }

  .vdr-handle-bm {
    margin-left: -3px;
    bottom: -7px;
    cursor: s-resize;
  }

  .vdr-handle-ml {
    margin-top: -6px;
    left: -7px;
    cursor: w-resize;
  }

  .vdr-handle-mr {
    margin-top: -6px;
    right: -6px;
    cursor: e-resize;
  }
}
</style>
