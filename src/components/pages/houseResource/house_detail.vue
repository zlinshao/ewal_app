<template>
  <div id="house_detail">
    <div>
      <div class="main-img">
        <img :src="detail.house_detail.cover" alt="" v-if="detail && detail.house_detail && detail.house_detail.cover" @click="handleLookPics(detail)">
        <img src="./detail.png" v-else alt="none" @click="handleLookPics(detail)">
      </div>
      <div class="main-content scroll_bar" ref="house_main" :style="mainHeight">
        <div>
          <!--头部-->
          <div class="header">
            <div class="flex">
              <h1>{{ detail && detail.house_name }}</h1>
              <a class="notice notice1"></a>
              <h3 class="price">{{ detail && detail.house_detail && detail.house_detail.suggest_price }}元/月</h3>
            </div>
            <div class="address">
              仙林大学城仙鹤门二号路1号
            </div>
          </div>
          <!--标签-->
          <div class="tags flex">
            <a v-if="detail && detail.house_detail && detail.house_detail.quality === 0" class="tag tag-quality">低质量</a>
            <a class="tag tag-quality" v-if="detail && detail.house_detail && detail.house_detail.warning_current_days > 0">已空置{{ detail && detail.house_detail && detail.house_detail.warning_current_days }}</a>
          </div>
          <!--属性-->
          <div class="property">
            <van-row>
              <van-col span="12">
                <a class="label">面积</a><span class="val">{{ detail && detail.area }}</span>
              </van-col>
              <van-col span="12">
                <a class="label">户型</a><span class="val">{{ detail && detail.hk }}</span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <a class="label">楼层</a><span class="val">{{ detail && detail.floor && detail.floor.this }}/{{ detail && detail.floor.all }}</span>
              </van-col>
              <van-col span="12">
                <a class="label">朝向</a><span class="val">{{ detail && detail.house_toward || '/'}}</span>
              </van-col>
            </van-row>
          </div>
          <div class="property">
            <van-row>
              <van-col span="12">
                <a class="label">装修</a><span class="val">{{ detail && detail.decoration_name }}</span>
              </van-col>
              <van-col span="12">
                <a class="label">所属部门</a><span class="val">{{ detail && detail.department_name || '/' }}</span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <a class="label">类型</a><span class="val">{{ detail && detail.house_identity || '/'}}</span>
              </van-col>
              <van-col span="12">
                <a class="label">负责人</a><span class="val">{{ detail && detail.leader_name || '/'}}</span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <a class="label">门锁</a><span class="val">{{ detail && detail.lock_type || '/'}}</span>
              </van-col>
              <van-col span="12">
                <a class="label">有效时长</a><span class="val">{{ detail && detail.month }}月{{ detail && detail.day }}天</span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <a class="label">电梯</a><span class="val">{{ detail && detail.house_lift || '/'}}</span>
              </van-col>
              <van-col span="12">
                <a class="label">租赁建议</a><span class="val">{{ detail && detail.house_detail && detail.house_detail.suggest_price || '/'}}元/月</span>
              </van-col>
            </van-row>
          </div>
          <!--配置-->
          <div class="configuration">
            <div class="flex" @click="handleLookAssociate">
              <h2>房屋配置</h2>
              <a>查看交接单<van-icon name="arrow" style="vertical-align: middle"></van-icon></a>
            </div>
            <div class="furniture">
              <van-row>
                <van-col span="6" v-for="tmp in 8" :key="tmp">
                  <div class="furniture" :class="['fur' + tmp]"></div>
                </van-col>
              </van-row>
            </div>
          </div>
          <!--位置-->
          <div class="location">
            <h3>位置及周边</h3>
            <div id="map-container">

            </div>
          </div>
          <!--同小区成交-->
          <div class="common_city">
            <h3>同小区成交</h3>
            <a class="clinch-btn">最新3套成交</a>
            <van-steps direction="vertical" :active="-1">
              <van-step v-for="item in 5" :key="item">
                <div class="flex house-clinch">
                  <h3>仙居雅苑1-101</h3>
                  <a>20000元/月</a>
                </div>
                <p class="type-clinch">100㎡ 2室1厅1卫</p>
              </van-step>
            </van-steps>
          </div>
          <!--推荐房源-->
          <div class="more-house">
            <h3>推荐房源</h3>
            <div v-for="item in 5" class="flex" :key="item">
              <img src="./detail.png" alt="">
              <div>
                <div class="flex">
                  <h4>仙居雅苑2-202</h4>
                  <a class="price">2000元/月</a>
                </div>
                <span>85㎡ 2室1厅1卫</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <div @click="handleGoContract">
              <a></a>
              <h5>历史合同</h5>
            </div>
          </div>
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
        server: globalConfig.server_market,
        detail: '',
        mainHeight: '',
      }
    },
    mounted() {
      this.handleGetHouseDetail();
      let top = this.$refs['house_main'].offsetTop;
      this.mainHeight = this.mainListHeight(top + 20);
    },
    watch: {},
    computed: {},
    methods: {
      handleLookPics(detail) {
        this.routerLink('/house_image');
      },
      handleGoContract() {
        this.routerLink('/houseContract',this.$route.query);
      },
      handleLookAssociate() {
        this.routerLink('/houseProperty');
      },
      handleGetHouseDetail() {
        if (!this.$route.query) {
          return false;
        }
        var house_id = this.$route.query.id;
        this.$httpZll.get(this.server + `v1.0/market/house/detail/${house_id}`,{},'获取中...').then(res => {
          if (res.code === 200) {
            this.detail = res.data;
          } else {
            this.house_detail = '';
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  @mixin houseBg($m) {
    @include bgImage('../../../assets/image/houseResource/' + $m);
  }
  #house_detail {
    > div {
      .main-img {
        height: 230px;
        border-top: .1rem solid #F4F4F4;
      }
      .main-content {
        position: relative;
        top: -.3rem;
        border-radius: 15px 15px  0 0;
        z-index: 1;
        background-color: white;
        > div {
          padding: .3rem .3rem 0 .3rem;
          .header {
            position: relative;
            h1,h3 {
              font-weight: bold;
              font-family: 'dingzitiblod';
            }
            h3 {
              position: absolute;
              right: 0;
              top: 0;
              color: #CF2E33;
            }
            > div.address {
              font-family: 'dingzitiblod';
              font-size: .25rem;
              padding: .2rem 0;
              color: #9B9B9B;
              border-bottom: 1px dashed #F2F2F2;
            }
            a.notice {
              width: 18px;
              height: 18px;
              vertical-align: middle;
              margin-left: 5px;
            }
            a.notice1 {
              @include houseBg('gantan-cheng.png');
            }
            a.notice2 {
              @include houseBg('gantan-hong.png');
            }
          }
          .tags {
            padding: 5px 0;
            .tag {
              padding: 3px 8px;
              border-radius: 3px;
              font-family: 'dingzitiblod';
              font-size: .25rem;
              &:not(:last-child) {
                margin-right: 5px;
              }
            }
            .tag-quality {
              background-color: #FDEDEC;
              color: #EA635F;
            }
          }
          .property {
            padding: .2rem 0;
            border-bottom: 1px dashed #F2F2F2;
            div.van-col {
              margin: .1rem auto;
            }
            .label ,.val{
              font-family: 'dingzitiblod';
              font-size: .25rem;
            }
            .label {
              display: inline-block;
              text-align: left;
              color: #D7D7D7;
              margin-right: 10px;
            }
            .val {
              color: #898991;
            }
          }
          .configuration {
            padding: .2rem 0;
            border-bottom: 1px dashed #F2F2F2;
            > div {
              &:first-child {
                position: relative;
                h2,a{
                  font-family: 'dingzitiblod';
                }
                a {
                  position: absolute;
                  right: -.3rem;
                  top: 0;
                  min-width: 75pt;
                  height: 15pt;
                  background-color: #FED836;
                  font-size: .2rem;
                  padding-left: .2rem;
                  line-height: 15pt;
                  border-radius: 10px 0 0 10px;
                  color: white;
                }
              }
            }
            .furniture {
              flex-wrap: wrap;
              padding: .2rem 0;
              div.furniture {
                width: 40pt;
                height: 40pt;
                margin: .2rem;
                border-radius: 50%;
              }
              @for $i from 1 to 9 {
                .fur#{$i} {
                  background: url("../../../assets/image/houseResource/fur#{$i}.png") no-repeat center;

                }
              }
            }
          }
          .location {
            padding: .3rem 0;
            border-bottom: 1px dashed #F2F2F2;
            h3 {
              font-family: 'dingzitiblod';
            }
            #map-container {
              min-height: 200px;
              background-color: #9B9B9B;
              border-radius: 10px;
              margin: .2rem 0;
            }
          }
          .common_city {
            padding: .3rem 0;
            border-bottom: 1px dashed #F2F2F2;
            h3 {
              font-family: 'dingzitiblod';
            }
            a.clinch-btn {
              display: inline-block;
              padding: 3px 8px;
              background-color: #ECF5EC;
              color: #51A554;
              font-family: 'dingzitiblod';
              font-size: 14px;
              margin: .2rem 0;
              border-radius: 3px;
            }
            div.house-clinch {
              position: relative;
              a {
                position: absolute;
                right: 0;
                top: 0;
                color: #CF2E33;
                font-family: 'dingzitiblod';
              }
            }
            p.type-clinch {
              margin-top: 5px;
              font-family: 'dingzitiblod';
              font-size: 12px;
              color: #9B9B9B;
            }
          }
          .more-house{
            padding: .3rem 0;
            border-bottom: 1px dashed #F2F2F2;
            h3 {
              font-family: 'dingzitiblod';
              margin-bottom: .2rem;
            }
            > div {
              margin-bottom: .2rem;
              img {
                width: 75pt;
                height: 60pt;
                border-radius: 3px;
              }
              > div {
                margin-left: .2rem;
                position: relative;
                width: calc(100% - 75pt);
                h4,a,span {
                  font-family: 'dingzitiblod';
                }
                a {
                  position: absolute;
                  right: 0;
                  top: 0;
                  color: #CF2E33;
                }
                span {
                  display: inline-block;
                  font-size: 14px;
                  color: #9B9B9B;
                  margin-top: 5px;
                }
              }
            }
          }
        }
      }
      .footer {
        border-top: 2px solid #F2F2F2;
        /*background-color: rebeccapurple;*/
        color: #808080;
        > div {
          width: 60px;
          margin: .1rem auto;
          text-align: center;
          a {
            display: inline-block;
            width: 30px;
            height: 30px;
            @include houseBg('lishihetong.png');
            &:active {
              @include houseBg('lishihetong-lan.png');
            }
          }
          h5 {
            font-size: 14px;
            font-family: 'dingzitiblod';
          }
        }
      }
    }
  }
</style>
