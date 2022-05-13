"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var utils_1 = require("./utils");
var DLLog = /** @class */ (function () {
    function DLLog(preData, curData, logMap) {
        var _a;
        this.curData = {};
        this.logMap = {};
        this.logs = [];
        this.preData = {};
        // 标记是否为数组，为数组生成的log中添加修改项的索引
        this.isArray = false;
        this.HandleMethods = (_a = {},
            _a[types_1.TypeConstant.Object] = this.handleObjectProperty.bind(this),
            _a[types_1.TypeConstant.Array] = this.handleArrayProperty.bind(this),
            _a.base = this.handleNormalProperty.bind(this),
            _a);
        this.mapDataAlis = {
            key: 'key',
            value: 'value'
        };
        this.preData = preData;
        this.curData = curData;
        this.logMap = logMap;
    }
    DLLog.prototype.generateLog = function () {
        this.handleObjectProperty(this.preData, this.curData, null, null, this.logMap);
        return this.logs;
    };
    /**
     * 处理对象类型的数据
     * @param preData
     * @param curData
     * @param key
     * @param index
     * @param logMap
     */
    DLLog.prototype.handleObjectProperty = function (preData, curData, key, index, logMap) {
        if ((0, utils_1.isEqualType)(preData, curData)) {
            // @ts-ignore
            var _logMap = key ? logMap[key] : logMap;
            var keys = Object.keys(_logMap);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                this.judgePropertyType(preData[k], curData[k], k, 0, _logMap);
            }
        }
        else {
            var validPreData = (0, utils_1.validValue)(preData);
            var validCurData = (0, utils_1.validValue)(curData);
            if (validPreData || validCurData) {
                var _logMap = key ? logMap[key] : logMap;
                var keys = Object.keys(_logMap);
                for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                    var k = keys_2[_a];
                    var preValue = validPreData ? preData[k] : null;
                    var curValue = validCurData ? curData[k] : null;
                    this.judgePropertyType(preValue, curValue, k, 0, _logMap);
                }
            }
        }
    };
    DLLog.prototype.handleArrayProperty = function (preData, curData, key, index, logMap) {
        this.isArray = true;
        this.compareArrayOrdered(preData, curData, key, index, logMap);
        this.isArray = false;
    };
    DLLog.prototype.compareArrayOrdered = function (preData, curData, key, index, logMap) {
        for (var i = 0; i < preData.length; i++) {
            if ((0, utils_1.isEqualType)(preData[i], curData[i])) {
                this.judgePropertyType(preData[i], curData[i], key, i, logMap);
            }
            else {
                var validPreData = (0, utils_1.validValue)(preData[i]);
                var validCurData = (0, utils_1.validValue)(curData[i]);
                var preValue = validPreData ? preData[i] : null;
                var curValue = validCurData ? curData[i] : null;
                this.judgePropertyType(preValue, curValue, key, i, logMap);
            }
        }
    };
    DLLog.prototype.judgePropertyType = function (preValue, curValue, key, index, logMap) {
        var preType = (0, utils_1.getType)(preValue);
        var curType = (0, utils_1.getType)(curValue);
        if (this.HandleMethods[preType]) {
            this.HandleMethods[preType](preValue, curValue, key, index, logMap);
        }
        else if (this.HandleMethods[curType]) {
            this.HandleMethods[curType](preValue, curValue, key, index, logMap);
        }
        else {
            this.HandleMethods['base'](preValue, curValue, key, index, logMap);
        }
    };
    /**
     * 处理基本类型属性
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    DLLog.prototype.handleNormalProperty = function (preValue, curValue, key, index, logMap) {
        // 都是基本类型才生成log
        if ((0, utils_1.isBaseType)(preValue) && (0, utils_1.isBaseType)(curValue)) {
            this.judgeLogType(preValue, curValue, key, index, logMap);
        }
    };
    //========== 基本生成日志方法  Basic generation log method ==========
    /**
     * 判断要生成的log 是删除,添加,还是修改
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     * @private
     */
    DLLog.prototype.judgeLogType = function (preValue, curValue, key, index, logMap) {
        var isValidPreVal = (0, utils_1.validValue)(preValue);
        var isValidCurVal = (0, utils_1.validValue)(curValue);
        var logStr = '';
        var config = logMap[key];
        // 如果配置项是函数则为自定义log
        if ((0, utils_1.isFunction)(config)) {
            logStr = config(preValue, curValue, key, index, logMap);
        }
        else {
            // 否则为默认的生成log的规则
            if (isValidPreVal && !isValidCurVal) {
                logStr = this.generateDeleteLog(preValue, curValue, key, index, logMap);
            }
            else if (!isValidPreVal && isValidCurVal) {
                logStr = this.generateAddLog(preValue, curValue, key, index, logMap);
            }
            else if (isValidPreVal && isValidCurVal) {
                if (preValue !== curValue) {
                    logStr = this.generateModifyLog(preValue, curValue, key, index, logMap);
                }
            }
        }
        logStr && this.logs.push(logStr);
    };
    /**
     * 生成删除log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     * @private
     */
    DLLog.prototype.generateDeleteLog = function (preValue, curValue, key, index, logMap) {
        var config = logMap[key];
        if (this.isArray)
            return "\u5220\u9664".concat((0, utils_1.isPlainObject)(config) ? config.label : config, "[").concat(index, "]:").concat(preValue.toString());
        return "\u5220\u9664".concat((0, utils_1.isPlainObject)(config) ? config.label : config, ":").concat(preValue.toString());
    };
    /**
     * 生成添加log
     * Generate Add log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    DLLog.prototype.generateAddLog = function (preValue, curValue, key, index, logMap) {
        var config = logMap[key];
        if (this.isArray)
            return "\u6DFB\u52A0".concat((0, utils_1.isPlainObject)(config) ? config.label : config, "[").concat(index, "]:").concat(curValue.toString(), "}");
        return "\u6DFB\u52A0".concat((0, utils_1.isPlainObject)(config) ? config.label : config, ":").concat(curValue.toString(), "}");
    };
    /**
     * 修改log
     * modify log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    DLLog.prototype.generateModifyLog = function (preValue, curValue, key, index, logMap) {
        var config = logMap[key];
        if (this.isArray)
            return "".concat((0, utils_1.isPlainObject)(config) ? config.label : config, "[").concat(index, "]:\u7531").concat(preValue.toString(), "\u4FEE\u6539\u6210:").concat(curValue.toString());
        return "".concat((0, utils_1.isPlainObject)(config) ? config.label : config, ":\u7531").concat(preValue.toString(), "\u4FEE\u6539\u6210:").concat(curValue.toString());
    };
    DLLog.prototype.getLabelFromMapData = function (data, key) {
        var _this = this;
        var _a;
        return ((_a = data.find(function (el) { return el[_this.mapDataAlis.key] === key; })) === null || _a === void 0 ? void 0 : _a[this.mapDataAlis.value]) || '';
    };
    DLLog.prototype.setMapDataAlis = function (key, value) {
        this.mapDataAlis = { key: key, value: value };
    };
    return DLLog;
}());
var log = new DLLog({
    // name: {a: {b: 1}},
    // arr: [1, 2, 3],
    // contact: [{
    //     name: null
    // }],
    age: 12
}, {
    // name: {a: {b: 2}},
    // arr: [2, 5],
    // contact: [{
    //     name: '张三'
    // }],
    age: null
}, {
    name: { a: { b: '姓名' } },
    // age: '年龄',
    arr: '数组',
    contact: {
        name: '联系人姓名',
        $mapData: []
    },
    age: function (preValue, curValue, key, index, logMap) {
        console.log(preValue, curValue, key, index, logMap);
        return preValue + '' + curValue + index;
    }
});
console.log(log.generateLog());
// 1、数组添加非顺序的map比较
// 2、可以替换基本的log文字信息
// 3、添加config
