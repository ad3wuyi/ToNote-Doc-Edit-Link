<template>
  <div class="app-content content">
    <div class="content-wrapper container-xxl p-0">
      <div class="content-body">
        <div class="card">
          <div class="card-datatable table-responsive" v-if="!isHidden">
            <div class="d-flex justify-content-between align-items-center header-actions text-nowrap mx-1 row mt-75">
              <div class="col-sm-12 col-lg-12">
                <div class="card-header d-flex justify-content-lg-between py-1 p-0">
                  <h4 class="card-title">My Files</h4>

                  <div class="d-none">
                    <div class="btn-group">
                      <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Upload
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">File Upload</a>
                        <a class="dropdown-item" href="#">Folder Upload</a>
                      </div>
                    </div>
                    <button class="btn btn-primary ms-2" @click="folderModal = true">
                      New Folder
                    </button>
                  </div>
                  <router-link :to="{ name: 'document.upload' }" class="btn btn-sm btn-primary">
                    Sign a Document
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

              <div class="my-auto">
                <table class="table table-borderless mb-5" role="grid">
                  <thead>
                    <tr role="row">
                      <th class="control sorting_disabled" rowspan="1" colspan="1" style="width: 0px" aria-label="">
                        <input type="checkbox" @click="checkAll" v-model="isCheckAll" class="form-check-input"
                          id="selectAllCheck" />
                      </th>
                      <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 258px" aria-label="Name">
                        Name
                      </th>
                      <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 348px"
                        aria-label="Assigned To">
                        Record
                      </th>
                      <th class="sorting" tabindex="0" rowspan="1" colspan="1" style="width: 227px"
                        aria-label="Created Date: activate to sort column ascending">
                        Last updated
                      </th>
                      <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 115px" aria-label="Actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="odd d-none">
                      <td class="control" tabindex="0">
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td>
                        <div>
                          <span class="me-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" class="feather feather-folder">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z">
                              </path>
                            </svg>
                          </span>

                          <span class="ml-1">All Affidavits </span>
                        </div>
                      </td>
                      <td>
                        <a href="#" class="me-50"><span class="badge rounded-pill badge-light-dark">2 Files</span></a>
                      </td>
                      <td>14 Apr 2021, 8:43 PM</td>
                      <td style="display: none">
                        <button class="btn btn-sm btn-icon" data-bs-toggle="modal"
                          data-bs-target="#editPermissionModal">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-edit font-medium-2 text-body">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg></button><button class="btn btn-sm btn-icon delete-record">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-trash font-medium-2 text-body">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                          </svg>
                        </button>
                      </td>
                    </tr>

                    <template v-if="filtered.length > 0">
                      <tr class="even" v-for="(doc, index) in filtered" :key="index">
                        <td class="control" tabindex="0">
                          <input type="checkbox" v-model="docIds" @change="updateCheckAll" :value="doc.id"
                            class="form-check-input" />
                        </td>
                        <td>
                          <a role="button" @click="
                            getDocument({
                              id: doc.id,
                              status: dashboard.status,
                              isView: true,
                            })
                          ">
                            <img src="@/assets/doc.png" class="me-1" alt="file-icon" height="15" />
                            <span class="ml-1">{{ doc.title }}</span>
                          </a>
                        </td>
                        <td>
                          <span class="badge rounded-pill badge-light-primary">
                            {{ doc.participants_count }} Participant(s)
                          </span>
                        </td>

                        <td>{{ dateTime(doc.updated_at) }}</td>

                        <td>
                          <div class="dropdown">
                            <button type="button"
                              class="btn btn-sm dropdown-toggle hide-arrow py-0 waves-effect waves-float waves-light"
                              data-bs-toggle="dropdown" aria-expanded="false">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                              </svg>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item" role="button" @click="
                                getDocument({
                                  id: doc.id,
                                  status: dashboard.status,
                                  isView: true,
                                })
                              ">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2"
                                  fill="none" stroke-linecap="round" stroke-linejoin="round" class="feather me-50">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>View</span>
                              </a>
                              <a class="dropdown-item" role="button" @click="
                                getDocument({
                                  id: doc.id,
                                  status: dashboard.status,
                                  isEdit: true,
                                })
                              ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round" class="feather feather-edit-2 me-50">
                                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                                <span>Edit</span>
                              </a>
                              <a class="dropdown-item" href="#" @click="deleteDocument">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round" class="feather feather-trash me-50">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                  </path>
                                </svg>
                                <span>Delete</span>
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr class="even text-center">
                        <td colspan="5" class="pt-3">
                          <i>No Items Found in
                            {{
                            dashboard.status == "Deleted" ? "Trash" : dashboard.status
                            }}</i>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="row my-2">
              <div class="col-12">
                <div class="d-flex justify-content-between px-2">
                  <router-link :to="{ name: 'Dashboard' }" class="btn btn-sm btn-secondary me-1"
                    @click="isHidden = !isHidden">
                    &larr; Back</router-link>

                  <router-link :to="{ name: 'document.edit', params: { document_id: editId } }"
                    class="btn btn-sm btn-primary">Edit
                  </router-link>
                </div>

                <div class="card">
                  <div class="card-header">
                    <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
                      <div class="mail-items">
                        <span v-show="isLoading">
                          <span class="spinner-border spinner-border-sm"></span>
                          Loading...
                        </span>
                        <h5 class="mb-0" v-show="!isLoading">{{ userDocument.title }}</h5>
                        <div v-show="!isLoading" class="email-info-dropup dropdown fw-normal">
                          <span role="button" class="dropdown-toggle font-small-3 text-muted" id="card_top01"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Participants: ({{ userDocument.participants_count }})
                          </span>
                          <div class="dropdown-menu" aria-labelledby="card_top01">
                            <table class="table table-hover fw-normal">
                              <tbody>
                                <tr v-for="(signer, index) in userDocument.participants" :key="index">
                                  <td>{{ ++index }}.</td>
                                  <td>{{ signer.user.first_name }}</td>
                                  <td>{{ signer.user.email }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mail-meta-item d-flex align-items-center">
                      <small class="mail-date-time text-muted">
                        {{ dateTime(userDocument.created_at) }}
                      </small>
                    </div>
                  </div>

                  <div class="card-body mail-message">
                    <div v-for="(doc, index) in userDocument.documentUploads" class="mb-1" :key="index">
                      <RenderPage :file="doc.file_url" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- </div> -->
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
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import RenderPage from "@/components/Document/Edit/Main/RenderPage.vue";
import moment from "moment";

import { computed, onMounted, ref, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { dashboard } from "@/store/dashboard";

import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRouter();

const hasMultipleSelection = ref(false);
const isHidden = ref(false);
const loading = ref(false);
const isLoading = ref(false);
const isDelete = ref(false);
const isCheckAll = ref(false);
const docIds = ref([]);
const docObj = ref([]);
const folderModal = ref(false);

const { token, documentsByStatus, userDocument } = useGetters({
  token: "auth/token",
  documentsByStatus: "document/documentsByStatus",
  receivedDocuments: "document/ReceivedDocuments",
  userDocument: "document/userDocument",
});

const {
  getUserDocuments,
  getUserDocument,
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
      if (newStatus == "Received") { return getReceivedDocuments(token.value) }
      if (newStatus == "Deleted") { return getDeletedDocuments(token.value) }
    }
  }
);

