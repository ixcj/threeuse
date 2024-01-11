/**
 * 格式化小数
 * @param n 数值
 * @param d 小数位数
 */
export function formattedDecimal(n: number, d: number = 2) {
  const multiple = Math.pow(10, d)

  return Math.round(n * multiple) / multiple
}

/**
 * 获取给定范围内随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @param {number} decimals 小数位数
 * @returns {number}
 */
export function getRandomNumber(min: number, max: number, decimals: number = 0) {
  const multiple = Math.pow(10, decimals)

  min = Math.ceil(min * multiple)
  max = Math.floor(max * multiple)

  const differenceValue = max - min
  const n = Math.random() * differenceValue + min

  return Math.round(n) / multiple
}
