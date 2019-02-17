<template>
  <div class="spread-wrapper" @touchstart.prevent="touchstart($event)" @touchmove="touchmove($event)" @touchend.prevent="touchend($event)">
    <!-- 下拉的时候刷新 -->
    <div class="refresh">
      <template v-if="refresh">
        <img class="img" src="./loading.gif" alt="">
        <span class="span">正在刷新...</span>
      </template>
      <template v-else>
        <span v-if="spreads.length">释放刷新</span>
        <span v-else>暂时没有发布记录</span>
      </template>
    </div>
    <!-- 主滑动区域 -->
    <div class="slider-container" ref="clientView" :class="{'refresh': refresh}">
      <template v-for="(item, index) in spreads">
        <div class="clientView" :key="index" :ref="'clientView_' + index" v-if="(index >= spreadIndex - 1) && (index <= spreadIndex + 1)">
          <SpreadItem :input="item" :index="item.index || 0"></SpreadItem>
        </div>
      </template>
    </div>
    <!-- 没有更多 -->
    <div class="no-more" :class="{'show': noMore}">
      没有更多了!
    </div>
  </div>
</template>

<script>
import MockData from './mock.json'
import SpreadItem from '../SpreadItem'
export default {
  name: 'spreadIndex',
  data() {
    return {
      pos: null, // 触摸开始的坐标
      page: null, // 当前页码
      spreads: [], // 广告列表
      noMore: false, // 是否显示没有更多
      allPage: null, // 总页码
      refresh: true, // 是否刷新
      shareCount: 5, // 剩余分享次数
      spreadIndex: 0, // 当前索引
      showMenu: false, // 是否显示菜单
      canOperate: true, // 是否可以操作[在刷新、滑动的时候禁止操作]
      coinRotate: false, // 硬币旋转效果
      clientHeight: null // 可视区域高度
    }
  },
  mounted() {
    this.init()
    this.clientHeight = document.documentElement.clientHeight
  },
  methods: {
    // 模拟异步数据
    mockData() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(MockData)
        }, 400)
      })
    },
    // init
    async init() {
      try {
        let res = await this.mockData()
        if (res.status !== 0) throw new Error(res.message)
        this.spreads = this._combine(res)
        if (this.spreads.length) {
          this.$set(
            this.spreads[0],
            'browse_num',
            this.spreads[0].browse_num + 1
          )
        }
        this.$nextTick(() => {
          this.refresh = false
          this.animationInit()
        })
      } catch (err) {
        console.log(err)
      }
    },
    animationInit() {
      let clientViews = this.$refs.clientView.querySelectorAll('.clientView')
      if (clientViews.length === 3) {
        clientViews[1].style.cssText = 'z-index: 1'
        clientViews[0].style.cssText =
          'z-index: 2;transform: translate3d(0,-100%,0);'
        clientViews[2].style.cssText =
          'z-index: 2;transform: translate3d(0,100%,0);'
      } else if (clientViews.length === 2) {
        if (this.spreadIndex === 0) {
          clientViews[0].style.cssText = 'z-index: 1'
          clientViews[1].style.cssText =
            'z-index: 2;transform: translate3d(0,100%,0);'
        } else if (this.spreadIndex === this.spreads.length - 1) {
          clientViews[1].style.cssText = 'z-index: 1'
          clientViews[0].style.cssText =
            'z-index: 2;transform: translate3d(0,-100%,0);'
        }
      }
    },
    // 刷新
    async refreshFun() {
      try {
        let res = await this.mockData()
        if (res.status !== 0) throw new Error(res.message)
        this.spreads = []
        setTimeout(() => {
          this.spreadIndex = 0
          this.spreads = this._combine(res)
          if (this.spreads.length) {
            this.$set(
              this.spreads[0],
              'browse_num',
              this.spreads[0].browse_num + 1
            )
          }
          this.$nextTick(() => {
            this.animationInit()
            this.refresh = false
            this.canOperate = true
            this.$refs.clientView.style.transform = `translate3d(0,0,0)`
          })
        })
      } catch (err) {
        this.refresh = false
        this.canOperate = true
      }
    },
    // 加载更多
    async loadMore() {
      try {
        if (this.page === this.allPage) return
        let res = await this.mockData()
        if (res.status !== 0) throw new Error(res.message)
        this.spreads = this.spreads.concat(this._combine(res))
      } catch (err) {
        console.log(err)
      }
    },
    // 开始滑动
    touchstart(event) {
      if (!this.canOperate) return
      this.showMenu = false
      this.canOperate = false
      this.pos = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      }
    },
    // 结束滑动
    touchend(event) {
      if (!this.pos) return
      let pos = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY
      }
      let distanceX = pos.x - this.pos.x
      let distanceY = pos.y - this.pos.y
      let horizontal = Math.abs(distanceX) >= Math.abs(distanceY)
      if (horizontal) {
        this.animationInit()
        this.canOperate = true
        this.$refs.clientView.style.transform = `translate3d(0,0,0)`
        if (Math.abs(distanceX) < 40) return
        if (distanceX >= 40) {
          // 向右滑(往左滚动)
          let index = this.spreads[this.spreadIndex].index || 0
          index = index > 0 ? index - 1 : 0
          this.$set(this.spreads[this.spreadIndex], 'index', index)
        } else {
          // 向左滑(往右滚动)
          let index = this.spreads[this.spreadIndex].index || 0
          let length = JSON.parse(this.spreads[this.spreadIndex].content).length
          index = index === length - 1 ? index : index + 1
          this.$set(this.spreads[this.spreadIndex], 'index', index)
        }
      } else {
        let clientViews = this.$refs.clientView.querySelectorAll('.clientView')
        if (this.spreadIndex !== 0) {
          clientViews[0].style.transition = 'all 0.4s ease'
        }
        if (this.spreadIndex !== this.spreads.length - 1) {
          clientViews[clientViews.length - 1].style.transition = 'all 0.4s ease'
        }
        // 高度不超过40 return
        if (Math.abs(distanceY) < 40) {
          this.animationInit()
          this.canOperate = true
          this.$refs.clientView.style.transform = `translate3d(0,0,0)`
          return
        }
        if (distanceY >= 40) {
          // 向下滑(往下滚动) 第一个
          if (this.spreadIndex === 0) {
            if (this.refresh) return
            this.refresh = true
            this.refreshFun()
          } else {
            clientViews[0].style.transform = `translate3d(0,0,0)`
            setTimeout(() => {
              this.spreadIndex = this.spreadIndex - 1
              this.$nextTick(() => {
                this.animationInit()
                this.canOperate = true
              })
            }, 300)
          }
        } else {
          // 向上滑(往上滚动) 最后一个
          if (this.spreadIndex === this.spreads.length - 1) {
            this.noMore = true
            setTimeout(() => {
              this.noMore = false
              this.canOperate = true
            }, 1500)
          } else {
            // 判断还剩下多少个广告,剩下3个时预加载下一页的广告
            clientViews[
              clientViews.length - 1
            ].style.transform = `translate3d(0,0,0)`
            setTimeout(() => {
              this.spreadIndex = this.spreadIndex + 1
              this.$nextTick(() => {
                this.animationInit()
                this.canOperate = true
              })
            }, 300)
            if (this.spreads.length - 1 - this.spreadIndex === 3) {
              this.loadMore()
            }
          }
        }
      }
      this.pos = null
    },
    // 开始滑动 => 暂时只判断上下滑动
    touchmove(event) {
      if (!this.pos) return
      let posY = event.changedTouches[0].pageY
      let distance = posY - (this.pos ? this.pos.y : 0)
      let clientViews = this.$refs.clientView.querySelectorAll('.clientView')
      if (distance > 0) {
        // 向下滑动 => 下拉刷新
        if (this.spreadIndex === 0) {
          distance = distance > 75 ? 75 : distance
          this.$refs.clientView.style.transform = `translate3d(0,${distance}px,0)`
        } else {
          distance = -this.clientHeight + distance
          clientViews[0].style.transform = `translate3d(0,${distance}px,0)`
        }
      } else {
        // 向上滑动
        if (this.spreadIndex === this.spreads.length - 1) return
        let last = clientViews.length - 1
        distance = this.clientHeight + distance
        clientViews[last].style.transform = `translate3d(0,${distance}px,0)`
      }
    },
    // 接口调整后,整合数据
    _combine(res) {
      let cards = res.data.cards
      let spread = res.data.data.data
      let marketing = res.data.marketing
      let enterprise = res.data.enterprise
      spread = spread.map(item => {
        if (item.type === 1 && enterprise[item.user_id]) {
          // 企业
          item.motto = enterprise[item.user_id].name
          item.head_picture = enterprise[item.user_id].logo
        } else if (cards[item.card_id]) {
          // 个人
          item.motto = cards[item.card_id].motto
          item.head_picture = cards[item.card_id].head_picture
        }
        item.user_marketing_title = item.user_marketing_id
          ? marketing[item.user_marketing_id].title
          : null
        return item
      })
      this.page = res.data.current_page
      this.allPage = res.data.last_page
      return spread
    }
  },
  components: {
    SpreadItem
  },
  watch: {
    spreadIndex: function(newVal) {
      try {
        this.$set(
          this.spreads[newVal],
          'browse_num',
          this.spreads[newVal].browse_num + 1
        )
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.spread-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #f2f2f2;
}
.refresh {
  left: 0;
  top: 80px;
  width: 100%;
  display: flex;
  font-size: 28px;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .img {
    width: 40px;
    margin-top: 20px;
  }
  .span {
    margin: 20px;
  }
}

.slider-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  &.refresh {
    transform: translate3d(0, 150px, 0);
  }
}
.clientView {
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}
.coin-box {
  top: 50%;
  left: 50%;
  z-index: 3;
  width: 120px;
  height: 120px;
  position: absolute;
  margin-top: -60px;
  margin-left: -60px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: all 2s cubic-bezier(0, 0, 0.2, 0.8);
  &.rotate {
    transform: rotateY(900deg);
  }
  .coin-front,
  .coin-back {
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    position: absolute;
    backface-visibility: hidden;
    img {
      width: 100%;
    }
  }
  .coin-back {
    transform: rotateY(180deg);
    span {
      width: 120px;
      font-size: 24px;
      color: #fef4d3;
      position: absolute;
      text-align: center;
      line-height: 120px;
      font-family: 'PingFang SC Bold';
    }
  }
}
.no-more {
  bottom: 0;
  opacity: 0;
  z-index: 99;
  width: 200px;
  height: 70px;
  left: 275px;
  color: #fff;
  font-size: 30px;
  position: absolute;
  text-align: center;
  line-height: 70px;
  text-align: center;
  border-radius: 35px;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  &.show {
    opacity: 1;
    bottom: 60px;
  }
}
</style>
