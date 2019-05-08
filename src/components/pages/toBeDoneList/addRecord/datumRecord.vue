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
        album: {},//图片预填
        oldPhoto: {},
        changePhoto: {},
        form: {
          task_id: '',
          house_name: '',
          contract_id: '',
          bulletin_staff_id: {},
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
      let params = {
        type: 1,
        id: 44206,
      };
      this.$httpZll.getPolishingDetail(params).then(res => {
        if (res) {
          this.photos(res.data);
        } else {
          this.photos([]);
        }
      });
    },
    watch: {},
    computed: {},
    methods: {
      // 生成图片字段
      photos(data) {
        for (let pic of this.upload) {
          this.oldPhoto[pic.keyName] = data[pic.keyName] || [];
          this.changePhoto[pic.keyName] = data[pic.keyName] || [];
          if (this.oldPhoto[pic.keyName].length) {
            this.$httpZll.getUploadUrl(this.oldPhoto[pic.keyName], 'close').then(res => {
              this.$set(this.album,pic.keyName,res.data);
            })
          }
        }
      },
      // 提交
      submit() {
        this.form.bulletin_staff_id = {};
        this.picChanges();
        console.log(this.form);
      },
      // 上传图片
      getImgData(val) {
        this.changePhoto[val[0]] = val[1];
      },
      // 图片上传改动字段
      picChanges() {
        for (let key of Object.keys(this.changePhoto)) {
          if (this.oldPhoto[key].length !== this.changePhoto[key].length) {
            this.form.bulletin_staff_id[key] = this.changePhoto[key];
          } else {
            if (this.changePhoto[key].length) {
              for (let val of this.changePhoto[key]) {
                if (!this.oldPhoto[key].includes(val)) {
                  this.form.bulletin_staff_id[key] = this.changePhoto[key];
                }
              }
            }
          }
        }
      }
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
