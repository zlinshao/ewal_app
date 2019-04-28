import axios from 'axios';
import common from './myUtils.js'

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

let url = globalConfig.server;//文件上传
let url_code = globalConfig.server_code;//报备标识码
let market = globalConfig.server_market; //报备
let url_hr = globalConfig.server_hr;//人资组织机构
let url_done = globalConfig.server_done;//小飞 待办
axios.defaults.timeout = 5000;

// 发送请求拦截
axios.interceptors.request.use((request) => {
  return request;
}, (err) => {
  return Promise.reject(err);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求');
        $httpPrompt('错误请求');
        break;
      case 401:
        console.log('未授权，请重新登录');
        $httpPrompt('未授权，请重新登录');
        break;
      case 403:
        console.log('拒绝访问');
        $httpPrompt('拒绝访问');
        break;
      case 404:
        console.log('请求错误,未找到该资源');
        $httpPrompt('请求错误,未找到该资源');
        break;
      case 405:
        console.log('请求方法未允许');
        $httpPrompt('请求方法未允许');
        break;
      case 408:
        console.log('请求超时');
        $httpPrompt('请求超时');
        break;
      case 500:
        console.log('服务器故障请联系产品经理');
        $httpPrompt('服务器故障请联系产品经理');
        break;
      case 501:
        console.log('网络未实现');
        $httpPrompt('网络未实现');
        break;
      case 502:
        console.log('网络错误');
        $httpPrompt('网络错误');
        break;
      case 503:
        console.log('服务不可用');
        $httpPrompt('服务不可用');
        break;
      case 504:
        console.log('网络超时');
        $httpPrompt('网络超时');
        break;
      case 505:
        console.log('http版本不支持该请求');
        $httpPrompt('http版本不支持该请求');
        break;
      default:
        console.log(`连接错误${err.response.status}`);
        $httpPrompt(`连接错误${err.response.status}`);
    }
  } else {
    console.log('连接到服务器失败');
    $httpPrompt('连接到服务器失败');
  }
  return Promise.resolve(err.response);
});

let msg = '正在处理..';

class Axios {
  static get(url, params = {}, noPrompt = '', close = '') {
    return new Promise((resolve, reject) => {
      if (noPrompt) {
        msg = noPrompt === 'prompt' ? msg : noPrompt;
        $httpPrompt(msg, 'send');
      }
      axios.get(url, {params: params}).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  }

  static post(url, data = {}, noPrompt = '', close = '') {
    if (noPrompt) {
      msg = noPrompt === 'prompt' ? msg : noPrompt;
      $httpPrompt(msg, 'send');
    }
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response.data);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static put(url, data = {}, noPrompt = '', close = '') {
    if (noPrompt) {
      msg = noPrompt === 'prompt' ? msg : noPrompt;
      $httpPrompt(msg, 'send');
    }
    return new Promise((resolve, reject) => {
      axios.put(url, data).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response.data);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static delete(url, data = {}, noPrompt = '', close = '') {
    if (noPrompt) {
      msg = noPrompt === 'prompt' ? msg : noPrompt;
      $httpPrompt(msg, 'send');
    }
    return new Promise((resolve, reject) => {
      axios.delete(url, data).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response.data);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static patch(url, data = {}, noPrompt = '', close = '') {
    if (noPrompt) {
      msg = noPrompt === 'prompt' ? msg : noPrompt;
      $httpPrompt(msg, 'send');
    }
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response.data);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  // 所有字典
  static getAllDict() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/dictionary/parent_son`).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 所有城市
  static getAllCityList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address`, params).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 城市列表
  static getCityList() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address/city-list`).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 新建小区
  static newAddVillage(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/community`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 小区搜索
  static searchVillageList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/community`, params, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 房屋搜索
  static searchHouseList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/house`, params, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 员工搜索
  static searchStaffList(val) {
    let params = {
      search: val,
      org_id: '',
      limit: 9999,
    };
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}staff/user`, params, 'prompt').then(res => {
        if (res.code.endsWith('0')) {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 组织架构 部门
  static getOrganization(org, status) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}organization/organization`, {
        parent_id: org
      }, status).then(res => {
        resolve(res);
      });
    });
  }

  // 新建待办任务
  static createdTask(data, name) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/task/${name}`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
        }
        resolve(res);
      });
    });
  }

  // 带看打卡 完成打卡
  static postFinishPunchClock(data) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/task/variables`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 获取 所有待办列表
  static getToBeDoneListApi(data) {
    let params = {
      title: '',
      page: 1,
      size: 12,
      // assignee: '69',//登陆人
    };
    for (let key of Object.keys(data)) {
      params[key] = data[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 获取 报备待办列表
  static getToBeDoneApi(taskKey = {}, tenant = 'market') {
    let params = {
      title: '',
      page: 1,
      size: 12,
      tenantId: tenant,
      assignee: '69',//登陆人
      // taskDefinitionKeyIn: 'CollectTakeLook,InputBulletinData,SignEC',
      taskDefinitionKeySuffix: 'TODO01',
      includeProcessVariables: true,
      includeTaskLocalVariables: true,
      order: 'desc',
    };
    for (let key of Object.keys(taskKey)) {
      params[key] = taskKey[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 完成当前任务
  static finishBeforeTask(id, data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_done}runtime/tasks/${id}`, data, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 获取去签约任务ID
  static getNewTaskId(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 审批
  static getMeInitiate(url, val = {}) {
    let params = {
      title: '',
      size: 12,
    };
    for (let key of Object.keys(val)) {
      params[key] = val[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}${url}`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 获取报备详情
  static getApprovalDetail(url) {
    return new Promise((resolve, reject) => {
      this.get(url, {}, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      })
    })
  }

  // 报备唯一标识码
  static bulletinCode = function (code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_code}api/registration/uinq_code?prefix=${code}`).then((res) => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          $httpPrompt(res.msg);
          resolve(false);
        }
      })
    })
  };

  // 收房报备 发布
  static submitReport(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/bulletin?to=collect`, data, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });
    });
  }

  // 收房报备 修改
  static putReviseReport(task_id, data) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/bulletin/${task_id}to=collect`, data, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });

    });
  }

  // 报备 草稿
  static getBulletinDraft(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/bulletin`, params, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });
    });
  }

  // 图片id获取图片地址
  static getUploadUrl(ids) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/output/file`, {ids: ids}, '', 'close').then(res => {
        if (res.success) {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 获取上传文件token
  static getToken() {
    return new Promise((resolve, reject) => {
      this.get(`${url}api/v1/token`, '').then(res => {
        if (res.code === '11020') {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.msg);
        }
      });
    });
  }

  // 上传文件
  static uploadServer(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url}api/v1/upload-direct`, data).then(res => {
        if (res.code === '110100') {
          resolve(res);
        } else {
          resolve(res);
          $httpPrompt(res.msg);
        }
      });
    });
  }
}


export default Axios
