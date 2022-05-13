const DDLog = require("./index.cjs");


const logMap = {
  customerName: "客户姓名",
  gender: {
    label: "客户性别",
    value: [
      { key: 1, value: "女" },
      { key: 0, value: "男" },
    ],
  },
  age: "客户年龄",
  loginIdList: "客户id",
  contactDVOList: {
    $compareRule: (pre, cur) => {
      return true;
    },
    name: "家庭成员姓名",
    mobile: "家庭成员手机号",
    others: "家庭成员其他内容",
    gender: "家庭成员性别",
    isDefault: "默认联系人",
    relation: {
      label: "家庭成员关系",
      value: [
        { key: "030001", value: "本人" },
        { key: "030003", value: "亲戚" },
      ],
    },
  },
  saleTagMap: {
    1: "系统标签",
  },
  province: "420000",
  city: "421000",
  birthday: "出生日期",
  job: "职业",
  customerDesc: "简介",
  intentionalInsureType: {
    label: "意向险种",
    value: [
      {
        key: "101-06",
        value: "家财险",
      },
      {
        key: "101-15",
        value: "企业财险",
      },
    ],
  },
  defineTag: [
    "a64266cd1e914291995937b2156f23fb",
    "4b38b40c9c594648a6685a4e2a9766a4",
    "ed597807738e4d1fb8f21d7680573a81",
  ],
  focusOther: "关注其他平台",
  salary: "家庭收入",
  debt: "家庭负债",
  addressDetail: "详细地址",
};

const log = new DDLog(
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