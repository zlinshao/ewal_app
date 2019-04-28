<template>
  <div class="div" id="spot_code">
    <span v-if="spot_code">{{spot_code}}</span>
    <span v-else>重新获取</span>
  </div>
</template>

<script>
  export default {
    name: "float-button",
    props: ['type'],
    data() {
      return {
        spot_code: '',
      }
    },
    activated() {
      this.identificationCode();
    },
    mounted() {
      let that = this;
      let flag = 0; //标记是拖曳还是点击
      let oDiv = document.getElementById('spot_code');
      let disX, disY, moveX, moveY, L, T, starX, starY, starXEnd, starYEnd;
      oDiv.addEventListener('touchstart', function (e) {
        flag = 0;
        e.preventDefault();//阻止触摸时页面的滚动，缩放
        disX = e.touches[0].clientX - this.offsetLeft;
        disY = e.touches[0].clientY - this.offsetTop;
        //手指按下时的坐标
        starX = e.touches[0].clientX;
        starY = e.touches[0].clientY;
        //console.log(disX);
      });
      oDiv.addEventListener('touchmove', function (e) {
        flag = 1;
        L = e.touches[0].clientX - disX;
        T = e.touches[0].clientY - disY;
        //移动时 当前位置与起始位置之间的差值
        starXEnd = e.touches[0].clientX - starX;
        starYEnd = e.touches[0].clientY - starY;
        //console.log(L);
        if (L < 0) {//限制拖拽的X范围，不能拖出屏幕
          L = 0;
        } else if (L > document.documentElement.clientWidth - this.offsetWidth) {
          L = document.documentElement.clientWidth - this.offsetWidth;
        }
        if (T < 0) {//限制拖拽的Y范围，不能拖出屏幕
          T = 0;
        } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
          T = document.documentElement.clientHeight - this.offsetHeight;
        }
        moveX = L + 'px';
        moveY = T + 'px';
        //console.log(moveX);
        this.style.left = moveX;
        this.style.top = moveY;
      });
      oDiv.addEventListener('touchend', function () {
        //alert(parseInt(moveX))
        //判断滑动方向
        if (flag === 0) { //点击
          if (that.spot_code) {
            that.$prompt('提醒租客在转账时备注收款识别码，报备通过更快速');
          } else {
            that.identificationCode();
          }
        }
      });
    },
    methods: {
      // 唯一标识码
      identificationCode() {
        let types = 'EWAL:' + this.type;
        // let prefix = (this.type == 1 ? 'EWAL:payable' : 'EWAL:receivable');
        this.$httpZll.bulletinCode(types).then(res => {
          if (res) {
            this.spot_code = res.data.uniq_code
          } else {
            this.spot_code = '';
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #spot_code {
    position: fixed;
    padding: .12rem .3rem;
    color: #FFFFFF;
    text-align: center;
    top: 10em;
    background-color: dodgerblue;
    @include radius(1rem);
  }

</style>
