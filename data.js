import Log from './log';

const data = {
  'customerId': 3117131,
  'customerName': '丁一字',
  'gender': 1,
  'age': '13',
  'customerSource': 6,
  'loginIdList': [532133],
  'contactDVOList': [{
    'contactId': 3001834,
    'name': '丁一字',
    'mobile': '158****7642',
    'mobileEn': '692f6956664a4d455772414a312f514856697943643074775472535369652b57',
    'weixin': '15826507642',
    'others': '其他内容',
    'delFlag': 0,
    'eeWeixin': 1,
    'gender': '0',
    'isDefault': 1,
    'relation': '030001',
    'weComCusId': 164,
    'weComName': '丁一字',
    'externalUserId': 'wmfvEMCAAA96n-2IiD2bAl0omGaoQ0Mw',
  }, {
    'mobile': '17583233243',
    'name': '丁二字',
    'relation': '030003',
    'gender': '0',
    'mark': '',
    'isDefault': 0,
    'others': 'test',
  }],
  'status': 0,
  'editable': 0,
  'integrity': '60%',
  'saleTagMap': {
    '1': [{
      'flag': true,
      'errMap': {},
      'noteMap': {},
      'createId': 19462,
      'modifyId': 19462,
      'delId': 0,
      'createTime': 1607913082333,
      'modifyTime': 1607913082333,
      'delTime': 1607913082000,
      'creatorName': 'jicheng',
      'modifierName': 'jicheng',
      'tagId': 4302,
      'tagType': 0,
      'tagCode': 'a64266cd1e914291995937b2156f23fb',
      'tagDesc': '养成',
      'tagSource': 1,
      'power': 1,
      'success': true,
    }, {
      'flag': true,
      'errMap': {},
      'noteMap': {},
      'createId': 19760,
      'modifyId': 19760,
      'delId': 0,
      'createTime': 1602641581175,
      'modifyTime': 1602641581175,
      'delTime': 1602641581000,
      'creatorName': 'baowei',
      'modifierName': 'baowei',
      'tagId': 3800,
      'tagType': 0,
      'tagCode': '4b38b40c9c594648a6685a4e2a9766a4',
      'tagDesc': '年龄大',
      'tagSource': 1,
      'power': 1,
      'success': true,
    }, {
      'flag': true,
      'errMap': {},
      'noteMap': {},
      'createId': 929,
      'modifyId': 929,
      'delId': 0,
      'createTime': 1597109326030,
      'modifyTime': 1597109326030,
      'delTime': 1597109326000,
      'creatorName': 'taoran',
      'modifierName': 'taoran',
      'tagId': 3300,
      'tagType': 0,
      'tagCode': 'ed597807738e4d1fb8f21d7680573a81',
      'tagDesc': '理财险',
      'tagSource': 1,
      'power': 1,
      'success': true,
    }],
  },
  'province': '420000',
  'city': '421000',
  'customerIdEn': '773458476a336c4f4a374779626f6a566769462b55513d3d',
  'customerSourceDesc': 'BI数据挖掘',
  'birthday': '2009-01-12 12:00:00',
  'job': 'bug工程师',
  'customerDesc': '业务好',
  'intentionalInsureType': ['101-06', '101-15'],
  'defineTag': ['a64266cd1e914291995937b2156f23fb', '4b38b40c9c594648a6685a4e2a9766a4', 'ed597807738e4d1fb8f21d7680573a81'],
  'focusOther': '惠泽',
  'salary': '一百万',
  'debt': '二百万',
  'addressDetail': '焦点科技',
};


const map = {
  'customerName': '客户姓名',
  'gender': {
    label: '客户性别',
    value: [{ key: 1, value: '女' }, { key: 0, value: '男' }],
  },
  'age': '客户年龄',
  'loginIdList': '客户id',
  'contactDVOList': {
    'name': '家庭成员姓名',
    'mobile': '家庭成员手机号',
    'others': '家庭成员其他内容',
    'gender': {
      label: '客户性别',
      value: [{ key: 1, value: '女' }, { key: 0, value: '男' }],
    },
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
    label: '意向险种'
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

const map = {
  'customerName': '客户姓名',
  'gender': {
    label: '客户性别',
    value: [{ key: 1, value: '女' }, { key: 0, value: '男' }, { key: -1, value: '请选择' }],
  },
  'age': {
    $compareRule: (pre, cur) => {
      return pre == cur;
    },
    label: '客户年龄',
  },
  'loginIdList': '客户id',
  'contactDVOList': {
    $compareRule: (pre, cur) => {
      console.log(21312312);
      return pre.mobile === cur.mobile;
    },
    'name': '家庭成员姓名',
    'mobile': '家庭成员手机号',
    'others': '家庭成员其他内容',
    'gender': {
      label: '客户性别',
      value: [{ key: 1, value: '女' }, { key: 0, value: '男' }],
    },
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
  'birthday': (preValue, curValue) => {
    return '出生日期:' + '由' + new Date(preValue) + '更改为' + curValue.toString()
  },
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
const customerDetailLog = new Log(props.customerDetail, customerDetail, map);
console.log(props.customerDetail, customerDetail);
console.log(customerDetailLog.getLog());
return;