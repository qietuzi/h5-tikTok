<template>
  <Wrapper id="app">
    <!-- <transition :name="transitionName"> -->
    <keep-alive max="6">
      <router-view></router-view>
    </keep-alive>
    <!-- </transition> -->
  </Wrapper>
</template>

<script>
import Wrapper from './components/Wrapper'

export default {
  name: 'app',
  components: {
    Wrapper
  }
}
</script>

<style scoped lang="scss">
</style>