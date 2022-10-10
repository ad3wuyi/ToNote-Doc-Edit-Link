<template>
  <div class="grid" v-if="isLoading === true">
    <PreLoader />
  </div>

  <section class="custom-width" v-else>
    <div class="mb-2">
      <h4 class="text-dark">ToNote Link</h4>
      <ul>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
        <li>Lorem ipsum dolor sit amet consectetur.</li>
        <li>Lorem ipsum dolor sit.</li>
      </ul>
    </div>

    <div class="grid" v-show="isSubmitted">
      <PreLoader />
    </div>
    <div v-show="!isSubmitted">
      <Form @submit="onProceed" :validation-schema="schema" v-slot="{ errors }">
        <div class="card">
          <div class="card-body">
            <div class="form-group mb-2">
              <div class="form-group">
                <label>Document title</label>
                <Field name="title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }"
                  placeholder="Enter document title" v-model="title" required />
                <div class="invalid-feedback">{{ errors.title }}</div>
              </div>
            </div>

            <DropZone @drop.prevent="drop" @change="selectedFile">
              <template #format>Upload PDF</template>
              <template #input>
                <input type="file" id="dropzoneFile" multiple class="dropzoneFile" accept=".pdf" />
              </template>
            </DropZone>

            <div class="mb-2"></div>

            <div v-for="(prev, index) in previewFile" :key="index">
              <div class="p-1 mb-1 border rounded">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <img data-dz-thumbnail src="@/assets/default.png" class="avatar-sm rounded bg-light" :alt="prev" />
                  </div>

                  <div class="col ps-0">
                    <a href="javascript:void(0)" class="text-muted fw-bold" data-dz-name></a>
                    <p class="mb-0" data-dz-size>{{ prev }}</p>
                  </div>

                  <div class="col-auto">
                    <a role="button" class="btn btn-sm btn-outline-danger ds-remove filed" data-id="#document_id"
                      data-name="fileName" @click="removeItem(index)">
                      X
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-1 py-1">
              <button type="submit" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: !isSelected }">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  </section>
</template>

<script setup>
import PreLoader from "@/components/PreLoader.vue";
import DropZone from "@/components/DropZone.vue";
import { Form, Field } from "vee-validate";
// import { dashboard } from "@/store/dashboard";

import { ref, toRaw, onMounted } from "vue";

// import { useRouter } from "vue-router";

import { useActions } from "vuex-composition-helpers/dist";

// const { token } = useGetters({ token: "auth/token" });

const { fileUploads } = useActions({
  setAuthForDocumentUpload: "auth/setAuthForDocumentUpload",
  fileUploads: "document/fileUploads",
  getUserPrints: "print/getUserPrints",
});

const isSubmitted = ref(false);
const isSelected = ref(false);
const dropzoneFile = ref("");
const previewFile = ref([]);
const dataFile = ref([]);
const title = ref("");

dataFile.value = [];
previewFile.value = [];
const preparedFile = (files) => {
  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    const params = files[i];
    reader.onloadend = () => {
      dataFile.value.push(reader.result);
      previewFile.value.push(params.name);
    };
    reader.readAsDataURL(params);
  }

  isSelected.value = true;
};

const drop = (e) => {
  let dropFiles = (dropzoneFile.value = e.dataTransfer.files);
  title.value = dropzoneFile.value[0].name.split('.').slice(0, -1).join('.');
  preparedFile(dropFiles);
  isSelected.value = true;
};

const selectedFile = (e) => {
  let dropFiles = (dropzoneFile.value = e.target.files);
  title.value = dropFiles[0].name.split('.').slice(0, -1).join('.');
  preparedFile(dropFiles);
  isSelected.value = true;
};

const removeItem = (index) => {
  previewFile.value.splice(index, 1);
  dataFile.value.splice(index, 1);
  if (previewFile.value.length == 0) {
    title.value = "";
    isSelected.value = false;
  }
};

const onProceed = (params) => {
  isSubmitted.value = true
  const uploadFile = {
    files: toRaw(dataFile.value),
    title: params.title,
  };

  fileUploads(uploadFile);
  dataFile.value = [];
  previewFile.value = [];
  setTimeout(() => { isSubmitted.value = false }, 10000);
};

const isLoading = ref(true);
// const route = useRouter();
// const uri = ref("");
// const hasToken = ref("");

onMounted(() => {
  // uri.value = route.currentRoute.value.query;
  // hasToken.value =
  //   uri.value.qt != undefined || uri.value.qt != null ? uri.value.qt : token.value;

  // if (hasToken.value == undefined || hasToken.value == "" || hasToken.value == null) {
  //   return route.push({ name: 'Register' })
  // }

  // dashboard.value.setToken(hasToken.value)

  // getUserPrints(hasToken.value);

  // setAuthForDocumentUpload(hasToken.value);
  isLoading.value = false;
});
</script>

<style scoped>
.custom-width {
  width: 75%;
  margin: 0 auto;
}

.grid {
  display: grid;
  place-items: center;
  height: 80vh;
}

.avatar-sm {
  height: 2rem;
  width: 2rem;
}

@media screen and (max-width: 991.5px) {
  .custom-width {
    width: 100%;
  }

  .avatar-sm {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
