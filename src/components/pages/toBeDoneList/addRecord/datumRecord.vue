<template>
  <div id="datumRecord" :style="mainListHeight()">
    <div class="up">
      <div v-for="item in 5">
        <label>粉红色的卡</label>
        <span>符合开始大量后来</span>
      </div>
    </div>
    <div class="down">
      <div class="content">
        <div>
          <div class="forms">
            <div class="detail">
              <label>房屋地址</label>
              <span>发货的款式饭卡了</span>
            </div>
            <div v-for="pic in upload" class="flex">
              <Upload :file="pic" :getImg="album[pic.keyName]" @success="getImgData"></Upload>
            </div>
          </div>
          <div class="commonBtn">
            <p class="btn back">取消</p>
            <p class="btn">确定</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "datum",
    data() {
      return {
        upload: [],
        album: {},
      }
    },
    mounted() {
    },
    activated() {
      let data = this.jsonClone(defineCollectReport);
      for (let item of Object.keys(data)) {
        for (let key of data[item]) {
          if (key.picker === 'upload') {
            this.upload = this.upload.concat(key.value);
          }
        }
      }
    },
    watch: {},
    computed: {},
    methods: {
      getImgData(val) {

      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  #datumRecord {
    label {
      color: #9B9B9B;
      text-align: right;
      margin-right: .3rem;
    }
    @include flex('bet-column');
    .up {
      background-color: #F8F8F8;
      padding: .45rem 0 1.2rem 1.2rem;
      div {
        @include flex('items-center');
        min-height: .66rem;
      }
    }
    .down {
      position: relative;
      height: 100%;
      background-color: #4570FE;
      .content {
        position: absolute;
        top: -.6rem;
        left: .1rem;
        right: .1rem;
        bottom: .7rem;
        margin: 0 .3rem;
        @include boxShaw(0 -4px 10px 0px rgba(69, 112, 254, 0.1));
        @include radius(.2rem);
        background-color: #FFFFFF;
        > div {
          height: 100%;
          padding: .6rem .2rem;
          @include flex('bet-column');
          .forms {
            height: 100%;
            @include scroll;
            .detail {
              @include flex('items-center');
              height: .88rem;
              label {
                min-width: 2.2rem;
                max-width: 2.2rem;

              }
            }
          }
          .commonBtn {
            padding-top: .3rem;
          }
        }
      }
    }
  }
</style>
