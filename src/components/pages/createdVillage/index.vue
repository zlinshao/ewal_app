<template>
  <div id="createdVillage">
    <div class="createdVillage" :style="mainListHeight()">
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
            <div v-else-if="item.picker === 'album' && item.value" class="uploadForm">
              <div v-for="upload in item.photos" class="flex">
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
          <p class="btn back" @click="resetting();$router.go(-1)">取消</p>
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
        map: null,
        form: {},
        formatData: {},               //DOM显示数据
        showData: {},
        album: {},
        drawSlither: [              //表单数据
          {
            label: '省',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'province',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '市',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'city',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '区/县',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'area',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '区域',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'region',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '小区名称',
            placeholder: '必填 请输入',
            keyName: 'village_name',
            keyType: '',
            type: 'text',
            showForm: 'formatData',//picker 显示form 或 formatData
            status: '',
            slot: '',
          },
          {
            label: '小区别名',
            placeholder: '请输入',
            keyName: 'village_alias',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '街道地址',
            placeholder: '已禁用',
            keyName: 'address',
            disabled: 'disabled',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '建筑年限',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'built_year',
            keyType: '',
            type: 'text',
            status: 'objInt',
            picker: 'picker',
            slot: '',
          },
          {
            label: '房屋类型',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'property_type',
            keyType: '',
            type: 'text',
            status: 'objInt',
            picker: 'picker',
            showForm: 'formatData',//picker 显示form 或 formatData
            slot: '',
          },
          {
            label: '总栋数',
            placeholder: '请输入',
            keyName: 'total_buildings',
            keyType: '',
            type: 'text',
            status: '',
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
            label: '物业公司',
            placeholder: '必填 请输入',
            keyName: 'property_com',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '开发商',
            placeholder: '必填 请输入',
            keyName: 'developers',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '小区房屋数量',
            placeholder: '必填 请输入',
            keyName: 'total_houses',
            keyType: '',
            type: 'number',
            status: '',
            slot: '',
          },
          {
            label: '周边信息',
            placeholder: '请输入',
            keyName: 'peripheral_info',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '地铁路线',
            placeholder: '请输入',
            keyName: 'subway_road',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '详情',
            placeholder: '必填 请输入',
            keyName: 'content',
            keyType: '',
            type: 'textarea',
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
            keyName: 'album',
            keyType: {},
            picker: 'album',
            photos: [
              {
                label: '小区照片',
                placeholder: '必填',
                keyName: 'village_photo',
              }, {
                label: '房屋照片',
                placeholder: '必填',
                keyName: 'house_pic',
              }, {
                label: '调研报告',
                placeholder: '可选文件',
                keyName: 'files',
              }
            ]
          },
        ],

        pickerModule: false,          //正常 select 下拉框
        pickers: {
          title: '',                  //picker标题
          type: '',                   //字典类型
          keyName: '',                //字段名
          parentKey: '',              //父级 字段名 变化有picker
          columns: [],                //下拉框选择文本列表
          ids: [],                    //当前字典所有id
          index: '',                  //变化下标
        },

        province: [],
        city: [],
        area: [],
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
      this.getVillageLocation();
    },
    activated() {

    },
    watch: {},
    computed: {
      keyUpStatus() {// 底部定位
        return this.$store.state.app.key_up_status;
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
          input: "village_name"
        };
        let auto = new AMap.Autocomplete(autoOptions);
        let placeSearch = new AMap.PlaceSearch({
          map: this.map
        });
        //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          let name = that.formatData.city;
          if (e.poi.name.startsWith(name)) {
            that.formatData.village_name = e.poi.name;
          } else {
            that.formatData.village_name = that.formatData.city + e.poi.name;
          }
          that.form.village_name = e.poi.name;
          that.form.longitude = e.poi.location.lng;
          that.form.latitude = e.poi.location.lat;
          that.form.address = e.poi.address;
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        }
      },
      // show picker
      choosePicker(val) {
        this.pickerModule = true;
        this.pickers = this.inputSelect(this.pickers, val);
      },
      // 确认选择
      onConfirm(value, show) {
        this.onCancel();
        if (value !== 'close') {
          this.form = value;
          this.formatData = show;
          let name = this.pickers.keyName;
          if (name === 'province') {
            this.closeSelect();
            this.$httpZll.getAllCityList({province: value.province}).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.city_id] = val.city_name;
              }
              dicties['city'] = data;
            });
          }
          if (name === 'city') {
            this.formatData.village_name = show.city;
            this.closeSelect('city');
            this.$httpZll.getAllCityList({province: this.form.province, city: value.city}).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.area_id] = val.area_name;
              }
              dicties['area'] = data;
            });
          }
          if (name === 'area') {
            this.$httpZll.getAllCityList({
              province: this.form.province,
              city: this.form.city,
              area: value.area
            }).then(res => {
              let data = {};
              for (let val of res.data) {
                data[val.region_id] = val.region_name;
              }
              dicties['region'] = data;
            });
          }
        }
      },
      closeSelect(val) {
        this.form.area = '';
        this.formatData.area = '';
        if (val === 'city') return;
        this.form.city = '';
        this.formatData.city = '';
        this.formatData.village_name = '';
        dicties.area = {};
        if (val === 'area') return;
        this.form.region = '';
        this.formatData.region = '';
        dicties.region = {};
      },
      onCancel() {
        this.pickerModule = false;
      },
      getImgData(val) {
        this.form.album[val[0]] = val[1];
      },
      // 提交
      okAddVillage() {
        this.$httpZll.newAddVillage(this.form).then(res => {
          if (res.success) {
            this.resetting();
            this.$router.go(-1);
          }
        })
      },
      // 初始化数据
      resetting() {
        this.drawForm = this.jsonClone(this.drawSlither);
        let all = this.initFormData(this.drawForm, this.showData, 'noStaff');
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
