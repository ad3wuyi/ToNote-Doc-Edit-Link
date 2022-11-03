<template>
  <div class="content-right border-0">
    <div @click="$emit('open', (openSide = true))" class="d-none sidebar-toggle d-block d-lg-none ms-1 my-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-menu font-medium-5">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </div>

    <div class="content-body">
      <div class="body-content-overlay" :class="{ show: dashboard.isOpened }" @click="dashboard.setIsOpened(false)">
      </div>
      <div class="email-app-list">
        <div class="email-user-list">
          <!-- <div class="email-user-list ps ps--active-y"> -->
          <div class="card shadow-none bg-light">
            <div class="card-body shadow-none p-1">
              <div class="d-flex justify-content-center position-fixed d-none" style="z-index: 1">
                <span title="zoom-in"
                  class="badge bg-primary cursor-pointer custom-box rounded-circle zoom d-flex justify-content-center align-items-center"
                  @click="plus">
                  <Icon icon="ep:zoom-in" class="custom-box" />
                </span>
                <span title="recycle"
                  class="badge bg-primary cursor-pointer custom-box rounded-circle zoom-out d-flex justify-content-center align-items-center mx-1"
                  @click="refresh">
                  <Icon icon="bi:recycle" class="custom-box" />
                </span>
                <span title="zoom-out"
                  class="badge bg-primary cursor-pointer custom-box rounded-circle zoom-init d-flex justify-content-center align-items-center"
                  @click="minus">
                  <Icon icon="ep:zoom-out" class="custom-box" />
                </span>
              </div>

              <br class="d-none" />

              <p>Title: {{ link.title }}</p>
              <div class="target">
                <div id="mainWrapper" class="mx-auto shadow" style="width: 820px; height: auto">
                  <template v-if="theTools?.length != 0 && documentHeight">
                    <div v-for="(tool, index) in theTools" :key="index" class="parent"
                      :style="{ height: documentHeight + 'px' }">
                      <template v-if="tool.append_print == null">
                        <template v-if="tool.tool_name == 'Photo'">
                          <ToolImage @remove="remove" :tool="tool" :owner="{
                            user: profile,
                            isOwner: link.is_the_owner_of_document,
                          }" />
                        </template>
                        <template v-else>
                          <ToolDefault @remove="remove" :tool="tool" :owner="{
                            user: profile,
                            isOwner: link.is_the_owner_of_document,
                          }" />
                        </template>
                      </template>
                      <template v-else>
                        <template v-if="tool.tool_name == 'Textarea'">
                          <ToolTextArea @remove="remove" :tool="tool" :owner="{
                            user: profile,
                            isOwner: link.is_the_owner_of_document,
                          }" />
                        </template>
                        <template v-else-if="tool.tool_name == 'Photo'">
                          <ToolImage @remove="remove" :tool="tool" :owner="{
                            user: profile,
                            isOwner: link.is_the_owner_of_document,
                          }" />
                        </template>
                        <template v-else>
                          <ToolWithCommonAsset @remove="remove" :tool="tool" :owner="{
                            user: profile,
                            isOwner: link.is_the_owner_of_document,
                          }" :print="tool" />
                        </template>
                      </template>
                    </div>
                  </template>

                  <div v-for="(doc, index) in link.documentUploads" :key="index" class="position-relative">
                    <RenderPage :file="doc.file_url" @click="$emit('docId', doc.id)" @documentHeight="getHeight" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="ps__rail-x" style="left: 0px; bottom: 0px">
          <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px"></div>
        </div> -->
        <div class="ps__rail-y" style="top: 0px; height: 100px; right: 0px">
          <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 100px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import "jquery/dist/jquery.min";
import $ from "jquery";
import { dashboard } from "@/store/dashboard";
import ToolDefault from "@/components/Document/Edit/Tools/ToolDefault.vue";
import ToolImage from "@/components/Document/Edit/Tools/ToolImage.vue";
import ToolTextArea from "@/components/Document/Edit/Tools/ToolTextArea.vue";
import ToolWithCommonAsset from "@/components/Document/Edit/Tools/ToolWithCommonAsset.vue";
import RenderPage from "./RenderPage.vue";

import { ref, onMounted, watch } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { profile, link, workingTools, toolWithAsset } = useGetters({
  profile: "auth/profile",
  workingTools: "document/workingTools",
  toolWithAsset: "document/toolWithAsset",
  link: "signLink/link",
});

const { removeTool } = useActions({
  removeTool: "document/removeTool",
});

const openSide = ref(false);
const theTools = ref([]);
const documentHeight = ref(0);

watch(
  () => [workingTools.value, toolWithAsset.value],
  ([newTool, newToolWithAsset], [oldTool, oldToolWithAsset]) => {
    if (oldTool?.length != newTool?.length) {
      let check = JSON.parse(localStorage.getItem("vuex"));
      theTools.value = check.document.resourceTools;
    }

    if (newToolWithAsset != oldToolWithAsset) {
      let check = JSON.parse(localStorage.getItem("vuex"));
      theTools.value = check.document.resourceTools;
    }
  },
  { deep: true }
);

const getHeight = (event) => {
  documentHeight.value = event;
};

const remove = (params) => {
  return removeTool(params.id);
};

let zoom = 1;

function plus() {
  zoom += 0.1;
  $(".target").css("transform", "scale(" + zoom + ")");
}

function refresh() {
  zoom = 1;
  $(".target").css("transform", "scale(" + zoom + ")");
}

function minus() {
  zoom -= 0.1;
  $(".target").css("transform", "scale(" + zoom + ")");
}

onMounted(() => {
  theTools.value = workingTools.value;
});
</script>

<style scoped>
.parent {
  width: 820px;
  position: absolute;
  user-select: none;
}

.email-application .content-area-wrapper .email-user-list {
  height: auto;
}

.custom-box {
  width: 28px;
  height: 28px;
}
</style>
