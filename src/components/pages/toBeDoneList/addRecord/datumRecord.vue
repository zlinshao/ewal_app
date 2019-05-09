<template>
  <div id="datumRecord" :style="mainListHeight()">
    <div class="up">
      <div v-for="item in Object.keys(showFormat)">
        <label>{{showFormat[item]}}</label>
        <span class="remaining_time" v-if="item === 'remaining_time'">
          <span class="unit">{{followRecord.due_date_hours}}<b>h</b></span>
          <span class="unit">{{followRecord.due_date_minutes}}<b>m</b></span>
        </span>
        <span v-else>{{followRecord[item]}}</span>
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
              <Upload :file="pic" :getImg="album[pic.keyName]" :close="!picStatus" @success="getImgData"></Upload>
            </div>
          </div>
          <div class="commonBtn">
            <p class="btn back">取消</p>
            <p class="btn" @click="submit">确定</p>
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
        picStatus: false,
        album: {},//图片预填
        oldPhoto: {},
        changePhoto: {},
        showFormat: {
          house_address: '房屋地址',
          to_do_content: '待办内容',
          due_date: '结束时间',
          remaining_time: '剩余时间',
          bulletin_staff_name: '跟进人',
        },
        form: {
          task_id: '',
          house_name: '',
          contract_id: '',
          bulletin_staff_id: '',
          complete_content: {},
        },
        upload: [
          {
            label: '证件照片',
            placeholder: '必填',
            keyName: 'identity_photo',
          }, {
            label: '银行卡照片',
            placeholder: '必填',
            keyName: 'bank_photo',
          }, {
            label: '合同照片',
            placeholder: '必填',
            keyName: 'photo',
          }, {
            label: '水表照片',
            placeholder: '必填',
            keyName: 'water_photo',
          }, {
            label: '电表照片',
            placeholder: '必填',
            keyName: 'electricity_photo',
          }, {
            label: '气表照片',
            placeholder: '必填',
            keyName: 'gas_photo',
          }, {
            label: '交接单照片',
            placeholder: '必填',
            keyName: 'checkin_photo',
          }, {
            label: '委托书照片',
            placeholder: '必填',
            keyName: 'auth_photo',
          }, {
            label: '押金照片',
            placeholder: '必填',
            keyName: 'deposit_photo',
          }, {
            label: '承诺书照片',
            placeholder: '必填',
            keyName: 'promise',
          }, {
            label: '房产证',
            placeholder: '必填',
            keyName: 'property_photo',
          }, {
            label: '水卡',
            placeholder: '必填',
            keyName: 'water_card_photo',
          }, {
            label: '电卡',
            placeholder: '必填',
            keyName: 'electricity_card_photo',
          }, {
            label: '气卡',
            placeholder: '必填',
            keyName: 'gas_card_photo',
          },
        ],
      }
    },
    mounted() {
    },
    activated() {
      this.picStatus = false;
      let query = this.$route.query;
      for (let key of Object.keys(query)) {
        this.form[key] = query[key];
      }
      this.albumDetail(query);
    },
    watch: {},
    computed: {
      followRecord() {
        return this.$store.state.app.followRecord;
      }
    },
    methods: {
      albumDetail(query) {
        let params = {
          type: 1,
          id: query.contract_id,
        };
        this.$httpZll.getPolishingDetail(params).then(res => {
          if (res) {
            this.photos(res.data);
          } else {
            this.photos([]);
          }
        });
      },
      // 生成图片字段
      photos(data) {
        for (let pic of this.upload) {
          this.oldPhoto[pic.keyName] = data[pic.keyName] || [];
          this.changePhoto[pic.keyName] = data[pic.keyName] || [];
          if (this.oldPhoto[pic.keyName].length) {
            this.$httpZll.getUploadUrl(this.oldPhoto[pic.keyName], 'close').then(res => {
              this.$set(this.album, pic.keyName, res.data);
            })
          }
        }
      },
      // 提交
      submit() {
        this.form.complete_content = this.changePhoto;
        // this.picChanges();
        this.$httpZll.setPolishingBulletin(this.form.task_id, this.form).then(res => {
          if (res) {
            this.close_();
            this.$router.go(-1);
          }
        })
      },
      // 上传图片
      getImgData(val) {
        this.changePhoto[val[0]] = val[1];
      },
      // 图片上传改动字段
      // picChanges() {
      //   for (let key of Object.keys(this.changePhoto)) {
      //     if (this.oldPhoto[key].length !== this.changePhoto[key].length) {
      //       this.form.complete_content[key] = this.changePhoto[key];
      //     } else {
      //       if (this.changePhoto[key].length) {
      //         for (let val of this.changePhoto[key]) {
      //           if (!this.oldPhoto[key].includes(String(val))) {
      //             this.form.complete_content[key] = this.changePhoto[key];
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      close_() {
        this.picStatus = true;
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
        label {
          width: 1.2rem;
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
