// const LogMap = {
//   'customerName': '客户姓名',
//   'gender': '客户性别',
//   'age': '年龄',
//   'customerSource': '客户来源',
//   'mark': {
//     label: '备注',
//     value: [{ key: 'tt', value: 'test' }],
//   },
//   // "tagMap": {},
//   'intentionalInsureType': '意向险种',
//   // "defineTag": [],
//   'focusOther': '关注其他平台',
//   'salary': '家庭年收入',
//   'debt': '家庭负债',
//   'customerDesc': '客户简介',
//   'addressDetail': '详细地址',
//   'loginIdList': '会员ID',
//   'tagMap': {
//     '1': {
//       'tagDesc': '意向险种',
//       'cc': '自定义',
//     },
//   },
//   'contactDVOList': {
//     'name': '家庭成员姓名',
//     'mobile': '家庭成员手机号',
//     'gender': '家庭成员性别',
//     'isDefault': '默认联系人',
//     'relation': {
//       label: '家庭成员关系',
//       value: [{ key: '0', value: '本人' }, { key: 1, value: '亲戚' }],
//     },
//   },
//   'tagDesc': {
//     label: '添加自定义标签',
//     value: [{ key: '0', value: '本人' }, { key: '1', value: '亲戚' }],
//   },
// };
const logMap = {
  'customerName': '客户姓名',
  'gender': {
    label: '客户性别',
    value: [{ key: 1, value: '女' }, { key: 0, value: '男' }],
  },
  'age': '客户年龄',
  'loginIdList': '客户id',
  'contactDVOList': {
    $compareRule: (pre, cur) => {
      return true;
    },
    'name': '家庭成员姓名',
    'mobile': '家庭成员手机号',
    'others': '家庭成员其他内容',
    'gender': '家庭成员性别',
    'isDefault': '默认联系人',
    'relation': {
      label: '家庭成员关系',
      value: [
        { key: '030001', value: '本人' },
        { key: '030003', value: '亲戚' },
      ],
    },
  },
  'saleTagMap': {
    '1': '系统标签',
  },
  'province': '420000',
  'city': '421000',
  'birthday': '出生日期',
  'job': '职业',
  'customerDesc': '简介',
  'intentionalInsureType': {
    label: '意向险种',
    value: [{
      key: '101-06',
      value: '家财险',
    }, {
      key: '101-15',
      value: '企业财险',
    }],
  },
  'defineTag': ['a64266cd1e914291995937b2156f23fb', '4b38b40c9c594648a6685a4e2a9766a4', 'ed597807738e4d1fb8f21d7680573a81'],
  'focusOther': '关注其他平台',
  'salary': '家庭收入',
  'debt': '家庭负债',
  'addressDetail': '详细地址',
};

class BaseDiffLog {
  constructor(preData, curData, logMap) {
    this.preData = preData;
    this.curData = curData;
    this.logMap = logMap;
    this.logs = [];
    this.reverse = false;
  }

  getLog(preData = this.preData, curData = this.curData) {
    // 判断preData：
    // base 、 arr 、 object
    // 一、类型相同：
    // 1、值相同： 不生成log
    // 2、值不同： 生成log：
    //   1）数组： 遍历出不同，生成
    //   2）对象： 遍历
    //   3) base:  比对
    // 二、类型不同：
    // 1、pre null，cur： （新增）
    //   1） obj： 遍历属性生成
    //   2） arr： 遍历生成
    //   3） base： map 取生成
    // 2、cur null, pre: (删除)
    //   1） obj： 遍历属性生成
    //   2） arr： 遍历生成
    //   3） base： map 取生成
    //
    // 公共方法：
    //      1、判断类型
    //      2、判断有效值
    //      3、数组遍历不同
    //      4、对象遍历不同
    //      5、获取label
    //
    this.getObjectLog(preData, curData);
    return this.logs;
  }


