<template>
  <div id="datumRecord" :style="mainListHeight()">
    <div class="up">
      <div v-for="item in Object.keys(showFormat)" v-if="followRecord[item]">
        <label>{{showFormat[item]}}</label>
<!--        <span class="remaining_time">-->
<!--          <span class="unit">{{followRecord.due_date_hours}}<b>h</b></span>-->
<!--          <span class="unit">{{followRecord.due_date_minutes}}<b>m</b></span>-->
<!--        </span>-->
        <span class="house_goods" v-if="item === 'house_goods'">
          <b v-if="followRecord[item]">
            <span v-for="house in Object.keys(followRecord[item])" style="display: block;">
              <b>{{house==='is_fill'?'':'缺少'}}</b>{{makeGoods[house]}}{{followRecord[item][house]}}个
            </span>
          </b>
        </span>
        <span v-else>{{followRecord[item]}}</span>
      </div>
    </div>
    <div class="down">
      <div class="content">
        <div>
          <div class="forms">
            <div class="detail" :class="followRecord.taskDefinitionKey">
              <label>房屋地址</label>
              <span>{{followRecord.house_address || ''}}</span>
            </div>
            <div v-if="followRecord.taskDefinitionKey === 'CompleteData'">
              <div v-for="pic in upload[followRecord.bulletin_type]" class="flex">
                <Upload :file="pic" :getImg="album[pic.keyName]" :close="!picStatus" @success="getImgData"></Upload>
              </div>
            </div>
            <div class="goods" v-else>
              <div class="flex" v-if="followRecord.house_goods">
                <label>补齐物品</label>
                <div class="polishing">
                  <h1 class="items-center" v-for="item in Object.keys(followRecord.house_goods)"
                      :class="{'choose': chooseText.includes(item)}" v-if="item !== 'is_fill'">
                    <b>{{makeGoods[item]}}/缺{{followRecord.house_goods[item]}}个</b>
                    <i class='checkbox' @click="choosePolishing(item)"><b></b></i>
                    <b style="white-space: nowrap" @click="choosePolishing(item)">补充</b>
                    <span class="num items-center">
                      <b @click="removeAdd('rem',item,followRecord.house_goods[item])">-</b>
                        <span>{{goods[item]}}</span>
                      <b class="add" @click="removeAdd('add',item,followRecord.house_goods[item])">+</b>
                    </span>
                  </h1>
                  <h2 class="items-center" :class="{'choose': chooseText.includes(item)}" v-else>
                    <b>家电不齐全</b>
                    <span class="items-center" @click="choosePolishing(item)">
                      <i class='checkbox'><b></b></i>
                      {{chooseText.includes(item)?'已补齐':'未补齐'}}
                    </span>
                  </h2>
                </div>
              </div>
              <div class="goodsPic">
                <div v-for="pic in goodsUpload" class="flex">
                  <label>{{pic.text}}</label>
                  <Upload :file="pic" :getImg="album[pic.keyName]" :close="!picStatus" @success="getImgData"></Upload>
                </div>
              </div>
            </div>
          </div>
          <div class="commonBtn">
            <p class="btn back" @click="$router.go(-1)">取消</p>
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
        followRecord: {},
        picStatus: false,
        album: {},//图片预填
        oldPhoto: {},
        changePhoto: {},
        showFormat: {
          house_address: '房屋地址',
          house_goods: '待办内容',
          due_date: '结束时间',
          // remaining_time: '剩余时间',
          bulletin_staff_name: '跟进人',
        },
        makeGoods: {
          bed: '床和床垫',
          wardrobe: '衣柜',
          curtain: '窗帘',
          is_fill: '家电不齐全',
        },
        form: {},//资料补齐
        goods: {},//物品补齐
        oldGoods: {},//物品补齐
        chooseText: [],//物品补齐多选
        upload: {
          bulletin_collect_basic: [
            {
              label: '证件照片',
              // placeholder: '必填',
              keyName: 'identity_photo',
            }, {
              label: '银行卡照片',
              // placeholder: '必填',
              keyName: 'bank_photo',
            }, {
              label: '合同照片',
              // placeholder: '必填',
              keyName: 'photo',
            }, {
              label: '水表照片',
              // placeholder: '必填',
              keyName: 'water_photo',
            }, {
              label: '电表照片',
              // placeholder: '必填',
              keyName: 'electricity_photo',
            }, {
              label: '气表照片',
              // placeholder: '必填',
              keyName: 'gas_photo',
            }, {
              label: '交接单照片',
              // placeholder: '必填',
              keyName: 'checkin_photo',
            }, {
              label: '委托书照片',
              // placeholder: '必填',
              keyName: 'auth_photo',
            }, {
              label: '押金照片',
              // placeholder: '必填',
              keyName: 'deposit_photo',
            }, {
              label: '承诺书照片',
              // placeholder: '必填',
              keyName: 'promise',
            }, {
              label: '房产证',
              // placeholder: '必填',
              keyName: 'property_photo',
            }, {
              label: '水卡',
              // placeholder: '必填',
              keyName: 'water_card_photo',
            }, {
              label: '电卡',
              // placeholder: '必填',
              keyName: 'electricity_card_photo',
            }, {
              label: '气卡',
              // placeholder: '必填',
              keyName: 'gas_card_photo',
            }
          ],
          bulletin_rent_basic: [
            {
              label: '交接单',
              // placeholder: '必填',
              keyName: 'checkin_photo',
            }, {
              label: '截图凭证',
              // placeholder: '必填',
              keyName: 'certificate_photo',
            }, {
              label: '押金收条',
              // placeholder: '必填',
              keyName: 'deposit_photo',
            }, {
              label: '证件照片',
              // placeholder: '必填',
              keyName: 'identity_photo',
            }, {
              label: '合同照片',
              // placeholder: '必填',
              keyName: 'photo',
            }, {
              label: '银行卡照片',
              // placeholder: '必填',
              keyName: 'bank_photo',
            }, {
              label: '水表照片',
              // placeholder: '必填',
              keyName: 'water_photo',
            }, {
              label: '电表照片',
              // placeholder: '必填',
              keyName: 'electricity_photo',
            }, {
              label: '气表照片',
              // placeholder: '必填',
              keyName: 'gas_photo',
            }
          ],
        },
        // 物品照片
        goodsUpload: [
          {
            text: '物品照片',
            // placeholder: '必填',
            keyName: 'house_goods',
          },
        ],
      }
    },
    beforeRouteLeave(to, from, next) {
      this.picStatus = true;
      setTimeout(_ => {
        this.picStatus = false;
      }, 100);
      next(vm => {
      })
    },
    mounted() {
    },
    activated() {
      this.close_();
      this.followRecord = JSON.parse(sessionStorage.datumRecord || '{}');
      let query = JSON.parse(this.$route.query.params || '{}');
      console.log(query)
      let record = this.followRecord.taskDefinitionKey;
      for (let key of Object.keys(query)) {
        this.form[key] = query[key];
      }
      if (record === 'CompleteAsset') {
        this.form.album = {
          house_goods: [],
        };
        this.form.house_id = query.house_id;
        console.log(1)
        console.log(this.form)
      } else {
        this.albumDetail(query, this.followRecord.bulletin_type);
      }
    },
    watch: {},
    computed: {},
    methods: {
      // 提交
      submit() {
        let type = this.followRecord.bulletin_type;
        this.form.contract_type = type === 'bulletin_collect_basic' ? 1 : 2;
        this.form.complete_content = {};
        console.log(2)
        console.log(this.form)
        let api = '';
        let key = this.followRecord.taskDefinitionKey;
        if (key === 'CompleteAsset') {
          this.goodsChange();
          api = '/goods';
        } else {
          this.picChanges();
        }
        console.log(3)
        console.log(this.form)
        this.$httpZll.setPolishingBulletin(this.form.task_id, this.form, api).then(res => {
          if (res) {
            this.$router.go(-1);
          }
        })
      },
      // 选择补齐
      choosePolishing(item) {
        if (this.chooseText.includes(item)) {
          this.chooseText.splice(this.chooseText.indexOf(item), 1);
          this.goods[item] = 0;
        } else {
          this.chooseText.push(item);
          if (item === 'is_fill') {
            this.goods[item] = 1;
          }
        }
      },
      // 补齐数量
      removeAdd(type, item, value) {
        if (!this.chooseText.includes(item)) return;
        if (type === 'add') {
          if (this.goods[item] < value) this.goods[item]++;
        } else {
          if (0 < this.goods[item]) this.goods[item]--;
        }
      },
      // 获取图片
      albumDetail(query, type) {
        let status = type === 'bulletin_collect_basic' ? 1 : 2;
        let params = {
          type: status,
          id: query.contract_id,
        };
        this.$httpZll.getPolishingDetail(params).then(res => {
          if (res) {
            this.photos(res.data.complete_content, type);
          } else {
            this.photos([], type);
          }
        });
      },
      // 生成图片字段
      photos(data, type) {
        for (let pic of this.upload[type]) {
          this.oldPhoto[pic.keyName] = data[pic.keyName] || [];
          this.changePhoto[pic.keyName] = this.jsonClone(this.oldPhoto[pic.keyName]);
          if (this.oldPhoto[pic.keyName].length) {
            this.$httpZll.getUploadUrl(this.oldPhoto[pic.keyName], 'close').then(res => {
              this.album[pic.keyName] = res.data;
              this.album = Object.assign({}, this.album);
            })
          }
        }
      },
      // 上传图片
      getImgData(val) {
        if (this.followRecord.taskDefinitionKey === 'CompleteAsset') {
          this.form.album[val[0]] = val[1];
        } else {
          this.changePhoto[val[0]] = val[1];
        }
      },
      // 资料补齐 改动字段
      picChanges() {
        for (let key of Object.keys(this.changePhoto)) {
          if (this.oldPhoto[key].length !== this.changePhoto[key].length) {
            this.form.complete_content[key] = this.changePhoto[key];
          } else {
            if (this.changePhoto[key].length) {
              for (let val of this.changePhoto[key]) {
                if ((!this.oldPhoto[key].includes(Number(val))) && (!this.oldPhoto[key].includes(String(val)))) {
                  this.form.complete_content[key] = this.changePhoto[key];
                }
              }
            }
          }
        }
      },
      // 物品补齐 改动字段
      goodsChange() {
        for (let key of Object.keys(this.goods)) {
          if (this.goods[key] !== this.oldGoods[key]) {
            this.form.complete_content[key] = this.goods[key];
          }
        }
      },
      // 清空
      close_() {
        this.followRecord = {};
        this.album = {};
        this.oldPhoto = {};
        this.changePhoto = {};
        this.chooseText = [];
        this.form = {
          task_id: '',
          process_id: '',
          house_name: '',
          contract_id: '',
          bulletin_staff_id: '',
          complete_content: {},
        };
        this.goods = {
          bed: 0,
          wardrobe: 0,
          curtain: 0,
          is_fill: 0,
        };
        this.oldGoods = this.jsonClone(this.goods);
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
      margin-right: .2rem;
      white-space: nowrap;
    }

    @include flex('bet-column');

    .up {
      background-color: #F8F8F8;
      padding: .45rem 0 1.2rem 1.2rem;

      div {
        @include flex();
        padding: .15rem 0;

        label {
          min-width: 1.2rem;
          max-width: 1.2rem;
        }

        .house_goods {
          line-height: .36rem;
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
          padding: .1rem .2rem .6rem;
          @include flex('bet-column');

          .forms {
            height: 100%;
            @include scroll;

            .detail {
              @include flex();
              padding: .4rem 0;

              .CompleteAsset {
                min-width: 2.2rem;
                max-width: 2.2rem;
              }
            }

            /*物品补齐*/
            .goods {
              label {
                padding-top: .03rem;
              }

              .goodsPic {
                label {
                  padding-top: .2rem;
                }
              }

              .polishing {
                .choose {
                  color: #000;

                  .checkbox {
                    border-color: #4570FE;

                    b {
                      background-color: #4570FE;
                    }
                  }

                  .num {
                    background-color: #F2F2F2;

                    b {
                      background-color: #DFDFE0;
                    }
                  }
                }

                h1, h2 {
                  .checkbox {
                    min-width: .4rem;
                    max-width: .4rem;
                    min-height: .4rem;
                    max-height: .4rem;
                    margin: 0 .1rem 0 .2rem;
                    @include radius(50%);
                    @include flex('flex-center');
                    border: 1px solid #D2D2D2;

                    b {
                      width: .2rem;
                      height: .2rem;
                      @include radius(50%);
                    }
                  }
                }

                h1 {
                  margin-bottom: .36rem;
                  color: #D2D2D2;

                  .num {
                    @include radius(1rem);
                    background-color: #F8F8F8;
                    line-height: .4rem;
                    margin: 0 .06rem;

                    span {
                      padding: 0 .15rem;
                    }

                    b {
                      width: .4rem;
                      height: .4rem;
                      @include flex('flex-center');
                      @include radius(50%);
                      background-color: #F0F0F0;
                    }

                    .add {
                      font-size: .35rem;
                    }
                  }
                }

                h2 {
                  margin-bottom: .36rem;
                  color: #D2D2D2;
                }
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
