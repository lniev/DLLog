 class BaseDiffLog {
  constructor(preData, curData, logMap) {
    this.preData = preData;
    this.curData = curData;
    this.logMap = logMap;
    this.logs = [];
    this.reverse = false;
  }

  getLog(preData = this.preData, curData = this.curData) {
    this.getObjectLog(preData, curData);
    return this.logs;
  }

  // ======= 获取log分类 =======
  getObjectLog(preData, curData) {
    // 修改删除
    for (const [preKey, preValue] of Object.entries(preData || {})) {
      if (this.validValue(curData)) {
        const curValue = curData && curData[preKey];
        this.generateLog(preKey, preValue, curValue);
        // logItem && this.logs.push(logItem);
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

  generateLog(key, preValue, curValue, idx) {
    let logStr = '';
    if (!this.validValue(preValue)) {
      preValue = null;
    }
    switch (this.getType(preValue)) {
      case 'String':
        logStr = this.generateBaseTypeLog(key, preValue, curValue, idx);
        logStr && this.logs.push(logStr);
        break;
      case 'Number':
        logStr = this.generateBaseTypeLog(key, preValue, curValue, idx);
        logStr && this.logs.push(logStr);
        break;
      case 'Object':
        this.generateObjectTypeLog(key, preValue, curValue || {});
        break;
      case 'Array':
        this.generateArrayTypeLog(key, preValue, curValue || []);
        break;
      case 'Null':
        if (!this.validValue(curValue)) break;
        this.reverse = true;
        this.generateLog(key, curValue, preValue);
        this.reverse = false;
        break;
    }
  }

  // =======  ========
  generateBaseTypeLog(key, preValue, curValue, index) {
    if (this.validValue(curValue)) {
      if (!this.isEqual(key, preValue, curValue)) {
        return this.modifyPropertyLog(key, preValue, curValue, index);
      }
    } else {
      return this.judgeAddOrDeletePropertyLog(key, preValue, index);
    }
    return '';
  }

  generateObjectTypeLog(key, preValue, curValue) {
    if (!this.logMap?.[key]) return;
    const _DiffLog = new DiffLog(preValue, curValue, this.logMap[key]);
    _DiffLog.reverse = this.reverse;
    _DiffLog.logs = this.logs;
    _DiffLog.getLog();
  }

  generateArrayTypeLog(key, preValue, curValue) {
    this.generateDisorderlyArrayTypeLog(key, preValue, curValue);
  }

  generateOrderlyArrayTypeLog(key, preValue, curValue) {
    for (let i = 0; i < preValue.length; i++) {
      this.generateLog(key, preValue[i], curValue[i], i);
    }
    for (let i = 0; i < curValue.length; i++) {
      if (i > preValue.length - 1) {
        this.generateLog(key, null, curValue[i], i);
      }
    }
  }

  generateDisorderlyArrayTypeLog(key, preValue, curValue) {
    const arrayItemType = this.getType(preValue[0]);
    if (arrayItemType === 'Object' || arrayItemType === 'Array') {
      this.generateOrderlyArrayTypeLog(key, preValue, curValue);
    } else {
      if (this.validValue(curValue)) {
        preValue.forEach((itx, idx) => {
          const sameResult = this.getType(curValue) === 'Array' ? curValue.find((ity, idy) => this.isEqual(key, itx, ity, idx, idy)) : null;
          if (!this.validValue(sameResult)) {
            this.generateLog(key, itx, null, idx);
          }
        });
        this.getType(curValue) === 'Array' &&
          curValue.forEach((itx, idx) => {
            const sameResult = preValue.find((ity) => this.isEqual(key, itx, ity));
            if (!this.validValue(sameResult)) {
              this.generateLog(key, null, itx, idx);
            }
          });
      } else {
        preValue.forEach((itx, idx) => {
          this.generateLog(key, itx, null, idx);
        });
      }
    }
  }

  // ===============
  // 修改内容log
  modifyPropertyLog(key, preValue, curValue, index) {
    return this.getMapLabel(key, index) + '：由' + preValue + '修改为' + curValue;
  }

  // 删除内容log
  deletePropertyLog(key, preValue, index) {
    return '删除' + this.getMapLabel(key, index) + ':' + preValue;
  }

  // 添加内容log
  addPropertyLog(key, curValue, index) {
    return '增加' + this.getMapLabel(key, index) + ':' + curValue;
  }

  // 判断反转是添加还是删除工作记录
  judgeAddOrDeletePropertyLog(key, value, index) {
    return this.reverse ? this.addPropertyLog(key, value, index) : this.deletePropertyLog(key, value, index);
  }

  // ======  基础方法  =========
  // 从字段中获取文案
  getMapLabel(key, preValue, curValue, index) {
    return this.logMap[key] ? this.logMap[key] : key;
  }

  // 判断是否相等
  isEqual(key, preValue, curValue, idx, idy) {
    if (this.logMap?.[key]?.$compareRule) {
      return this.logMap[key].$compareRule.call(this, key, preValue, curValue, idx, idy);
    }
    return this.baseEqual(preValue, curValue);
  }

  // 判断是否相等
  baseEqual(preValue, curValue) {
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
      Function: () => true,
      Date: () => true,
    };
    return validValues[type] && validValues[type]();
  }
}

export default class DDLog extends BaseDiffLog {
  constructor(preData, curData, logMap) {
    super(preData, curData, logMap);
  }

  // 修改内容log
  modifyPropertyLog(key, preValue, curValue, index) {
    const labelResult = this.getMapLabel(key, preValue, curValue, index);
    if (!this.validValue(labelResult)) return null;
    if (this.getType(labelResult) === 'String') return labelResult;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return label + '：由' + preValueLabel + '修改为' + curValueLabel;
  }

  // 删除内容log
  deletePropertyLog(key, preValue, index) {
    const labelResult = this.getMapLabel(key, preValue, null, index);
    if (!this.validValue(labelResult)) return null;
    const labelResultType = this.getType(labelResult);
    if (labelResultType === 'String') return labelResult;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return '删除' + label + ':' + preValueLabel;
  }

  // 添加内容log
  addPropertyLog(key, curValue, index) {
    const labelResult = this.getMapLabel(key, null, curValue, index);
    if (!this.validValue(labelResult)) return null;
    if (this.getType(labelResult) === 'String') return labelResult;
    const [label, preValueLabel, curValueLabel] = labelResult;
    return '增加' + label + ':' + curValueLabel;
  }

  // 从字段中获取文案
  getMapLabel(key, preValue, curValue, index) {
    const keyMap = this.logMap[key] ? this.logMap[key] : '';
    if (!this.validValue(keyMap)) return null;
    const keyMapTypes = this.getType(keyMap);
    const handleValueMapTypes = {
      Object: () => {
        if (!this.validValue(keyMap.value)) return [keyMap.label, preValue, curValue];
        return [
          keyMap.label,
          this.getLabelFromMapValue(keyMap.value, preValue, key, index),
          this.getLabelFromMapValue(keyMap.value, curValue, key, index),
        ];
      },
      Function: () => {
        return keyMap.call(this, key, preValue, curValue, index);
      },
    };
    if (handleValueMapTypes[keyMapTypes]) return handleValueMapTypes[keyMapTypes].call(this);
    return [keyMap, preValue, curValue];
  }

  getLabelFromMapValue(arr, key, parentKey) {
    if (!this.validValue(arr)) return key;
    const fieldNames = this.logMap?.[parentKey].$fieldNames;
    const result = arr.find((el) => el[fieldNames?.key || 'key'] === key);
    return (result && result[fieldNames?.value || 'value']) || key;
  }
}
