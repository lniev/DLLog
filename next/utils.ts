import {TypeConstant} from "./types";

export function isArrayBuffer(val: unknown): boolean {
    return getType(val) === TypeConstant.ArrayBuffer
}

export function isFormData(val: unknown): boolean {
    return getType(val) === TypeConstant.FormData
}

export function isPlainObject(val: unknown): boolean {
    if (getType(val) !== TypeConstant.Object) return false
    const prototype = Object.getPrototypeOf(val)
    return prototype === null || prototype === Object.prototype
}

export function isSet(val: unknown): boolean {
    return getType(val) === TypeConstant.Set
}

export function isMap(val: unknown): boolean {
    return getType(val) === TypeConstant.Map
}

export function isSymbol(val: unknown): boolean {
    return getType(val) === TypeConstant.Symbol
}

export function isDate(val: unknown): boolean {
    return getType(val) === TypeConstant.Date
}

export function isFile(val: unknown): boolean {
    return getType(val) === TypeConstant.File
}

export function isBlob(val: unknown): boolean {
    return getType(val) === TypeConstant.Blob
}

export function isFunction(val: unknown): boolean {
    return getType(val) === TypeConstant.Function
}

export function isURLSearchParams(val: unknown): boolean {
    return getType(val) === TypeConstant.URLSearchParams
}

export function isNull(val: unknown): boolean {
    return val === null
}

export function isString(val: unknown): boolean {
    return typeof val === TypeConstant.String
}

export function isNumber(val: unknown): boolean {
    return typeof val === TypeConstant.Number
}

export function isUndefined(val: unknown): boolean {
    return typeof val === TypeConstant.Undefined
}

export function isNaN(val: unknown): boolean {
    return isNumber(val) && val.toString() === TypeConstant.NaN
}

export function isArray(val: unknown): boolean {
    return val.toString() === TypeConstant.Array
}

export function isBoolean(val: unknown): boolean {
    return typeof val === TypeConstant.Boolean
}

export function getType(val: unknown): string {
    const type = typeof val
    if (type === "object") {
        if (val === null) return TypeConstant.Null
        return Object.prototype.toString.call(val)
    } else {
        return type
    }
}

export function isEqualType(val1, val2) {
    if (isNaN(val1)) return false
    return getType(val1) === getType(val2)
}

/**
 * 验证是否为不为空值
 * @param value
 */
export function validValue(value: any): boolean {
    const type = getType(value);
    const validValues: any = {
        [TypeConstant.Array]: () => value.length > 0,
        [TypeConstant.Object]: () => Object.keys(value).length > 0,
        [TypeConstant.Number]: () => value?.toString() !== 'NaN',
        [TypeConstant.String]: () => value.length > 0,
        [TypeConstant.Undefined]: () => false,
        [TypeConstant.Null]: () => false,
        [TypeConstant.Boolean]: () => true,
        [TypeConstant.Date]: () => true,
        [TypeConstant.Function]: () => true,
        [TypeConstant.Set]: () => value.size,
        [TypeConstant.Map]: () => value.size,
        [TypeConstant.Symbol]: () => true,
    };
    return validValues[type] && validValues[type]();
}

/**
 * 判断是否为基本类型
 * @param val
 */
export function isBaseType(val: any): boolean | undefined {
    const type = getType(val)
    const baseType = {
        [TypeConstant.Number]: true,
        [TypeConstant.String]: true,
        [TypeConstant.Undefined]: true,
        [TypeConstant.Null]: true,
        [TypeConstant.Boolean]: true,
        [TypeConstant.Symbol]: true,
    }
    return baseType[type]
}