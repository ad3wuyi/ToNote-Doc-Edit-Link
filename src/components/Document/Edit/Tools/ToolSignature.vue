<template>
  <template v-if="tool.value == null">
    <Vue3DraggableResizable :key="tool.id" :initH="30" :initW="Number(tool.tool_width)" :x="Number(tool.tool_pos_left)"
      :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" :parent="true" :draggable="profile?.id"
      :resizable="false" @drag-end="dragEnd($event, tool)" class="image-area" :handles="['tl', 'tr', 'bl', 'br']"
      :class="tool.tool_class" :id="tool.tool_id" :data-doc="tool.document_upload_id" :data-name="tool.tool_name"
      :data-user="tool.user_id" :data-id="tool.id" :data-class="tool.tool_class">
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
    </Vue3DraggableResizable>
  </template>
  <template v-else>
    <Vue3DraggableResizable :key="tool.id" :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
      :minH="30" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x"
      v-model:y="y" v-model:h="h" v-model:w="w" :draggable="profile?.id" :resizable="profile?.id"
      @drag-end="dragEnd($event, tool)" @resize-end="resizeEnd(tool, w, h)" class="image-area"
      :handles="['tl', 'tr', 'bl', 'br']" class-name-active="active-class" class-name-dragging="dragging-class"
      class-name-handle="handle-class" class-name-resizing="resizing-class" @dblclick="
        getUserId({
          toolName: tool.tool_name,
          docUpId: tool.document_upload_id,
          toolId: tool.id,
        })
      " :data-id="tool.id" :data-doc="tool.document_upload_id" :data-name="tool.tool_name">
      <img :src="tool.value" class="w-100 h-100" style="object-fit: scale-down" />

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

        <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
          @click="remove({ id: tool.id })" :data-id="tool.id">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg></span>
      </span>
    </Vue3DraggableResizable>
  </template>

  <Teleport to="body">
    <ModalComp :show="affixModal" :footer="false" @close="affixModal = false">
      <template #header>
        <h4 class="modal-title">Create your signature</h4>
      </template>

      <template #body>
        <LeftTabWrapper>
          <LeftTabList title="Draw">
            <SignaturePad @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Select">
            <SignatureSelectFull @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Initial">
            <SignatureSelectInitial @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Upload">
            <div class="row">
              <div class="col-md-12 mx-auto position-relative">
                <SignatureUpload @close="swapModal" />
              </div>
            </div>
          </LeftTabList>
        </LeftTabWrapper>
        <div class="row">
          <div class="col-md-10 ms-auto mt-2">
            <p class="fw-normal">
              By clicking create, I agree that all signatures, marks or initials created
              here are as valid as my hand written signature to the extent allowed by law.
            </p>
          </div>
        </div>
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="signatureListModal" :footer="false" :size="'modal-sm'" @close="signatureListModal = false">
      <template #header>
        <h4 class="modal-title">Signature box</h4>
      </template>

      <template #body>
        <SignatureList @selectedSignature="savePrint" />
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";
import SignatureSelectFull from "@/components/Signature/SignatureTextFull.vue";
import SignatureSelectInitial from "@/components/Signature/SignatureTextInitial.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";
import SignatureList from "@/components/Signature/SignatureList.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";
import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";

import { useDragResizeComposable } from '@/composables/useDragResize';

import { ref, defineProps, defineEmits } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { dragEnd, resizeEnd } = useDragResizeComposable()

const props = defineProps({ tool: Object, owner: Object });

const { profile, print } = useGetters({
  profile: "auth/profile",
  print: "print/print",
});

const { editToolWithAsset, editWithAsset, getUserPrint } = useActions({
  editTools: "signLink/editTools",
  editPublicTools: "signLink/editPublicTools",
  editToolWithAsset: "signLink/editToolWithAsset",
  editWithAsset: "document/editToolWithAsset",
  getUserPrint: "print/getUserPrint",
});

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));

const documentId = ref(null);
const affixModal = ref(false);
const signatureListModal = ref(false);
const sealModal = ref(false);
const stampModal = ref(false);
const initialModal = ref(false);
const toolId = ref(null);
const imgWidth = ref(null);
const imgHeight = ref(null);

const swapModal = () => {
  affixModal.value = false
  signatureListModal.value = true
}

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
  } else if (params.tool_name == "Signature" && params.category == "Draw") {
    params.tool_width = "100";
    params.tool_height = "50";
  } else if (params.tool_name == "Signature" && params.category == "Type") {
    params.tool_width = "150";
    params.tool_height = "40";
  } else if (params.tool_name == "Initial" && params.category == "Type") {
    params.tool_width = "80";
    params.tool_height = "40";
  } else if (params.tool_name == "Signature" && params.category == "Upload") {
    getUserPrint(params.append_print_id);

    setTimeout(() => {
      img.src = print.value?.file;
    }, 1000);

    let img = new Image();
    img.onload = function () {
      imgWidth.value = img.width;
      imgHeight.value = img.height;
      params.tool_width = imgWidth.value.toString();
      params.tool_height = imgHeight.value.toString();
    };
  }

  params.document_id = props.tool?.document_id;
  params.document_upload_id = documentId.value;

  const dataObj = {
    document_id: props.tool?.document_id,
    document_upload_id: documentId.value,
    id: props.tool?.id,
    signed: false,
    tool_class: "tool-box main-element",
    tool_height: params.tool_height,
    tool_name: params.tool_name,
    tool_pos_left: x.value.toString(),
    tool_pos_top: y.value.toString(),
    tool_width: params.tool_width,
    value: params.value,
  }

  if (profile.value?.id != undefined) {
    editWithAsset({ id: toolId.value, payload: dataObj, hasAsset: true, hasProfile: profile.value?.id });
  } else {
    editToolWithAsset({ id: toolId.value, payload: dataObj, hasAsset: true, hasProfile: profile.value?.id });
  }
  signatureListModal.value = false
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

</script>

<style scoped>

</style>
