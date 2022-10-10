<template>
  <div class="sidebar-left custom-md-none" :class="{ show: openSide }">
    <div class="sidebar">
      <div class="sidebar-content email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav text-center py-3 px-1" style="width: 260px;">
            <img src="@/assets/logo.png" class="w-25 mb-2" alt="ToNote Logo" />
            <p>
              We help thousands of customers sign and notarise documents the easy way.
            </p>
            <p>We continue to work hard to ensure that our notary process is fully automated, legally binding and
              affordable for all our customers.
            </p>
            <h4>Contact Us</h4>
            <p>Office Address: 1625b Saka Jojo Street, Victoria Island, Lagos.</p>
            <p>Phone: +2348146507035</p>
            <p>Email : ask@gettonote.com</p>

            <div class="list-group list-group-messages d-none">
              <div class="list-group-item list-group-item-action border-bottom">
                Tool Management
              </div>

              <div class="list-group-item list-group-item-action border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    Added Tool ({{ workingTools.length > 0 ? workingTools.length : 0 }})
                  </div>
                </div>
              </div>

              <template v-if="userDocument.is_the_owner_of_document === true">
                <div class="list-group-item list-group-item-action border-bottom">
                  <p>Signers ({{ userDocument.participants_count }})</p>

                  <div class="avatar-group">
                    <div v-for="(init, index) in userDocument.participants" data-popup="tooltip-custom"
                      data-bs-placement="top" :title="init.user.first_name + ' ' + init.user.last_name"
                      class="avatar pull-up" :data-bs-original-title="init.user.first_name" :data-id="init.id"
                      :key="index">
                      <div class="avatar-content">
                        {{
                        getFirstLetters(init.user.first_name + " " + init.user.last_name)
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div role="button" class="list-group-item list-group-item-action border-bottom"
                  @click="editSignerModal = true">
                  <span class="isHover">View all signers <span>&rightarrow;</span></span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
import { Icon } from "@iconify/vue";
import ModalComp from "@/components/ModalComp.vue";

import { computed, onMounted, ref, defineEmits, defineProps, watch } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

const { userDocument, profile, workingTools } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
});

const { removeParticipant, editParticipant } = useActions({
  removeParticipant: "document/removeParticipant",
  editParticipant: "document/editParticipant",
});

workingTools.value = computed(() => {
  return workingTools.value;
});

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close'])

watch(
  () => [userDocument.value.participants, props.isOpen],
  ([newUserDoc, newOpen]) => {
    participants.value = newUserDoc
    if (newOpen) { editSignerModal.value = newOpen }
  }
);

const isOwner = ref(false);
const removeParticipantModal = ref(false);
const editSignerModal = ref(false);
const fullName = ref("");
const participantId = ref("");
const nameInitials = ref("");
const initialObj = ref([]);
const participants = ref(null);

participants.value = userDocument.value.participants;

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

onMounted(() => {
  initialObj.value = [];
  if (participants.value == undefined) return;
  participants.value.map((params) => {
    fullName.value = params.user.first_name + " " + params.user.last_name;
    nameInitials.value = getFirstLetters(fullName.value);
    initialObj.value.push({
      id: params.id,
      initials: nameInitials.value,
      fullName: fullName.value,
    });
  });

  if (
    userDocument.value.participants != undefined ||
    userDocument.value.participants.length > 0
  ) {
    userDocument.value.participants.map((participant) => {
      if (participant.user.id === profile.value.id)
        return (isOwner.value = participant.ownerDocument);
    });
  }

  const $sidebar = $('.sidebar-nav');
  let sidebarTop = $sidebar.position().top != undefined ? $sidebar.position().top : 0;

  $(window).scroll(fixSidebarOnScroll);
  function fixSidebarOnScroll() {
    const windowScrollTop = $(window).scrollTop();
    if (windowScrollTop <= sidebarTop) {
      $sidebar.removeClass('sticky');
    } else if (windowScrollTop >= sidebarTop) {
      if (!$sidebar.hasClass('sticky')) {
        $sidebar.addClass('sticky');
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

.isHover {
  background-image: linear-gradient(to right, #003bb3, #003bb3 50%, #000 50%);
  background-size: 200% 100%;
  background-position: -100%;
  display: inline-block;
  padding: 5px 0;
  position: relative;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease-in-out;
}

.isHover:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 4px;
  background-color: #003bb3;
  bottom: 0;
  left: 0;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.isHover:hover {
  background-position: 0;
}

.isHover:hover::before {
  transform-origin: left;
  transform: scaleX(1);
}

/* .email-application .content-area-wrapper .sidebar .email-app-sidebar {
  width: 225px !important;
} */

@media screen and (max-width: 1160px) {
  .custom-md-none {
    display: none;
  }
}
</style>
