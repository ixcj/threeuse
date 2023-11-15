/**
 * 格式化小数
 * @param n 数值
 * @param d 小数位数
 */
export function formattedDecimal(n: number, d: number = 2) {
  const multiple = Math.pow(10, d)

  return Math.round(n * multiple) / multiple
}
