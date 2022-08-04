import _ from 'lodash'

export const generateRandomHexadecimal = () => Math.floor(Math.random() * 16)
  .toString(16)

export const generateRandomHexColor = () => { // TODO: beautify
  let randomHexColor = ''
  while (randomHexColor.length !== 6) {
    randomHexColor = Math.floor(Math.random() * 16777215)
      .toString(16)
  }

  return randomHexColor
}

export const getRGBfromHex = hex => {
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

export const isBackgroundTooLight = hex => {
  const { r, g, b } = getRGBfromHex(hex)

  // TODO: окрасивить и обработать доп случаи где фон слишком светлый
  // (может есть у antd стандартные средства или удобная формула в сети)
  return r + g + b > 770
    || ((r < 50 || g < 50 || b < 50) && r + g + b > 540)
    || ((r > 240 || g > 240 || b > 240) && r + g + b > 500)
}

export const getRandomPopulationName = () => {
  const NAME_BEGINNINGS = ['Язво', 'Гетеро', 'Валю', 'Эпидо', 'Змее', 'Распи', 'Транти']
  const NAME_MIDDLES = ['мо', 'ма', 'фо', 'фа', 'зак', 'лаг', 'таг', 'раг', 'да', 'пи']
  const NAME_MIDDLES_2 = ['зо', 'тро', 'ра', 'ло', 'за', 'зи', 'зо', 'зи', 'во']
  const NAME_ENDINGS = ['крылы', 'фобы', 'тосы', 'мамбы', 'завры']

  return _.sample(NAME_BEGINNINGS) + _.sample(NAME_MIDDLES) + _.sample(NAME_MIDDLES_2) + _.sample(NAME_ENDINGS)
}
