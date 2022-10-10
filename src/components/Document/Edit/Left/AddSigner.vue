<template>
  <form @submit.prevent="onAddParticipant">
    <div id="addSignerErrorMsg" class="text-center text-danger"></div>
    <div class="row gx-1" v-for="(row, index) in rows" :key="index">
      <div class="col-md-3 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name">First Name</label>
          <input type="text" v-model="row.first_name" id="first-name" class="form-control form-control-sm"
            placeholder="First Name" name="first_name" required />
        </div>
      </div>
      <div class="col-md-3 col-12">
        <div class="mb-1">
          <label class="form-label" for="last-name-column">Last Name</label>
          <input type="text" v-model="row.last_name" id="last-name-column" class="form-control form-control-sm"
            placeholder="Last Name" name="lname-column" required />
        </div>
      </div>
      <!-- <div class="col-md-3 col-12">
          <div class="mb-1">
            <label class="form-label" for="phone-column">Phone</label>
            <input type="tel" v-model="row.phone" id="phone-column" class="form-control form-control-sm"
              placeholder="Phone" name="phone-column">
          </div>
        </div> -->
      <div class="col-md-3 col-12">
        <div class="mb-1">
          <label class="form-label" for="email-id-column">Email</label>
          <input type="email" v-model="row.email" id="email-id-column" class="form-control form-control-sm"
            name="email-id-column" placeholder="Email" required />
        </div>
      </div>
      <div class="col-md-3 col-12">
        <div class="mb-1">
          <label class="form-label" for="role-column">Role</label>
          <select name="role" id="role" v-model="row.role" class="form-select form-control-sm" required>
            <option value="" selected>select role</option>
            <option>Signer</option>
            <option>Viewer</option>
          </select>
        </div>
      </div>

      <template v-if="row.action != '+'">
        <div class="col-md-12">
          <small class="hover" :class="['text-danger', isRemove]" @click="removeRow(index)">
            Remove
          </small>
        </div>
      </template>
      <hr />
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <button type="button" @click="addRow" class="btn btn-sm btn-warning waves-effect waves-float waves-light">
        Add more
      </button>

      <button type="submit" class="btn btn-sm btn-primary waves-effect waves-float waves-light">
        Add participants
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

const emit = defineEmits(["close"]);

const { useActions, useGetters } = createNamespacedHelpers(["document"]);
const { userDocument } = useGetters(["userDocument"]);
const { addParticipant } = useActions(["addParticipant"]);

const isRemove = ref(false);

const rows = ref([{ first_name: "", last_name: "", email: "", phone: "", role: "", action: "+" }]);
const addRow = () => {
  rows.value.push({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    action: "-",
  });
};

const removeRow = (index) => {
  isRemove.value = true;
  rows.value.splice(index, 1);
};

let formObj = [];
const onAddParticipant = () => {
  rows.value.forEach((obj) => {
    formObj.push({
      document_id: userDocument.value.id,
      first_name: obj.first_name,
      last_name: obj.last_name,
      email: obj.email,
      phone: obj.phone,
      role: obj.role,
    });
  });

  addParticipant(formObj);
  emit("close", true);
  formObj = [];
  rows.value = [{ first_name: "", last_name: "", email: "", phone: "", role: "", action: "+" }];
};
</script>

<style scoped>
.hover:hover {
  cursor: pointer;
}
</style>
