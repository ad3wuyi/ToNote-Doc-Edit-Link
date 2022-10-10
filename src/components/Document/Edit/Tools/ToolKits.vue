<template>
  <div class="tool bg-white" style="height: 100vh">
    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'textTool',
        tool_name: 'Textarea',
      })
    ">
      Text Area
      <svg width="19" height="19" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <g clip-path="url(#a)">
          <path
            d="M19.001 4.263V3.64h-2.676v.623h1.027v10.473h-1.027v.622h2.676v-.622h-1.027V4.263h1.027ZM.115 12.826l3.133-7.073c.218-.487.616-.783 1.155-.783h.116c.539 0 .924.296 1.142.783l3.132 7.073c.065.142.103.27.103.399 0 .526-.41.95-.937.95-.462 0-.77-.27-.95-.681l-.603-1.412H2.452l-.63 1.476c-.166.385-.5.616-.91.616A.91.91 0 0 1 0 13.25c0-.141.051-.282.115-.424Zm5.559-2.49L4.429 7.371l-1.245 2.965h2.49Zm4.158 1.784v-.026c0-1.502 1.143-2.195 2.773-2.195a4.89 4.89 0 0 1 1.682.282v-.115c0-.81-.501-1.258-1.477-1.258-.539 0-.975.077-1.348.192a.825.825 0 0 1-.282.051.794.794 0 0 1-.809-.795c0-.347.218-.642.527-.758.616-.23 1.283-.36 2.195-.36 1.065 0 1.835.283 2.323.77.514.514.745 1.272.745 2.196v3.132a.937.937 0 0 1-.95.937c-.565 0-.937-.398-.937-.808v-.013c-.475.526-1.13.873-2.08.873-1.296 0-2.362-.745-2.362-2.105Zm4.48-.45v-.346a3.026 3.026 0 0 0-1.245-.257c-.835 0-1.348.334-1.348.95v.025c0 .527.437.835 1.066.835.911 0 1.527-.5 1.527-1.207Z">
          </path>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h19v19H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </li>

    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'signTool',
        tool_name: 'Signature',
      })
    ">
      Signature
      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <g clip-path="url(#a)">
          <path
            d="M10.002 0 9.46.541a4 4 0 0 0-.75 1.04l-.57 1.143 5.138 5.138 1.143-.572a4.001 4.001 0 0 0 1.04-.749L16 6l-6-6ZM6.663 4.079C4.68 5.334 3 5 3 5L0 16l11-3s-.333-1.68.923-3.663l-5.26-5.26ZM5.5 12.002a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z">
          </path>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h16v16H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </li>

    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'initialTool',
        tool_name: 'Initial',
      })
    ">
      Initial
      <svg width="19" height="19" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <path d="M16 10V9h-3v1h1v4.5h-1v1h3v-1h-.94V10H16Zm-5-4.5V4H6v1.5h1.5V14H6v1.5h5V14H9.5V5.5H11Z"></path>
      </svg>
    </li>

    <li class="btn d-none blue" @click="
      isSignerSelected({
        toolId: 'dateTool',
        tool_name: 'Date',
      })
    ">
      Date Signed
      <svg width="21" height="21" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <path
          d="M6.3 15.225h8.4a2.625 2.625 0 0 0 2.625-2.625V5.25A2.625 2.625 0 0 0 14.7 2.625h-.525V2.1a.525.525 0 1 0-1.05 0v.525h-2.1V2.1a.525.525 0 1 0-1.05 0v.525h-2.1V2.1a.525.525 0 1 0-1.05 0v.525H6.3A2.625 2.625 0 0 0 3.675 5.25v7.35A2.625 2.625 0 0 0 6.3 15.225Zm1.05-2.887a.788.788 0 1 1 0-1.576.788.788 0 0 1 0 1.576Zm0-2.625a.788.788 0 1 1 0-1.575.788.788 0 0 1 0 1.575Zm3.15 2.625a.788.788 0 1 1 0-1.576.788.788 0 0 1 0 1.576Zm0-2.625a.787.787 0 1 1 0-1.575.787.787 0 0 1 0 1.575Zm3.15 2.625a.788.788 0 1 1 0-1.576.788.788 0 0 1 0 1.576Zm0-2.625a.787.787 0 1 1 0-1.575.787.787 0 0 1 0 1.575ZM4.725 5.25A1.58 1.58 0 0 1 6.3 3.675h.525V4.2a.525.525 0 1 0 1.05 0v-.525h2.1V4.2a.525.525 0 1 0 1.05 0v-.525h2.1V4.2a.525.525 0 1 0 1.05 0v-.525h.525a1.58 1.58 0 0 1 1.575 1.575v.525H4.725V5.25Z">
        </path>
      </svg>
    </li>

    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'sealTool',
        tool_name: 'Seal',
      })
    ">
      Seal
      <svg width="21" height="21" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <g clip-path="url(#a)">
          <path
            d="M17.808 6.033c-.657-.657-.524-1.413-.54-1.516 0-3.099-3.284-3.075-3.288-3.077-.493 0-.957-.192-1.305-.54a3.08 3.08 0 0 0-4.351 0c-.657.657-1.413.523-1.516.54-3.099 0-3.075 3.284-3.077 3.288 0 .493-.192.956-.54 1.305a3.08 3.08 0 0 0 0 4.35c.348.35.54.813.54 1.306.002.004-.135 2.696 2.461 3.225V21l4.307-2.871L14.806 21v-6.086c2.68-.546 2.453-3.203 2.461-3.225 0-.493.192-.957.54-1.305a3.056 3.056 0 0 0 .902-2.176c0-.821-.32-1.594-.901-2.175ZM7.423 15.02c.339.075.65.245.9.496.434.433.974.721 1.561.84v.703L7.423 18.7v-3.679Zm3.691 2.039v-.703a3.055 3.055 0 0 0 1.56-.84c.252-.251.563-.42.902-.496v3.68l-2.462-1.641Zm5.824-7.547a3.056 3.056 0 0 0-.901 2.176c-.002.004.068 2.057-1.846 2.057-.093.016-1.34-.146-2.386.9-.35.35-.813.541-1.306.541-.493 0-.956-.192-1.305-.54-1.043-1.043-2.296-.885-2.386-.901-1.912 0-1.845-2.053-1.846-2.057 0-.822-.32-1.595-.901-2.176-.72-.72-.72-1.89 0-2.61a3.056 3.056 0 0 0 .9-2.175c.002-.004-.068-2.057 1.847-2.057.092-.017 1.339.146 2.386-.901.72-.72 1.89-.72 2.61 0a3.056 3.056 0 0 0 2.176.9c.004.002 2.057-.067 2.057 1.847.016.092-.146 1.339.9 2.386.35.349.541.812.541 1.305 0 .493-.192.957-.54 1.305Z">
          </path>
          <path
            d="M10.5 3.69a4.312 4.312 0 0 0-4.308 4.306 4.312 4.312 0 0 0 4.307 4.307 4.312 4.312 0 0 0 4.307-4.307A4.312 4.312 0 0 0 10.5 3.69Zm0 7.383a3.08 3.08 0 0 1-3.077-3.077 3.08 3.08 0 0 1 3.076-3.076 3.08 3.08 0 0 1 3.077 3.076 3.08 3.08 0 0 1-3.077 3.077Z">
          </path>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h21v21H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </li>

    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'stampTool',
        tool_name: 'Stamp',
      })
    ">
      Stamp
      <svg width="21" height="12" xmlns="http://www.w3.org/2000/svg" class="ml-auto tool-svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21 0H0v12h21V0Zm-.913 1H.913v10h19.174V1Z"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.348 3H3.652v6h13.696V3Zm-.913 1H4.565v4h11.87V4Z"></path>
      </svg>
    </li>

    <li class="btn blue" @click="
      isSignerSelected({
        toolId: 'photoTool',
        tool_name: 'Photo',
      })
    ">
      Image
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" class="ml-auto tool-svg"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </li>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
// import { useGetters } from "vuex-composition-helpers/dist";
// import { useToast } from "vue-toast-notification";
// const toast = useToast();

// const { profile } = useGetters({
//   profile: "auth/profile",
// });

const emit = defineEmits(["bindTools"]);

const isSignerSelected = (params) => {
  emit("bindTool", params);
  // if (profile.email == "")
  //   return toast.error("Kindly select a signer!", {
  //     timeout: 5000,
  //     position: "top-right",
  //   });
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
