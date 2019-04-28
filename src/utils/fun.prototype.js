import {ImagePreview} from 'vant';
import PickerSlot from '../components/common/picker-slot.vue';
import ZlInput from '../components/common/zl-input.vue';
import PickerInput from '../components/common/picker-input.vue';
import ChooseTime from '../components/common/chooseTime.vue';
import Picker from '../components/common/picker.vue';
import Upload from '../components/common/upload.vue';
import FloatButton from '../components/common/floatButton.vue';
import ScrollLoad from '../components/common/scrollLoad'

export default {
  install(Vue, options) {
    let urls = globalConfig.login;
    // 全局组件
    Vue.component('picker', Picker);//正常picker
    Vue.component('picker-slot', PickerSlot);//带表单 弹出窗
    Vue.component('zl-input', ZlInput);//input 表单
    Vue.component('picker-input', PickerInput);//弹窗里 input 布局
    Vue.component('choose-time', ChooseTime);//时间选择
    Vue.component('Upload', Upload);//上传
    Vue.component('float-button', FloatButton);//可拖動唯一标识码
    Vue.component('scroll-load', ScrollLoad);//滚动条加载
    // 加入历史栈 跳转
    Vue.prototype.routerLink = function (url, data) {
      if (data) {
        this.$router.push({path: url, query: data});
      } else {
        this.$router.push(url);
      }
    };
    Vue.prototype.goToTop = function () {
      let mainContent = document.getElementById('mainContent');
      mainContent.scrollTop = 0;
    };
    // 关闭当前页面 跳转
    Vue.prototype.routerReplace = function (url, data) {
      if (data) {
        this.$router.replace({path: url, query: data});
      } else {
        this.$router.replace(url);
      }
    };
    // 钉钉 路由返回
    Vue.prototype.goBack = function (url = '/index', data) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url, query: data});
      });
      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess() {
          that.$router.push({path: url, query: data});
        },
      });
    };
    // 获取form个人信息
    Vue.prototype.getPersonal = function (form, data) {
      for (let key of Object.keys(data)) {
        form[key] = data[key];
      }
      return form;
    };
    // 容器高度 计算
    Vue.prototype.mainListHeight = function (remove = 0) {
      return {height: (Number(sessionStorage.windowHeight) - remove) + 'px'};
    };
    // 手机类型
    Vue.prototype.phoneType = function () {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        return 'android'
      }
      if (isIOS) {
        return 'ios'
      }
    };
    // 克隆数据/JSON数据转换
    Vue.prototype.jsonClone = function (val) {
      return JSON.parse(JSON.stringify(val));
    };
    // 复选
    Vue.prototype.checkChooseCommon = function (item, value) {
      if (value.length) {
        if (value.includes(item)) {
          let index = value.indexOf(item);
          value.splice(index, 1);
        } else {
          value.push(item);
        }
      } else {
        value.push(item);
      }
    };
    // 去打卡数据重组
    Vue.prototype.punchClockHandlerData = function (data, task) {
      let arr = [];
      if (!task) {
        task = ['title', 'flow_type', 'task_title', 'task_action', 'ctl_detail_request_url', 'outcome'];
      }
      for (let item of data) {
        let obj = {};
        obj.name = item.name;
        obj.task_id = item.id;
        obj.process_id = item.rootProcessInstanceId;
        for (let key of item.variables) {
          if (task.includes(key.name)) {
            obj[key.name] = key.value;
          }
        }
        arr.push(obj);
      }
      return arr;
    };
    //自动获取用户IP，返回当前城市
    Vue.prototype.getBeforeCity = function (data = []) {
      return new Promise((resolve, reject) => {
        let obj = {};
        obj.name = '';
        obj.city = [];
        obj.location = [];
        let mapObj = new AMap.Map('iCenter');
        //自动获取用户IP，返回当前城市
        mapObj.plugin('AMap.Geolocation', function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            showMarker: false,
            showButton: false,
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', function (res) {
            let address = res.addressComponent;
            obj.location[0] = res.position.lng;
            obj.location[1] = res.position.lat;
            for (let city of data) {
              console.log(address.city.includes(city.name));
              if (address.city.includes(city.name)) {
                if (Array.isArray(city.code)) {
                  obj.city = city.code;
                  obj.name = city.name;
                } else {
                  obj.city.push(city.code);
                  obj.name = city.name;
                }
              }
            }
            resolve(obj);
          });
          AMap.event.addListener(geolocation, 'error', function (err) {
            obj.city = [320100];
            obj.name = '南京';
            obj.location = [118.734235, 31.984095];
            resolve(obj);
          });
        });
      })
    };
    // 初始化数据
    Vue.prototype.initFormData = function (drawForm, showForm, noStaff) {
      let form = {};
      let album = {};
      let formatData = this.jsonClone(showForm);
      let value = [];
      for (let item of drawForm) {
        if (item.moreString) {
          for (let str of item.moreString) {
            form[str.keyName] = str.keyType;
            if (item.showForm) {
              formatData[str.keyName] = str.keyType;
            }
          }
        } else if (item.moreArray) {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = this.jsonClone(item.keyType);
          for (let arr of item.moreArray) {
            form[item.keyName].push(arr.keyType);
            formatData[item.keyName] = '';
          }
        } else if (item.picker === 'upload') {
          for (let up of item.value) {
            form[up.keyName] = [];
            album[up.keyName] = [];
          }
        } else if (item.picker === 'album') {
          // 新建小区
          form[item.keyName] = item.keyType;
          album[item.keyName] = item.keyType;
          for (let up of item.value) {
            form[item.keyName][up.keyName] = [];
            album[item.keyName][up.keyName] = [];
          }
        } else if (item.value) {
          value = item.value;
          for (let val of item.value) {
            form[val.key] = val.num;
          }
        } else if (item.checks) {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = ''
        } else if (item.children) {
          let obj = {};
          let child = [];
          for (let key of item.children) {
            for (let con of key) {
              obj[con.keyName] = con.keyType;
            }
          }
          child.push(obj);
          form[item.keyName] = child;
          formatData[item.keyName] = this.jsonClone(child);
        } else {
          if (item.status === 'obj') {
            form[item.keyName] = {
              id: '',
              name: '',
            };
          } else if (item.keyName === 'floors') {
            form.floor = '';
            form.floors = '';
          } else {
            if (item.keyName) {
              form[item.keyName] = item.keyType;
            }
          }
          if (item.showForm) {
            formatData[item.keyName] = item.keyType || '';
            if (item.keyType && dicties[item.keyName]) {
              formatData[item.keyName] = dicties[item.keyName][Number(item.keyType)] || '';
            }
          }
        }
      }
      if (!noStaff) {
        this.getPersonal(form, this.$store.state.app.personal);
      }
      return {form, formatData, value, album};
    };
    // 预填数据处理
    Vue.prototype.changeHandle = function (res, item, val, all, data) {
      let formatData = data;
      for (let slither of Object.keys(all)) {
        for (let list of all[slither]) {
          if (list.keyName === item) {
            for (let i = 1; i < res[item].length; i++) {
              list.children.push(list.children[0]);
            }
          }
        }
      }
      formatData[item] = this.jsonClone(res[item]);
      res[item].forEach((key, idx) => {
        for (let key of val) {
          formatData[item][idx][key] = dicties[key][res[item][idx][key]];
        }
      });
      return formatData;
    };
    // 下拉框数据显示 picker 配置
    Vue.prototype.inputSelect = function (pickers, val, num, parentKey) {
      pickers.keyName = val.keyName;
      pickers.status = val.status;
      pickers.title = val.label;
      pickers.index = num;
      pickers.parentKey = parentKey || '';
      if (val.status.includes('arrs')) {
        let index = val.status.split('-');
        pickers.columns = [];
        for (let i = 0; i < index.length - 1; i++) {
          let obj = {};
          obj.values = dicties[val.keyName]['value_' + i];
          obj.className = 'column' + (i + 1);
          obj.defaultIndex = Number(index[i + 1]);
          pickers.columns.push(obj);
        }
      } else {
        if (val.status === 'arr') {
          pickers.columns = dicties[val.keyName];
        } else {
          if (dicties[val.keyName]) {
            pickers.columns = Object.values(dicties[val.keyName]);
            pickers.ids = Object.keys(dicties[val.keyName]);
          }
        }
      }
      return pickers;
    };
    // 查看大图
    Vue.prototype.$bigPhoto = function (val, uri) {
      console.log(val);
      let images = [];
      for (let item of val) {
        if (item.info && item.info.mime) {
          if (item.info.mime.includes('image')) {
            images.push(item.uri);
          }
        } else {
          if (item.mime.includes('image')) {
            images.push(item.uri);
          }
        }
      }
      let index = images.indexOf(uri);
      ImagePreview({
        images: images,
        startPosition: index,
        onClose() {
        }
      });
    };
    // loading/Toast 提示信息
    Vue.prototype.$prompt = function (msg, type) {
      this.myUtils.prompt(msg, type);
    };

    // 钉钉认证
    Vue.prototype.personalGet = function () {
      let that = this;
      dd.biz.navigation.setRight({show: false});
      return new Promise((resolve, reject) => {
        that.$http.get(urls + 'special/special/dingConfig').then((res) => {
          let _config = res;
          dd.config({
            agentId: _config.agentId, // 必填，微应用ID
            corpId: _config.corpId,//必填，企业ID
            timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
            nonceStr: _config.nonceStr, // 必填，生成签名的随机串
            signature: _config.signature, // 必填，签名
            jsApiList: ['biz.cspace.saveFile', 'biz.cspace.preview'] // 必填，需要使用的jsapi列表，注意：不要带dd。
          });
          dd.ready(function () {
            dd.runtime.permission.requestAuthCode({
              corpId: _config.corpId,
              onSuccess(info) {
                that.$http.get(urls + 'special/special/userInfo', {
                  code: info.code,
                }).then((res) => {
                  if (res) {
                    if (res.status !== 'fail') {
                      that.personalData(res, resolve);
                    } else {
                      alert('读取信息失败，稍后再试！');
                      that.closeDD();
                    }
                  } else {
                    setTimeout(() => {
                      alert('请求超时请稍后再试');
                      that.closeDD();
                    }, 3000);
                  }
                })
              },
              onFail(err) {
                alert('您不在系统内，请联系管理员添加！！');
                that.closeDD();
              }
            });
          });
          dd.error(function (err) {
            alert('dd error: ' + JSON.stringify(err));
          });
        });
      });
    };
    // 存储个人信息
    Vue.prototype.personalData = function (res, resolve) {
      let data = {};
      let info = res.data;
      data.avatar = info.avatar;
      data.phone = info.phone;
      data.staff_id = info.id;
      data.staff_name = info.name;
      data.department_name = info.org[0].name;
      data.department_id = info.org[0].id;
      this.$store.dispatch('personal_storage', JSON.stringify(data));
      resolve(true);
    };
    // 关闭钉钉
    Vue.prototype.closeDD = function () {
      dd.biz.navigation.close({});
    };
  }
}