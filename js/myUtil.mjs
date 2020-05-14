/**
 * 自己封装的一些常用的工具
 * @author chengxg
 * @since 2019-1-11
 */
export function isType(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

export function isObject(val) {
  return isType(val) === 'Object';
}

export function isArray(val) {
  return isType(val) === 'Array';
}

export function isFunction(val) {
  return isType(val) === 'Function';
}

/**
 * 继承
 * @param {Object} dest
 * @param {Object} src
 * @return {Object}
 */
export function extend(dest, src) {
  if (isObject(dest) || isFunction(dest) && isObject(src)) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        if (isObject(src[key])) {
          dest[key] = extend(isObject(dest[key]) ? dest[key] : {}, src[key]);
        } else if (isArray(src[key])) {
          dest[key] = extend(isArray(dest[key]) ? dest[key] : [], src[key]);
        } else {
          dest[key] = src[key];
        }
      }
    }
  } else if (isArray(dest) && isArray(src)) {
    for (var i = 0, len = src.length; i < len; i++) {
      if (isObject(src[i])) {
        dest.push(extend({}, src[i]));
      } else if (isArray(src[i])) {
        dest.push(extend([], src[i]));
      } else {
        dest.push(src[i]);
      }
    }
  }
  return dest;
}

/**
 * 深度克隆
 * @param {Object} obj
 * @return {Object}
 */
export function clone(obj) {
  if (isObject(obj)) {
    return extend({}, obj);
  } else if (isArray(obj)) {
    return extend([], obj);
  } else {
    return obj;
  }
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns {Array} result
 */
export function arrayDistinct(arr) {
  let result = [];
  let obj = {};

  for (let i of arr) {
    if (!obj[i]) {
      result.push(i)
      obj[i] = 1;
    }
  }

  return result
}

/**
 * 根据对象的字段值从数组中查询这个对象
 * @param {Array} arr
 * @param {String} filed
 * @param {Object} filedVal
 */
export function getObjFromArrByFiled(arr, filed, filedVal) {
  var len = arr.length,
    temp = null;
  for (var i = 0; i < len; i++) {
    temp = arr[i];
    if (temp[filed] === filedVal) {
      return temp;
    }
  }
  return null;
}

/**
 * 根据对象的字段值从数组中移除这个对象
 * @param {Array} arr
 * @param {String} filed
 * @param {Object} filedVal
 */
export function removeObjFromArrByFiled(arr, filed, filedVal) {
  let len = arr.length,
    temp = null;
  for (let i = 0; i < len; i++) {
    temp = arr[i];
    if (temp[filed] === filedVal) {
      arr.splice(i, 1);
      return true;
    }
  }
  return false;
}

/**
 * 经典的洗牌算法
 * @param {Array} arr
 */
export function shuffle(arr) {
  var len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    var idx = Math.floor(Math.random() * (len - i));
    var temp = arr[idx];
    arr[idx] = arr[len - i - 1];
    arr[len - i - 1] = temp;
  }
  return arr;
}

/**
 * 得到js中注释的html模板
 * @param {Funcion} tmpl
 */
export function getHtmlTemplate(tmpl) {
  tmpl = tmpl + "";
  return tmpl.toString().match(/[^]*\/\*([^]*)\*\/\s*\}$/)[1];
}

/**
 * 日期格式化
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {Date} date
 * @param {String} fmt
 */
