<template>
  <div class="app-content content mb-5">
    <div class="content-wrapper container-xxl p-0">
      <div class="content-body">
        <div class="card">
          <div class="card-body" v-if="!isHidden">
            <div class="row mt-75">
              <div class="col-sm-12 col-lg-12">
                <div class="card-header d-flex justify-content-lg-between pb-1 p-0">
                  <h4 class="card-title">Template Links</h4>

                  <router-link :to="{ name: 'document.upload' }" class="btn btn-sm btn-primary">
                    Create a link
                  </router-link>
                </div>

                <div class="bg-light p-1 mb-2">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 my-auto custom-sm" v-show="hasMultipleSelection">
                      <button type="button" class="btn btn-sm btn-primary" @click="deleteDocument">
                        Delete
                      </button>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 ms-auto">
                      <div class="input-group input-group-merge">
                        <span class="input-group-text">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg></span>
                        <input type="text" v-model="filterStatus" class="form-control form-control-lg"
                          placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon-search2" />
                      </div>
                    </div>

                    <div class="col-lg-6 col-md-12 col-12 mt-sm-2 mt-lg-0 d-none">
                      <div class="clearfix">
                        <div class="float-lg-end">
                          <div class="mb-1 row">
                            <label for="colFormLabelLg" class="col-sm-3 col-form-label-lg">Filter</label>
                            <div class="col-sm-9">
                              <select class="form-select form-select-lg" id="selectLarge">
                                <option selected="">All</option>
                                <option value="1">Files</option>
                                <option value="2">Folder</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-3 col-md-4 col-sm-12" v-for="(item,index) in 6" :key="index">
                <div class="card custom-shadow">
                  <div class="card-header">
                    <div class="d-flex justify-content-between align-items-start">
                      <h5 class="card-subtitle">Title: Contract agreement link can be copied</h5>
                      <a role="button" class="ms-auto text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-edit">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div class="card-body">
                    <div class="position-relative border" style="padding: 8px;">
                      <p class="card-text mb-0" style="font-size:10px">
                        https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd
                      </p>
                      <!-- <template v-if="isCopy">
                        <div class="position-absolute top-0 start-0 w-100 h-100"
                          style="display: grid; background: rgba(0, 0, 0, 0.3)">
                          <div class="d-flex justify-content-center align-items-center text-white">
                            <p class="me-50 mb-0">Please wait...</p>
                            <div class="spinner-grow spinner-grow-sm " role="status"></div>
                          </div>
                        </div>
                      </template> -->
                    </div>

                    <div class="demo-inline-spacing">
                      <button type="button" class="btn btn-sm btn-outline-primary waves-effect"
                        v-clipboard:copy="`https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd`"
                        v-clipboard:success="onCopy" v-clipboard:error="onError">
                        Copy
                      </button>
                    </div>
                  </div>

                  <div class="card-footer">
                    <!-- <div class="demo-inline-spacing">
                      <div class="avatar avatar-sm pull-up" v-for="(item,index) in 15" :key="index"
                        data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title=""
                        data-bs-original-title="Vinnie Mostowy">
                        <div class="avatar-content"><img src="@/assets/avatar.png" alt="Avatar" height="32" width="32">
                        </div>
                      </div>
                    </div> -->

                    <div class="avatar-group flex-wrap">
                      <div v-for="(item,index) in 10" :key="index" data-bs-toggle="tooltip" data-popup="tooltip-custom"
                        data-bs-placement="top" title="" class="avatar pull-up" data-bs-original-title="Vinnie Mostowy"
                        @click="showDetail(item)">
                        <img src="@/assets/avatar.png" alt="Avatar" height="32" width="32">
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp :show="isDelete" :size="'modal-sm'" @close="isDelete = false">
    <template #header>
      <h4 class="modal-title text-danger">Alert</h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <p class="text-center"><i>You won't be able to revert this!</i></p>
    </template>

    <template #footer>
      <button type="button" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: loading }"
        @click="proceedToDelete">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>

  <ModalComp :show="folderModal" :size="'modal-sm'" @close="folderModal = false">
    <template #header>
      <h4 class="modal-title mb-0">New Folder</h4>
    </template>

    <template #body>
      <input type="text" class="form-control" placeholder="New folder" />
    </template>

    <template #footer>
      <button type="button" class="btn btn-primary me-1 waves-effect waves-float waves-light" data-bs-dismiss="modal">
        Create
      </button>
    </template>
  </ModalComp>

  <ModalComp :show="showModal" :footer="false" :size="'modal-sm'" @close="showModal = false">
    <template #header>
      <h4 class="modal-title text-warning">User Details</h4>
    </template>

    <template #body>
      <table class="table">
        <tbody>
          <tr>
            <td>Name:</td>
            <td>
              <div class="d-flex justify-content-left align-items-center">
                <div class="avatar-wrapper">
                  <div class="avatar me-1">
                    <img src="@/assets/avatar.png" alt="Avatar" height="32" width="32">
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <h6 class="user_name text-truncate text-body mb-0">
                    <span class="fw-bolder">
                      Stu Delamaine {{theItemId}}</span>
                  </h6>
                  <small class="emp_post text-muted">sdelamainek@who.int</small>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Role:</td>
            <td>
              <span class="text-truncate align-middle">
                Signer</span>
            </td>
          </tr>
          <tr>
            <td>Status:</td>
            <td><span class="badge rounded-pill badge-light-warning" text-capitalized="">Pending</span></td>
          </tr>
        </tbody>
      </table>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
