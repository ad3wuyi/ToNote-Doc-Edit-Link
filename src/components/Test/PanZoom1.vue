<template>
  <div>
    <div ref="container">
      <div tabindex="1" ref="image" draggable="false" :style="{ transform: transform }" class="media-360-viewer__image"
        @touchend="handleEnd" @touchmove="handleMove" @touchstart="handleStart" @wheel="zoomWheel">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores porro veniam possimus! Aut dolor labore
        nobis nisi dolores, quaerat autem iusto tenetur a soluta. Corporis, dignissimos debitis nisi neque beatae
        similique consequatur amet nam libero ducimus odio repudiandae harum impedit, enim cumque, suscipit ipsum
        laborum. Officia possimus nemo blanditiis dolor, minus repudiandae similique tenetur ratione sed soluta
        voluptate sit officiis, corrupti dolorum fugiat consectetur eligendi? Corrupti veritatis, unde fugit quam
        voluptatem sit enim ex, reprehenderit doloribus repellendus nemo sed eius iure praesentium delectus soluta?
        Tenetur molestias expedita necessitatibus ab. Molestias dicta ab praesentium, blanditiis reiciendis molestiae
        fugiat ut excepturi nostrum.
      </div>
      <!-- <img tabindex="1" ref="image" draggable="false"
        src="https://s3-eu-west-1.amazonaws.com/crash.net/visordown.com/styles/amp_1200/s3/2020_YAM_YZF1000R1SPL_EU_BWM2_STA_001-70560.jpg?itok=5bisLKmj"
        :style="{ transform: transform }" class="media-360-viewer__image" @touchend="handleEnd" @touchmove="handleMove"
        @touchstart="handleStart" @wheel="zoomWheel" alt="360 Image" /> -->
    </div>
    <!-- <img src="https://loremflickr.com/640/360"> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,

      loop: true,

      speed: 8,

      speedController: 0,

      zoomEnabled: true,
      zoomLevels: [1, 1.5, 2, 2.5, 3],
      zoomLevel: 1,

      frame: 1,
      images: [],
      imagesPreloaded: 0,

      spinEnabled: true,
      spinAuto: false,

      reverse: false,

      viewportScale: 0.3,
      viewportEnabled: true,
      viewportOpacity: 0.8,

      lastX: 0,
      lastY: 0,

      startX: 0,
      startY: 0,

      translateX: 0,
      translateY: 0,

      isMoving: false,
      isDragging: false,

      lastPinch: 0,

      animationRequestID: 0,

      spinStart: null,
      spinThen: Date.now(),
      fps: 1000 / 8,

      axiosRequest: null,

      $clickEvent: null,
      $moveEvent: null,

      output: ''
    };
  },
  mounted() {
    window.addEventListener('mouseup', this.handleEnd);
    window.addEventListener('touchend', this.handleEnd);
    window.addEventListener('resize', this.fetch);
  },
  beforeUnmount() {
    window.removeEventListener('mouseup', this.handleEnd);
    window.removeEventListener('touchend', this.handleEnd);
  },
  methods: {
    handleSlider(event) {
      this.frame = Number(event.target.value);
    },

    zoom(direction) {
      if (this.zoomLevels[this.zoomLevels.indexOf(this.closestZoom) + direction] === undefined) {
        return;
      }

      let current = this.zoomLevels.indexOf(this.closestZoom);
      let index = current += direction;
      if (direction === 0) {
        index = 0;
      }
      this.zoomLevel = this.zoomLevels[index];

      this.translate(null, true);
    },
    zoomWheel($event) {
      this.zoomLevel += $event.deltaY * -0.01;

      if (this.zoomLevel < 1) {
        this.zoomLevel = 1;
      }

      $event.preventDefault();

      let maxZoom = this.zoomLevels[this.zoomLevels.length - 1];

      this.zoomLevel = Math.min(Math.max(.125, this.zoomLevel), maxZoom);

      this.translate(null, true);
    },
    zoomPinch($event) {

      let curDiff = Math.abs($event.touches[0].clientX - $event.touches[1].clientX);

      if (this.lastPinch) {
        $event.deltaY = this.lastPinch - curDiff;
        this.zoomWheel($event);
      }

      this.lastPinch = curDiff;
    },
    handleStart($event) {
      if ($event.button && $event.button !== 0) {
        return;
      }
      this.$clickEvent = $event;

      if (this.animationRequestID !== 0) {
        this.spinStop();
      }
      this.isMoving = true;
      this.isDragging = true;

      // this.startTouchX = [ $event.touches[0].clientX, $event.touches[1].clientX ];
      // this.startTouchY = [ [ $event.touches[0].clientY, $event.touches[1].clientY ] ];

      this.startX = this.$clickEvent.pageX || this.$clickEvent.touches[0].pageX;
      this.startY = this.$clickEvent.pageY || this.$clickEvent.touches[0].pageY;
    },
    handleMove($event, viewport) {
      if ($event.button && $event.button !== 0) {
        return;
      }
      if ($event.touches && $event.touches.length > 1) {
        this.zoomPinch($event);
        return;
      }

      this.$moveEvent = $event;

      if (this.isMoving && this.isDragging) {
        const positions = {
          x: $event.pageX || $event.touches[0].pageX,
          y: $event.pageY || $event.touches[0].pageY
        }

        if (this.zoomLevel !== 1) {
          this.translate(positions, null, viewport);
        }
        if (this.zoomLevel === 1) {
          this.changeFrame(positions);
        }

        this.lastX = positions.x;
        this.lastY = positions.y;
      }
    },
    handleEnd($event) {
      if ($event.button && $event.button !== 0) {
        return;
      }
      this.isMoving = false;
      this.lastPinch = 0;
    },

    spin(index) {
      let i = index;
      if (i >= this.images.length) {
        i = 1;
      }
      this.animationRequestID = window.requestAnimationFrame(() => this.spin(i));

      let now = Date.now();
      let elapsed = now - this.spinThen;

      if (elapsed > this.fps) {
        this.spinThen = now - (elapsed % this.fps);
        this.frame = i;
        i += 1;
      }
    },
    spinToggle() {
      if (this.animationRequestID === 0 && this.zoomLevel === 1) {
        this.spin(this.frame);
        return;
      }
      this.spinStop();
    },
    spinStop() {
      if (this.animationRequestID) {
        window.cancelAnimationFrame(this.animationRequestID);
        this.animationRequestID = 0;
      }
    },

    translate(positions, zooming, viewport) {
      if (this.$moveEvent) {
        this.$moveEvent.preventDefault();
      }
      window.requestAnimationFrame(() => {
        positions = positions || {
          x: this.startX,
          y: this.startY
        };

        if (viewport) {
          this._translateFromViewport(positions);
        } else {
          this._translateFromImage(positions, zooming);
        }

        this.startX = positions.x;
        this.startY = positions.y;
      });
    },

    /**
     * @param positions
     * @private
     */
    _translateFromViewport: function (positions) {
      let move = {
        x: Math.floor(positions.x - this.startX),
        y: Math.floor(positions.y - this.startY)
      };

      let box = this.$refs.viewportBox.getBoundingClientRect();
      let container = this.$refs.viewportContainer.getBoundingClientRect();

      // Amount of pixels moved within animation frame, adjust based on viewport scale.
      // Zoom level doesn't matter as image scale doesn't move, so box is moving same amount of pixels.
      let moveAmountX = (move.x / this.viewportScale);
      let moveAmountY = (move.y / this.viewportScale);

      // Find the current offset of the container bounds, calculate new offset based on movement amount
      let calculatedOffset = {
        left: (container.left - box.left) - moveAmountX,
        right: (container.right - box.right) - moveAmountX,
        top: (container.top - box.top) - moveAmountY,
        bottom: (container.bottom - box.bottom) - moveAmountY
      };

      this.output = JSON.stringify(calculatedOffset);

      // Only move if the calculated new offset is not out of container bounds
      // Reverse the movement as moving box in same direction as cursor rather than the image.
      if (calculatedOffset.left <= 0 && calculatedOffset.right >= 0) {
        this.translateX += -moveAmountX;
      }
      if (calculatedOffset.top <= 0 && calculatedOffset.bottom >= 0) {
        this.translateY += -moveAmountY;
      }

    },
    _translateFromImage: function (positions, zooming) {
      let move = {
        x: Math.floor(positions.x - this.startX),
        y: Math.floor(positions.y - this.startY)
      };

      let image = this.$refs.image.getBoundingClientRect();
      let container = this.$refs.container.getBoundingClientRect();

      let moveAmountX = move.x * this.zoomLevel;
      let moveAmountY = move.y * this.zoomLevel;

      let calculatedOffset = {
        left: (container.left - image.left) - moveAmountX,
        right: (container.right - image.right) - moveAmountX,
        top: (container.top - image.top) - moveAmountY,
        bottom: (container.bottom - image.bottom) - moveAmountY
      };

      if (zooming) {
        if (calculatedOffset.left <= 0) {
          this.translateX += calculatedOffset.left;
        }
        if (calculatedOffset.right >= 0) {
          this.translateX += calculatedOffset.right;
        }
        if (calculatedOffset.top <= 0) {
          this.translateY += calculatedOffset.top;
        }
        if (calculatedOffset.bottom >= 0) {
          this.translateY += calculatedOffset.bottom;
        }
      }

      if (calculatedOffset.left >= 0 && calculatedOffset.right <= 0) {
        this.translateX += move.x / this.zoomLevel;
      }

      if (calculatedOffset.top >= 0 && calculatedOffset.bottom <= 0) {
        this.translateY += move.y / this.zoomLevel;
      }
    },

    changeFrame(positions) {
      this.speedController += 1;
      if (this.speedController < this.speed) {
        return;
      }
      if (this.speedController > this.speed) {
        this.speedController = 0;
      }

      if (positions.x > this.lastX) {
        if (this.frame >= 0 && this.frame < this.images.length) {
          this.frame += 1;
        } else if (this.loop) {
          this.frame = 1;
        }
      } else if (positions.x < this.lastX) {
        if (this.frame >= 0 && this.frame - 1 > 0) {
          this.frame -= 1;
        } else if (this.loop) {
          this.frame = this.images.length;
        }
      }
    }
  },
  watch: {
    zoomLevel: function () {
      if (this.zoomLevel !== 1 && this.animationRequestID !== 0) {
        this.spinStop();
      }
    }
  },
  computed: {
    closestZoom: function () {
      return this.zoomLevels.reduce((a, b) => {
        return Math.abs(b - this.zoomLevel) < Math.abs(a - this.zoomLevel) ? b : a;
      });
    },
    imageSet: function () {
      return this.images.map(image => {
        return image[this.closestZoom].url;
      });
    },
    preloadProgress: function () {
      return Math.floor(this.imagesPreloaded / this.images.length * 100);
    },
    currentPath: function () {
      return this.images[this.frame - 1][this.closestZoom].url;
    },
    nextZoomLevel: function () {
      if (this.zoomLevels.indexOf(this.closestZoom) === this.zoomLevels.length - 1) {
        return this.zoomLevels[0];
      }
      return this.zoomLevels[this.zoomLevels.indexOf(this.closestZoom) + 1];
    },
    // viewportTransform: function () {
    //   if (this.viewportEnabled) {
    //     let translateX = -((this.translateX * this.viewportScale) * this.zoomLevel);
    //     let translateY = -((this.translateY * this.viewportScale) * this.zoomLevel);

    //     return `scale(${1 / this.zoomLevel}) translateX(${translateX}px) translateY(${translateY}px)`;
    //   }
    // },
    transform: function () {
      return `scale(${this.zoomLevel}) translateX(${this.translateX}px) translateY(${this.translateY}px)`;
    },
    canZoomIn: function () {
      return this.zoomLevels[this.zoomLevels.indexOf(this.closestZoom) + 1] === undefined
    },
    canZoomOut: function () {
      return this.zoomLevels[this.zoomLevels.indexOf(this.closestZoom) + -1] === undefined
    }
  },
  template: '#template'
};

