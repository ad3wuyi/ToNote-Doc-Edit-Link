<template>
  <div v-if="prints.length != 0">
    <p class="text-center fw-normal mb-4">Pick a signature to append</p>
    <div class="grid">
      <div v-for="(print, index) in prints" :key="index">
        <label class="form-check-label border position-relative" :for="print.category">
          <div @click="
            getImgUrl({ file: print.file, category: print.category, type: print.type })
          ">
            <input type="radio" :name="print.category" v-model="selected" class="form-check-input tool_name"
              :id="print.category" :value="print.category" />
            <img :src="print.file" class="img-fluid" :alt="print.category" />
          </div>

          <span @click="deletePrint(index)"
            class="btn-outline-danger position-absolute top-0 start-100 translate-middle"
            style="padding:1px 4px">&cross;</span>
        </label>
      </div>
    </div>

    <button type="button" class="btn btn-sm btn-primary d-block ms-auto mt-2" :disabled="!isDisabled"
      @click="uploadSignature">
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Append</span>
    </button>
  </div>
  <div v-else>
    <p class="text-center fw-normal"><i>No signature to append</i></p>
  </div>

  <ModalComp :show="createSignatureModal" :footer="false" @close="createSignatureModal = false">
    <template #header>
      <h4 class="modal-title">Create your signature</h4>
    </template>

    <template #body>
      <LeftTabWrapper>
        <LeftTabList title="Draw">
          <SignaturePad @close="createSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Select">
          <SignatureSelectFull @close="createSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Upload">
          <!-- <div class="row"> -->
          <div class="position-relative">
            <SignatureUpload @close="createSignatureModal = false" />
          </div>
          <!-- </div> -->
        </LeftTabList>
      </LeftTabWrapper>
      <div class="row">
        <div class="col-md-10 ms-auto mt-2">
          <p>
            By clicking create, I agree that all signatures, marks or initials created
            here are as valid as my hand written signature to the extent allowed by law.
          </p>
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";
import SignatureSelectFull from "@/components/Signature/SignatureSelectFull.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";

import { ref, defineEmits, watch } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useGetters, useActions } = createNamespacedHelpers("print");

const { prints } = useGetters(["prints"]);
const { removePrint } = useActions(["removePrint"]);

const createSignatureModal = ref(false);
const loading = ref(false);
const isDisabled = ref(false);
const selected = ref("");
const file = ref("");

watch(
  () => prints.value,
  (newValue) => {
    console.log({ newValue })
    prints.value = newValue;
  }
);

const category = ref("");
const type = ref("");
const getImgUrl = (params) => {
  category.value = params.category;
  type.value = params.type;
  file.value = params.file;
  isDisabled.value = true;
};

const deletePrint = (params) => {
  removePrint(params)
}

const emit = defineEmits(["selectedSignature"]);
const uploadSignature = () => {
  const uploadFile = {
    category: category.value,
    type: type.value,
    tool_name: "Signature",
    value: file.value,
  };

  emit("selectedSignature", uploadFile);

  loading.value = true;
  isDisabled.value = false;
  setTimeout(() => (loading.value = false), 500);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;
  gap: 20px;
}

[type="radio"] {
  position: absolute;
  opacity: 0;
}

[type="radio"]+img {
  cursor: pointer;
  margin-right: 0.5rem;
}

[type="radio"]+img:hover {
  outline: 0.5px solid #003bb3;
}

[type="radio"]:checked+img {
  outline: 2px solid #003bb3;
}
</style>
