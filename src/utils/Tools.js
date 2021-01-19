import { Decimal } from 'decimal.js';
import { BSFLAG_LONG, BSFLAG_SHORT } from './Constants'

Decimal.set({ toExpNeg: -30, toExpPos: 30 });

/**
 * 科学计数法转换
 * @param {*} val
 */
export function numToStr(val) {
  return Decimal(val).valueOf();
}

/**
 * input输入数字格式化
 * @export
 * @param {*} val
 * @returns
 */
export function numFmt(val, dn = 2) {
  let obj = String(val);
  // 修复第一个字符是小数点 的情况.
  if (obj !== '' && obj.substring(0, 1) === '.') obj = '0.';
  obj = obj.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
  obj = obj.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
  obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  const str = new RegExp(`^(-)*(\\d+)\\.(\\d{${dn}}).*$`);
  obj = obj.replace(str, '$1$2.$3'); // 只能输入两个小数
  if (dn === 0) {
    obj = numToStr(parseFloat(obj));
  } else if (obj.indexOf('.') < 0) {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    obj = numToStr(parseFloat(obj));
  }

  return isNaN(obj) ? 0 : obj;
}

// 格式化 固定小数位-截取
export function fmtDec(num, dec = 8) {
  var arr = (num || '').toString().split('.');
  var result = num;
  if (arr.length === 2 && arr[1].length > dec) {
      arr[1] = arr[1].substring(0, dec);
      while (arr[1].length > 0 && arr[1].endsWith("0")) {
          arr[1] = arr[1].substring(0, arr[1].length - 1)
      }
      result = arr.join('.');

      if (result.length > 0 && result.endsWith(".")) {
          result = result.substring(0, result.length - 1)
      }
  }
  return result
}

export function fromWei(num, decimal = 18) {
  return div(num, Math.pow(10, decimal)).valueOf();
}

export function toWei(num, decimal = 18) {
  return mul(num, Math.pow(10, decimal)).valueOf();
}

export function fmtToFixed(num, dec = 2) {
  return Decimal(num).toFixed(dec);
}

export function toNumber(val) {
  return Decimal(val).toNumber();
}

export function abs(v) {
  return Decimal.abs(v).valueOf();
}

/**
 * 减法运算
 * @param {*} v1
 * @param {*} v2
 */
export function sub(v1, v2) {
  return Decimal.sub(v1, v2).valueOf();
}
/**
 * 加法运算
 * @param {*} v1
 * @param {*} v2
 */
export function plus(v1, v2) {
  return Decimal.add(v1, v2).valueOf();
}
/**
 * 乘法运算
 * @param {*} v1
 * @param {*} v2
 */
export function mul(v1, v2) {
  return Decimal.mul(v1, v2).valueOf();
}
/**
 * 除法运算
 * @param {*} v1
 * @param {*} v2
 */
export function div(v1, v2) {
  return Decimal.div(v1, v2).valueOf();
}

// 等于
export function EQ(val, compareVal) {
  return Decimal(val).eq(compareVal);
}
// 大于
export function GT(val, compareVal) {
  return Decimal(val).gt(compareVal);
}
// 大于等于
export function GE(val, compareVal) {
  return Decimal(val).gte(compareVal);
}
// 小于
export function LT(val, compareVal) {
  return Decimal(val).lt(compareVal);
}
// 小于等于
export function LE(val, compareVal) {
  return Decimal(val).lte(compareVal);
}

/**
 * 获取url参数
 * @param url
 */
export const getURLParams = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

export function fmtZero(value) {
  return value < 10 ? '0' + value : value;
}

/**
 * 倒计时 (XXDXXH)
 * @param {*} start
 * @param {*} end
 */
export function diffDayHour(start, end) {
  let diff = end - start;
  let diffSeconds = diff / 1000;
  let D = Math.floor(diffSeconds / 24 / 60 / 60);
  let afterDay = diffSeconds - D * 24 * 60 * 60;
  let H = Math.floor(afterDay / 60 / 60);
  return `${fmtZero(D)}D ${fmtZero(H)}H`;
}

export function fmtShowTime(diffSeconds) {
  function fmtZero(value) {
    return value < 10 ? '0' + value : value;
  }
  if (diffSeconds > 60 * 60 * 24) {
    let D = Math.floor(diffSeconds / 24 / 60 / 60);
    let afterDay = diffSeconds - D * 24 * 60 * 60;
    let H = Math.floor(afterDay / 60 / 60);
    return `${fmtZero(D)}D ${fmtZero(H)}H`;
  } else {
    let H = Math.floor(diffSeconds / 60 / 60);
    let afterHour = diffSeconds - H * 60 * 60;
    let m = Math.floor(afterHour / 60);
    return `${fmtZero(H)}H ${fmtZero(m)}M`;
  }
}

/**
 * 随机字符串
 * @param {*} len
 */
export const generateRandomAlphaNum = (len) => {
  var rdmString = '';
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
  return rdmString.substr(0, len);
};

/**
 * 计算订单的盈亏
 * @param {*} price 
 * @param {*} order 
 */
export const calcOrderPL = (lastPrice, order) => {
  if (!lastPrice || !order) return null;
  var plusMinus = order.bsFlag == BSFLAG_LONG ? 1 : -1;
  //var result = plusMinus * (lastPrice - order.openPrice) / order.openPrice * order.tokenAmount * order.lever;  
  return Decimal(plusMinus).mul(Decimal(lastPrice).sub(order.openPrice)).div(order.openPrice).mul(order.tokenAmount).mul(order.lever).valueOf();
}

/**
 * 计算止损价
 * @param {*} lastPrice 
 * @param {*} order 
 */
export const calcStopLossPrice = (order, bottomlimit) => {
  if (!order) return null;
  if (order.bsFlag == BSFLAG_LONG) {
    //order.openPrice * (1 - bottomlimit / 100.0 / order.lever)
    return Decimal(order.openPrice).mul(1 - bottomlimit / 100.0 / order.lever); 
  } else {
    //order.openPrice * (1 + bottomlimit / 100.0 / order.lever)
    return Decimal(order.openPrice).mul(1 - bottomlimit / 100.0 / order.lever);
  }
}

/**
 * 计算止损价
 * @param {*} lastPrice 
 * @param {*} order 
 */
export const calcTakeProfitPrice = (order, bottomlimit) => {
  if (!order) return null;
  return calcStopLossPrice({...order, bsFlag: order.bsFlag == BSFLAG_LONG ? BSFLAG_SHORT : BSFLAG_LONG}, bottomlimit);
}

/**
 * 计算止损价
 * @param {*} lastPrice 
 * @param {*} order 
 */
export const calcForceClosePrice = (order) => {
  if (!order) return null;
  return calcStopLossPrice(order, 100);
}