</script>

<style scoped>
.media-360-viewer {
  position: relative;
  overflow: hidden;
  display: inline-block;
  background: #000;
  width: 100%;
  transition: filter 0.2s ease-in-out;
}

.media-360-viewer__image {
  width: 100%;
  cursor: grab;
}

.media-360-viewer__image.isTranslating {
  cursor: grabbing;
}

.media-360-viewer__image.loading {
  filter: blur(4px);
}

.media-360-viewer__loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
}

.media-360-viewer__loader * {
  user-select: none;
}

.media-360-viewer__loader>svg {
  width: 100%;
  height: 100%;
  transform: rotate(270deg);
}

.media-360-viewer__loader--text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.media-360-viewer__loader--text p {
  font-size: 100%;
  font-weight: bold;
  color: #fff;
}

.media-360-viewer__loader--text p.large {
  font-size: 150%;
}

.media-360-viewer__loader--background {
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
  stroke: rgba(0, 0, 0, .7);
  stroke-width: 25px;
}

.media-360-viewer__loader--cover {
  stroke-dasharray: 200%;
  stroke: #848484;
  stroke-width: 15px;
  stroke-linecap: round;
}

.media-360-viewer__loader--background,
.media-360-viewer__loader--cover {
  fill: transparent;
}

.media-360-viewer__viewport {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  overflow: hidden;
}

.media-360-viewer__viewport--image {
  width: 100%;
  pointer-events: none;
}

.media-360-viewer__viewport--zoom {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: #fff;
  z-index: 3;
  font-size: 12px;
  pointer-events: none;
}

.media-360-viewer__viewport--square {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: rgba(0, 0, 0, .6) 0 0 0 10000px;
  cursor: grab;
  transition: background ease-in-out 0.1s;
}

.media-360-viewer__viewport--square:hover {
  background: rgba(255, 255, 255, .2);
}

.media-360-viewer__tools {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}

.media-360-viewer__tools>a {
  margin: 0 5px;
  color: #000;
  background: #fff;
  border-radius: 50%;
  width: 40px;
  text-align: center;
  line-height: 40px;
}

.media-360-viewer__tools>a[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.media-360-viewer__tools>a[disabled]:hover {
  color: #000;
  background: #fff;
}

.media-360-viewer__tools>a:hover {
  background: #000;
  color: #fff;
}

.media-360-viewer__tools--autoplay:before {
  font-family: 'ClickIcons';
  content: '\ea81';
}

.media-360-viewer__tools--autoplay.active:before {
  content: '\eb48';
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>