export function formatDate(date, fmt) {
  if (!date) {
    return "";
  }
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * 格式化后台的日期
 * 默认转换为日期类型, 如果设置 fmt 参数则转换为对应的日期字符串
 * @param {Object} dateObj (json字符串 或 ajax请求后的数据)
 * @param {String} fmt
 */
export function formatBackstageDate(dateObj, fmt) {
  if (!dateObj) {
    return "";
  }
  let fmtDate = null;

  //去掉日期字符串的中的 "T"
  if (typeof dateObj === 'string') {
    //苹果不支持 "2018-07-12"这种类型的格式化
    dateObj = dateObj.replace(/-/g, "/");
    fmtDate = new Date(dateObj.replace("T", " "));
  }

  //时间戳
  if (typeof dateObj === 'number') {
    fmtDate = new Date(dateObj);
  }

  if (dateObj instanceof Date) {
    fmtDate = dateObj;
  }

  //处理json字符串中的日期
  if (typeof dateObj === 'object' && !isNaN(dateObj.time)) {
    fmtDate = new Date(dateObj.time);
  }

  if (fmtDate != null && typeof fmt !== 'undefined') {
    fmtDate = formatDate(fmtDate, fmt);
  }

  return fmtDate;
}

//js精确加法
export function floatAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

//js精确 减法
export function floatSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//js精确 乘法
export function floatMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

//js精确 除法
export function floatDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 序列化表单对象, 值是 undefined 或 null的字段会过滤掉
 * let serializeData = serializeFormData("", {
    a: "a",
    b: 2,
    c: true,
    d: [{
      z: "z",
      x: 3
    }, {
      v: [1, 2, ["qwe", "sdf"]],
      n: 45
    }],
    e: {
      g: "g"
    }
  });
  console.log(serializeData);
 * @param {String} parentName
 * @param {Object} obj 要序列化的对象
 */
export function serializeFormData(parentName, obj) {
  var data = {};
  var i, len, filed, childData, childField;
  if (isArray(obj)) {
    for (i = 0, len = obj.length; i < len; i++) {
      if (isArray(obj[i]) || isObject(obj[i])) {
        childData = serializeFormData("", obj[i]);
        for (childField in childData) {
          if (childData[childField] === undefined || childData[childField] === null) {
            continue;
          }
          if (childField.charAt(0) === '[') {
            data[parentName + "[" + i + "]" + childField] = childData[childField];
          } else {
            data[parentName + "[" + i + "]." + childField] = childData[childField];
          }
        }
      } else {
        data[parentName + "[" + i + "]"] = obj[i];
      }
    }
  }
  if (isObject(obj)) {
    for (filed in obj) {
      if (obj[filed] === undefined || obj[filed] === null) {
        continue;
      }
      if (isArray(obj[filed]) || isObject(obj[filed])) {
        childData = serializeFormData(filed, obj[filed]);
        for (childField in childData) {
          if (childData[childField] === undefined || childData[childField] === null) {
            continue;
          }
          if (parentName) {
            data[parentName + "." + childField] = childData[childField];
          } else {
            data[childField] = childData[childField];
          }
        }
      } else {
        if (parentName) {
          data[parentName + "." + filed] = obj[filed];
        } else {
          data[filed] = obj[filed];
        }
      }
    }
  }
  return data;
}

/**
 * 从url获取参数
 * @param {String} name 参数名
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(unescape(r[2]));
  }
  return null;
}

/**
 *
 * 解析出所有的url参数
 * @param {String} url
 * @returns {Object} params
 */
export function resoveURLParams(url) {
  let params = {};
  url = decodeURI(url);
  let matchs = url.match(/[a-zA-Z0-9]+=[^&\?\/\\#]*/g);
  if (matchs != null) {
    matchs.forEach(element => {
      let arr = element.split("=");
      params[arr[0]] = unescape(arr[1]);
    })
  }
  return params;
}

export function getScrollEventTarget(element) {
  let currentNode = element;
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.nodeType === 1) {
    const overflowY = window.getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
}

export function getScrollTop(element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  } else {
    return element.scrollTop;
  }
}

/**
 * 将枚举对象转化为 [{lable:"", value:""}]形式的数组
 * @param {Object} statusEnum
 * @param {Boolean} [keyIsNumber] key是否为数字,默认false
 */
export function getEnumOptions(statusEnum, keyIsNumber = false, isAllKey = false) {
  let options = [];
  if (isObject(statusEnum)) {
    for (let f in statusEnum) {
      if (statusEnum.hasOwnProperty(f) && (keyIsNumber ^ isNaN(f) || isAllKey)) {
        options.push({
          label: statusEnum[f],
          value: f
        });
      }
    }
  }
  return options;
}

/**
 * 通过当前的url获取当前的模块名
 */
export function getModuleName() {
  let pathname = window.location.pathname;
  let matchs = pathname.match(/^\/?[a-zA-Z0-9]+[^&\?\/\\#\.]*/g);
  if (matchs != null) {
    return matchs[0].substring(1);
  } else {
    return "";
  }
}

/**
 * 从返回结果中得到分页对象
 * @param {Object} data
 */
export function getPageFromData(data) {
  if (!data) {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 10
    }
  }
  return {
    pageNum: data.pageNum * 1,
    total: data.total * 1,
    pageSize: data.pageSize * 1
  }
}

/**
 * 从swagger模板中获取去掉数组中的 多复制的一个对象
 * @param {Object} tpl
 * @param {Array} [leastOneFileds] 不需要去除的字段 多层级的嵌套的相同字段名暂时不予考虑
 */
function removeArrayMoreThanObj(obj, leastOneFileds = []) {
  if (isArray(obj)) {
    obj.forEach((item) => {
      removeArrayMoreThanObj(item, leastOneFileds);
    })
  } else {
    if (isObject(obj)) {
      for (let f in obj) {
        if (!obj[f]) {
          continue;
        }
        if (isArray(obj[f]) && obj[f].length > 0) {
          //排除 已 Comment 结尾的属性
          if (leastOneFileds.indexOf(f) == -1 && !f.endsWith("Comment")) {
            //没有要求这个数组中至少有一个对象, 则删除
            obj[f] = [];
          } else {
            removeArrayMoreThanObj(obj[f][0], leastOneFileds);
          }
        }
        if (isObject(obj[f])) {
          removeArrayMoreThanObj(obj[f], leastOneFileds);
        }
      }
    }
  }
}

/**
 * 补充后台返回数据缺失的字段, 允许添加函数字段, 来混入属性
 * 这个函数的作用就是缺啥补啥
  (function () {
    //测试代码
    let data = {
      a: 23,
      b: "asd",
      c: [{
        ca: "1",
        cd: true,
        cc: null
      }, {
        ca: "2",
        cc: {
          cca: true,
          ccb: 2
        }
      }],
      d: null,
      e: {
        ea: {
          eaa: null
        }
      },
      f:[]
    };

    tranNullObject(data, {
      a: 0,
      b: "",
      c: [{
        ca: "",
        cd: true,
        cc: {
          cca: false,
          ccb: 0
        }
      }],
      d: {
        da: "we",
        db: 2,
        bc: false,
        dd: [{
          dda: "3",
          ddb: false
        }],
        de: [{
          dea: "3",
          deb: false
        }]
      },
      e: {
        ea: {
          eaa: 0,
          eab: "eab"
        }
      },
      f: [{
        fa:"12",
        fb:1,
        fc:false
      }]
    }, ["de","f"]);
    console.log(data);
  })()
 * @param {Object|Array} obj 后台的数据
 * @param {Object} tpl 数据模板 同swagger模板
 * @param {Array} [tplArrayLeastOneFileds] 数组对象中至少存在一个对象的字段属性名
 */
export function tranNullObject(obj, tpl, tplArrayLeastOneFileds = []) {
  //支持数组遍历, 方便api方法中转化数据
  if (obj && isArray(obj)) {
    let len = obj.length;
    for (let i = 0; i < len; i++) {
      tranNullObject(obj[i], tpl, tplArrayLeastOneFileds);
    }
    return;
  }
  if (!obj && !isObject(obj)) {
    return;
  }
  if (typeof tpl === 'undefined') {
    return;
  }
  for (let f in tpl) {
    if (f == '00TplArrayLeastOneFileds' && isArray(tpl[f])) {
      tplArrayLeastOneFileds.push(...tpl[f]);
      continue;
    }
    //模板不存在直接过
    if (typeof tpl[f] === 'undefined' || tpl[f] === null || f == '00ObjectComment') {
      continue;
    }
    //该字段不存在, 并且在模板中存在
    if (typeof obj[f] === 'undefined' || obj[f] === null) {
      //值不存在从模板中复制一个
      if (isObject(tpl[f])) {
        //是对象的情况
        obj[f] = clone(tpl[f]);
        removeArrayMoreThanObj(obj[f], tplArrayLeastOneFileds);
      } else if (isArray(tpl[f])) {
        //是数组的情况
        if (tplArrayLeastOneFileds.indexOf(f) > -1) {
          obj[f] = clone(tpl[f]);
          removeArrayMoreThanObj(obj[f], tplArrayLeastOneFileds);
        } else {
          if (f.endsWith("Comment")) {
            obj[f] = clone(tpl[f]);
          } else {
            obj[f] = [];
          }
        }
      } else {
        //基本数据类型
        obj[f] = tpl[f];
      }
    } else {
      if (isObject(obj[f])) {
        tranNullObject(obj[f], tpl[f], tplArrayLeastOneFileds);
      } else {
        if (isArray(obj[f]) && isArray(tpl[f])) {
          if (obj[f].length == 0) {
            //长度为0且该数组必须有一个值, 则复制一个
            if (tplArrayLeastOneFileds.indexOf(f) > -1) {
              obj[f] = clone(tpl[f]);
              removeArrayMoreThanObj(obj[f], tplArrayLeastOneFileds);
            }
          } else {
            obj[f].forEach((item, index) => {
              tranNullObject(item, tpl[f][0], tplArrayLeastOneFileds);
            })
          }
        }
      }
    }
  }
}

/**
 * 保存数据到本地
 * @param {*} obj 保存的对象
 * @param {String} saveName 保存的名字
 * @param {Boolean} [isSessionStorage] 是否保存到sessionStorage
 * @param {Number} [expireTime] 过期时间 ms
 */
export function saveDataToLocal(saveName, obj, isSessionStorage = true, expireTime) {
  if (obj && (isObject(obj) || isArray(obj))) {
    if (isSessionStorage) {
      sessionStorage.setItem(saveName, JSON.stringify(obj))
    } else {
      localStorage.setItem(saveName, JSON.stringify(obj))
    }
  } else {
    if (isSessionStorage) {
      sessionStorage.setItem(saveName, obj)
    } else {
      localStorage.setItem(saveName, obj)
    }
  }
  //存过期时间
  if (expireTime) {
    let expireTimeObjStr = JSON.stringify({
      time: new Date().getTime(),
      expireTime: expireTime
    });
    if (isSessionStorage) {
      sessionStorage.setItem(saveName + "ExpireTime", expireTimeObjStr)
    } else {
      localStorage.setItem(saveName + "ExpireTime", expireTimeObjStr)
    }
  }
}

/**
 * 从本地读取数据
 * @param {String} readName 去取数据的名字
 * @param {Boolean} [isSessionStorage] 是否从sessionStorage读取
 */
export function readDataFromLocal(readName, isSessionStorage = true) {
  let dataStr = null;
  let data = null;
  if (isSessionStorage) {
    dataStr = sessionStorage.getItem(readName);
  } else {
    dataStr = localStorage.getItem(readName);
  }
  if (dataStr) {
    //如果过期直接返回null
    let expireTimeObj = readDataFromLocal(readName + "ExpireTime", isSessionStorage);
    if (expireTimeObj) {
      if ((new Date().getTime() - expireTimeObj.time) >= expireTimeObj.expireTime) {
        saveDataToLocal(readName, null, isSessionStorage);
        return null;
      }
    }
    let first = dataStr.charAt(0);
    //如果是数组或对象
    if (first === '{' || first === '[') {
      data = JSON.parse(dataStr);
    } else {
      //尝试保持原始数据类型
      try {
        data = JSON.parse(dataStr);;
      } catch (e) {
        data = dataStr;
      }
    }
  } else {
    data = dataStr;
  }
  return data;
}

/**
 * 执行数据对象中的函数来混入属性
 * 已"_"开头的函数作为批量混入字段使用, 仅执行混入函数, 不会将执行后的结果混入到对象上
 * 已"_数字$"结尾的属性为多次引用的写法 如"_2$" "_3$"等
 * (function () {
      let testData = {
        a: "a",
        b: (obj) => obj.a + "_b",
        c: {
          ca: "ca",
          //三次引用执行
          cb0_3$: (obj, parentObj) => "$3_" + obj.cb1,
          //二次引用执行,写法 字段添加后缀 "_index$" 该函数依赖于 cb
          cb1_2$: (obj, parentObj) => "$2_" + obj.cb2,
          cb2: (obj, parentObj) => obj.ca + "_" + parentObj.a,
          cc: [2],
          cd: [(i, arr, parentObj) => {
            return i + "_" + parentObj.cc[i] + "_" + parentObj.ca
          }]
        },
        d: [{
          da: "da",
          db: (obj, i, arr, parentObj) => {
            return obj.da + "_" + i + "_" + parentObj.a
          }
        }]
      };
      mixinsFiledUseFunc(testData);
      console.log(testData);
    })();
 * @param {Object|Array} obj
 */
export function mixinsFiledUseFunc(obj) {
  if (!obj) {
    return 1;
  }
  let exeCount = 1; //执行总次数
  let isTop = true; //是否为最顶层对象
  //最后一个参数是否是数字 判断 是否为最顶层对象
  if (typeof arguments[arguments.length - 1 + ''] == 'number') {
    isTop = false;
  }

  //只有最顶层方法 才有这个循环
  for (let exeIndex = 1; exeIndex <= exeCount; exeIndex++) {
    if (isObject(obj)) {
      for (let f in obj) {
        if (obj[f] != null && (isObject(obj[f]) || isArray(obj[f]))) {
          let args = [].slice.call(arguments);
          if (isTop) {
            args.push(exeIndex);
          }

          let getExeCount = mixinsFiledUseFunc(obj[f], ...args);
          if (isTop && getExeCount > exeCount) {
            //设置最大的执行次数
            exeCount = getExeCount;
          }
        } else {
          //执行模板函数, 混入属性
          if (typeof obj[f] === 'function') {
            if (f.startsWith("_")) {
              obj[f](...arguments);
              delete obj[f];
            } else if (f.endsWith("$")) {
              let strLen = f.length;
              //类似 filedName_2$ 的形式
              if (f.charAt(strLen - 3) == '_' && !isNaN(f.charAt(strLen - 2))) {
                let funcExeIndex = f.charAt(strLen - 2) * 1;
                if (funcExeIndex > exeCount) {
                  //设置最大的执行次数
                  exeCount = funcExeIndex;
                }
                let currentExeIndex = 1; //当前执行引用序号
                if (!isTop) {
                  currentExeIndex = arguments[arguments.length - 1 + ''];
                } else {
                  currentExeIndex = exeIndex;
                }
                //当前执行
                if (funcExeIndex == currentExeIndex) {
                  obj[f.substring(0, strLen - 3)] = obj[f](...arguments);
                  delete obj[f];
                }
              }
            } else {
              obj[f] = obj[f](...arguments);
            }
          }
        }
      }
    }
    if (isArray(obj)) {
      let len = obj.length;
      for (let i = 0; i < len; i++) {
        if (obj[i] != null && (isObject(obj[i]) || isArray(obj[i]))) {
          let args = [].slice.call(arguments);
          if (isTop) {
            args.push(exeIndex);
          }

          let getExeCount = mixinsFiledUseFunc(obj[i], i, ...args);
          if (isTop && getExeCount > exeCount) {
            //设置最大的执行次数
            exeCount = getExeCount;
          }
        } else {
          //执行模板函数, 混入属性
          if (typeof obj[i] === 'function') {
            obj[i] = obj[i](i, ...arguments);
          }
        }
      }
    }
    if (!isTop) {
      break;
    }
  }

  return exeCount;
}

/**
 * 往后台传输的查询参数中 移除为空串的字段
 * var params = {
 *    a: "a",
 *    b: "",
 *    c: null,
 *    d: [{
 *      da: "",
 *      db: "db",
 *      dc: null,
 *      de: " ",
 *      df: 0
 *    }],
 *    e: {
 *      ea: "",
 *      eb: 0,
 *      ec: [1, 2, 3]
 *    }
 *  }
 *  removeEmptyFiled(params);
 *  console.log(params);
 *
 * @param {Object|Array} obj 参数
 */
export function removeEmptyFiled(obj) {
  if (!obj) {
    return;
  }
  if (isObject(obj)) {
    for (let f in obj) {
      if (typeof obj[f] === "string") {
        obj[f] = obj[f].trim();
      }
      if (obj[f] === "" || obj[f] === null || obj[f] === undefined) {
        delete obj[f];
        continue;
      }
      removeEmptyFiled(obj[f]);
    }
    return;
  }
  if (isArray(obj)) {
    obj.forEach((item) => {
      removeEmptyFiled(item);
    })
  }
}

/**
 * 批量 将价格分转元, 是分的字段, 会在同级对象中混入 以"Yuan"结尾的属性
 * let data = {
      a: 1234500,
      b: {
        ba: 344,
        bb: [{
          bba: 2345,
          bbb: 12340,
          bbc: "bbc1"
        }, {
          bba: 3421,
          bbb: 45689,
          bbc: "bbc2"
        }],
        bc: {
          bca: "2367",
          bcb: "bcb",
          bce: 4567
        },
        be :{
          bce: 3456
        }
      },
      c: 123,
      e: [123, 345, 67] //此种情况不考虑
    }
    mixinsFiledPriceYuan(data, ["a", "bba", "bca", "a.bb.bbb", "bc.bce"])
    console.log(data);
 * @param {Object|Array} obj
 * @param {Array} priceFileds 价格为分的字段,一般情况下只需输入字段名, 支持全路径, 例:"a.b.c"
 * @param {boolean} [isMathFloor] 是否向下取整
 * @param {String} [parentName] 父级属性名
 */
export function mixinsFiledPriceYuan(obj, priceFileds = [], isMathFloor = false, parentName = "") {
  if (!obj) {
    return;
  }
  if (isObject(obj)) {
    let priceFiledsLen = priceFileds.length;
    let hasFiled = false;
    for (let f in obj) {
      if (obj[f] === null) {
        continue;
      }
      if (isObject(obj[f]) || isArray(obj[f])) {
        let pathName = parentName;
        if (!parentName) {
          pathName = f;
        } else {
          pathName = parentName + "." + f;
        }
        mixinsFiledPriceYuan(obj[f], priceFileds, isMathFloor, pathName);
        continue;
      }
      if (!isNaN(obj[f])) {
        let pathName = parentName;
        if (!parentName) {
          pathName = f;
        } else {
          pathName = parentName + "." + f;
        }
        hasFiled = false;
        for (let i = 0; i < priceFiledsLen; i++) {
          //写全路径用于区分不同对象下 相同的字段
          if (priceFileds[i].indexOf(".") > -1) {
            if (pathName.endsWith(priceFileds[i])) {
              hasFiled = true;
              break;
            }
          } else {
            if (priceFileds[i] === f) {
              hasFiled = true;
              break;
            }
          }
        }
        if (hasFiled) {
          if (isMathFloor) {
            obj[f + "Yuan"] = Math.floor(obj[f] / 100);
          } else {
            obj[f + "Yuan"] = (obj[f] / 100).toFixed(2) * 1;
          }
        }
      }
    }
  }

  if (isArray(obj)) {
    let len = obj.length;
    for (let i = 0; i < len; i++) {
      if (isObject(obj[i]) || isArray(obj[i])) {
        mixinsFiledPriceYuan(obj[i], priceFileds, isMathFloor, parentName);
      }
    }
  }
}

/**
 * 对对象的字段进行排序
 * 已"_"开头的属性, 从第2个字符开始比较
 * @param {Object|Array} obj
 * @returns {Object} newObj
 */
export function objFiledSort(obj) {
  if (!obj) {
    return obj;
  }

  if (isObject(obj)) {
    let newObj = {};
    let sortKeys = Object.keys(obj).sort((a, b) => {
      if (a.charAt(0) == '_') {
        a = a.substring(1);
      }
      if (b.charAt(0) == '_') {
        b = b.substring(1);
      }
      if (a > b) {
        return 1
      }
      if (a < b) {
        return -1
      }
      return 0
    });
    for (let f of sortKeys) {
      if (isObject(obj[f]) || isArray(obj[f])) {
        newObj[f] = objFiledSort(obj[f]);
      } else {
        newObj[f] = obj[f];
      }
    }
    return newObj;
  }

  if (isArray(obj)) {
    let len = obj.length;
    let newArray = [];
    for (let i = 0; i < len; i++) {
      if (isObject(obj[i]) || isArray(obj[i])) {
        newArray[i] = objFiledSort(obj[i]);
      } else {
        newArray[i] = obj[i];
      }
    }
    return newArray;
  }

  return obj;
}

/**
 * 深层初始化数据
 * //数据模板
  let data = {
    a: "",
    b: false,
    c: false,
    d: "",
    e: null,
    f: null,
    g: 0,
    h: 0,
    arr: [0, false, "", null, null, {
        a: "",
        b: false,
        d: "",
        e: null,
        f: null,
        g: 0,
        h: 0,
      },
      null
    ],
    arr1: ["a", "b", "c"],
    arr2: [0, 0, 0],
    o: {
      a: "",
      b: false,
      c: false,
      d: "",
      e: null,
      f: null,
      g: 0,
      h: 0,
      arr: [0, false, "", null, null, {
          a: "",
          b: false,
          c: false,
          d: "",
          e: null,
          f: null,
          g: 0,
          h: 0,
        },
        [1, 2, 3]
      ],
      o: {
        a: ""
      }
    },
    p: {
      a: "pa"
    }
  }

  //需要初始化的数据,数据可能有残缺
  let initData = {
    a: "a",
    b: false,
    c: true,
    d: "",
    e: null,
    f: undefined,
    g: 12,
    h: 0,
    arr: [1, false, "", null, undefined, {
        a: "a",
        b: false,
        c: true,
        d: "",
        e: null,
        f: undefined,
        g: 12,
        h: 0,
      },
      [1, 2, 3]
    ],
    arr1: [],
    arr2: null,
    o: {
      a: "oa",
      b: false,
      c: true,
      d: "",
      e: null,
      f: undefined,
      g: 12,
      h: 0,
      arr: [1, false, "", null, undefined, {
          a: "a",
          b: false,
          c: true,
          d: "",
          e: null,
          h: 0,
        },
        [1, 2, 3]
      ],
      o: {
        a: "ooa"
      }
    },
    p: null
  }
  deepInitValue(data, initData);
  console.log(data);
 * @param {Object|Array} obj 
 * @param {Object|Array} data 
 */
export function deepInitValue(obj, data) {
  if (!obj || !data) {
    return;
  }
  if (isObject(obj) && isObject(data)) {
    for (let f in obj) {
      if (isObject(obj[f]) || isArray(obj[f])) {
        deepInitValue(obj[f], data[f]);
        continue;
      }
      if (typeof data[f] !== 'undefined') {
        obj[f] = data[f];
      }
    }
    return;
  }
  if (isArray(obj) && isArray(data)) {
    let item = null;
    for (let i = 0; i < obj.length; i++) {
      item = obj[i];
      if (isObject(item) || isArray(item)) {
        deepInitValue(item, data[i]);
        continue;
      }
      if (typeof data[i] !== 'undefined') {
        obj[i] = data[i];
      }
    }
    return;
  }
}
