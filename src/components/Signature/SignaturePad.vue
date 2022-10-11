<template>
  <div class="grid">
    <div class="grid-8 px-0">
      <div class="my-1">Draw your signature in the tool box</div>
      <div :style="{ width: w, height: h }" @touchmove.prevent>
        <canvas :id="state.uid" class="canvas shadow" :data-uid="state.uid" :disabled="state?.disabled"></canvas>
      </div>
    </div>

    <div class="grid-4">
      <div class="btn-group my-1" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="signature" id="btnradiogenerate" autocomplete="off" />
        <label class="btn btn-sm btn-primary waves-effect" for="btnradiogenerate" @click="save">Generate</label>
        <input type="radio" class="btn-check" name="signature" id="btnradioclear" autocomplete="off" ref="generate" />
        <label class="btn btn-sm btn-outline-primary waves-effect" for="btnradioclear" @click="clear">Clear</label>
      </div>

      <template v-if="prints.Signature || prints.Signature != undefined">
        <div v-for="(sign, index) in prints.Signature" :key="index">
          <template v-if="sign.category == 'Draw'">
            <div class="grid-draw">
              <img :src="sign.file" class="img-thumbnail" style="width: 155px" alt="Signature" />
              <template v-if="imgBase64.length > 0">
                <cropper ref="cropped" :src="imgBase64" />
                <div class="text-center">
                  <button class="btn btn-sm btn-primary" @click="cropImage">Crop</button>
                </div>
                <template v-if="prevImg != ''">
                  <img :src="prevImg" class="img-thumbnail d-block mx-auto" alt="preview" />
                </template>
                <template v-else>
                  <img src="@/assets/empty.png" class="img-thumbnail d-block mx-auto" width="150" alt="preview" />
                </template>
                <!-- <img :src="imgBase64" class="img-thumbnail" style="width:155px" alt="Signature" /> -->
              </template>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <template v-if="imgBase64.length > 0">
          <cropper ref="cropped" class="example-cropper" :src="imgBase64" />
          <div class="text-center">
            <button class="btn btn-sm btn-primary" @click="cropImage">Crop</button>
          </div>
          <template v-if="prevImg != ''">
            <img :src="prevImg" class="img-thumbnail d-block mx-auto" alt="preview" />
          </template>
          <template v-else>
            <img src="@/assets/empty.png" class="img-thumbnail d-block mx-auto" width="150" alt="Preview" />
          </template>
          <!-- <img :src="imgBase64" class="img-thumbnail" style="width:155px" alt="Signature" /> -->
        </template>
        <template v-else>
          <img src="@/assets/empty.png" class="img-thumbnail" style="width: 155px" alt="Signature" />
        </template>
      </template>
    </div>
  </div>

  <button class="btn btn-primary d-block ms-auto mt-2" ref="create" @click="createDrawSignature">
    <template v-if="prints.Signature == undefined || prints.Signature.length <= 0">
      Create
    </template>
    <template v-else> Update </template>
  </button>
</template>

<script setup>
import SignaturePad from "signature_pad";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import {
  defineProps,
  onMounted,
  reactive,
  watch,
  defineExpose,
  ref,
  defineEmits,
} from "vue";

import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useActions, useGetters } = createNamespacedHelpers(["print"]);
const { prints } = useGetters(["prints"]);
const { savePrint } = useActions(["savePrint"]);

const emit = defineEmits(["close"]);

const imgBase64 = ref("");
const generate = ref(false);
const create = ref(false);

