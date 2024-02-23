const formattedDecimalMode = <const>['round', 'floor', 'ceil']

/**
 * 格式化小数
 * @param {number} num - 数值
 * @param {number} [decimals=2] - 小数位数
 * @param {string} [mode=round] - 取整模式  round 四舍五入. floor 下取整. ceil 上取整.
 */
export function formattedDecimal(
  num: number,
  decimals: number = 2,
  mode: typeof formattedDecimalMode[number] = formattedDecimalMode[0]
) {
  const multiple = Math.pow(10, decimals)
  const modeMethod = formattedDecimalMode.includes(mode)
    ? Math[mode]
    : Math.round

  return modeMethod(num * multiple) / multiple
}

/**
 * 获取给定范围内随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {number} [decimals=0] - 小数位数
 * @returns {number}
 */
export function getRandomNumber(
  min: number,
  max: number,
  decimals: number = 0
) {
  const differenceValue = max - min
  const num = Math.random() * differenceValue + min

  return formattedDecimal(num, decimals)
}
