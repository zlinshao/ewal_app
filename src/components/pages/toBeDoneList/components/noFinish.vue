<template>
  <div id="polishing">
    <van-popup v-model="popupModule" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="popupModule">
      <div class="moduleTop">
        <h1>
          {{taskDefinitionKey[allDetail.taskDefinitionKey]}}
        </h1>
        <h2>
          <span class="numberFont">54<b>%</b></span>
          <i style="height: 54%;"></i>
        </h2>
      </div>
      <div class="moduleMain">
        <div class="main">
          <div class="detail">
            <div v-for="item in Object.keys(showFormat)" v-if="allDetail[item] || item === 'remaining_time'">
              <label>{{showFormat[item]}}</label>
              <span v-if="item === 'remaining_time'">
                <span class="unit">{{allDetail.due_date_hours}}<b>h</b></span>
                <span class="unit">{{allDetail.due_date_minutes}}<b>m</b></span>
              </span>
              <span v-else-if="item === 'house_goods'">
                <b v-if="allDetail[item]">
                  <span v-for="house in Object.keys(allDetail[item])" style="display: block;">
                    <span v-if="house !== 'is_fill'">缺少{{makeGoods[house]}}{{allDetail[item][house]}}个</span>
                    <span v-else>家电不齐全</span>
                  </span>
                </b>
              </span>
              <span v-else>{{allDetail[item] || ''}}</span>
            </div>
          </div>
          <div class="record" v-for="item in recordList">
            <h1>{{item.created_at}}</h1>
            <div>
              <h2 v-for="key in Object.keys(item.content.complete_content)" v-if="makeGoods[key]">
                <label>{{makeGoods[key]}}</label>
                <span>补充{{item.content.complete_content[key]}}个</span>
              </h2>
            </div>
            <div v-if="item.file">
              <h2 v-for="pic in Object.keys(item.file)">
                <label>{{uploadCollect[pic]}}</label>
                <i>
                  <img v-for="p in item.file[pic]" :src="p.uri" @click="$bigPhoto(item.file[pic],p.uri)" alt="">
                </i>
              </h2>
            </div>
          </div>
        </div>
        <div class="commonBtn">
          <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="addRecord(item)">
            {{item.label}}
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "polishing",
    props: ['module', 'detail'],
    data() {
      return {
        popupModule: false,
        allDetail: {},//父组件传值
        recordList: [],//跟进记录
        showFormat: {
          house_address: '房屋地址',
          house_goods: '待办内容',
          due_date: '结束时间',
          remaining_time: '剩余时间',
          bulletin_staff_name: '跟进人',
        },
        makeGoods: {
          bed: '床和床垫',
          wardrobe: '衣柜',
          curtain: '窗帘',
          is_fill: '家电是否齐全'
        },
        buttons: [
          {
            label: '转交',
            type: 'deliver'
          },
          {
            label: '增加跟进记录',
            type: 'confirm'
          },
        ],
        moduleType: '',//弹窗类型
        taskDefinitionKey: {
          CompleteData: '业务员补齐资料',
          CompleteAsset: '补齐物品报备',
        },
        showForm: {},
        params: {},
        // 收房
        uploadCollect: {
          auth_photo: "委托书照片",
          promise: "承诺书照片",
          property_photo: "房产证",
          water_card_photo: "水卡",
          electricity_card_photo: "电卡",
          gas_card_photo: "气卡",
          house_goods: "补齐照片",
        },
        // 租房
        uploadRent: {
          certificate_photo: "截图凭证",
        },
        commonPic: {
          identity_photo: "证件照片",
          photo: "合同照片",
          bank_photo: "银行卡照片",
          checkin_photo: "交接单照片",
          deposit_photo: "押金照片",
          electricity_photo: "电表照片",
          gas_photo: "气表照片",
          water_photo: "水表照片",
        }
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.popupModule = val;
      },
      detail(val) {
        let contract_id = '';
        // 合同id
        if (val.ewal_contract) {
          contract_id = JSON.parse(val.ewal_contract).v3_contract_id;
        }
        // 跳转 参数
        this.params = {
          bulletin_staff_id: val.bulletin_staff_id,
          house_name: val.house_address,
          task_id: val.task_id,
          contract_id: contract_id,
        };
        // 需要补齐物品 列表
        if (val.taskDefinitionKey === 'CompleteAsset') {
          if (val.house_goods && typeof val.house_goods === 'string') {
            val.house_goods = JSON.parse(val.house_goods);//物品补齐
          }
          this.params.house_id = val.house_id;
          this.params.house_goods = val.house_goods;
        } else {
          val.house_goods = ''
        }
        this.allDetail = val;
        // 结束时间
        if (val.due_date) {
          this.allDetail.due_date = this.myUtils.formatDate(new Date(val.due_date), 'datetime');
        }
        this.uploadCollect = Object.assign({}, this.uploadCollect, this.commonPic);
        this.recordList = [];
        this.getRecordList(val.task_id);
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close');
        }
      }
    },
    computed: {},
    methods: {
      // 跟进列表
      getRecordList(id) {
        this.$httpZll.followRecordList(id).then(res => {
          if (res) {
            this.recordList = res.data;
          }
        })
      },
      // 跟进记录
      addRecord(val) {
        if (val.type === 'deliver') {

        } else {
          sessionStorage.setItem('datumRecord', JSON.stringify(this.allDetail));
          this.routerLink('/datumRecord', this.params);
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  @mixin polishImg($n) {
    @include bgImage('../../../../assets/image/toBeDoneList/goSignContract/' + $n + '.png');
  }

  #polishing {
    .popupModule {
      right: 0;
      left: 1.8rem;
      height: 100%;
      background-color: #4570FE;
      @include radius(.2rem 0 0 .2rem);
      @include flex('bet-column');
    }

    .moduleTop {
      height: 2.6rem;
      padding-bottom: .6rem;
      @include flex('justify-center');
      align-items: flex-end;

      h1 {
        color: #FFFFFF;
        margin-right: .1rem;
      }

      h2 {
        position: relative;
        width: 1rem;
        height: 1rem;
        overflow: hidden;
        @include radius(50%);
        background-color: rgba(255, 255, 255, .1);
        @include flex('flex-center');

        span {
          z-index: 2;
          position: absolute;
          font-size: .42rem;

          b {
            position: absolute;
            top: -.05rem;
            right: -.12rem;
          }
        }

        i {
          position: absolute;
          background-color: #FFFFFF;
          width: 100%;
          bottom: 0;
          z-index: 1;
        }
      }
    }

    .moduleMain {
      height: 100%;
      padding-top: .2rem;
      @include flex('bet-column');
      background-color: #FFFFFF;
      @include radius(.2rem .2rem 0 0);

      label {
        white-space: nowrap;
        color: #9B9B9B;
        margin-right: .2rem;
        text-align: right;
      }

      .main {
        height: 100%;
        @include scroll;

        .detail {
          padding: .3rem .6rem;

          div {
            @include flex();
            margin-bottom: .2rem;

            label {
              min-width: 1.3rem;
              max-width: 1.3rem;
            }

            span {
              line-height: .36rem;
            }
          }

          .unit {
            position: relative;
            margin-right: .3rem;
            @include numberFont('blod');

            b {
              font-size: .25rem;
              position: absolute;
              top: -.1rem;
              right: -.2rem;
            }
          }
        }

        .record {
          margin-top: .6rem;
          padding: 0 .3rem;

          h1 {
            color: #001A6E;
            padding: 0 0 .1rem .06rem;
          }

          div {
            background-color: #F8F8F8;
            @include radius(.1rem);

            h2 {
              padding: .2rem .1rem;
              @include flex('items-center');

              label {
                min-width: 1.6rem;
                max-width: 1.6rem;
              }

              i {
                @include flex('items-center');
                flex-wrap: wrap;

                img {
                  margin: .1rem .1rem 0 0;
                  width: .8rem;
                  height: .8rem;
                  @include radius(.1rem);
                }
              }

              span {
                width: 100%;
                @include flex('items-bet');
              }
            }
          }
        }
      }

      .commonBtn {
        padding: .3rem;

        .confirm {
          padding: .2rem;
        }
      }
    }
  }
</style>
