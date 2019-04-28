<template>
  <div id="house_property">
    <div>
      <div class="property-list">
        <h3 class="label">房屋配置</h3>
        <van-row>
          <van-col span="6" v-for="item in 8" :key="item">
            <div class="pro-item">
              <a class="pro-icon"></a>
              <h4>空调</h4>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #house_property {
    border-top: 2px solid #F2F2F2;
    > div {
      padding: .3rem;
      .property-list {
        padding: .3rem 0;
        border-bottom: 1px dashed #F2F2F2;
        h3.label {
          font-family: 'dingzitiblod';
        }
        div.pro-item {
          text-align: center;
          margin: .2rem;
          a.pro-icon {
            display: inline-block;
            width: 25pt;
            height: 25pt;
            background-color: rebeccapurple;
          }
        }
      }
    }
  }
</style>
