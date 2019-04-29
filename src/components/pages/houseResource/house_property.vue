<template>
  <div id="house_property">
    <div>
      <div class="property-list">
        <h3 class="label">房屋配置</h3>
        <van-row>
          <van-col span="6" v-for="(item,key) in property_list" :key="item.key">
            <div class="pro-item">
              <a class="pro-icon" :class="['pro-icon-' + item.key]"></a>
              <h4>{{ item.label }}*{{ item.val }}</h4>
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
      return {
        property_list: {
          a: {
            label: '空调',
            key: 1,
            val: 1
          },
          b: {
            label: '冰箱',
            key: 2,
            val: 2
          },
          c: {
            label: '电视',
            key: 3,
            val: 2
          },
          d: {
            label: '煤气',
            key: 4,
            val: 2
          },
          e: {
            label: '油烟机',
            key: 5,
            val: 1
          },
          f: {
            label: '微波炉',
            key: 6,
            val: 1
          },
          g: {
            label: '洗衣机',
            key: 7,
            val: 1
          },
          h: {
            label: '热水器',
            key: 8,
            val: 1
          },
        }
      }
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
        h3.label ,h4{
          font-family: 'dingzitiblod';
        }
        div.pro-item {
          text-align: center;
          margin: .2rem;
          a.pro-icon {
            display: inline-block;
            width: 25pt;
            height: 25pt;
          }
          @for $i from 1 to 9 {
            a.pro-icon-#{$i} {
              $url: '../../../assets/image/houseResource/pro_icon_#{$i}.png';
              @include bgImage($url);
              background-size: contain;
            }
          }
          h4 {
            font-size: .25rem;
          }
        }
      }
    }
  }
</style>
