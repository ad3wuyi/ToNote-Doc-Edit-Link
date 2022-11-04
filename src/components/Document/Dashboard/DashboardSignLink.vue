<template>
  <table class="table table-borderless mb-5" role="grid" :id="theSignId">
    <thead>
      <tr role="row">
        <th rowspan="1" colspan="1" style="width: 0px" aria-label="">
          <input type="checkbox" @click="checkAll" v-model="isCheckAll" class="form-check-input" />
        </th>
        <th rowspan="1" colspan="1" style="width: 258px" aria-label="Name">Name</th>
        <th rowspan="1" colspan="1" style="width: 348px" aria-label="Link">Link</th>
        <th tabindex="0" rowspan="1" colspan="1" style="width: 227px" aria-label="Responses">
          <span>Response(s)</span>
        </th>
        <th rowspan="1" colspan="1" style="width: 115px" aria-label="Actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr class="even" v-for="(doc, index) in links" :key="index">
        <td class="control" tabindex="0">
          <input type="checkbox" v-model="docIds" @change="updateCheckAll" :value="doc.id" class="form-check-input" />
        </td>
        <td>
          <a role="button" class="text-truncate" style="width: 200px" @click="
            getDocument({
              id: doc.id,
              status: dashboard.status,
              isView: true,
            })
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-file-text">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {{ doc.title }}
          </a>
        </td>
        <td>
          <span class="badge rounded-pill badge-light-dark fw-normal" style="font-size:10px">
            {{ linkUrl + "/document/edit/" + doc.id }}
          </span>
        </td>
        <td>
          <span role="button" class="badge rounded-pill badge-light-success fw-normal" @click="editModal = true">
            {{ doc.participants_count }}
            response(s)
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-edit">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </span>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <button type="button" class="btn btn-sm btn-outline-primary waves-effect"
              v-clipboard:copy="linkUrl + '/document/edit/' + doc.id" v-clipboard:success="onCopy"
              v-clipboard:error="onError">
              Copy link
            </button>
            <div class="dropdown">
              <button type="button"
                class="btn btn-sm dropdown-toggle hide-arrow py-0 waves-effect waves-float waves-light"
                data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-more-vertical">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div class="dropdown-menu dropdown-menu-end">
                <template v-if="dashboard.status != 'Deleted'">
                  <a class="dropdown-item" role="button" @click="
                    getDocument({
                      id: doc.id,
                      status: dashboard.status,
                      isView: true,
                    })
                  ">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
                      stroke-linecap="round" stroke-linejoin="round" class="feather me-50">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="feather feather-edit-2 me-50">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <span>Edit</span>
                  </a>
                </template>
                <template v-else>
                  <a class="dropdown-item" href="#" @click="deleteDocument('restore', doc.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="feather feather-rotate-ccw me-50">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    <span>Restore</span>
                  </a>
                </template>
                <a class="dropdown-item" href="#" @click="deleteDocument('delete', doc.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-trash me-50">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Delete</span>
                </a>
                <a class="dropdown-item" role="button" @click="moveToLocker">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-folder me-50">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Move to locker</span>
                </a>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <ModalComp :show="editModal" :size="'modal-lg'" :footer="false" @close="editModal = false">
    <template #header>
      <h4 class="modal-title mb-0">Details</h4>
    </template>

    <template #body>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </template>

    <!-- <template #footer>
      <button type="button" class="btn btn-primary me-1 waves-effect waves-float waves-light" data-bs-dismiss="modal">
        Create
      </button>
    </template> -->
  </ModalComp>

  <ModalComp :show="isDeleteOrRestore" :size="'modal-sm'" @close="isDeleteOrRestore = false">
    <template #header>
      <h4 class="modal-title text-danger">Alert</h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <template v-if="dashboard.status == 'Deleted' && action != 'restore'">
        <p class="text-center"><i>You won't be able to undo this!</i></p>
      </template>
    </template>

    <template #footer>
      <button type="button" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: loading }"
        @click="proceedToDelete">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import { dashboard } from "@/store/dashboard";
import { onMounted, ref, watch, defineEmits } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs5";
import $ from "jquery";

const emit = defineEmits(['close'])

const route = useRouter();
const toast = useToast();

