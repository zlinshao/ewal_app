import axios from 'axios';
import common from './myUtils.js';

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

axios.defaults.timeout = 10000;

// 发送请求拦截
axios.interceptors.request.use((request) => {
  request.headers.common['Authorization'] = globalConfig.token;
  return request;
}, (err) => {
  return Promise.reject(err);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    let msg = err.response.data.msg;
    let message = err.response.data.message;
    switch (err.response.status) {
      case 400:
      case 401:
      case 403:
      case 404:
      case 405:
      case 408:
        if (msg) {
          $httpPrompt(msg);
        } else if (message) {
          $httpPrompt(message);
        } else {
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
          }
        }
        break;
      case 500:
        console.log('服务器故障');
        $httpPrompt('服务器故障');
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

let msg = '正在处理...';

class Axios {
  static get(url, data = {}, prompt = '', close = '') {
    return new Promise((resolve, reject) => {
      if (prompt) {
        msg = prompt === 'prompt' ? msg : prompt;
        $httpPrompt(msg, 'send');
      }
      axios.get(url, {params: data}).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response);
      }).catch(err => {
        reject(err);
      })
    })
  }

  static post(url, data = {}, prompt = '', close = '') {
    if (prompt) {
      msg = prompt === 'prompt' ? msg : prompt;
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
        resolve(response);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static put(url, data = {}, prompt = '', close = '') {
    if (prompt) {
      msg = prompt === 'prompt' ? msg : prompt;
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
        resolve(response);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static delete(url, data = {}, prompt = '', close = '') {
    if (prompt) {
      msg = prompt === 'prompt' ? msg : prompt;
      $httpPrompt(msg, 'send');
    }
    return new Promise((resolve, reject) => {
      axios.delete(url, {params: data}).then(response => {
        if (response.status > 399) {
          return;
        }
        if (!close) {
          $httpPrompt('', 'close');
        }
        resolve(response);
      }).catch(err => {
        console.log(err);
      })
    })
  }

  static patch(url, data = {}, prompt = '', close = '') {
    if (prompt) {
      msg = prompt === 'prompt' ? msg : prompt;
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
        resolve(response);
      }).catch(err => {
        console.log(err);
      })
    })
  }
}

export default Axios
