<template>
  <div class="progress-bar">
    <div class="bg-bar">
      <div class="active-bar" :style="activeBarStyle">
        <div class="bar-node">
          <slot name="node">
            <i class="icon-music"></i>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    computed: {
      activeBarStyle() {
        return {
          width: this.value * 100 + '%'
        }
      }
    },
  }
</script>

<style lang="less" scoped>
.progress-bar {
  height: 3px;
  position: relative;
  .bg-bar {
    height: 100%;
    background:  rgba(33, 39, 51, 0.2);
  }
  .active-bar {
    height: 100%;
    background: #212733;
    position: relative;
    overflow: visible;
    .bar-node {
      position: absolute;
      right: 0;
      top: 0;
      height: 10px;
      width: 10px;
      mix-blend-mode: darken;
      cursor: pointer;
      .icon-music {
        transform: scale(0.2) translateY(-50%);
        transform-origin: 0 0;
      }
    }
  }
}
</style>