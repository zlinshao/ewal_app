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
    if (type === 'datetime') {
      return year + '-' + mm + '-' + dd + ' ' + hh + ':' + md;
    }
    return year + '-' + mm + '-' + dd + ' ' + hh + ':' + md + ':' + ss;
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

  // 计算时间差
  static timeDifference(di) {//di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    let dateBegin = new Date(di);//将-转化为/，使用new Date
    let dateEnd = new Date();//获取当前时间
    let dateDiff = -(dateEnd.getTime() - dateBegin.getTime());//时间差的毫秒数
    let hours = Math.floor(dateDiff / (3600 * 1000));
    let leave = dateDiff % (3600 * 1000);//计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave / (60 * 1000));//计算相差分钟数
    return {hours, minutes}
    // let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    // let leave1 = dateDiff % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
    // let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
    // //计算相差分钟数
    // let leave2 = leave1 % (3600 * 1000);//计算小时数后剩余的毫秒数
    // let minutes = Math.floor(leave2 / (60 * 1000));//计算相差分钟数
    // //计算相差秒数
    // let leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
    // let seconds = Math.round(leave3 / 1000);
    // console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");
    // console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数"
    //   , hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");
  };

  //格式化日期
  static formatDate2(v, format = 'yyyy-MM-dd') {//用法:format="yyyy-MM-dd hh:mm:ss";
    if (!v) return null;
    let d = v;
    if (typeof v === 'string') {
      if (v.indexOf("/Date(") > -1)
        d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
      else
        d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
    }
    let o = {
      "M+": d.getMonth() + 1,  //month
      "d+": d.getDate(),       //day
      "h+": d.getHours(),      //hour
      "m+": d.getMinutes(),    //minute
      "s+": d.getSeconds(),    //second
      "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
      "S": d.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }

  //判断时间是否在给定的日期范围内
  //第三个参数传选定的日期 不传默认当前时间
  static judgeDateInRange(startTime, endTime, inTime = new Date()) {
    let time = new Date(inTime).getTime();
    let sTime = new Date(startTime.replace(/-/g, '/')).getTime();
    let eTime = new Date(endTime.replace(/-/g, '/')).getTime();
    return sTime < time && eTime > time;
  }
}

export default myUtils