const editModal = ref(false);
const isHidden = ref(false);
const hasMultipleSelection = ref(false);
const isCheckAll = ref(false);
const isDeleteOrRestore = ref(false);
const loading = ref(false);
const docIds = ref([]);

const { links } = useGetters({
  links: "signLink/links",
  link: "signLink/link",
  receivedDocuments: "signLink/ReceivedDocuments",
});

const { getLinks, removeLink, retrieveLink } = useActions({
  getLinks: "signLink/getLinks",
  getLink: "signLink/getLink",
  removeLink: "signLink/removeLink",
  retrieveLink: "signLink/retrieveLink",
  getDeletedLinks: "signLink/getDeletedLinks",
});

watch(
  () => [dashboard.value.status],
  ([newStatus], [oldStatus]) => {
    if (newStatus != oldStatus) {
      isCheckAll.value = hasMultipleSelection.value = isHidden.value = false;
      docIds.value = [];
    }
  }
);

// const editId = ref("");
const getDocument = (params) => {
  // getLink(params.id);

  if (params.isView && params.status == "Sign") {
    return route.push({ name: "document.show", params: { document_id: params.id } });
  }

  if (params.isEdit === true) {
    return route.push({ name: "document.edit", params: { document_id: params.id } });
  }

  // isLoading.value = isHidden.value = true;
  // editId.value = params.id;
  // setTimeout(() => (isLoading.value = false), 2000);
};

const checkAll = () => {
  isCheckAll.value = !isCheckAll.value;
  docIds.value = [];
  if (isCheckAll.value) {
    for (const key in links.value) {
      docIds.value.push(links.value[key].id);
    }
  }
  console.log(docIds.value)
  hasMultipleSelection.value = docIds.value.length > 0 ? true : false;
  emit('showDeleteButton', hasMultipleSelection.value)
};

const updateCheckAll = () => {
  hasMultipleSelection.value = docIds.value.length - 1 >= 0 ? true : false;
  emit('showDeleteButton', hasMultipleSelection.value)
  if (docIds.value.length == links.value.length) {
    isCheckAll.value = true;
  } else {
    isCheckAll.value = false;
  }
};

const action = ref("");
const linkId = ref("");
const deleteDocument = (params, id) => {
  if (id == '') {
    return toast.error("Select a file to delete", {
      timeout: 5000,
      position: "top-right",
    });
  }
  linkId.value = id;

  // if (id != "") {
  //   docIds.value = [id];
  // }
  // if (docIds.value.length == 0) {
  //   console.log(docIds)
  //   return toast.error("Select a file to delete", {
  //     timeout: 5000,
  //     position: "top-right",
  //   });
  // }

  action.value = params;
  isDeleteOrRestore.value = true;
};

// const docObj = ref([])
const proceedToDelete = () => {
  loading.value = true;
  // docObj.value = [];
  // const isPermanent = route.currentRoute.value.query.status == "deleted" ? true : false;
  // for (const key in docIds.value) {
  //   docObj.value.push({ document_id: docIds.value[key], permanent_delete: isPermanent });
  // }

  action.value == "delete"
    ? removeLink(linkId.value)
    : retrieveLink(linkId.value);

  docIds.value = [];

  hasMultipleSelection.value = isCheckAll.value = false;
  isDeleteOrRestore.value = loading.value = false;
  setTimeout(() => {
    getLinks();
  }, 1000);
};


const message = "Copied to clipboard!";
const onCopy = () => {
  return toast.default(message, {
    timeout: 5000,
    position: "top-right",
  });
};
const onError = (e) => {
  alert("Failed to copy texts", e);
};

const theSignId = ref("");
const linkUrl = ref("");
onMounted(() => {
  linkUrl.value =
    process.env.NODE_ENV === "development"
      ? process.env.VUE_APP_URL_AUTH_LOCAL
      : process.env.VUE_APP_URL_SIGN_LINK;

  getLinks();
  theSignId.value = dashboard.value.status;
  setTimeout(() => {
    if ($.fn.dataTable.isDataTable("#" + theSignId.value)) {
      $("#" + theSignId.value).DataTable();
    } else {
      $("#" + theSignId.value).DataTable({
        columnDefs: [{ orderable: false, targets: [0, 4] }],
        aaSorting: [],
        lengthMenu: [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, "All"],
        ],
        pageLength: 5,
      });
    }
  }, 100);
});
</script>

<style scoped>

</style>
