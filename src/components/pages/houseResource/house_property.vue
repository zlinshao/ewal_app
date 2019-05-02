<template>
  <div id="house_property">
    <div class="scroll_bar" ref="mainContainer" :style="mainHeight">
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
      <div class="property-list" v-for="(tmp,key) in extra_property" :key="key">
        <h3 class="label">{{ tmp.label }}</h3>
        <div class="chooseBtn">
          <p v-for="value in tmp.value" @click="handleChooseItem(tmp,value)">
            <b :class="{'choose': params[tmp.key].includes(value.id)}">{{ value.label }}</b>
          </p>
        </div>
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
        },
        extra_property: [
          {
            label: '卧室',
            key: 'bedroom',
            value: [
              {id: 1, label: '床', key: ''},
              {id: 2, label: '衣柜', key: ''},
              {id: 3, label: '空调遥控器', key: ''},
              {id: 4, label: '书桌', key: ''},
              {id: 5, label: '吸顶灯', key: ''},
              {id: 6, label: '门锁钥匙', key: ''},
              {id: 7, label: '彩电遥控器', key: ''},
            ]
          },
          {
            label: '客厅',
            key: 'livingRoom',
            value: [
              {id: 1, label: '大门锁', key: ''},
              {id: 2, label: '纱窗', key: ''},
              {id: 3, label: '天然气', key: ''},
              {id: 4, label: '彩电', key: ''},
              {id: 5, label: '吸顶灯', key: ''},
              {id: 6, label: '遥控器', key: ''},
              {id: 7, label: '空调遥控器', key: ''},
              {id: 8, label: '沙发', key: ''},
              {id: 9, label: '茶几', key: ''},
              {id: 10, label: '冰箱', key: ''},
            ]
          },
          {
            label: '厨房',
            key: 'kitchen',
            value: [
              {id: 1, label: '桌子', key: ''},
              {id: 2, label: '椅子', key: ''},
              {id: 3, label: '燃气灶', key: ''},
              {id: 4, label: '水龙头', key: ''},
              {id: 5, label: '橱柜', key: ''},
              {id: 6, label: '微波炉', key: ''},
            ]
          },
          {
            label: '阳台',
            key: 'balcony',
            value: [
              {id: 1, label: '吸顶灯', key: ''},
              {id: 2, label: '晾衣架', key: ''},
            ]
          },
          {
            label: '卫生间',
            key: 'toilet',
            value: [
              {id: 1, label: '吸顶灯', key: ''},
              {id: 2, label: '热水器', key: ''},
              {id: 3, label: '浴霸', key: ''},
            ]
          }
        ],
        params: {
          bedroom: [],
          livingRoom: [],
          kitchen: [],
          balcony: [],
          toilet: [],
        },
        mainHeight: {
          height: 0
        },
      }
    },
    mounted() {
      var top = this.$refs['mainContainer'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
    },
    watch: {},
    computed: {},
    methods: {
      handleChooseItem(tmp, value) {
        if (this.params[tmp.key].indexOf(value.id) !== -1) {
          this.params[tmp.key].splice(this.params[tmp.key].indexOf(value.id), 1);
        } else {
          this.params[tmp.key].push(value.id);
        }
      },
    },
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
        h3.label, h4 {
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
        .chooseBtn {
          @include flex('items-center');
          flex-wrap: wrap;
          p {
            margin-top: .2rem;
            padding: 0 .1rem;
            width: 25%;
            @include flex('flex-center');
            b {
              width: 100%;
              padding: .2rem 0;
              text-align: center;
              @include radius(1rem);
              background-color: #EEEDEE;
            }
            .choose {
              background-color: rgba(69, 112, 254, .1);
              color: #4570FE;
            }
          }
        }
      }
    }
  }
</style>
