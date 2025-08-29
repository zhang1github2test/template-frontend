/**
 * 判断是否为外部链接
 */
export const isExternal = (path: string): boolean => {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证邮箱格式
 */
export const isEmail = (email: string): boolean => {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return reg.test(email)
}

/**
 * 验证手机号格式
 */
export const isPhone = (phone: string): boolean => {
    const reg = /^1[3-9]\d{9}$/
    return reg.test(phone)
}

/**
 * 验证用户名格式（字母、数字、下划线，3-20位）
 */
export const isUsername = (username: string): boolean => {
    const reg = /^[a-zA-Z0-9_]{3,20}$/
    return reg.test(username)
}

/**
 * 验证密码强度（至少包含字母和数字，6-20位）
 */
export const isStrongPassword = (password: string): boolean => {
    const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/
    return reg.test(password)
}

/**
 * 验证URL格式
 */
export const isUrl = (url: string): boolean => {
    const reg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return reg.test(url)
}

/**
 * 验证身份证号格式
 */
export const isIdCard = (idCard: string): boolean => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(idCard)
}

/**
 * 验证IP地址格式
 */
export const isIP = (ip: string): boolean => {
    const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return reg.test(ip)
}

/**
 * 验证是否为数字
 */
export const isNumber = (value: string): boolean => {
    const reg = /^\d+$/
    return reg.test(value)
}

/**
 * 验证是否为小数
 */
export const isDecimal = (value: string): boolean => {
    const reg = /^\d+(\.\d+)?$/
    return reg.test(value)
}

/**
 * 验证是否为正整数
 */
export const isPositiveInteger = (value: string): boolean => {
    const reg = /^[1-9]\d*$/
    return reg.test(value)
}