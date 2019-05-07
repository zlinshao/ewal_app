<template>
  <div id="goSignContract">
    <van-popup v-model="popupModule" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="popupModule">
      <div class="moduleTop">
        <span>带看打卡</span>
        <b></b>
        <i></i>
      </div>
      <div class="container">
        <div id="container"></div>
      </div>
      <div class="main">
        <div class="detail" :class="item.name" v-for="item of villageDetail">
          <label class="labelTitle">{{villageInfo[item.name]}}</label>
          <div v-if="!item.name.includes('photo')">
            {{item.value}}
          </div>
          <div class="photo" v-else>
            <p v-for="pic in item.value">
              <img :src="pic.uri" @click="$bigPhoto(item.value,pic.uri)">
            </p>
          </div>
        </div>
      </div>
      <div class="commonBtn">
        <div class="btn" :class="item.route" v-for="item in taskAction.outcomeOptions"
             @click="actions(taskAction.variableName, item)">
          {{item.title}}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "go-sign-contract",
    props: ['module', 'detail'],
    data() {
      return {
        popupModule: false,
        allDetail: {},
        taskAction: {},
        villageDetail: [],
        villageInfo: {
          punch_clock_time: '打卡时间',
          punch_clock_address: '打卡地点',
          property_fee: '物业费',
          property_phone: '物业电话',
          remark: '备注',
          look_photo: '带看照片',
        },
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
        this.allDetail = val;
        let btn = '';
        if (val.outcome) {
          btn = '';
          this.taskAction = JSON.parse(val.outcome);
        } else {
          btn = 'no';
        }
        this.getDetail(val.ctl_detail_request_url, btn);
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    computed: {},
    methods: {
      // 去签署
      actions(key = '', action = {}) {
        let postData = {};
        postData.action = 'complete';
        postData.variables = [{
          name: key,
          value: action.action,
        }];
        this.$httpZll.finishBeforeTask(this.allDetail.task_id, postData).then(_ => {
          if (action.route === 'back') {
            this.$emit('close', 'again');
          } else {
            let params = {
              taskDefinitionKey: 'InputBulletinData',
              rootProcessInstanceId: this.allDetail.root_id,
            };
            this.$httpZll.getNewTaskId(params).then(res => {
              if (!res.data.length) {
                this.$prompt('未找到签约信息！');
                return;
              }
              let data = res.data[0];
              this.allDetail.task_id = data.id;
              this.allDetail.process_instance_id = data.processInstanceId;
              this.allDetail.root_process_instance_id = data.rootProcessInstanceId;
              this.$store.dispatch('bulletin_type', bulletinRouterStatus.newCollect);
              this.$store.dispatch('task_detail', this.allDetail);
              this.routerReplace(action.route);
              this.$emit('close');
            });
          }
        })
      },
      // 获取任务详情
      getDetail(api, btn) {
        this.$httpZll.get(api).then(res => {
          let address = {};
          if (res.success) {
            if (btn) {
              this.$prompt('当前报备暂不能签约！');
            }
            let content = res.data.content;
            let arr = ['property_fee', 'property_phone'];
            if (content.add_data) {
              for (let item of content.add_data) {
                if (arr.includes(item.name)) {
                  content[item.name] = item.value;
                }
              }
            }
            this.allDetail.content = content;
            let community = res.data.content.community;
            address.location = [community.longitude, community.latitude];
            address.village_name = community.village_name;
            this.villageDetail = res.data.content.add_data || [];
            for (let item of this.villageDetail) {
              if (item.name.includes('photo')) {
                this.$httpZll.getUploadUrl(item.value, btn).then(res => {
                  if (res) {
                    item.value = res.data;
                  } else {
                    item.value = [];
                  }
                })
              }
            }
          } else {
            this.allDetail.content = {};
            this.villageDetail = [];
            this.$prompt(res.message);
          }
          this.getLocation(address);
        })
      },
      // 地图定位
      getLocation(val) {
        let location = val.location;
        let map = new AMap.Map('container', {
          resizeEnable: true,
          center: location,
        });
        // 打卡位置
        let villageContent =
          `<div class="icon_location villageContent">
              <div>${val.village_name}</div>
             </div>`;
        let villageMarker = new AMap.Marker({
          position: location,
          // 将 html 传给 content
          content: villageContent,
          // 以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-20, -30)
        });
        map.add(villageMarker);
        map.setFitView();//根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  @mixin goSignImg($n) {
    @include bgImage('../../../../assets/image/toBeDoneList/goSignContract/'+$n+'.png');
  }

  #goSignContract {
    .popupModule {
      right: 0;
      left: 1rem;
      height: 100%;
      @include radius(.2rem 0 0 .2rem);
      background-color: #43A046;
      @include flex('bet-column');
      .moduleTop {
        position: relative;
        min-height: 2rem;
        @include flex('justify-center');
        align-items: flex-end;
        padding: .45rem;
        font-size: .36rem;
        color: #FFFFFF;
        b, i {
          position: absolute;
        }
        b {
          top: 0;
          right: 1rem;
          width: .6rem;
          height: 1.5rem;
          z-index: 3;
          @include goSignImg('yiwancheng');
        }
        i {
          right: 0;
          bottom: -1.1rem;
          width: 1.6rem;
          height: 2.2rem;
          z-index: 1;
          @include goSignImg('yiwanchengzhiwen');
        }
      }
      .container, .main, .commonBtn {
        background-color: #FFFFFF;
      }
      .container {
        @include radius(.3rem .3rem 0 0);
        min-height: 3.3rem;
        padding-bottom: .3rem;
        overflow: hidden;
        #container {
          height: 100%;
        }
      }
      .main {
        @include scroll;
        height: 100%;
        .detail {
          @include flex('items-center');
          min-height: .6rem;
          padding: .1rem .3rem .1rem 0;
          div {
            margin-left: .3rem;
          }
          .photo {
            @include flex('items-center');
            flex-wrap: wrap;
            p {
              margin: 0 .2rem .2rem 0;
              width: 1rem;
              height: 1rem;
              img {
                @include radius(.1rem);
              }
            }
          }
        }
        .look_photo {
          margin-top: .2rem;
          align-items: flex-start;
        }
      }
      .commonBtn {
        padding: .3rem;
        flex-direction: row-reverse;
      }
    }
  }
</style>
