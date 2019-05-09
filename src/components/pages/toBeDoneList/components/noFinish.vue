<template>
  <div id="polishing">
    <van-popup v-model="popupModule" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="popupModule">
      <div class="moduleTop">
        <h1>
          {{taskDefinitionKey[allQuery.taskDefinitionKey]}}
        </h1>
        <h2>
          <span class="numberFont">54<b>%</b></span>
          <i style="height: 54%;"></i>
        </h2>
      </div>
      <div class="moduleMain">
        <div class="main">
          <div class="detail">
            <div v-for="item in Object.keys(showFormat)">
              <label>{{showFormat[item]}}</label>
              <span v-if="item === 'remaining_time'">
                <span class="unit">{{allQuery.due_date_hours}}<b>h</b></span>
                <span class="unit">{{allQuery.due_date_minutes}}<b>m</b></span>
              </span>
              <span v-else>{{allQuery[item] || ''}}</span>
            </div>
          </div>
          <div class="record" v-for="item in recordList">
            <h1>{{item.created_at}}</h1>
            <div>
              <h2 v-for="pic in Object.keys(item.file)">
                <label>{{uploadCollect[pic]}}</label>
                <i><img v-for="p in item.file[pic]" :src="p.uri"></i>
                <!--<span>-->
                <!--<b>空调/缺2台</b><b>补充2台</b>-->
                <!--</span>-->
              </h2>
            </div>
          </div>
        </div>
        <div class="commonBtn">
          <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="addRecord()">
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
        allQuery: {},//父组件传值
        recordList: [],//跟进记录
        showFormat: {
          house_address: '房屋地址',
          to_do_content: '待办内容',
          due_date: '结束时间',
          remaining_time: '剩余时间',
          bulletin_staff_name: '跟进人',
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
        this.allQuery = val;
        let contract_id = '';
        if (val.ewal_contract) {
          contract_id = JSON.parse(val.ewal_contract).v3_contract_id;
        }
        if (val.due_date) {
          this.allQuery.due_date = this.myUtils.formatDate(new Date(val.due_date), 'datetime');
        }
        this.params = {
          bulletin_staff_id: val.bulletin_staff_id,
          house_name: val.house_address,
          task_id: val.task_id,
          contract_id: contract_id,
        };
        this.uploadCollect = Object.assign({}, this.uploadCollect, this.commonPic);
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
      addRecord() {
        this.$store.dispatch('follow_record', this.allQuery);
        this.routerLink('/datumRecord', this.params);
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
              width: 1.3rem;
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