  // ======= 获取log分类 =======
  getObjectLog(preData, curData) {
    // 修改删除
    for (const [preKey, preValue] of Object.entries(preData || {})) {
      if (this.validValue(curData)) {
        const curValue = curData && curData[preKey];
        const logItem = this.generateLog(preKey, preValue, curValue);
        logItem && this.logs.push(logItem);
      } else {
        this.generateLog(preKey, preValue, curData);
      }
    }
    // 增加
    for (const [curKey, curValue] of Object.entries(curData || {})) {
      const preValue = preData[curKey];
      if (this.validValue(preValue)) continue;
      this.generateLog(curKey, null, curValue);
    }
  }


  generateLog(key, preValue, curValue) {
    let logStr = '';
    switch (this.getType(preValue)) {
      case 'String':
        logStr = this.generateBaseTypeLog(key, preValue, curValue);
        logStr && this.logs.push(logStr);
        break;
      case 'Number':
        logStr = this.generateBaseTypeLog(key, preValue, curValue);
        logStr && this.logs.push(logStr);
        break;
      case 'Object':
        this.generateObjectTypeLog(key, preValue, curValue || {});
        break;
      case 'Array':
        this.generateArrayTypeLog(key, preValue, curValue || []);
        break;
      case 'Null':
        this.reverse = true;
        this.generateLog(key, curValue, preValue);
        this.reverse = false;
    }
  }


  // =======  ========
  generateBaseTypeLog(key, preValue, curValue) {
    if (this.validValue(curValue)) {
      if (!this.isEquil(preValue, curValue)) {
        return this.modifyPropertyLog(key, preValue, curValue);
      }
    } else {
      return this.judgeAddOrDeletePropertyLog(key, preValue);
    }
    return '';
  }

  generateObjectTypeLog(key, preValue, curValue) {
    const _DiffLog = new DiffLog(preValue, curValue, this.logMap[key]);
    _DiffLog.reverse = this.reverse;
    const logs = _DiffLog.getLog();
    if (logs.length > 0) {
      this.logs = this.logs.concat(logs);
    }
  }

  generateArrayTypeLog(key, preValue, curValue) {
    preValue.forEach(itx => {
      const result = this.validValue(curValue) ? curValue.find(ity => this.isEquil(itx, ity, itx.$compareRule)) : null;
      if (!result || this.getType(result) === 'Object' || this.getType(result) === 'Array') {
        const _curValue = result ? result : null;
        this.generateLog(key, itx, _curValue);
      }
    });
  }

// ===============
// 修改内容log
  modifyPropertyLog(key, preValue, curValue) {
    return this.getMapLabel(key) + '：由' + preValue + '修改为' + curValue;
  }

// 删除内容log
  deletePropertyLog(key, preValue) {
    return '删除' + this.getMapLabel(key) + ':' + preValue;
  }

// 添加内容log
  addPropertyLog(key, curValue) {
    return '增加' + this.getMapLabel(key) + ':' + curValue;
  }

// 判断反转是添加还是删除工作记录
  judgeAddOrDeletePropertyLog(key, value) {
    return this.reverse ? this.addPropertyLog(key, value) : this.deletePropertyLog(key, value);
  }


// ======  基础方法  =========
// 从字段中获取文案
  getMapLabel(key, preValue, curValue) {
    return this.logMap[key] ? this.logMap[key] : key;
  }

  // 判断是否相等
  isEquil(preValue, curValue, customerRule) {
    if (this.validValue(customerRule)) {
      return customerRule(preValue, curValue);
    }
    return this.baseEquil(preValue, curValue);
  }

// 判断是否相等
  baseEquil(preValue, curValue) {
    return JSON.stringify(preValue) === JSON.stringify(curValue);
  }

// 获取类型
  getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
  }

