<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="sidebar-content email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav" style="width: 260px">
            <div class="list-group list-group-messages">
              <template v-if="userDocument.is_the_owner_of_document === true">
                <div class="list-group-item border-bottom">
                  <span class="align-middle"> Edit Tools</span>
                </div>

                <div class="list-group-item border-bottom">
                  <div class="d-grid col-lg-12 col-md-12 mb-1 mb-lg-0">
                    <button type="button" class="
                        btn btn-primary
                        waves-effect waves-float waves-light
                        custom
                      " @click="addParticipantModal = true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="feather feather-plus">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span> Add participants</span>
                    </button>
                  </div>
                </div>

                <div role="button" class="list-group-item border-bottom" @click="editSignerModal = true">
                  <span class="isHover">Manage signers <span>&rightarrow;</span></span>
                </div>

                <div class="list-group-item border-bottom">
                  <p>Signers ({{ userDocument.participants_count }})</p>

                  <div class="avatar-group">
                    <div v-for="(init, index) in userDocument.participants" data-popup="tooltip-custom"
                      data-bs-placement="top" :title="init.user.first_name + ' ' + init.user.last_name"
                      class="avatar pull-up" :data-bs-original-title="init.user.first_name" :data-id="init.id"
                      :key="index">
                      <div class="avatar-content text-uppercase">
                        {{
                        getFirstLetters(init.user.first_name + " " + init.user.last_name)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="list-group-item border-bottom">
                  <label class="form-label">Good day to you!</label>
                  <p class="text-capitalize">
                    {{ profile.first_name }} {{ profile.last_name }}.
                  </p>
                </div>
              </template>
              <div class="">
                <div class="list-group-item border-bottom">
                  Tool Management
                </div>

                <div class="list-group-item border-bottom">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      Added Tool ({{ workingTools.length > 0 ? workingTools.length : 0 }})
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="!hasRole" class="text-center mt-5">
                <span class="spinner-border spinner-border-sm"></span>
                Loading...
              </div>
              <div v-if="hasRole">
                <ToolKits @bindTool="addMouseMoveListener" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tool-box textTool" id="textTool">
    <input aria-invalid="false" type="text" class="v-textareaTool w-100" value="" />
  </div>

  <div class="tool-box tool-style signTool" id="signTool">
    <div class="element">Sign<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style initialTool" id="initialTool">
    <div class="element">Initial<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style stampTool" id="stampTool">
    <div class="element">Stamp<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style sealTool" id="sealTool">
    <div class="element">Seal<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box dateTool" id="dateTool">
    <div class="element">Date<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style photoTool" id="photoTool">
    <div class="element">Image<i data-feather="arrow-down-right"></i></div>
  </div>

  <ModalComp :show="addParticipantModal" :footer="false" @close="addParticipantModal = false">
    <template #header>
      <h5 class="modal-title">Add participants</h5>
    </template>

    <template #body>
      <AddSigner @close="addParticipantModal = false" />
    </template>
  </ModalComp>
  <ModalComp :show="editSignerModal" :footer="false" @close="closeSignerModal">
    <template #header>
      <template v-if="userDocument.is_the_owner_of_document === true">
        <h5 class="modal-title">Edit participants</h5>
      </template>
      <template v-else>
        <h5 class="modal-title">Participants</h5>
      </template>
    </template>

    <template #body>
      <form @submit.prevent="onEditParticipant">
        <div id="addSignerErrorMsg" class="text-center text-danger"></div>
        <div class="row gx-1" v-for="(participant, index) in participants" :key="index">
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="first-name">First Name</label>
              <input :readonly="!userDocument.is_the_owner_of_document" type="text" name="first_name"
                v-model="participant.user.first_name" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="last-name-column">Last Name</label>
              <input :readonly="!userDocument.is_the_owner_of_document" type="text" name="last_name"
                v-model="participant.user.last_name" class="form-control form-control-sm" />
            </div>
          </div>
          <!-- <div class="col-md-3 col-12">
              <div class="mb-1">
                <label class="form-label" for="phone-column">Phone</label>
                <input :readonly="!userDocument.is_the_owner_of_document" type="phone" name="phone"
                    v-model="participant.user.phone" class="form-control form-control-sm" />
              </div>
            </div> -->
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="email-id-column">Email</label>
              <input :readonly="!userDocument.is_the_owner_of_document" type="email" name="email"
                v-model="participant.user.email" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <div class="mb-1">
              <label class="form-label" for="role-column">Role</label>
              <select name="role" :disabled="!userDocument.is_the_owner_of_document" v-model="participant.role"
                class="form-select form-control-sm" required>
                <option value="">select role</option>
                <option :selected="participant.role == 'Signer' ? true : false">
                  Signer
                </option>
                <option :selected="participant.role == 'Viewer' ? true : false">
                  Viewer
                </option>
              </select>
            </div>
          </div>

          <template v-if="userDocument.is_the_owner_of_document === true">
            <div class="col-md-12">
              <small role="button" style="font-size: small" class="text-danger" @click="remove(participant.id)">
                Remove
              </small>
            </div>
          </template>
          <hr />
        </div>

        <div class="row">
          <div class="col-12">
            <button v-if="userDocument.is_the_owner_of_document === true" type="submit"
              class="btn btn-sm btn-primary waves-effect waves-float waves-light d-block ms-auto">
              Update
            </button>
          </div>
        </div>
      </form>
    </template>
  </ModalComp>

  <ModalComp :show="removeParticipantModal" :size="'modal-sm'" @close="removeParticipantModal = false">
    <template #header>
      <h4 class="text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>
    <template #body>
      <h5 class="modal-title text-center">
        Are you sure you want to remove this signer?
      </h5>
      <p class="fw-normal text-center">
        This will remove all tools added in the signer's name
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-content-end align-items-center">
        <button class="btn btn-sm btn-outline-danger" @click="deleteParticipant">
          Yes Remove
        </button>
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import AddSigner from "@/components/Document/Edit/Left/AddSigner.vue";

import { ref, onMounted, defineProps, defineEmits, watch, onUpdated, computed } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

import ToolKits from "@/components/Document/Edit/Tools/ToolKits.vue";

const { profile, userDocument, workingTools } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
});

