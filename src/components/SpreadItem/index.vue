<!-- 
    @name   SpreadItem
    @desc   全民推广广告组件
    @props
            input       当前全民推广项
            index       当前全民推广项的索引
-->

<template>
  <div class="spread-wrapper">
    <div class="slider-wrapper">
      <SlideShow :isEdit="false" :input="graphics" :index="index"></SlideShow>
    </div>
    <div class="spread-mask">
      <div class="spread-info">
        <span class="spread-date">{{input.created_at | timeFormt('YYYY-MM-DD')}}</span>
        <span class="spread-coin">分享可得{{input.maibao_spend_num || 0}}个脉宝</span>
      </div>
      <div class="spread-txt" @touchstart.stop="goMarketing()" @touchend.stop="">
        <span v-text="graphics[index] ? graphics[index].txt : ''"></span>
        <span v-if="input.user_marketing_id||input.web_site" class="iconfont icon-chaolianjie"></span>
      </div>
    </div>
    <div class="ad-info">
      <div class="spread-card" v-if="input.card_id" @touchstart.stop="goToCard()" @touchend.stop="">
        <img :src="input.head_picture" alt="">
      </div>
      <div class="spread-visited">
        <span class="iconfont icon-liulan"></span>
        <span class="count" v-text="input.browse_num || 0"></span>
      </div>
      <div class="spread-shared" @touchstart.stop="showGuard()" @touchend.stop="">
        <span class="iconfont icon-fenxiang4"></span>
        <span class="count" v-text="input.share_num || 0"></span>
      </div>
    </div>
  </div>
</template>

<script>
import SlideShow from '../SlideShow'
export default {
  props: ['input', 'index'],
  data() {
    return {
      graphics: [] // 图文内容
    }
  },
  mounted() {
    this.graphics = JSON.parse(this.input.content)
  },
  methods: {
    // 跳转到名片
    goToCard() {
      if (this.input.type === 1) {
        this.$router.push({
          path: `/company/${this.input.user_id}`
        })
      } else {
        this.$router.push({
          path: `/card/detail/${this.input.user_id}`
        })
      }
    },
    // 分享接口
    showGuard() {
      alert('去分享')
    },
    // 跳转到营销网页
    goMarketing() {
      if (this.input.type) {
        window.location.href = this.input.web_site
      } else {
        if (!this.input.user_marketing_id) return
        this.$router.push({
          path: `/marketing/detail/${this.input.user_marketing_id}`
        })
      }
    }
  },
  components: {
    SlideShow
  }
}
</script>

<style lang="scss" scoped>
.spread-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1b1b1b;

  .slider-wrapper {
    width: 100%;
    height: 100%;
  }
  .spread-info {
    height: 50px;
    font-size: 28px;
    margin-top: 30px;
    line-height: 50px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'PingFang SC Medium';
    .spread-date {
      float: left;
      margin-left: 20px;
    }
    .spread-coin {
      float: right;
      margin-right: 20px;
    }
  }
  .spread-txt {
    color: #fff;
    font-size: 32px;
    margin-top: 20px;
    text-indent: 20px;
    font-family: 'PingFang SC Medium';
  }
  .icon-chaolianjie {
    font-size: 32px;
    color: #46a9ff;
  }
  .ad-info {
    top: 50%;
    right: 20px;
    width: 80px;
    color: #fff;
    font-size: 24px;
    margin-top: -50px;
    position: absolute;
    text-align: center;
    font-family: 'PingFang SC Medium';
    .spread-card {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 50%;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .spread-visited,
    .spread-shared {
      display: flex;
      margin-top: 50px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      text-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
    }
    .icon-liulan {
      font-size: 40px;
    }
    .icon-fenxiang4 {
      font-size: 48px;
    }
    .count {
      margin-top: 10px;
      font-size: 28px;
    }
  }
  .spread-mask {
    left: 0;
    bottom: 0;
    width: 100%;
    position: absolute;
    padding-bottom: 60px;
    background: linear-gradient(0deg, rgba(27, 27, 27, 0.3), rgba(0, 0, 0, 0));
  }
}
</style>
