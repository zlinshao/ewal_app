import {Toast} from 'vant';

class myUtils {
  constructor(data) {
  }

  // 提示信息
  static prompt(msg, type) {
    switch (type) {
      case 'send':
        Toast.loading({
          duration: 0,            // 持续展示 toast
          forbidClick: true,      // 禁用背景点击
          loadingType: 'spinner',
          message: msg
        });
        break;
      case 'success':
        Toast.success(msg);
        break;
      case 'fail':
        Toast.fail(msg);
        break;
      case 'close':
        Toast.clear();
        break;
      case 'err':
        Toast.clear();
        Toast('提交失败,请重新尝试!');
        break;
      default:
        Toast(msg);
        break;
    }
  }

  // 判断字符串是否为空
  static isNull(str) {
    return str === null || str.length === 0 || str === '';
  }

  // 判断是否为Number类型
  static isNum(num) {
    if (num === '') return false;
    return !Number.isNaN(Number(num));
  }

  // 计算后格式化 日期
  static formatAddRem(interval, num, date, type) {
    return this.formatDate(this.dateAdd(interval, num, date), type);
  }

  // 年月日 加减计算
  static dateAdd(interval, num, date) {
    num = Number(num);
    switch (interval) {
      case "yy":
        date.setFullYear(date.getFullYear() + num);
        return date;
      case "mm":
        date.setMonth(date.getMonth() + num);
        return date;
      case "dd":
        date.setDate(date.getDate() + num);
        return date;
      default:
        date.setDate(date.getDate() + num);
        return date;
    }
  };

  // 格式化日期 yyyy-MM-dd
  static formatDate(date, type = 'date') {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let mm = month.toString();  //月
    let dd = day.toString();    //日
    let hh = h.toString();      //时
    let md = m.toString();      //分
    let ss = s.toString();      //秒
    mm = mm[1] ? mm : '0' + mm;
    dd = dd[1] ? dd : '0' + dd;
    if (mm === '00') {
      year = year - 1;
      mm = '12';
    }
    hh = hh[1] ? hh : '0' + hh;
    md = md[1] ? md : '0' + md;
    ss = md[1] ? ss : '0' + ss;
    if (type === 'date') {
      return year + '-' + mm + '-' + dd;
    }
    return year + '-' + mm + '-' + dd + ' ' + hh + ':' + md;
  };

  // 数组去重
  static arrayWeight(array) {
    let temp = [];
    let index = [];
    let l = array.length;
    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        if (array[i] === array[j]) {
          i++;
          j = i;
        }
      }
      temp.push(array[i]);
      index.push(i);
    }
    return temp;
  }
}

export default myUtils
