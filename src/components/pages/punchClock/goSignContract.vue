<template>
  <div id="goSignContract">
    <div id="container" ref="container"></div>
    <div class="main" :style="mainHeight">
      <div class="punchClockInfo">
        <div class="scroll_bar">
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
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "go-sign-contract",
    data() {
      return {
        mainHeight: '',
        allDetail: {},
        villageDetail: [],
        villageInfo: {
          punch_clock_time: '打卡时间',
          punch_clock_address: '打卡地点',
          property_fee: '物业费',
          property_phone: '物业电话',
          remark: '备注',
          look_photo: '带看照片',
        },
        flow_type: '',
        taskAction: {}
      }
    },
    mounted() {
      let main = this.$refs.container.offsetHeight;
      this.mainHeight = this.mainListHeight(main);
    },
    activated() {
      let query = this.$route.query;
      let api = query.ctl_detail_request_url;
      this.flow_type = query.flow_type;
      this.allDetail.task_id = query.task_id;
      this.allDetail.root_id = query.root_id;
      this.getVillageDetail(api);
      if (!query.outcome) return;
      this.taskAction = JSON.parse(query.outcome);
    },
    watch: {},
    computed: {},
    methods: {
      // 去签署
      actions(key = '', action = {}) {
        let data = {}, postData = {};
        postData.variables = [];
        data.name = key;
        data.value = action.action;
        postData.variables.push(data);
        postData.action = 'complete';
        this.$httpZll.finishBeforeTask(this.allDetail.task_id, postData).then(_ => {
          if (action.route === 'back') {
            this.$router.go(-1);
          } else {
            let params = {
              taskDefinitionKey: 'InputBulletinData',
              rootProcessInstanceId: this.allDetail.root_id,
            };
            this.$httpZll.getNewTaskId(params).then(res => {
              this.allDetail.task_id = res.data[0].id;
              this.$store.dispatch('bulletin_draft', this.allDetail);
              this.routerReplace('/collectReport');
            });
          }
        })
      },
      getVillageDetail(api) {
        this.$httpZll.get(api).then(res => {
          let address = {};
          if (res.success) {
            this.allDetail.content = res.data.content;
            let community = res.data.content.community;
            address.location = [community.longitude, community.latitude];
            address.village_name = community.village_name;
            this.villageDetail = res.data.content.add_data;
            for (let item of this.villageDetail) {
              if (item.name.includes('photo')) {
                this.$httpZll.getUploadUrl(item.value).then(res => {
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
  @import "../../../assets/scss/common.scss";

  #goSignContract {
    #container {
      height: 4.2rem;
    }
    .main {
      position: fixed;
      top: 4.2rem;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 300;
      background: linear-gradient(135deg, rgba(137, 164, 255, 1) 0%, rgba(69, 112, 254, 1) 100%);
      .punchClockInfo {
        padding-top: .2rem;
        position: absolute;
        top: -.8rem;
        left: .3rem;
        right: .3rem;
        bottom: .6rem;
        @include radius(.1rem);
        background-color: #FFFFFF;
        @include flex('bet-column');
        .detail {
          @include flex('items-center');
          min-height: .88rem;
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
          margin-top: .3rem;
          align-items: flex-start;
        }
        .commonBtn {
          flex-direction: row-reverse;
          padding: .36rem 0;
        }
      }
    }
  }
</style>
