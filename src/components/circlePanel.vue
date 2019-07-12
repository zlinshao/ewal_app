<template>
  <div ref="parent" id="circlePanel">
    <div class="circleOut" ref="out">
      <div class="circleIn" ref="into">
        <div class="circleItem" v-for="item in buttonList" @click="toBulletin(item)" ref="item">
          <img :src="item.icon" class="circleIcon" :class="[item.type]" :style="{transform: itemAngle}" alt="">
        </div>
      </div>
      <img src="../assets/image/home/circle_logo.png" class="logo" ref="lejialogo" alt="">
    </div>
    <img src="../assets/image/home/zhuanpan_zhicheng.png" class="zhicheng" alt="">
    <!--<audio src="../assets/image/circlePanel/kaka.mp3" ref="audio"></audio>-->
  </div>
</template>

<script>
  import ic_shoufang from '@/assets/image/home/ic_shoufang.png'
  import ic_zufang from '@/assets/image/home/ic_zufang.png'
  import ic_qudao from '@/assets/image/home/ic_qudao.png'
  import ic_weikuan from '@/assets/image/home/ic_weikuan.png'
  import ic_tiaozu from '@/assets/image/home/ic_tiaozu.png'
  import ic_zhuanzu from '@/assets/image/home/ic_zhuanzu.png'
  import ic_tuizu from '@/assets/image/home/ic_tuizu.png'
  import ic_teshu from '@/assets/image/home/ic_teshu.png'
  // import ic_zhadan from '@/assets/image/home/ic_zhadan.png'
  // import {Base64Binary} from "../../static/js/base64Binary.js"

  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  export default {
    name: "CirclePanel",
    data() {
      return {
        buttonList: [
          {
            // url: 'toBeDone',
            name: '收房待办',
            status: bulletinRouterStatus.bulletin_collect_basic,
            icon: ic_shoufang,
          },
          {
            // url: 'toBeDone',
            name: '租房待办',
            status: bulletinRouterStatus.bulletin_rent_basic,
            icon: ic_zufang,
          },
          {
            // url: 'toBeDone',
            name: '渠道费待办',
            status: bulletinRouterStatus.bulletin_agency,
            icon: ic_qudao,
          },
          {
            // url: 'toBeDone',
            name: '尾款待办',
            status: bulletinRouterStatus.bulletin_retainage,
            icon: ic_weikuan,
          },
          {
            // url: 'toBeDone',
            // url: '',
            name: '调租',
            status: bulletinRouterStatus.bulletin_change,
            icon: ic_tiaozu,
          },
          {
            // url: 'toBeDone',
            // url: '',
            name: '转租',
            status: bulletinRouterStatus.bulletin_rent_trans,
            icon: ic_zhuanzu,
          },
          {
            // url: 'toBeDone',
            // url: '',
            name: '特殊事项',
            status: bulletinRouterStatus.bulletin_special,
            icon: ic_teshu,
          },
          {
            // url: 'toBeDone',
            // url: '',
            name: '退租',
            status: bulletinRouterStatus.bulletin_checkout,
            icon: ic_tuizu,
          },
          // {
          //   icon: ic_zhadan,
          //   name: '炸单',
          //   url: 'toBeDone',
          // },
        ],
        arrayData: '',//ArrayBuffer数据
        audioCtx: null,
        decodedData: null,//音频数据
        startAngle: 0,
        itemAngle: "rotate(0deg)",

      }
    },
    mounted() {
      // let data = this.$refs.audio.src;
      // this.arrayData = Base64Binary.decodeArrayBuffer(data.substring(data.indexOf(',') + 1));
      // window.AudioContext = window.AudioContext || window.webkitAudioContext;
      // this.audioCtx = new AudioContext();//获取音频上下文
      let curAngle = 0;
      let startX = 0;
      let startY = 0;
      let app = this;
      let circleOut = this.$refs.out;
      let circleIn = this.$refs.into;

      let itemCount = this.$refs.item.length;
      let radius = circleIn.clientWidth / 2.1;

      for (let i = 0; i < itemCount; i++) {
        let item = this.$refs.item[i];
        let itemHalfWidth = item.clientWidth / 3;
        let itemHalfHeight = item.clientHeight / 3;
        let itemDegrees = 360 / itemCount;
        let radian = itemDegrees * Math.PI / 180;
        let top = radius - Math.cos(radian * i).toFixed(2) * radius;
        let left = radius - Math.sin(radian * i).toFixed(2) * radius;
        top = top - itemHalfHeight;
        left = left - itemHalfWidth;
        item.style.top = top + "px";
        item.style.left = left + "px";
      }
      //以下是去除谷歌警告
      let passiveSupported = false;
      try {
        let options = Object.defineProperty({}, "passive", {
          get: function () {
            passiveSupported = true;
          }
        });
        window.addEventListener("test", null, options);
      } catch (err) {
      }
      let passive = passiveSupported ? {passive: true} : false;

      circleOut.addEventListener("touchstart", function (e) {
        e.stopPropagation();
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
      }, passive);
      //以上是去除谷歌警告
      circleOut.addEventListener("touchmove", function (e) {
        e.stopPropagation();
        let moveX = e.targetTouches[0].clientX;
        let moveY = e.targetTouches[0].clientY;
        let angle = app.angle(app.getBasePoint(), new Point(startX, startY), new Point(moveX, moveY)) % 360;
        angle = angle / 2;
        startX = moveX;
        startY = moveY;
        curAngle = curAngle + angle;
        let lejialogo = app.$refs.lejialogo;

        let angleCss = 'rotate(' + curAngle + 'deg)';
        let logoAngleCss = 'rotate(' + -curAngle + 'deg)';
        circleOut.style.webkitTransform = angleCss;
        circleOut.style.mozTransform = angleCss;
        circleOut.style.msTransform = angleCss;
        circleOut.style.oTransform = angleCss;
        circleOut.style.transform = angleCss;

        lejialogo.style.webkitTransform = logoAngleCss;
        lejialogo.style.mozTransform = logoAngleCss;
        lejialogo.style.msTransform = logoAngleCss;
        lejialogo.style.oTransform = logoAngleCss;
        lejialogo.style.transform = logoAngleCss;

        app.startAngle = app.startAngle + angle;
        app.itemAngle = 'rotate(' + -curAngle + 'deg)';
        if (Math.abs(app.startAngle) >= 10) {
          app.startAngle = 0;
          app.playSound();
        }
      }, passive);
      circleOut.addEventListener("touchend", function (e) {
        e.stopPropagation();
      }, passive);
    },
    methods: {
      // 报备跳转
      toBulletin(item) {
        sessionStorage.setItem('bulletin_type', JSON.stringify(item.status));
        this.$bulletinTitles(item.status.bulletin);
        this.routerLink('/toBeDone');
      },
      getBasePoint() {
        let parent = this.$refs.parent;
        let offsetLeft = parent.offsetLeft;
        let offsetTop = parent.offsetTop;
        let size = parent.offsetHeight;
        return new Point(size / 2 + offsetLeft, size / 2 + offsetTop);
      },
      angle(cen, first, second) {
        let dx1, dx2, dy1, dy2;
        dx1 = first.x - cen.x;
        dy1 = first.y - cen.y;
        dx2 = second.x - cen.x;
        dy2 = second.y - cen.y;
        // 计算三边的平方
        let ab2 = (second.x - first.x) * (second.x - first.x) + (second.y - first.y) * (second.y - first.y);
        let oa2 = dx1 * dx1 + dy1 * dy1;
        let ob2 = dx2 * dx2 + dy2 * dy2;
        // 根据两向量的叉乘来判断顺逆时针
        let isClockwise = ((first.x - cen.x) * (second.y - cen.y) - (first.y - cen.y) * (second.x - cen.x)) > 0;
        // 根据余弦定理计算旋转角的余弦值
        let cosDegree = (oa2 + ob2 - ab2) / (2 * Math.sqrt(oa2) * Math.sqrt(ob2));
        // 异常处理，因为算出来会有误差绝对值可能会超过一，所以需要处理一下
        if (cosDegree > 1) {
          cosDegree = 1;
        } else if (cosDegree < -1) {
          cosDegree = -1;
        }
        // 计算弧度
        let radian = Math.acos(cosDegree);
        // 计算旋转过的角度，顺时针为正，逆时针为负
        return (isClockwise ? radian * 180 / Math.PI : -radian * 180 / Math.PI);
      },
      playSound() {
        let app = this;
        if (app.decodedData !== null) {
          app.play();
        } else {
          // app.audioCtx.decodeAudioData(app.arrayData, (data) => {
          //   app.decodedData = data;
          //   app.play();
          // });
        }
      },
      play() {
        let source = this.audioCtx.createBufferSource();
        source.buffer = this.decodedData;
        source.connect(this.audioCtx.destination);
        source.start(0); //立即播放
      }
    },

  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/common.scss";

  #circlePanel {
    $outSize: 6rem; //外圈圆宽高
    $inSize: 4.8rem; //内圈圆宽高
    $zhizhuHeight: 4rem; //支柱的高度
    $zhizhuWidth: .8rem; //支柱的宽度
    width: $outSize;
    height: $outSize + $zhizhuHeight - $outSize/2;
    //外圆
    .circleOut {
      overflow: hidden;
      width: $outSize;
      height: $outSize;
      position: absolute;
      @include radius($outSize);
      //内圆
      .circleIn {
        position: absolute;
        width: $inSize;
        height: $inSize;
        top: ($outSize - $inSize )/2;
        left: ($outSize - $inSize )/2;
        z-index: 1;
        @include radius($inSize);
        @include bgImage('../assets/image/home/zhuanpan.png');
      }

      //转盘中心LJ logo
      $logoSize: 1.4rem;

      .logo {
        position: absolute;
        top: ($outSize)/2 - $logoSize/2;
        left: ($outSize)/2 - $logoSize/2;
        width: $logoSize;
        height: $logoSize;
        z-index: 1;
      }
    }

    //新租 续租等按钮
    .circleItem {
      position: absolute;
      text-align: center;
      line-height: .8rem;
      font-size: .8rem;
      z-index: 1;
      //按钮图标
      .circleIcon {
        width: .72rem;
        height: 1.2rem;
      }

      .final, .special {
        width: .8rem;
      }
    }

    //风车支柱class
    .zhicheng {
      position: absolute;
      width: $zhizhuWidth;
      height: $zhizhuHeight;
      top: $outSize/2;
      left: $outSize/2 - $zhizhuWidth/2;
      z-index: -1;
    }
  }

</style>
