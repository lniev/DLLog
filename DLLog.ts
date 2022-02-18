import {MapConfig, TypeConstant} from "./types";
import {getType, isBaseType, isEqualType, isFunction, isPlainObject, validValue} from "./utils";

class DLLog {
    private readonly curData: object = {}
    private readonly logMap: object = {}
    private logs: any[] = []
    private readonly preData: object = {}
    // 标记是否为数组，为数组生成的log中添加修改项的索引
    private isArray: boolean = false
    private readonly HandleMethods = {
        [TypeConstant.Object]: this.handleObjectProperty.bind(this),
        [TypeConstant.Array]: this.handleArrayProperty.bind(this),
        base: this.handleNormalProperty.bind(this),
    }
    private mapDataAlis = {
        key: 'key',
        value: 'value'
    }

    constructor(preData: object, curData: object, logMap: object) {
        this.preData = preData;
        this.curData = curData;
        this.logMap = logMap
    }


    generateLog() {
        this.handleObjectProperty(this.preData, this.curData, null, null, this.logMap)
        return this.logs
    }

    /**
     * 处理对象类型的数据
     * @param preData
     * @param curData
     * @param key
     * @param index
     * @param logMap
     */
    handleObjectProperty(preData: any, curData: any, key: string, index: number, logMap) {
        if (isEqualType(preData, curData)) {
            // @ts-ignore
            const _logMap = key ? logMap[key] : logMap
            const keys = Object.keys(_logMap);
            for (const k of keys) {
                this.judgePropertyType(preData[k], curData[k], k, 0, _logMap)
            }
        } else {
            const validPreData = validValue(preData)
            const validCurData = validValue(curData)
            if (validPreData || validCurData) {
                const _logMap = key ? logMap[key] : logMap
                const keys = Object.keys(_logMap);
                for (const k of keys) {
                    const preValue = validPreData ? preData[k] : null
                    const curValue = validCurData ? curData[k] : null
                    this.judgePropertyType(preValue, curValue, k, 0, _logMap)
                }
            }
        }
    }

    handleArrayProperty(preData, curData, key, index, logMap) {
        this.isArray = true
        this.compareArrayOrdered(preData, curData, key, index, logMap)
        this.isArray = false
    }

    compareArrayOrdered(preData, curData, key, index, logMap) {
        for (let i = 0; i < preData.length; i++) {
            if (isEqualType(preData[i], curData[i])) {
                this.judgePropertyType(preData[i], curData[i], key, i, logMap)
            } else {
                const validPreData = validValue(preData[i])
                const validCurData = validValue(curData[i])
                const preValue = validPreData ? preData[i] : null
                const curValue = validCurData ? curData[i] : null
                this.judgePropertyType(preValue, curValue, key, i, logMap)
            }
        }
    }


    private judgePropertyType(preValue, curValue, key, index, logMap) {
        const preType = getType(preValue)
        const curType = getType(curValue)
        if (this.HandleMethods[preType]) {
            this.HandleMethods[preType](preValue, curValue, key, index, logMap)
        } else if (this.HandleMethods[curType]) {
            this.HandleMethods[curType](preValue, curValue, key, index, logMap)
        } else {
            this.HandleMethods['base'](preValue, curValue, key, index, logMap)
        }
    }

    /**
     * 处理基本类型属性
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    private handleNormalProperty(preValue, curValue, key, index, logMap) {
        // 都是基本类型才生成log
        if (isBaseType(preValue) && isBaseType(curValue)) {
            this.judgeLogType(preValue, curValue, key, index, logMap)
        }
    }

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
    private judgeLogType(preValue, curValue, key, index, logMap) {
        const isValidPreVal = validValue(preValue)
        const isValidCurVal = validValue(curValue)
        let logStr = ''
        const config = logMap[key]
        // 如果配置项是函数则为自定义log
        if (isFunction(config)) {
            logStr = config(preValue, curValue, key, index, logMap)
        } else {
            // 否则为默认的生成log的规则
            if (isValidPreVal && !isValidCurVal) {
                logStr = this.generateDeleteLog(preValue, curValue, key, index, logMap)
            } else if (!isValidPreVal && isValidCurVal) {
                logStr = this.generateAddLog(preValue, curValue, key, index, logMap)
            } else if (isValidPreVal && isValidCurVal) {
                if (preValue !== curValue) {
                    logStr = this.generateModifyLog(preValue, curValue, key, index, logMap)
                }
            }
        }
        logStr && this.logs.push(logStr)
    }

    /**
     * 生成删除log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     * @private
     */
    private generateDeleteLog(preValue, curValue, key, index, logMap) {
        const config = logMap[key]
        if (this.isArray) return `删除${isPlainObject(config) ? config.label : config}[${index}]:${preValue.toString()}`
        return `删除${isPlainObject(config) ? config.label : config}:${preValue.toString()}`
    }

    /**
     * 生成添加log
     * Generate Add log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    private generateAddLog(preValue, curValue, key, index, logMap) {
        const config = logMap[key]
        if (this.isArray) return `添加${isPlainObject(config) ? config.label : config}[${index}]:${curValue.toString()}}`
        return `添加${isPlainObject(config) ? config.label : config}:${curValue.toString()}}`
    }

    /**
     * 修改log
     * modify log
     * @param preValue
     * @param curValue
     * @param key
     * @param index
     * @param logMap
     */
    private generateModifyLog(preValue, curValue, key, index, logMap) {
        const config = logMap[key]
        if (this.isArray) return `${isPlainObject(config) ? config.label : config}[${index}]:由${preValue.toString()}修改成:${curValue.toString()}`
        return `${isPlainObject(config) ? config.label : config}:由${preValue.toString()}修改成:${curValue.toString()}`
    }

    private getLabelFromMapData(data: { key: any, value: string }[], key: any) {
        return data.find(el => el[this.mapDataAlis.key] === key)?.[this.mapDataAlis.value] || ''
    }

    public setMapDataAlis(key: string, value: string) {
        this.mapDataAlis = {key, value}
    }
}

const log = new DLLog({
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
    name: {a: {b: '姓名'}},
    // age: '年龄',
    arr: '数组',
    contact: {
        name: '联系人姓名',
        $mapData: []
    },
    age: (preValue, curValue, key, index, logMap) => {
        console.log(preValue, curValue, key, index, logMap)
        return preValue + '' + curValue + index
    }
})
console.log(log.generateLog())


// 1、数组添加非顺序的map比较
// 2、可以替换基本的log文字信息
// 3、添加config