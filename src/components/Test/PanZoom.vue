<template>
  <div>
    <div class="command">
      <button @click="zoom(1)">ZoomIn</button>
      <button @click="zoom(-1)">ZoomOut</button>
    </div>
    <div style="overflow: hidden;">
      <div id="panzoom-element">
        <img src="https://loremflickr.com/640/360">
      </div>
    </div>
  </div>
</template>

<script>
import Panzoom from '@panzoom/panzoom'
export default {
  props: {
    options: { type: Object, default: () => { } },
  },
  mounted() {
    this.panzoom = Panzoom(document.getElementById('panzoom-element'), {
      maxScale: 5
    })
  },
  methods: {
    zoom(level) {
      level === -1 ? this.panzoom.zoomOut() : this.panzoom.zoomIn()
    }
  }
}
</script>

<style scoped>

</style>