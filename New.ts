const logMap = {
    a: '年龄',
    b: '数组',
    c: {
        d: '姓名'
    }
}
const preData = {
    a: 1,
    b: [2,3],
    c: {d:'zhang'}
}

const curData = {
    a: 2,
    b: [4,5],
    c: {d:'wangzi'}
}
const set = new Set([])
for (const key of logMap) {
        set.add({
            key,
            label: logMap[key],
            value: preData[key],
        })
}