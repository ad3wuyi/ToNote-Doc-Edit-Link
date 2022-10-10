<template>
  <div v-if="isLoading">
    <div class="loader">
      <PreLoader />
    </div>
  </div>
  <div v-else id="pdfvuer">
    <pdf :src="pdfdata" v-for="i in numPages" :key="i" :id="i" :page="i" :annotation="true" :resize="true"
      @link-clicked="handle_pdf_link">
    </pdf>
  </div>
</template>

<script>
import pdfvuer from "pdfvuer";
import "pdfjs-dist/build/pdf.worker.entry";
import PreLoader from "@/components/PreLoader.vue";

export default {
  components: {
    pdf: pdfvuer,
    PreLoader
  },
  props: ["file"],
  data() {
    return {
      documentFile: this.file,
      isLoading: false,
      renderFile: '',
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors: [],
      scale: "page-width",
      documentHeight: 0,
    };
  },

  computed: {
    formattedZoom() {
      return Number.parseInt(this.scale * 100);
    },
  },

  mounted() {
    this.isLoading = true
    setTimeout(() => {
      this.getPdf()
      this.isLoading = false
    }, 2000);
  },

  updated() {
    this.documentHeight = Number(this.numPages) * 1159;
    this.$emit("documentHeight", this.documentHeight);
    this.pinchZoom()
  },

  watch: {
    show: function (s) {
      if (s) {
        this.getPdf();
      }
    },
    page: function (p) {
      if (
        window.pageYOffset <= this.findPos(document.getElementById(p)) ||
        (document.getElementById(p + 1) &&
          window.pageYOffset >= this.findPos(document.getElementById(p + 1)))
      ) {
        document.getElementById(p).scrollIntoView();
      }
    },
  },

  methods: {
    handle_pdf_link: function (params) {
      let page = document.getElementById(String(params.pageNumber));
      page.scrollIntoView();
    },
    getPdf() {
      let self = this;
      self.pdfdata = pdfvuer.createLoadingTask(this.file);
      self.pdfdata.then((pdf) => {
        self.numPages = pdf.numPages;
        window.onscroll = function () {
          changePage();
          stickyNav();
        };

        let sticky = document.getElementById("buttons")?.offsetTop;
        function stickyNav() {
          if (window.pageYOffset >= sticky) {
            document.getElementById("buttons")?.classList.remove("hidden");
          } else {
            document.getElementById("buttons")?.classList.add("hidden");
          }
        }

        function changePage() {
          let i = 1,
            count = Number(pdf.numPages);
          do {
            if (
              window.pageYOffset >= self.findPos(document.getElementById(i)) &&
              window.pageYOffset <= self.findPos(document.getElementById(i + 1))
            ) {
              self.page = i;
            }
            i++;
          } while (i < count);
          if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
            self.page = i;
          }
        }
      });
    },
    findPos(obj) {
      return obj?.offsetTop;
    },

    // !*** //
    pinchZoom() {
      let imageElement = document.getElementById("pdfvuer")
      console.log(imageElement);
      let imageElementScale = 1;

      let start = {};

      // Calculate distance between two fingers
      const distance = (event) => {
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
      };

      imageElement?.addEventListener('touchstart', (event) => {
        // console.log('touchstart', event);
        if (event.touches.length === 2) {
          event.preventDefault(); // Prevent page scroll

          // Calculate where the fingers have started on the X and Y axis
          start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
          start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
          start.distance = distance(event);
        }
      });

      imageElement?.addEventListener('touchmove', (event) => {
        console.log('touchmove', event);
        if (event.touches.length === 2) {
          event.preventDefault(); // Prevent page scroll

          // Safari provides event.scale as two fingers move on the screen
          // For other browsers just calculate the scale manually
          let scale;
          if (event.scale) {
            scale = event.scale;
          } else {
            const deltaDistance = distance(event);
            scale = deltaDistance / start.distance;
          }
          imageElementScale = Math.min(Math.max(1, scale), 4);

          // Calculate how much the fingers have moved on the X and Y axis
          const deltaX = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - start.x) * 2; // x2 for accelarated movement
          const deltaY = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - start.y) * 2; // x2 for accelarated movement

          // Transform the image to make it grow and move with fingers
          const transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${imageElementScale})`;
          imageElement.style.transform = transform;
          imageElement.style.WebkitTransform = transform;
          imageElement.style.zIndex = "9999";
        }
      });

      imageElement?.addEventListener('touchend', (event) => {
        console.log('touchend', event);
        // Reset image to it's original format
        imageElement.style.transform = "";
        imageElement.style.WebkitTransform = "";
        imageElement.style.zIndex = "";
      });
    }
  },
};
</script>

<style src="pdfvuer/dist/pdfvuer.css">

</style>

<style lang="css" scoped>
#buttons {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.loader {
  display: grid;
  place-items: center;
  position: relative;
  height: 80vh;
  width: 100%;
}

@media screen and (max-width: 640px) {
  .loader {
    width: 100vw;
  }
}

@media screen and (max-width: 991.5px) {
  .loader {
    height: 60vh;
  }
}
</style>
