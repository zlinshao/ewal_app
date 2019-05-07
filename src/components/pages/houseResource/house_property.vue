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
            <b :class="{'choose': value.val > 0}">{{ value.label }}*{{ value.val }}</b>
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
          house_config_airc: {
            label: '空调',
            key: 1,
            val: 0
          },
          house_config_refrigerator: {
            label: '冰箱',
            key: 2,
            val: 0
          },
          house_config_tv: {
            label: '电视',
            key: 3,
            val: 0
          },
          d: {
            label: '煤气',
            key: 4,
            val: 0
          },
          e: {
            label: '油烟机',
            key: 5,
            val: 0
          },
          house_config_microwave: {
            label: '微波炉',
            key: 6,
            val: 0
          },
          house_config_washing: {
            label: '洗衣机',
            key: 7,
            val: 0
          },
          house_config_heater: {
            label: '热水器',
            key: 8,
            val: 0
          },
        },
        extra_property: [
          {
            label: '卧室',
            key: 'room',
            value: [
              {id: 1, label: '床', key: 'bed_num',val: 0},
              {id: 2, label: '衣柜', key: 'wardrobe_num',val: 0},
              {id: 3, label: '空调遥控器', key: 'airc_control_num',val: 0},
              {id: 4, label: '书桌', key: 'bedroom_table_num',val: 0},
              {id: 5, label: '吸顶灯', key: 'bedroom_light_num',val: 0},
              {id: 6, label: '门锁钥匙', key: 'bedroom_keys_num',val: 0},
              {id: 7, label: '彩电遥控器', key: 'bedroom_TV_control',val: 0},
            ]
          },
          {
            label: '客厅',
            key: 'hall',
            value: [
              {id: 1, label: '彩电', key: 'hall_has_tv',val: 0},
              {id: 2, label: '吸顶灯', key: 'hall_light_num',val: 0},
              {id: 3, label: '遥控器', key: 'hall_tv_controller_type',val: 0},
              {id: 4, label: '沙发', key: 'hall_sofa_num',val: 0},
              {id: 5, label: '茶几', key: 'hall_tea_table_num',val: 0},
              {id: 6, label: '冰箱', key: 'hall_has_refrigerator',val: 0},
            ]
          },
          {
            label: '厨房',
            key: 'kitchen',
            value: [
              {id: 1, label: '桌子', key: 'hall_dining_num',val: 0},
              {id: 2, label: '椅子', key: 'hall_chairs_num',val: 0},
              {id: 3, label: '燃气灶', key: 'kitchen_has_gas',val: 0},
              {id: 4, label: '水龙头', key: 'kitchen_faucet_num',val: 0},
              {id: 5, label: '橱柜', key: 'kitchen_cabinet_num',val: 0},
              {id: 6, label: '微波炉', key: 'kitchen_microwave_num',val: 0},
            ]
          },
          {
            label: '阳台',
            key: 'balcony',
            value: [
              {id: 1, label: '吸顶灯', key: 'balcony_light_num',val: 0},
              {id: 2, label: '晾衣架', key: 'balcony_has_hanger',val: 0},
            ]
          },
          {
            label: '卫生间',
            key: 'toilet',
            value: [
              {id: 1, label: '吸顶灯', key: 'toilet_light_num',val: 0},
              {id: 2, label: '热水器', key: 'toilet_has_heater',val: 0},
              {id: 3, label: '浴霸', key: 'toilet_has_yuba',val: 0},
            ]
          }
        ],
        params: {
          room: [],
          hall: [],
          kitchen: [],
          toilet: [],
          balcony: []
        },
        mainHeight: {
          height: 0
        },
        server: globalConfig.server_market,
      }
    },
    mounted() {
      var top = this.$refs['mainContainer'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      this.handleGetHouseDetail();
    },
    watch: {},
    computed: {},
    methods: {
      handleGetHouseDetail() {
        if (!this.$route.query) {
          return false;
        }
        var house_id = this.$route.query.id;
        this.$httpZll.get(this.server + `v1.0/market/house/detail/${house_id}`, {}, '获取中...').then(res => {
          if (res.code === 200) {
            if (res.data.handover_data) {
              if (res.data.handover_data.house_config) {
                for (var key in this.property_list) {
                  this.property_list[key].val = res.data.handover_data.house_config[key] ? res.data.handover_data.house_config[key] : 0;
                }
              }
              for (var item of this.extra_property) {
                if (res.data.handover_data[item.key]) {
                  console.log(res.data.handover_data[item.key]);
                  for (var tmp of item.value) {
                    tmp.val = res.data.handover_data[item.key][tmp.key] ? res.data.handover_data[item.key][tmp.key] : 0;
                  }
                }
              }
              console.log(this.extra_property);
            }
          } else {
            this.$prompt('获取数据失败');
          }
        })
      },
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
              font-size: .25rem;
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
