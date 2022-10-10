<template>
  <Vue3DraggableResizable v-show="dashboard.enableAnno" :key="tool.id" :initH="30" :initW="Number(tool.tool_width)"
    :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" :parent="true"
    :resizable="false" @drag-end="onDragEnd($event, tool)" class="image-area" :handles="['tl', 'tr', 'bl', 'br']"
    :data-can-drag-tool="tool.can_drag_tool" :data-can-delete-tool="tool.can_delete_tool" :class="tool.tool_class"
    :id="tool.tool_id" :data-doc="tool.document_upload_id" :data-name="tool.tool_name" :data-user="tool.user_id"
    :data-print-id="tool?.append_print?.id" :data-id="tool.id" :data-class="tool.tool_class">

    <div class="bg-fill w-100 h-100 d-flex justify-content-center align-items-center" @click.prevent="
      getUserId({
        user: tool,
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
    ">
      {{ tool.tool_name }}
    </div>

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

  <Teleport to="body">
    <ModalComp :show="affixModal" :footer="false" :size="'modal-lg'" @close="affixModal = false">
      <template #header>
        <h4 class="modal-title">Signature box</h4>
      </template>

      <template #body>
        <SignaturePrintFull @selectedSignature="savePrint" @closeModal="affixModal = false" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="initialModal" :footer="false" :size="'modal-md'" @close="initialModal = false">
      <template #header>
        <h4 class="modal-title">Initial signature box</h4>
      </template>

      <template #body>
        <SignaturePrintInitial @selectedSignature="savePrint" @closeModal="initialModal = false" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="sealModal" :footer="false" :size="'modal-md'" @close="sealModal = false">
      <template #header>
        <h4 class="modal-title">Seal box</h4>
      </template>

      <template #body>
        <SealAppend @selectedSeal="savePrint" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="stampModal" :footer="false" :size="'modal-md'" @close="stampModal = false">
      <template #header>
        <h4 class="modal-title">Stamp box</h4>
      </template>

      <template #body>
        <StampAppend @selectedStamp="savePrint" />
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import SealAppend from "@/components/Notary/Seal/SealAppend.vue";
import StampAppend from "@/components/Notary/Stamp/StampAppend.vue";
import SignaturePrintFull from "@/components/Signature/SignaturePrintFull.vue";
import SignaturePrintInitial from "@/components/Signature/SignaturePrintInitial.vue";
import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";
import { dashboard } from "@/store/dashboard";

import { ref, defineProps, defineEmits } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

const props = defineProps({ tool: Object, owner: Object });

const { print } = useGetters({
  print: "print/print",
});

const { editTools, editToolWithAsset, getUserPrint } = useActions({
  editTools: "document/editTools",
  editToolWithAsset: "document/editToolWithAsset",
  getUserPrint: "print/getUserPrint",
});

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));

const documentId = ref(null);
const affixModal = ref(false);
const sealModal = ref(false);
const stampModal = ref(false);
const initialModal = ref(false);
const toolId = ref(null);
const imgWidth = ref(null);
const imgHeight = ref(null);

const getUserId = (params) => {
  if (params.toolName == "Seal") sealModal.value = true;
  if (params.toolName == "Stamp") stampModal.value = true;
  if (params.toolName == "Initial") initialModal.value = true;
  if (params.toolName == "Signature") affixModal.value = true;

  documentId.value = params.docUpId;
  toolId.value = params.toolId;
};

const savePrint = (params) => {
  if (params.tool_name == "Seal") {
    params.tool_width = "100";
    params.tool_height = "100";
  } else if (params.tool_name == "Stamp") {
    params.tool_width = "260";
    params.tool_height = "100";
  } else if ((params.tool_name == "Signature" && params.category == "Draw")) {
    params.tool_width = "100";
    params.tool_height = "50";
  } else if (params.tool_name == "Signature" && params.category == "Type") {
    params.tool_width = "150";
    params.tool_height = "40";
  } else if (params.tool_name == "Initial" && params.category == "Type") {
    params.tool_width = "80";
    params.tool_height = "40";
  } else if (params.tool_name == "Signature" && params.category == "Upload") {
    getUserPrint(params.append_print_id)

    setTimeout(() => { img.src = print.value?.file }, 1000);

    let img = new Image();
    img.onload = function () {
      imgWidth.value = img.width
      imgHeight.value = img.height
      params.tool_width = imgWidth.value.toString();
      params.tool_height = imgHeight.value.toString();
    };
  }

  params.document_upload_id = documentId.value;

  editToolWithAsset({ id: toolId.value, payload: params, hasAsset: true });
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
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
</script>

<style scoped>

</style>
