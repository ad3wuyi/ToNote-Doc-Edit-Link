<template>
  <div class="my-2" data-aos="zoom-in">
    <div class="camera__container">
      <div class="alert__box">
        <p class="small text-danger">
          Position yourself properly within the frame. <br />
          No glasses or face-cap. <br />
          Background must be plain.
        </p>
        <p data-aos="zoom-in" v-if="timer" class="timer">
          {{ timer }}
        </p>
      </div>
      <video ref="video" id="passport__video" autoplay></video>
      <div class="photoArea"></div>
    </div>
    <div class="control d-flex justify-content-center align-items-center">
      <button class="btn btn-primary icon" @click="takePhoto" :disabled="loader">
        <span class="iconify" data-icon="fluent:camera-20-filled">
          <span v-show="loader" class="spinner-border spinner-border-sm text-white"></span>
          <Icon v-show="!loader" icon="mdi-light:camera" />
        </span>
      </button>
    </div>
    <canvas ref="canvas" style="display: none"></canvas>

    <template v-if="prints.Photograph">
      <div class="grid grid__3">
        <label v-for="(photo, index) in prints.Photograph" :key="index" class="form-check-label border"
          :for="photo.created_at">
          <div @click="getPrintId({ category: 'Upload', print_id: photo.id })">
            <template v-if="photo.user_id">
              <div class="position-relative">
                <input type="radio" name="photo" v-model="selected" class="form-check-input tool_name pass"
                  :id="photo.created_at" :value="photo.id" />

                <img :src="photo.file" class="img-fluid" :alt="photo.id" />
                <a role="button" @click="deletePassport(photo.id)"
                  class="text-danger btn-close d-block text-end delete"></a>
              </div>
            </template>
          </div>
        </label>
      </div>

      <button type="button" class="btn btn-primary d-block ms-auto mt-2" :class="{ disabled: !isDisabled }"
        @click="affixSnap">
        <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
        <span>Append</span>
      </button>
    </template>
    <!-- <div>
      <img v-show="snapImgSrc" :src="snapImgSrc" class="snap__shoot" data-aos="zoom-in" />
    </div> -->
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
      <button type="button" class="btn btn-primary d-block ms-auto mt-2" :class="{ disabled: loader }"
        @click="proceedToDelete">
        <span v-show="loader" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import AOS from "aos";

import { onMounted, ref, defineEmits, onBeforeUnmount } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import ModalComp from "../ModalComp.vue";

const { useActions, useGetters } = createNamespacedHelpers("print");

const { prints } = useGetters(["prints"]);
const { savePrint } = useActions(["savePrint"]);
const { removePrint } = useActions(["removePrint"]);

var localMediaStream = null;
const video = ref(null);
const base64Url = ref("");
const canvas = ref(null);
const timer = ref(null);
let snapImgSrc = ref(false);
const appendPass = ref(false);

const isLoading = ref(false);
const loader = ref(false);
const isDisabled = ref(false);
const isDelete = ref(false);
const printId = ref("");

const getPrintId = (params) => {
  isDisabled.value = true;
  printId.value = params.print_id;
};

const affixSnap = () => {
  const uploadPassport = { append_print_id: printId.value };

  emit("affix", uploadPassport);

  isLoading.value = true;
  isDisabled.value = false;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const deletePassport = (params) => {
  isDelete.value = true;
  printId.value = params;
};

const proceedToDelete = () => {
  loader.value = true;
  removePrint(printId.value);

  setTimeout(() => {
    isDelete.value = false;
    loader.value = false;
  }, 1000);
};

// defineEmits(['close'])
const emit = defineEmits(["close"]);

const takePhoto = () => {
  loader.value = true;
  if (localMediaStream) {
    let count = 3;
    timer.value = 3;
    setInterval(() => {
      if (count >= 1) {
        count--;
        timer.value = count;
      }
    }, 1000);

    setTimeout(() => {
      var ctx = canvas.value.getContext("2d");
      ctx.canvas.width = 200;
      ctx.canvas.height = 200;

      ctx.drawImage(
        video.value,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.width,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      snapImgSrc.value = canvas.value.toDataURL("image/jpeg");
      base64Url.value = canvas.value.toDataURL("image/jpeg");
      const uploadPassport = {
        file: base64Url.value,
        type: "Photograph",
        category: "Upload",
      };
      savePrint(uploadPassport);
      // emit('close', true)
      appendPass.value = true;
      loader.value = false;
    }, 3000);
  }
};

const startCapture = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL;

  navigator.getUserMedia(
    { video: { width: 200, height: 200 } },
    (stream) => {
      video.value.srcObject = stream;
      localMediaStream = stream;
    },
    (e) => {
      console.log(e);
    }
  );
};

const vidOff = () => {
  video.value.pause();
  video.value.src = "";
  localMediaStream.getTracks()[0].stop();
};

onMounted(() => {
  startCapture();
  AOS.init({ duration: 500 });
});

onBeforeUnmount(() => vidOff());
</script>

<style scoped>
.iconify {
  height: 20px;
  width: 20px;
}

.icon {
  border-radius: 50%;
  padding: 5px;
  height: 35px;
  width: 35px;
}

.camera__container {
  width: auto;
  height: 200px;
  position: relative;
}

.camera__container video {
  width: 100%;
  height: 100%;
  position: absolute;
}

.camera__container .photoArea {
  /* border: 2px dashed #bd1616; */
  width: 200px;
  height: 200px;
  margin: 0 auto;
  position: relative;
  /* top: 0px; */
}

.control {
  position: relative;
  margin-top: 6rem;
  margin-bottom: 1rem;
  z-index: 100;
}

.alert__box {
  display: flex;
  justify-content: space-between;
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

.grid {
  display: grid;
  place-items: center;
  gap: 25px;
}

.grid__3 {
  grid-template-columns: repeat(6, 1fr);
}

.grid__1 {
  grid-template-columns: 1fr;
}

.pass {
  position: absolute;
  opacity: 0;
}

.pass+img {
  cursor: pointer;
  margin-right: 0.5rem;
}

.pass+img:hover {
  outline: 0.5px solid #003bb3;
}

.pass:checked+img {
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

  .grid__3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
