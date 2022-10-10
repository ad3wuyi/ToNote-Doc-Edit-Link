<template>
  <div class="d-flex justify-content-between align-items-center my-2">
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-sm btn-primary" @click="scale = scale > 0.25 ? scale - 0.25 : 0.25">&minus;</button>
      <div class="text-center" style="min-width:50px">{{ scale * 100 }}%</div>
      <button class="btn btn-sm btn-primary" @click="scale = scale < 2 ? scale + 0.25 : 2">&plus;</button>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-sm" :class="[enableAnno ? 'btn-primary':'btn-secondary']"
        @click="enableAnno = !enableAnno">
        {{enableAnno ? 'Disable' : 'Enable'}} Tools
      </button>
      <span class="mx-1">
        Tool enable: <strong>{{ enableAnno }}</strong>
      </span>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-sm btn-primary"
        @click="currentPage = currentPage > 1 ? currentPage - 1 : 1">&larr;</button>
      <div class="text-center" style="min-width:50px">{{ currentPage }} / {{ pages }}</div>
      <button class="btn btn-sm btn-primary"
        @click="currentPage = currentPage < pages ? currentPage + 1 : pages">&rarr;</button>
    </div>
  </div>

  <div class="text-center">
    <VuePDF :pdf="pdf" :scale="scale" :page="currentPage" :annotation-layer="true" @annotation="annotationEvent"
      :text-layer="enableAnno" @loaded="loadedEvent" />
  </div>
</template>

<script setup>
import { usePDF, VuePDF } from "@tato30/vue-pdf";

import { ref } from "vue";

const scale = ref(1);
const currentPage = ref(1);
const enableAnno = ref(false);

const onPassword = (updatePassword, reason) => {
  console.log(`Reason for callback: ${reason}`)
  updatePassword('documentpassword1234')
}

const onProgress = ({ loaded, total }) => {
  console.log(`${loaded / total * 100}% Loaded`);
}

const { pdf, pages, info } = usePDF("./example_014.pdf", {
  onPassword: onPassword,
  onProgress: onProgress,
})

console.log(`Document info: ${info}`)

const annotationEvent = (value) => {
  console.log("ANNOTATION: ", value);
}

const loadedEvent = (value) => {
  console.log("LOADED: ", value);
}

</script>