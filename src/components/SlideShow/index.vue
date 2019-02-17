<template>
  <div class="slider-wrapper">
    <div class="slider-container" :style="sliderStyle">
      <div class="slide-item" v-for="(item, index) in input" :key="index" :style="{'background-image' : ('url(' + item.img + '?x-oss-process=style/blur50-50)')}">
          <div class="big-img-bg">
            <img class="big-img" :src="item.img" :alt="item.img">
          </div>
      </div>
    </div>
    <ul class="slider-nav">
      <li v-for="(item,_index) in input" :key="_index" :class="{'active': index === _index}"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['input', 'index', 'slideTo'],
  data() {
    return {
      eventName: `event_${parseInt(Math.random() * 1000)}`
    }
  },
  mounted() {
      this.sliderStyle = {
        transform: 'translate3d(0,0,0)',
        width: this.input.length * 750 + 'px'
      }
  },
  methods: {
    // 点击箭头
    arrowHandler(input) {
      let newIndex = this.index + input
      if (newIndex === -1 || newIndex === this.input.length) return
      this.slideTo(newIndex)
    },
  },
  computed: {
    sliderStyle: {
      get: function() {
        return {
          transform: `translate3d(${this.index * -750}px,0,0)`,
          width: this.input.length * 750 + 'px'
        }
      },
      set: function(input) {
        return input
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slider-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #1b1b1b;
  .slide-item {
    float: left;
    width: 100vw;
    height: 100%;
    display: flex;
    position: relative;
    align-items: center;
    background-size: cover;
    justify-content: center;
    background-position: center;
    background-repeat: no-repeat;
  }
  &.edit {
    .slider-container {
      height: 100%;
    }
    .slide-item {
      display: block;
    }
    .input-wrapper {
      margin: 40px auto;
    }
    .slider-nav {
      bottom: 144px;
    }
  }
}
.slider-container {
  height: 100%;
  overflow: hidden;
  min-width: 100vw;
  transition: all ease-in-out 0.3s;
}
.input-wrapper {
  width: 400px;
  height: 520px;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  background: #2e2e2e;
  justify-content: center;
  img {
    width: 100%;
  }
  .add-img {
    width: 100px;
  }
  .upload {
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .input-close {
    top: 0;
    right: 0;
    z-index: 2;
    width: 50px;
    height: 50px;
    color: #fff;
    font-size: 32px;
    position: absolute;
    text-align: center;
    border-radius: 0 0 0 50px;
    background: rgba(0, 0, 0, 0.3);
    span {
      margin-right: -10px;
    }
  }
}
.spread-text {
  width: 710px;
  height: 92px;
  resize: none;
  border: none;
  padding: 10px;
  outline: none;
  display: block;
  margin: 0 auto;
  font-size: 28px;
  color: #cccccc;
  border-radius: 8px;
  background: #393939;
  font-size: 'PingFang SC Medium';
}
.tip {
  font-size: 22px;
  margin-top: 16px;
  color: #bcbcbc;
  text-align: right;
  line-height: 24px;
  margin-right: 20px;
  font-family: 'PingFang SC Medium';
  &::before {
    clear: both;
    content: '';
  }
}
.slider-arrow {
  top: 50%;
  width: 54px;
  height: 100px;
  color: #fff;
  z-index: 1;
  line-height: 100px;
  margin-top: -136px;
  position: absolute;
  text-align: center;
  background: #636363;
  i {
    display: block;
    font-size: 48px;
    font-weight: bold;
    line-height: 100px;
  }
  &.slider-arrow-left {
    left: 20px;
  }
  &.slider-arrow-right {
    right: 20px;
    i {
      transform: rotate(180deg);
    }
  }
}
.big-img-bg {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.big-img {
  z-index: 2;
  width: 100%;
}
.slider-nav {
  z-index: 1;
  width: 100%;
  bottom: 20px;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  li {
    width: 20px;
    height: 4px;
    margin: 0 10px;
    display: block;
    background: rgba(238, 238, 238, 0.6);
    &.active {
      width: 14px;
      height: 14px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #fff;
    }
  }
}
</style>