// 是否为有效值
  validValue(value) {
    const type = this.getType(value);
    const validValues = {
      Array: () => value.length > 0,
      Object: () => Object.keys(value).length > 0,
      Number: () => value.toString() !== 'NaN',
      String: () => value.length > 0,
      Undefined: () => false,
      Null: () => false,
      Boolean: () => value,
    };
    return validValues[type] && validValues[type]();
  }
}

class DiffLog extends BaseDiffLog {
  constructor(preData, curData, logMap) {
    super(preData, curData, logMap);
  }


  // 修改内容log
  modifyPropertyLog(key, preValue, curValue) {
    const labelResult = this.getMapLabel(key, preValue, curValue);
    if (this.getType(labelResult) === 'String') return labelResult;
    if (this.getType(labelResult) === 'Null') return null;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return label + '：由' + preValueLabel + '修改为' + curValueLabel;
  }

  // 删除内容log
  deletePropertyLog(key, preValue) {
    const labelResult = this.getMapLabel(key, preValue, null);
    const labelResultType = this.getType(labelResult);
    if (labelResultType === 'String') return labelResult;
    if (this.getType(labelResult) === 'Null') return null;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return '删除' + label + ':' + preValueLabel;
  }

  // 添加内容log
  addPropertyLog(key, curValue) {
    const labelResult = this.getMapLabel(key, null, curValue);
    if (this.getType(labelResult) === 'String') return labelResult;
    if (this.getType(labelResult) === 'Null') return null;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return '增加' + label + ':' + curValueLabel;
  }

  // 从字段中获取文案
  getMapLabel(key, preValue, curValue) {
    const keyMap = this.logMap[key] ? this.logMap[key] : '';
    if (!this.validValue(keyMap)) return null;
    const keyMapTypes = this.getType(keyMap);
    const handleValueMapTypes = {
      'Object': () => {
        if (!this.validValue(keyMap.value)) return keyMap.label;
        return [keyMap.label, this.getValueMapLabel(keyMap.value, preValue), this.getValueMapLabel(keyMap.value, curValue)];
      },
      'Function': () => {
        return keyMap(key, preValue, curValue);
      },
    };
    if (handleValueMapTypes[keyMapTypes]) return handleValueMapTypes[keyMapTypes]();
    return [keyMap, preValue, curValue];
  }

  getValueMapLabel(arr, key) {
    if (!this.validValue(arr)) return '';
    const reslut = arr.find(el => el.key === key);
    return reslut && reslut.value;
  }
}

const log = new DiffLog(
  {
    gender: 1,
    aaa: 12,
    addressDetail: '焦点科技',
    contactDVOList: [{
      'contactId': 3001834,
      'name': '丁一字',
      'mobile': '158****7642',
      'mobileEn': '544776586f5066794b4e54576e487a61624733435537714266313646326f4e68',
      'weixin': '15826507642',
      'others': '其他内容',
      'delFlag': 0,
      'eeWeixin': 1,
      'gender': 0,
      'isDefault': 1,
      'relation': '030001',
      'weComCusId': 164,
      'weComName': '丁一字',
      'externalUserId': 'wmfvEMCAAA96n-2IiD2bAl0omGaoQ0Mw',
    }, {
      'contactId': 3002234,
      'name': '丁二字',
      'mobile': '175****3243',
      'mobileEn': '612b5957417963315857346e396666514558444a65786146392f385252556b62',
      'others': 'test',
      'delFlag': 0,
      'gender': 0,
      'isDefault': 0,
      'relation': '030003',
    }],
  },
  {
    gender: 0,
    // tagDesc: ['0', '1'],
    // // gender: 2, customerName: 'lisi',
    // tagMap: {
    //   1: [{
    //     tagDesc: '标签2',
    //   }],
    // },
    // "contactDVOList": [
    //   {
    //     "name": "1",
    //     // "mobile": "1",
    //     // "gender": "1",
    //     // "isDefault": "1",
    //     "relation": 1,
    //   }
    // ],
  }, logMap,
);
console.log(log.getLog());
