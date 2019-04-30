<template>
  <div id="punchClock">
    <!--高德地图-->
    <div id="container" ref="con" :class="[successPunchClock?'hover':'']"></div>
    <div>
      <!--填写打卡信息-->
      <div class="main" v-if="successPunchClock">
        <div class="punchClockInfo">
          <div class="scroll_bar">
            <!--显示formatData -->
            <div v-if="item.showForm === 'formatData'" v-for="(item,index) in drawSlither">
              <zl-input
                :key="index"
                v-model="formatData[item.keyName]"
                :type="item.type"
                :label="item.label"
                :id="item.keyName"
                :disabled="item.disabled"
                :readonly="item.readonly"
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
            </div>
            <!--显示form -->
            <div v-else>
              <!--上传-->
              <div v-if="item.picker === 'upload' && item.value" class="uploadForm">
                <div v-for="upload in item.value" class="flex">
                  <Upload :file="upload" :getImg="album" @success="getImgData"></Upload>
                </div>
              </div>
              <!--普通输入框-->
              <div v-else>
                <zl-input
                  :key="index"
                  v-model="form[item.keyName]"
                  :type="item.type"
                  :label="item.label"
                  :id="item.keyName"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                  :placeholder="item.placeholder">
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
              </div>
            </div>
          </div>
          <div class="commonBtn">
            <div class="btn back" @click="successPunchClock = false">取消</div>
            <div class="btn" @click="finishPunchClock">确定</div>
          </div>
        </div>
      </div>
      <!--定位打卡-->
      <div v-else>
        <div class="againLocation" @click="getLocation(villageInfo)">
          <i></i>
          <span>重新定位</span>
        </div>
        <div class="punchClock">
          <div :class="[infraMetas ? 'infraMetas':'noInfraMetas']">
            <div @click="punchClock(infraMetas)">
              <h1 class="numberFont">{{today.substring(11)}}</h1>
              <p>{{infraMetas ? '打卡' : '不在打卡范围'}}</p>
            </div>
            <h2></h2>
            <h3></h3>
            <h3></h3>
          </div>
        </div>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        mainHeight: '',
        map: null,
        today: '',                    //打卡时间
        infraMetas: false,            //是否在打卡范围
        villageInfo: {
          location: [],
          subway_road: '',
          village_name: '',
        },//小区信息
        successPunchClock: false,     //打卡成功
        form: {},                     //生成表单
        formatData: {},               //DOM显示数据
        showData: {},
        album: {},
        drawSlither: [              //表单数据
          {
            label: '打卡时间',
            disabled: 'disabled',
            placeholder: '已禁用',
            keyName: 'punch_clock_time',
            keyType: '',
            type: 'text',
            status: '',
            picker: 'picker',
            slot: '',
          },
          {
            label: '打卡地点',
            disabled: 'disabled',
            placeholder: '已禁用',
            keyName: 'punch_clock_address',
            keyType: '',
            type: 'text',
            status: '',
            picker: 'picker',
            slot: '',
          },
          {
            label: '物业费',
            placeholder: '必填 请输入',
            keyName: 'property_fee',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '物业电话',
            placeholder: '必填 请输入',
            keyName: 'property_phone',
            keyType: '',
            type: 'number',
            status: '',
            slot: '',
          },
          {
            label: '备注',
            placeholder: '请输入',
            keyName: 'remark',
            keyType: '',
            type: 'textarea',
            status: '',
            slot: '',
          },
          {
            label: '上传',
            keyName: 'upload',
            picker: 'upload',
            value: [
              {
                label: '带看照片',
                placeholder: '必填',
                keyName: 'look_photo',
              }
            ]
          },
        ],
        postForm: {},//最终提交数据
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
    },
    activated() {
      this.startTime();
      setInterval(this.startTime, 1000);
      let query = this.$route.query;
      let api = query.ctl_detail_request_url;
      this.postForm = {};
      this.postForm.task_id = query.task_id;
      this.postForm.flow_type = query.flow_type;
      this.postForm.process_id = query.root_id;
      this.villageDetail(api);
    },
    watch: {},
    computed: {},
    methods: {
      // 确定打卡
      finishPunchClock() {
        this.postForm.variables = this.jsonClone(this.form);
        this.$httpZll.postFinishPunchClock(this.postForm).then(res => {
          if (res.success) {
            this.close_();
            this.$store.dispatch('done_tabs', '2');
            this.routerReplace('/toBeDoneList');
          }
        });
      },
      // 清空
      close_() {
        this.postForm = {};
        this.resetting();
      },
      // 带看小区信息 详情
      villageDetail(api) {
        this.successPunchClock = false;
        this.$httpZll.get(api).then(res => {
          if (res.success) {
            let village = res.data.content.community;
            this.villageInfo.location = [village.longitude, village.latitude];
            this.villageInfo.village_name = village.village_name;
            this.form.punch_clock_address = village.village_name || '';
            this.form.property_fee = village.property_fee || '';
            this.form.property_phone = village.property_phone || '';
          } else {
            this.villageInfo.location = [];
            this.villageInfo.village_name = '';
            this.form.punch_clock_address = '';
            this.form.property_phone = '';
            this.$prompt(res.message);
          }
          this.getLocation(this.villageInfo);
        })
      },
      startTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        month = this.checkTime(month);
        day = this.checkTime(day);
        m = this.checkTime(m);
        s = this.checkTime(s);
        this.today = year + '-' + month + '-' + day + ' ' + h + ":" + m + ":" + s;
      },
      checkTime(i) {
        if (i < 10) {
          i = "0" + i
        }
        return i
      },
      // 打卡
      punchClock(val) {
        if (val) {
          this.successPunchClock = true;
        } else {
          this.successPunchClock = true;
          this.form.punch_clock_time = this.today;
          let that = this;
          let con = that.$refs.con.offsetHeight;
          that.mainHeight = that.mainListHeight(con);
          this.$prompt('超出打卡范围（范围300米）')
        }
      },
      // 获取 打卡地点 员工位置
      getLocation(val) {
        let location;
        this.getBeforeCity().then(res => {
          // location = val;
          location = res.location;
          let map = new AMap.Map('container', {
            resizeEnable: true,
            center: location,
          });
          map.plugin('AMap.Geolocation', function () {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //是否使用高精度定位，默认:true
              timeout: 10000, //超过10秒后停止定位，默认：无穷大
              showMarker: false,
              showButton: false,
              showCircle: false,
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
          });
          // 员工位置
          let staffContent =
            `<div class="icon_location staffContent">
               <img src="https://aos-cdn-image.amap.com/pp/avatar/04e/7b/9a/165076233.jpeg?ver=1519641744&imgoss=1">
            </div>`;
          let staffMarker = new AMap.Marker({
            position: location,
            // 将 html 传给 content
            content: staffContent,
            // 以 icon 的 [center bottom] 为原点
            offset: new AMap.Pixel(-28, -46)
          });
          // 打卡位置
          let villageContent =
            `<div class="icon_location villageContent">
              <div>${val.village_name}</div>
             </div>`;
          let villageMarker = new AMap.Marker({
            position: val.location,
            // 将 html 传给 content
            content: villageContent,
            // 以 icon 的 [center bottom] 为原点
            offset: new AMap.Pixel(-20, -30)
          });
          // 范围
          let circle = new AMap.Circle({
            center: new AMap.LngLat(val.location[0], val.location[1]),// 圆心位置
            radius: 300, //半径
            strokeColor: "#1791fc", //线颜色
            strokeOpacity: 0.5, //线透明度
            strokeWeight: 1,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.1//填充透明度
          });
          let myLngLat = new AMap.LngLat(location[0], location[1]);
          this.infraMetas = circle.contains(myLngLat);//如果点在圆内则输出
          map.add([staffMarker, villageMarker]);
          circle.setMap(map);//显示圆圈
          map.setFitView();//根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
        });
      },
      // 图片ids
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 初始化数据
      resetting() {
        this.drawForm = this.jsonClone(this.drawSlither);
        let all = this.initFormData(this.drawForm, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #punchClock {
    #container {
      width: 100%;
      height: 10rem;
      @include transition(all .3s);
    }
    #container.hover {
      height: 4.2rem;
    }
    /*重新获取定位*/
    .againLocation {
      position: fixed;
      top: 7rem;
      right: .3rem;
      background-color: #FFFFFF;
      @include radius(1rem);
      border: .01rem solid #DDDDDD;
      padding-right: .2rem;
      z-index: 210;
      @include flex('items-center');
      i {
        width: .6rem;
        height: .6rem;
        @include bgImage('../../../assets/image/common/againLocation.png');
      }
    }
    /*打卡*/
    .punchClock {
      position: fixed;
      top: 6rem;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 36%);
      @include flex('flex-center');
      > div {
        @include flex('flex-center');
        position: absolute;
        bottom: .8rem;
        width: 3rem;
        height: 3rem;
        div {
          @include flex('flex-center');
          flex-direction: column;
          z-index: 6;
        }
        div, h2, h3, h4 {
          position: absolute;
          width: 100%;
          height: 100%;
          @include radius(50%);
        }
        h1 {
          font-size: .6rem;
          color: #FFFFFF;
          margin-bottom: .1rem;
        }
        h2, h3, h4 {
          z-index: 3;
          @include animation(circle-opacity 2s infinite);
        }
        h3 {
          animation-delay: 0.6s;
        }
        h4 {
          animation-delay: 1.1s;
        }
      }
      .infraMetas {
        div {
          background-color: #4570FE;
        }
        h2, h3, h4 {
          background-color: #d9ebff;
        }
      }
      .noInfraMetas {
        div {
          background-color: #FFC400;
        }
        h2, h3, h4 {
          background-color: #fff2c7;
        }
      }
    }
    @keyframes circle-opacity {
      0% {
        @include transform(scale(1));
        opacity: 1;
      }

      100% {
        @include transform(scale(1.3));
        opacity: 0;
      }
    }
    /*填写打卡信息*/
    .main {
      position: absolute;
      top: 4.2rem;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(137, 164, 255, 1) 0%, rgba(69, 112, 254, 1) 100%);
      .punchClockInfo {
        padding-top: .2rem;
        position: absolute;
        top: -.8rem;
        left: .3rem;
        right: .3rem;
        bottom: .6rem;
        z-index: 300;
        @include radius(.1rem);
        background-color: #FFFFFF;
        @include flex('bet-column');
        .commonBtn {
          padding: .42rem 0;
        }
      }
    }
  }
</style>
