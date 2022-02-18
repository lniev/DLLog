"use strict";
exports.__esModule = true;
exports.isBaseType = exports.validValue = exports.isEqualType = exports.getType = exports.isBoolean = exports.isArray = exports.isNaN = exports.isUndefined = exports.isNumber = exports.isString = exports.isNull = exports.isURLSearchParams = exports.isFunction = exports.isBlob = exports.isFile = exports.isDate = exports.isSymbol = exports.isMap = exports.isSet = exports.isPlainObject = exports.isFormData = exports.isArrayBuffer = void 0;
var types_1 = require("./types");
function isArrayBuffer(val) {
    return getType(val) === types_1.TypeConstant.ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;
function isFormData(val) {
    return getType(val) === types_1.TypeConstant.FormData;
}
exports.isFormData = isFormData;
function isPlainObject(val) {
    if (getType(val) !== types_1.TypeConstant.Object)
        return false;
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
exports.isPlainObject = isPlainObject;
function isSet(val) {
    return getType(val) === types_1.TypeConstant.Set;
}
exports.isSet = isSet;
function isMap(val) {
    return getType(val) === types_1.TypeConstant.Map;
}
exports.isMap = isMap;
function isSymbol(val) {
    return getType(val) === types_1.TypeConstant.Symbol;
}
exports.isSymbol = isSymbol;
function isDate(val) {
    return getType(val) === types_1.TypeConstant.Date;
}
exports.isDate = isDate;
function isFile(val) {
    return getType(val) === types_1.TypeConstant.File;
}
exports.isFile = isFile;
function isBlob(val) {
    return getType(val) === types_1.TypeConstant.Blob;
}
exports.isBlob = isBlob;
function isFunction(val) {
    return getType(val) === types_1.TypeConstant.Function;
}
exports.isFunction = isFunction;
function isURLSearchParams(val) {
    return getType(val) === types_1.TypeConstant.URLSearchParams;
}
exports.isURLSearchParams = isURLSearchParams;
function isNull(val) {
    return val === null;
}
exports.isNull = isNull;
function isString(val) {
    return typeof val === types_1.TypeConstant.String;
}
exports.isString = isString;
function isNumber(val) {
    return typeof val === types_1.TypeConstant.Number;
}
exports.isNumber = isNumber;
function isUndefined(val) {
    return typeof val === types_1.TypeConstant.Undefined;
}
exports.isUndefined = isUndefined;
function isNaN(val) {
    return isNumber(val) && val.toString() === types_1.TypeConstant.NaN;
}
exports.isNaN = isNaN;
function isArray(val) {
    return val.toString() === types_1.TypeConstant.Array;
}
exports.isArray = isArray;
function isBoolean(val) {
    return typeof val === types_1.TypeConstant.Boolean;
}
exports.isBoolean = isBoolean;
function getType(val) {
    var type = typeof val;
    if (type === "object") {
        if (val === null)
            return types_1.TypeConstant.Null;
        return Object.prototype.toString.call(val);
    }
    else {
        return type;
    }
}
exports.getType = getType;
function isEqualType(val1, val2) {
    if (isNaN(val1))
        return false;
    return getType(val1) === getType(val2);
}
exports.isEqualType = isEqualType;
/**
 * 验证是否为不为空值
 * @param value
 */
function validValue(value) {
    var _a;
    var type = getType(value);
    var validValues = (_a = {},
        _a[types_1.TypeConstant.Array] = function () { return value.length > 0; },
        _a[types_1.TypeConstant.Object] = function () { return Object.keys(value).length > 0; },
        _a[types_1.TypeConstant.Number] = function () { return (value === null || value === void 0 ? void 0 : value.toString()) !== 'NaN'; },
        _a[types_1.TypeConstant.String] = function () { return value.length > 0; },
        _a[types_1.TypeConstant.Undefined] = function () { return false; },
        _a[types_1.TypeConstant.Null] = function () { return false; },
        _a[types_1.TypeConstant.Boolean] = function () { return true; },
        _a[types_1.TypeConstant.Date] = function () { return true; },
        _a[types_1.TypeConstant.Function] = function () { return true; },
        _a[types_1.TypeConstant.Set] = function () { return value.size; },
        _a[types_1.TypeConstant.Map] = function () { return value.size; },
        _a[types_1.TypeConstant.Symbol] = function () { return true; },
        _a);
    return validValues[type] && validValues[type]();
}
exports.validValue = validValue;
/**
 * 判断是否为基本类型
 * @param val
 */
function isBaseType(val) {
    var _a;
    var type = getType(val);
    var baseType = (_a = {},
        _a[types_1.TypeConstant.Number] = true,
        _a[types_1.TypeConstant.String] = true,
        _a[types_1.TypeConstant.Undefined] = true,
        _a[types_1.TypeConstant.Null] = true,
        _a[types_1.TypeConstant.Boolean] = true,
        _a[types_1.TypeConstant.Symbol] = true,
        _a);
    return baseType[type];
}
exports.isBaseType = isBaseType;
