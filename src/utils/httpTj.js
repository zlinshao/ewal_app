import httpService from './httpService.js';
import common from "./myUtils";

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

let url_upload = globalConfig.server;//文件上传
let url_code = globalConfig.server_code;//报备标识码
let market = globalConfig.server_market; //报备
let url = globalConfig.server_hr;//人资组织机构
let url_done = globalConfig.server_done;//小飞 待办

class httpTj extends httpService {

  // 所有字典
  // static getAllDict() {
  //   return new Promise((resolve, reject) => {
  //     this.get(`${market}v1.0/market/dictionary/parent_son`).then(res => {
  //       if (res.success) {
  //         resolve(res.data);
  //       } else {
  //         $httpPrompt(res.message);
  //       }
  //     })
  //   })
  // }
  static getQuestionnaireList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url}questionnaire`, params,'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  //获取问卷详情
  static getQuestionnaireDetail(id) {
    return new Promise((resolve, reject) => {
      this.get(`${url}questionnaire/${id}`, {},'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.msg);
        }
      })
    })
  }
  //提交问卷 =》 用户作答接口
  static submitQuestionnaire(params) {
    return new Promise((resolve,reject)=> {
      this.post(`${url}questionnaire/submit`,params,'prompt').then(res=> {
        if(res.data.code.endsWith('0')) {
          resolve(res.data);
        }else {
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  //获取考试列表
  static getExamList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url}train/exam`, params,'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.msg);
          resolve(false);
        }
      })
    })
  }
  //获取考试详情
  static getExamDetail(id) {
    return new Promise((resolve, reject) => {
      this.get(`${url}train/exam/${id}`, {},'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  //生成试卷
  static generateExam(id,params) {
    return new Promise((resolve,reject)=> {
      this.get(`${url}train/exam/${id}/generate`,params,).then(res=> {
        if(res.data.code.endsWith('0')) {
          resolve(res.data);
        }else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  };

  //提交考试 =》 用户作答接口
  static submitExam(id,params) {
    return new Promise((resolve,reject)=> {
      this.put(`${url}train/exam/set/${id}`,params,'prompt').then(res=> {
        if(res.data.code.endsWith('0')) {
          resolve(res.data);
        }else {
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

}

export default httpTj
