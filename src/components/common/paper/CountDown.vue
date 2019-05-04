<template>
    <div id="count_down">
      <div class="count-content">{{h}}:{{m}}:{{s}}</div>
    </div>
</template>

<script>
  export default {
    name: "CountDown",//倒计时组件
    props:{
      datetime: {
        default:'',
      }
    },
    watch: {
      datetime:{
        handler(val,oldVal) {
          if(val) {
            this.mDatetime = this.myUtils.formatDate2(this.datetime,'yyyy-MM-dd hh:mm:ss');
          }
        },
        immediate:true,
      },
    },
    data() {
      return {
        d:0,
        h:0,
        m:0,
        s:0,
        mDatetime:this.myUtils.formatDate2(new Date(),'yyyy-MM-dd hh:mm:ss'),
      }
    },
    mounted() {
      this.countTime();
    },
    methods: {
      countTime () {
        //获取当前时间
        let date = new Date();
        let now = date.getTime();
        //设置截止时间
        let newInitTime = this.mDatetime;
        let endDate = new Date(newInitTime.replace(/-/g,'/'));
        let end = endDate.getTime();
        //时间差
        let leftTime = end - now;
        //定义变量 d,h,m,s保存倒计时的时间
        if (leftTime >= 0) {
          //this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          this.h = Math.floor(leftTime / 1000 / 60 / 60);
          this.m = Math.floor(leftTime / 1000 / 60 % 60);
          this.s = Math.floor(leftTime / 1000 % 60);
        }
        //递归每秒调用countTime方法，显示动态时间效果
        setTimeout(this.countTime, 1000);
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common.scss";
  #theme_name {
    #count_down {
      display: inline-flex;
      .count-content {
        color: #4570FD;
        //font-size: 18px;
      }
    }
  }

  #theme_name.theme1 {
    #count_down {

    }
  }

  #theme_name.theme2 {
    #count_down {

    }
  }

  #theme_name.theme3 {
    #count_down {

    }
  }

  #theme_name.theme4 {
    #count_down {

    }
  }
</style>
