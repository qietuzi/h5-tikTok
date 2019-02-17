<!-- 
    @name   Wrapper
    @desc   滚动时固定header和footer并实时监听滚动的容器组件
    @props
            slot              插槽
            scrolling         滚动时的处理函数    实时返回当前滚动位置
            paddingTop        距离顶端高度
-->

<template>
  <div class="app-wraper" :style="wrapperStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Wrapper',
  data() {
    return {
      scrolled: 0,
      header: null,
      footer: null,
      scrollHeight: null,
      windowHeight: null
    }
  },
  props: ['paddingTop'],
  activated() {
    window.addEventListener('scroll', this.scrollHandler, false)
    document.documentElement.scrollTop = this.scrolled
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollHandler, false)
  },
  mounted() {
    let pageWidth = 750
    let slots = this.$slots.default
    this.windowHeight = document.documentElement.clientHeight
    if (!this.$slots.default) return false
    try {
      let vueHeader = slots.find(
        item => item.data && item.data.ref === 'header'
      )
      let vueFooter = slots.find(
        item => item.data && item.data.ref === 'footer'
      )
      this.header = vueHeader ? vueHeader.elm : null
      this.footer = vueFooter ? vueFooter.elm : null
    } catch (err) {
      // nothing
    }
    window.addEventListener('scroll', this.scrollHandler, false)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler, false)
  },
  methods: {
    scrollHandler() {
      let scrolled =
        document.documentElement.scrollTop || document.body.scrollTop
      this.scrollHeight = document.documentElement.scrollHeight
      let windowHeight = document.documentElement.clientHeight
      let updateWindowHeight = this.windowHeight === windowHeight
      this.windowHeight = updateWindowHeight ? this.windowHeight : windowHeight
      if (this.header && this.header.style.display !== 'none') {
        this.header.style.position = 'fixed'
      }
      if (this.footer && this.footer.style.display !== 'none') {
        this.footer.style.position = 'fixed'
      }
      this.scrolled = scrolled
      this.$emit('scrolling', scrolled, this.scrollHeight)
      this.$emit('isButton', scrolled + this.windowHeight >= this.scrollHeight)
    }
  },
  computed: {
    wrapperStyle: function() {
      if (this.paddingTop) {
        return {
          'padding-top': this.paddingTop
        }
      } else if (this.header) {
        return {
          'padding-top': '100px'
        }
      }
    }
  }
}
</script>

<style scoped>
.app-wraper {
  overflow: hidden;
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
  background: #fff;
}
</style>