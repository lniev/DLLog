export interface MapConfig {
    label: string,
    data: filedMapData,
    $filedNames: { key: string, value: string },
    $ordered: boolean
}

export  type filedMapData = { key: string, value: string }[]

export enum TypeConstant {
    'Undefined' = 'undefined',
    'String' = 'string',
    'Number' = 'number',
    'Null' = 'null',
    'Boolean' = 'boolean',
    'NaN' = 'NaN',
    'Symbol' = 'symbol',
    'Function' = 'function',
    'Object' = '[object Object]',
    'ArrayBuffer' = '[object ArrayBuffer]',
    'FormData' = '[object FormData]',
    'Date' = '[object Date]',
    'File' = '[object File]',
    'Blob' = '[object Blob]',
    'URLSearchParams' = '[object URLSearchParams]',
    'Set' = '[object Set]',
    'Map' = '[object Map]',
    'Array' = '[object Array]',
}

