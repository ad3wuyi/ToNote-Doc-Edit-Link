<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav sticky shadow" style="width: 260px">
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
                <div class="list-group-item border-bottom">
                  Tool Management
                </div>
                <div v-show="!hasRole" class="text-center mt-5">
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </div>
                <div v-if="hasRole">
                  <ToolKits @bindTool="addMouseMoveListener" />
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
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import AddSigner from "@/components/Document/Edit/Left/AddSigner.vue";

import { ref, onMounted, defineProps, watch, onUpdated, computed } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

import ToolKits from "@/components/Document/Edit/Tools/ToolKits.vue";

const { profile, userDocument, workingTools } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
});

const { resourceTools } = useActions({
  resourceTools: "document/resourceTools",
});

workingTools.value = computed(() => {
  return workingTools.value;
});

/* ------- // *** Props from views\documents\DocumentEdit.vue (PARENT) ------ */
const props = defineProps({ chunkFileId: String, isOpen: Boolean });

const watchFileId = ref("");

watch(
  () => [props.chunkFileId],
  ([newChunkF]) => {
    if (newChunkF) {
      watchFileId.value = newChunkF;
    }
  },
  { deep: true }
);

const addParticipantModal = ref(false);
const hasRole = ref(false);

const tempStorage = ref(null);
const tool_class = ref("");
const tool_id = ref("");
const tempData = ref(false);

const participantId = ref("");

function getOS() {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Linux/.test(platform)) {
    os = "Linux";
  }
  return os;
}
const hasOS = ref("");
hasOS.value = getOS();

const addMouseMoveListener = (params) => {
  tempData.value = true;
  let count = 1;
  tempStorage.value = params;
  let customValue = hasOS.value == "Mac OS" ? 26 : 70;
  $(document).bind("mousemove", function (e) {
    count = count + 1;
    tool_id.value = count;
    $("." + params.toolId).attr("id", count);
    $("." + params.toolId).css({
      display: "block",
      left: e.pageX - customValue,
      top: e.pageY - 164,
    });
  });
};

$(document).on("click", "#mainWrapper", function (e) {
  if (tempStorage.value == null) return;
  $("#" + tool_id.value).css("display", "none");
  removeMouseMoveListener();

  let posX = $(this).offset().left;
  let posY = $(this).offset().top;
  let x = e.pageX - posX;
  let y = e.pageY - posY;

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
    user_id: participantId.value == "" ? profile.value.id : participantId.value,
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
});
</script>

<style scoped>
.email-app-sidebar {
  background: transparent !important;
}

.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
  background-color: #fff;
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
