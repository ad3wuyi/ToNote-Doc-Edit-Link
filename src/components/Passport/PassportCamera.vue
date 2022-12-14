<template>
  <div class="w-100">
    <div data-aos="zoom-in">
      <div class="d-flex justify-content-between align-items-center text-start">
        <p class="small text-danger">
          Position yourself properly within the frame. <br />
          No glasses or face-cap. <br />
          Background must be plain.
        </p>
        <p data-aos="zoom-in" v-if="isTimer" class="timer">
          {{ timer }}
        </p>
      </div>

      <p v-if="isSelected == ''" class="text-center my-4"><i>Kindly select camera type to proceed</i></p>
      <template v-else>
        <template v-if="isLoading">
          <div class="text-center">
            <PreLoader class="my-4" />
          </div>
        </template>
      </template>

      <div v-show="isSelected != ''">
        <div v-show="!isLoading" class="video">
          <Camera :resolution="{ width: 200, height: 200 }" ref="camera" @loading="loading" @started="started"
            @camera-change="cameraChange" autoplay>
          </Camera>
        </div>
      </div>

      <div class="video-options my-1">
        <select class="form-select form-select-sm" v-model="isSelected" @change="changeCameraFace">
          <option value="">Select camera</option>
          <option v-for="(vDevice, index) in videoDevices" :value="vDevice.deviceId" :key="index">
            {{ vDevice.label }}
          </option>
        </select>
      </div>
    </div>

    <button v-if="isSelected != ''" class="btn btn-primary icon my-2" @click="snapshot" :disabled="spinner">
      <span class="iconify" data-icon="fluent:camera-20-filled">
        <span v-show="spinner" class="spinner-border spinner-border-sm text-white"></span>
        <Icon v-show="!spinner" icon="mdi-light:camera" />
      </span>
    </button>

    <template v-if="prints.length > 0">
      <div class="d-flex justify-content-center mt-3" v-for="(print, index) in prints" :key="index">
        <label v-if="print.type === 'Photograph'" class="form-check-label border position-relative" style="width:150px"
          :for="print.type">
          <div @click="
            getPrintId({ file: print.file, category: print.category, type: print.type })
          ">
            <input type="radio" :name="print.type" v-model="selected" class="form-check-input tool_name"
              :id="print.type" :value="print.category" />
            <img :src="print.file" class="img-fluid" :alt="print.category" />

            <span @click="deletePrint(index)"
              class="btn-outline-danger position-absolute top-0 start-100 translate-middle"
              style="padding:1px 4px">&cross;</span>
          </div>
        </label>
      </div>

      <img :src="url" class="img-fluid d-none" alt="..." />

      <div class="modal-footer justify-content-center w-100 mt-2 pb-0">
        <button type="button" class="btn btn-sm btn-primary" :class="{ disabled: !isDisabled }" @click="affixSnap">
          <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
          <span>Append</span>
        </button>
      </div>
    </template>
  </div>

  <ModalComp :show="isDelete" :size="'modal-sm'" @close="isDelete = false">
    <template #header>
      <h4 class="modal-title text-danger">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <h5 class="text-center">Are you sure?</h5>
      <p class="fw-normal text-center"><i>You won't be able to revert this!</i></p>
    </template>

    <template #footer>
      <button type="button" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: spinner }"
        @click="proceedToDelete">
        <span v-show="spinner" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>
</template>

<script setup>
import Camera from "simple-vue-camera";
import PreLoader from "@/components/PreLoader.vue";
import ModalComp from "@/components/ModalComp.vue";
import { Icon } from "@iconify/vue";
import AOS from "aos";
import { ref, defineEmits, watch } from "vue";

import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { prints, isSaved } = useGetters({
  prints: "printSignLink/prints",
  isSaved: "printSignLink/isSaved",
});

const { savePrint, removePrint } = useActions({
  savePrint: "printSignLink/savePrint",
  removePrint: "printSignLink/removePrint",
});

const spinner = ref(false);
const isLoading = ref(false);
const camera = ref("");
const url = ref("");
const timer = ref(null);
const isTimer = ref(false);
const isDisabled = ref(false);
const isDelete = ref(false);
const isSelected = ref('')
const videoDevices = ref([])
const emit = defineEmits(["close"]);

watch(
  () => isSaved.value,
  (newSave) => {
    if (newSave) {
      isSaved.value = newSave;
      spinner.value = false
      isTimer.value = false
    }
  }
);

const loading = () => (spinner.value = isLoading.value = true);

const started = () => {
  spinner.value = isLoading.value = false
  AOS.init({ duration: 500 })
};

const getPrintId = (params) => {
  isDisabled.value = true;
  emit("getFile", params);
};

const affixSnap = () => {
  emit("affix", true);

  isLoading.value = true;
  isDisabled.value = false;
  setTimeout(() => { isLoading.value = false }, 1000);
};

const deletePrint = (params) => {
  removePrint(params)
}

setTimeout(async () => {
  const devices = await camera.value?.devices();
  videoDevices.value = devices.filter(device => device.kind === 'videoinput');
}, 3000);

const changeCameraFace = () => {
  camera.value?.changeCamera(isSelected.value);
}

const snapshot = async () => {
  let count = 3;
  timer.value = 3;
  isTimer.value = true;

  const timeInterval = setInterval(() => {
    if (count >= 1) {
      count--;
      timer.value = count;
    }
  }, 1000);

  spinner.value = true;
  setTimeout(() => {
    spinner.value = isTimer.value = false;
    clearInterval(timeInterval)
  }, 3100);

  await camera.value?.snapshot({ width: 200, height: 200 }, "image/png", 0.5);
  const dataUrl = camera.value?.canvas.toDataURL("image/png");
  url.value = dataUrl;
  // if (timer.value == 0) {
  // }

  const uploadPassport = {
    file: url.value,
    type: "Photograph",
    category: "Passport",
  };

  savePrint(uploadPassport);
};
</script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  gap: 15px;
  width: 50%;
  margin: 0 auto;
}

.grid__3 {
  grid-template-columns: repeat(3, 1fr);
}

.video-options {
  width: 150px;
  margin: 0 auto;
}

.custom-width {
  width: 100px
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 20px;
  text-align: center;
  font-size: 1.5rem;
  margin: 0 auto;
  height: 35px;
  width: 35px;
}

.timer {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 2rem;
  background: var(--bs-purple);
  color: #fff;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

[type="radio"] {
  position: absolute;
  opacity: 0;
}

[type="radio"]+img {
  cursor: pointer;
  margin-right: 0.5rem;
}

[type="radio"]+img:hover {
  outline: 0.5px solid #003bb3;
}

[type="radio"]:checked+img {
  outline: 3px solid #003bb3;
}

.delete {
  position: absolute;
  top: -14px;
  right: -14px;
  border-radius: 50%;
  border: 1px solid red;
  padding: 8px;
}

@media screen and (max-width: 991.5px) {
  .timer {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .grid {
    width: 100%;
  }

  .grid__3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .custom-width {
    width: 80px
  }
}
</style>