const props = defineProps({
  sigOption: {
    type: Object,
    default: () => {
      return {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        penColor: "rgb(0, 0, 0)",
      };
    },
  },
  w: {
    type: String,
    default: "100%",
  },
  h: {
    type: String,
    default: "100%",
  },
  clearOnResize: {
    type: Boolean,
    default: false,
  },
  waterMark: {
    type: Object,
    default: () => {
      return {};
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultUrl: {
    type: String,
    default: "",
  },
});

let state = reactive({
  sig: () => { },
  option: {
    backgroundColor: "rgb(255, 255, 255)",
    penColor: "rgb(0, 0, 0)",
  },
  uid: "",
});

state.uid = "canvas" + Math.random();

let sigOptions = Object.keys(props.sigOption);
for (let item of sigOptions) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  state.option[item] = props.sigOption[item];
}

watch(
  () => props?.disabled,
  (val) => {
    if (val) {
      state.sig.off();
    } else {
      state.sig.on();
    }
  }
);

const draw = () => {
  let canvas = document.getElementById(state.uid);
  state.sig = new SignaturePad(canvas, state.option);

  function resizeCanvas(c) {
    let url;
    if (!isEmpty()) {
      url = save();
    }
    c.width = 290;
    c.height = 316;

    c.getContext("2d").scale(1, 1);
    clear();

    !props.clearOnResize && url !== undefined && fromDataURL(url);
    Object.keys(props.waterMark).length && addWaterMark(props.waterMark);
  }

  window.addEventListener("resize", resizeCanvas(canvas));
  resizeCanvas(canvas);

  if (props.defaultUrl !== "") {
    fromDataURL(props.defaultUrl);
  }

  if (props.disabled) {
    state.sig.off();
  } else {
    state.sig.on();
  }
};

const clear = () => {
  state.sig.clear();
  generate.value.checked = false;
  create.value.disabled = true;
  imgBase64.value = 0;
  prevImg.value = ''
};

const save = (format) => {
  const dataResult = format ? state.sig.toDataURL(format) : state.sig.toDataURL();
  imgBase64.value = dataResult;
};

const fromDataURL = (url) => {
  state.sig.fromDataURL(url);
};

const isEmpty = () => {
  return state.sig.isEmpty();
};

const undo = () => {
  let data = state.sig.toData();
  if (data) {
    data.pop();
    state.sig.fromData(data);
  }
};

const addWaterMark = (data) => {
  if (!(Object.prototype.toString.call(data) == "[object Object]")) {
    throw new Error("Expected Object, got " + typeof data + ".");
  } else {
    let vCanvas = document.getElementById(state.uid);
    let textData = {
      text: data.text || "",
      x: data.x || 20,
      y: data.y || 20,
      sx: data.sx || 40,
      sy: data.sy || 40,
    };

    let ctx = vCanvas.getContext("2d");
    ctx.font = data.font || "20px sans-serif";
    ctx.fillStyle = data.fillStyle || "#333";
    ctx.strokeStyle = data.strokeStyle || "#333";
    if (data.style == "all") {
      ctx.fillText(textData.text, textData.x, textData.y);
      ctx.strokeText(textData.text, textData.sx, textData.sy);
    } else if (data.style == "stroke") {
      ctx.strokeText(textData.text, textData.sx, textData.sy);
    } else {
      ctx.fillText(textData.text, textData.x, textData.y);
    }
    state.sig._isEmpty = false;
  }
};

const cropped = ref("");
const prevImg = ref("");

const cropImage = () => {
  const result = cropped.value[0].getResult();
  prevImg.value = result.canvas.toDataURL();
  generate.value.checked = true;

  if (generate.value.checked) {
    create.value.disabled = false;
  }
};

onMounted(() => {
  create.value.disabled = true;
  draw();
});

defineExpose({
  save,
  clear,
  isEmpty,
  undo,
  addWaterMark,
  fromDataURL,
});

const createDrawSignature = () => {
  const drawnSignature = {
    file: prevImg.value,
    type: "Signature",
    category: "Draw",
  };

  savePrint(drawnSignature);
  imgBase64.value = 0;
  emit("close", true);
};
</script>

<style scoped>
canvas {
  width: 290px;
  height: 316px;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

.box {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  padding: 5px;
  border: 2px solid #ccc;
}

.box:before,
.box:after {
  content: "•";
  position: absolute;
  width: 14px;
  height: 14px;
  font-size: 14px;
  color: #ccc;
  border: 2px solid #ccc;
  line-height: 12px;
  top: 5px;
  text-align: center;
}

.box:before {
  left: 5px;
}

.box:after {
  right: 5px;
}

.box .box-inner {
  position: relative;
  border: 2px solid #ccc;
  padding: 40px;
}

.box .box-inner:before,
.box .box-inner:after {
  content: "•";
  position: absolute;
  width: 14px;
  height: 14px;
  font-size: 14px;
  color: #ccc;
  border: 2px solid #ccc;
  line-height: 12px;
  bottom: -2px;
  text-align: center;
}

.box .box-inner:before {
  left: -2px;
}

.box .box-inner:after {
  right: -2px;
}

.grid-draw {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}

@media screen and (max-width: 991.5px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .grid-draw {
    grid-template-columns: 1fr;
  }
}
</style>
