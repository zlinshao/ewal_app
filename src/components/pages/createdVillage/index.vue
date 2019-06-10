<template>
  <div id="createdVillage">
    <div class="createdVillage" :style="htmlCss">
      <div class="top bgColor"></div>
      <div class="top shaw"></div>
      <div class="main">
        <div class="mainList">
          <!--显示formatData -->
          <div v-if="item.showForm === 'formatData'" v-for="(item,index) in drawSlither">
            <!--select 下拉选择-->
            <div v-if="(item.picker && item.readonly) || item.disabled">
              <zl-input
                v-model="formatData[item.keyName]"
                @focus="choosePicker(item)"
                :key="index"
                :type="item.type"
                :label="item.label"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :placeholder="item.placeholder">
                <div class="zl-button" v-if="item.button">{{item.button}}</div>
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
            <div v-else>
              <zl-input
                :key="index"
                v-model="formatData[item.keyName]"
                :type="item.type"
                :label="item.label"
                :id="item.keyName"
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
            </div>
          </div>
          <!--显示form -->
          <div v-else>
            <!--select 下拉选择-->
            <div v-if="(item.picker && item.readonly) || item.disabled">
              <zl-input
                :key="index"
                v-model="form[item.keyName]"
                @focus="choosePicker(item)"
                :type="item.type"
                :label="item.label"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
            <!--上传-->
            <div v-else-if="item.picker === 'upload' && item.photos" class="uploadForm">
              <div v-for="upload in item.photos" class="flex">
                <Upload :file="upload" :close="!villagePhoto" @success="getImgData"></Upload>
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
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
              <div class="zl-button" v-if="item.button">{{item.button}}</div>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
          </div>
          <div id="container" style="width: 100%;height: 4.2rem;margin-top: .3rem;"></div>
        </div>
        <div class="commonBtn" :class="{'footerStatic': keyUpStatus}">
          <p class="btn back" @click="onCancel()">取消</p>
          <p class="btn reset" @click="resetting()">重置</p>
          <p class="btn" @click="okAddVillage">确定</p>
          <i></i>
          <b></b>
        </div>
      </div>
    </div>

    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>

  </div>
</template>

<script>

  export default {
    name: "created-village",
    components: {},
    data() {
      return {
        htmlCss: {},
        map: null,
        villagePhoto: false,
        form: {},
        village: '',
        formatData: {},               //DOM显示数据
        showData: {},
        drawSlither: [],

        pickerModule: false,          //正常 select 下拉框
        pickers: {},

        province: [],
        city: [],
        district: [],
      }
    },
    created() {

    },
    mounted() {

    },
    activated() {
      this.htmlCss = this.mainListHeight();
      this.htmlCss.width = window.innerWidth + 'px';
      this.resetting();
    },
    watch: {
      'formatData.village'() {
        this.form.address = '';
      }
    },
    computed: {
      keyUpStatus() {// 底部定位
        return this.$store.state.app.key_up_status;
      },
      personal() {// 个人信息
        return this.$store.state.app.personalDetail;
      },
    },
    methods: {
      // 定位
      getVillageLocation() {
        let that = this;
        // 高德地图
        this.map = new AMap.Map("container", {
          resizeEnable: true
        });
        //输入提示
        let autoOptions = {
          input: "village_name",
          city: this.village || this.personal.city_name,
        };
        let auto = new AMap.Autocomplete(autoOptions);
        let placeSearch = new AMap.PlaceSearch({
          map: this.map
        });
        //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          that.formatData.village_name = e.poi.name;
          that.form.village_name = e.poi.name;
          that.form.address = e.poi.address;
          that.form.longitude = e.poi.location.lng;
          that.form.latitude = e.poi.location.lat;
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        }
      },
      // show picker
      choosePicker(val) {
        this.$closePicker().then(res => {
          this.pickers = res;
          this.pickerModule = true;
          this.inputSelect(val).then(picker => {
            this.pickers = picker;
          });
        })
      },
      // 确认选择
      onConfirm(value, show) {
        this.pickerModule = false;
        if (value !== 'close') {
          this.form = value;
          this.formatData = show;
          let name = this.pickers.keyName;
          if (name === 'province') {
            this.closeSelect();
            this.$httpZll.getAllCityList({province: value.province.id}).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.city_id] = val.city_name;
              }
              dicties.city = data;
            });
          }
          if (name === 'city') {
            this.village = value.city.name;
            this.getVillageLocation();
            this.closeSelect('city');
            this.$httpZll.getAllCityList({province: this.form.province.id, city: value.city.id}).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.city_id] = val.city_name;
              }
              dicties.district = data;
            });
          }
          if (name === 'district') {
            this.$httpZll.getAllCityList({
              province: this.form.province.id,
              city: this.form.city.id,
              area: value.district.id
            }).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.area_id] = val.area_name;
              }
              dicties.region = data;
            });
          }
        }
      },
      closeSelect(val) {
        this.form.district = {
          id: '',
          name: ''
        };
        this.formatData.district = '';
        if (val === 'city') return;
        this.form.city = {
          id: '',
          name: ''
        };
        this.formatData.city = '';
        this.formatData.village_name = '';
        dicties.district = {};
        if (val === 'district') return;
        this.form.region = {
          id: '',
          name: '',
        };
        this.formatData.region = '';
        dicties.region = {};
      },
      onCancel() {
        this.resetting();
        this.$router.go(-1);
      },
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 提交
      okAddVillage() {
        this.form.village_name = this.formatData.village_name;
        if (this.$attestationKey(this.drawSlither)) return;
        this.$httpZll.newAddVillage(this.form).then(res => {
          if (res.success) {
            this.resetting();
            this.$router.go(-1);
          }
        })
      },
      // 初始化数据
      resetting() {
        this.villagePhoto = true;
        setTimeout(_ => {
          this.villagePhoto = false;
        }, 100);
        this.drawSlither = this.jsonClone(defineNewAddVillage);
        let all = this.initFormData(this.drawSlither, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        this.getVillageLocation();
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #createdVillage {
    .createdVillage {
      background: linear-gradient(135deg, rgba(137, 164, 255, 1) 0%, rgba(69, 112, 254, 1) 100%);

      .top {
        position: fixed;
        top: .4rem;
        left: .1rem;
        right: .1rem;
        height: .24rem;
        @include radius(1rem);
      }

      .top.bgColor {
        background-color: #001A6E;
        z-index: 1;
      }

      .top.shaw {
        background: linear-gradient(360deg, rgba(0, 26, 110, 0) 0%, rgba(0, 26, 110, 1) 100%);
        z-index: 3;
      }

      .main {
        position: fixed;
        top: .48rem;
        left: .3rem;
        right: .3rem;
        bottom: 0;
        z-index: 2;
        padding-top: .2rem;
        border-radius: .1rem .1rem 0 0;
        background-color: #FFFFFF;
        @include flex('bet-column');

        .mainList {
          height: 100%;
          @include scroll;
        }

        .commonBtn {
          position: relative;
          padding: .45rem 0;
          margin-top: .3rem;
          border-top: .01rem dashed #C6CAD8;

          i, b {
            position: absolute;
            top: -.15rem;
            width: .3rem;
            height: .3rem;
            @include radius(50%);
          }

          i {
            left: -.15rem;
            background-color: #6387FF;
          }

          b {
            right: -.15rem;
            background-color: #4A74FE;
          }
        }

        .footerStatic {
          b, i {
            display: none;
          }
        }
      }
    }
  }
</style>