const editId = ref("");
const getDocument = (params) => {
  getUserDocument(params.id);

  if (params.isView && params.status == "Sent") {
    return route.push({ name: "document.audit", params: { document_id: params.id } });
  }

  if (params.isEdit === true) {
    return route.push({ name: "document.edit", params: { document_id: params.id } });
  }

  isLoading.value = isHidden.value = true;
  editId.value = params.id;
  setTimeout(() => (isLoading.value = false), 2000);
};

const filterStatus = ref("");
const filtered = computed(() => {
  return documentsByStatus.value.filter((item) =>
    item.title.toLowerCase().includes(filterStatus.value.toLowerCase())
  );
});

const checkAll = () => {
  isCheckAll.value = !isCheckAll.value;
  docIds.value = [];
  if (isCheckAll.value) {
    for (const key in documentsByStatus.value) {
      docIds.value.push(documentsByStatus.value[key].id);
    }
  }

  hasMultipleSelection.value = docIds.value.length > 0 ? true : false;
};

const updateCheckAll = () => {
  hasMultipleSelection.value = docIds.value.length - 1 >= 0 ? true : false;
  if (docIds.value.length == documentsByStatus.value.length) {
    isCheckAll.value = true;
  } else {
    isCheckAll.value = false;
  }
};

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

const dateTime = (value) => {
  return moment(value).format("Do MMM YYYY, HH:mm A");
};

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

.table> :not(caption)>*>* {
  padding: 0.72rem 1rem !important;
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