// import RenderPage from "@/components/Document/Edit/Main/RenderPage.vue";
// import moment from "moment";

import { onMounted, ref, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { dashboard } from "@/store/dashboard";

import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRouter();

const showModal = ref(false);
const hasMultipleSelection = ref(false);
const isHidden = ref(false);
const loading = ref(false);
// const isLoading = ref(false);
const isDelete = ref(false);
const isCheckAll = ref(false);
const docIds = ref([]);
const docObj = ref([]);
const folderModal = ref(false);

const { token } = useGetters({
  token: "auth/token",
  documentsByStatus: "document/documentsByStatus",
  receivedDocuments: "document/ReceivedDocuments",
  userDocument: "document/userDocument",
});

const {
  getUserDocuments,
  removeDocument,
  getUserPrints,
  getUserDocumentByStatus,
  getReceivedDocuments,
  getDeletedDocuments,
} = useActions({
  getUserDocuments: "document/getUserDocuments",
  getUserDocument: "document/getUserDocument",
  removeDocument: "document/removeDocument",
  getUserDocumentByStatus: "document/getUserDocumentByStatus",
  getReceivedDocuments: "document/getReceivedDocuments",
  getDeletedDocuments: "document/getDeletedDocuments",
  getUserPrints: "print/getUserPrints",
});

watch(
  () => dashboard.value.status,
  (newStatus) => {
    if (newStatus) {
      isHidden.value = false;
      getUserDocumentByStatus(newStatus);
      if (newStatus == "Received") {
        return getReceivedDocuments(token.value);
      }
      if (newStatus == "Deleted") {
        return getDeletedDocuments(token.value);
      }
    }
  }
);

const theItemId = ref('')
const showDetail = (id) => {
  showModal.value = true
  theItemId.value = id
}

const isCopy = ref(false);
const message = 'Copied to clipboard!'
const onCopy = () => {
  isCopy.value = true
  setTimeout(() => {
    isCopy.value = false
  }, 1000);

  return toast.default(message, {
    timeout: 5000,
    position: "top-right",
  });
}
const onError = (e) => {
  alert('Failed to copy texts', e)
}

// const editId = ref("");
// const getDocument = (params) => {
//   getUserDocument(params.id);

//   if (params.isView && params.status == "Sent") {
//     return route.push({ name: "document.audit", params: { document_id: params.id } });
//   }

//   if (params.isEdit === true) {
//     return route.push({ name: "document.edit", params: { document_id: params.id } });
//   }

//   isLoading.value = isHidden.value = true;
//   editId.value = params.id;
//   setTimeout(() => (isLoading.value = false), 2000);
// };

const filterStatus = ref("");
// const filtered = computed(() => {
//   return documentsByStatus.value.filter((item) =>
//     item.title.toLowerCase().includes(filterStatus.value.toLowerCase())
//   );
// });

// const checkAll = () => {
//   isCheckAll.value = !isCheckAll.value;
//   docIds.value = [];
//   if (isCheckAll.value) {
//     for (const key in documentsByStatus.value) {
//       docIds.value.push(documentsByStatus.value[key].id);
//     }
//   }

//   hasMultipleSelection.value = docIds.value.length > 0 ? true : false;
// };

// const updateCheckAll = () => {
//   hasMultipleSelection.value = docIds.value.length - 1 >= 0 ? true : false;
//   if (docIds.value.length == documentsByStatus.value.length) {
//     isCheckAll.value = true;
//   } else {
//     isCheckAll.value = false;
//   }
// };

const deleteDocument = () => {
  if (docIds.value.length == 0) {
    return toast.error("Select a file to delete", {
      timeout: 5000,
      position: "top-right",
    });
  }
  isDelete.value = true;
};

const proceedToDelete = () => {
  loading.value = true;
  docObj.value = [];
  const isPermanent = route.currentRoute.value.query.status == "deleted" ? true : false;
  for (const key in docIds.value) {
    docObj.value.push({ document_id: docIds.value[key], permanent_delete: isPermanent });
  }

  removeDocument({ documents: docObj.value });
  docIds.value = [];

  hasMultipleSelection.value = isCheckAll.value = false;
  setTimeout(() => {
    isDelete.value = loading.value = false;
  }, 1000);
};

// const dateTime = (value) => {
//   return moment(value).format("Do MMM YYYY, HH:mm A");
// };

onMounted(() => {
  getUserDocuments(token.value);
  getUserPrints(token.value);
  getReceivedDocuments(token.value);
  getDeletedDocuments(token.value);
  setTimeout(() => {
    getUserDocumentByStatus(dashboard.value.status);
  }, 100);
});
</script>

<style scoped>
.loader {
  display: grid;
  place-items: center;
  height: 70vh;
  width: 100%;
}

.card-subtitle {
  margin-top: 0;
}

.custom-shadow {
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px !important;
}

.custom-shadow:hover {
  /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important; */
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px !important;
}

.table> :not(caption)>*>* {
  padding: 0.72rem 1rem !important;
}

.avatar-group .avatar {
  margin-left: -0.55rem;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #999 #eee;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #eee;
}

*::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 20px;
  border: 3px solid #eee;
}

@media screen and (max-width: 991.5px) {
  .custom-sm {
    margin-bottom: 8px !important;
  }
}
</style>
