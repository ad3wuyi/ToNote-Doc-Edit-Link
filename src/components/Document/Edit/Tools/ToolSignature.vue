<template>
  <Vue3DraggableResizable v-if="sign64 == null" :key="tool.id" :initH="30" :initW="Number(tool.tool_width)"
    :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x" v-model:y="y" :parent="true"
    :draggable="profile?.id" :resizable="false" @drag-end="dragEnd($event, tool)" class="image-area"
    :handles="['tl', 'tr', 'bl', 'br']" :class="tool.tool_class">
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
        <MoveIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })">
        <DeleteIcon />
      </span>
    </span>
  </Vue3DraggableResizable>
  <Vue3DraggableResizable v-else :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
    :minH="30" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x" v-model:y="y"
    v-model:h="h" v-model:w="w" :draggable="profile?.id" :resizable="profile?.id" @drag-end="dragEnd($event, tool)"
    @resize-end="resizeEnd(tool, w, h)" class="image-area" :handles="['tl', 'tr', 'bl', 'br']"
    class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
    class-name-resizing="resizing-class" @dblclick="
      getUserId({
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })
    ">
    <img :src="tool.value" class="w-100 h-100" style="object-fit: scale-down" />

    <span class="drag-me">
      <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
        <MoveIcon />
      </span>

      <span title="Edit" class="btn btn-xs btn-secondary rounded-0 edit" @click="getUserId({
        toolName: tool.tool_name,
        docUpId: tool.document_upload_id,
        toolId: tool.id,
      })">
        <EditIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id })">
        <DeleteIcon />
      </span>
    </span>
  </Vue3DraggableResizable>

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
import MoveIcon from "@/icons/MoveIcon.vue"
import EditIcon from "@/icons/EditIcon.vue"
import DeleteIcon from "@/icons/DeleteIcon.vue"

import { useDragResizeComposable } from '@/composables/useDragResize';

import { ref, defineProps, defineEmits, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { dragEnd, resizeEnd } = useDragResizeComposable()

const props = defineProps({ tool: Object, owner: Object });

const { profile } = useGetters({
  profile: "auth/profile",
});

const { editToolWithAsset, editWithAsset } = useActions({
  editToolWithAsset: "signLink/editToolWithAsset",
  editWithAsset: "document/editToolWithAsset",
});

const sign64 = ref(props.tool.value)
watch(() => props.tool.value,
  (newTool) => {
    if (newTool) {
      sign64.value = newTool
    }
  })

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));
const w = ref(Number(props.tool.tool_width));
const h = ref(Number(props.tool.tool_height));

const affixModal = ref(false);
const signatureListModal = ref(false);
const sealModal = ref(false);
const stampModal = ref(false);
const initialModal = ref(false);
const toolId = ref(null);

const swapModal = () => {
  affixModal.value = false
  signatureListModal.value = true
}

const getUserId = (params) => {
  if (params.toolName == "Seal") sealModal.value = true;
  if (params.toolName == "Stamp") stampModal.value = true;
  if (params.toolName == "Initial") initialModal.value = true;
  if (params.toolName == "Signature") affixModal.value = true;

  toolId.value = params.toolId;
};

const savePrint = (params) => {
  if (params.category == "Draw") {
    params.tool_width = "100";
    params.tool_height = "50";
  } else if (params.category == "Type") {
    params.tool_width = "150";
    params.tool_height = "40";
  } else if (params.category == "Initial") {
    params.tool_width = "80";
    params.tool_height = "40";
  } else if (params.tool_name == "Signature" && params.category == "Upload") {
    params.tool_width = "100";
    params.tool_height = "62";
  }

  const dataObj = {
    document_id: props.tool?.document_id,
    document_upload_id: props.tool?.document_upload_id,
    id: props.tool?.id,
    signed: false,
    tool_class: "tool-box main-element",
    tool_height: params.tool_height,
    tool_name: params.tool_name,
    tool_pos_left: props.tool.tool_pos_left,
    tool_pos_top: props.tool.tool_pos_top,
    tool_width: params.tool_width,
    value: params.value,
  }

  if (profile.value?.id != undefined) {
    editWithAsset({ id: toolId.value, payload: dataObj, hasAsset: true, hasProfile: profile.value?.id });
  } else {
    editToolWithAsset({ id: toolId.value, payload: dataObj, hasAsset: true, hasProfile: profile.value?.id });
  }
  affixModal.value = signatureListModal.value = false
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

</script>

<style scoped>

</style>