const { resourceTools, editParticipant, removeParticipant } = useActions({
  resourceTools: "document/resourceTools",
  removeParticipant: "document/removeParticipant",
  editParticipant: "document/editParticipant",
});

workingTools.value = computed(() => {
  return workingTools.value;
});

/* ------- // *** Props from views\documents\DocumentEdit.vue (PARENT) ------ */
const props = defineProps({ chunkFileId: String, isOpen: Boolean });
const emit = defineEmits(['close'])

const watchFileId = ref("");
const participants = ref("");

watch(
  () => [userDocument.value.participants, props.chunkFileId, props.isOpen],
  ([newUserDoc, newChunkF, newOpen]) => {
    participants.value = newUserDoc
    if (newChunkF) {
      watchFileId.value = newChunkF;
    }

    if (newOpen) { editSignerModal.value = newOpen }
  },

  { deep: true }
);

const editSignerModal = ref(false);
const addParticipantModal = ref(false);
const hasRole = ref(false);

const tempStorage = ref(null);
const tool_class = ref("");
const tool_id = ref("");
const tempData = ref(false);

const removeParticipantModal = ref(false);
const participantId = ref("");

const closeSignerModal = () => {
  editSignerModal.value = false
  emit('close', true)
}

const getFirstLetters = (str) => {
  const firstLetters = str
    .split(" ")
    .map((word) => word[0])
    .join("");

  return firstLetters;
};

const onEditParticipant = () => {
  let formObj = [];
  participants.value.map((obj) => {
    formObj.push({
      document_id: userDocument.value.id,
      document_participant_id: obj.id,
      first_name: obj.user.first_name,
      last_name: obj.user.last_name,
      email: obj.user.email,
      phone: obj.user.phone,
      role: obj.role,
    });
  });

  editParticipant(formObj);
  editSignerModal.value = false;
  emit('close', true)
};

const remove = (params) => {
  removeParticipantModal.value = true;
  participantId.value = params;
};

const deleteParticipant = () => {
  removeParticipant(participantId.value);
  removeParticipantModal.value = false;
};

const addMouseMoveListener = (params) => {
  tempData.value = true;

  let count = 1;
  tempStorage.value = params;

  $(document).bind("mousemove", function (e) {
    count = count + 1;
    tool_id.value = count;
    $("." + params.toolId).attr("id", count);
    $("." + params.toolId).css({
      display: "block",
      left: e.pageX - 80,
      top: e.pageY - 200,
    });
  });
};

$(document).on("click", "#mainWrapper", function (e) {
  if (tempStorage.value == null) return;
  $("#" + tool_id.value).css("display", "none");
  removeMouseMoveListener();

  let offset = $(this).offset();

  let x = e.pageX - offset.left - 10;
  let y = e.pageY - offset.top - 35;

  const toolName = tempStorage.value.tool_name;
  if (toolName == "Sign" || toolName == "Initial") {
    tool_class.value = "tool-box tool-style main-element";
  } else if (toolName == "Textarea" || toolName == "Date") {
    tool_class.value = "main-element";
  } else if (toolName == "Photo") {
    tool_class.value = "main-element";
  } else {
    tool_class.value = "tool-box main-element";
  }

  let saveTools = {
    document_upload_id: watchFileId.value,
    user_id: profile.value.id,
    tool_name: toolName,
    tool_class: tool_class.value,
    tool_width: toolName == "Textarea" ? "120" : "100",
    tool_height: toolName == "Textarea" ? "25" : "40",
    tool_pos_top: y.toString(),
    tool_pos_left: x.toString(),
    category: toolName == "Textarea" ? "Type" : "",
    type: toolName == "Textarea" ? "Text" : "",
    value: "",
  };

  if (tempData.value === true) {
    resourceTools(saveTools);
    tempData.value = false;
  }
});

function removeMouseMoveListener() {
  $(document).unbind("mousemove");
}

onUpdated(() => {
  console.log('Updated')
});

onMounted(() => {
  setTimeout(() => {
    hasRole.value = true;
  }, 1000);

  const $sidebar = $(".sidebar-nav");
  let sidebarTop =
    $sidebar.position().top != undefined ? $sidebar.position().top : 0;

  $(window).scroll(fixSidebarOnScroll);
  function fixSidebarOnScroll() {
    const windowScrollTop = $(window).scrollTop();
    if (windowScrollTop <= sidebarTop) {
      $sidebar.removeClass("sticky");
    } else if (windowScrollTop >= sidebarTop) {
      if (!$sidebar.hasClass("sticky")) {
        $sidebar.addClass("sticky");
      }
    }
  }
});
</script>

<style scoped>
.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
}

.btn.custom {
  padding: 0.786rem 0.5rem !important;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
