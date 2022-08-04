import { getRGBfromHex } from 'common/helpers'

import UnitStore from './unit.store'

// TODO: переиграть, т.к. нет необходимости просчитывать разные цвета, считаем близость к абсолюту
// const PURE_GENES = ['ff0000', '00ff00', '0000ff'] // TODO: Вести всё к красному цвету?
const PURE_GENES = ['ff0000'] // TODO: Вести всё к красному цвету?

// Используется и для высчета выживаемости, и для высчета потенциального рождения
export const getCurrentUnitsChances = () => {
  // TODO: (!) проверить, что оно действительно каждый раз считает шансы только между живыми юнитами

  const unitsPersonalChances = UnitStore.aliveUnits.map(unit => ({
    ...unit,
    personalChance: 1 / getMaxPersonalChanceFromFlagmanGenes(unit.genes),
  }))

  // TODO: прописать что за chances
  const commonChance = unitsPersonalChances.reduce((acc, { personalChance }) => acc + personalChance, 0)

  return unitsPersonalChances.map(({ id, personalChance, generation }) => ({
    id, surviveChance: personalChance / commonChance * Math.sqrt(generation), // TODO: Считать иначе?
  }))
  // (!) Похоже, что это не surviveChance, а deathChance
}

const getMaxPersonalChanceFromFlagmanGenes = (unitGenes) => {
  const differentPureGenesDifferences = PURE_GENES.map((genes) => countGenesDifference(genes, unitGenes))

  return Math.min(...differentPureGenesDifferences)
}

// TODO: (!) переименовать-таки везде genes в hexcolor или стоять на своем?
const countGenesDifference = (genes1, genes2) => {
  const rgb1 = getRGBfromHex(genes1)
  const rgb2 = getRGBfromHex(genes2)

  return (Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b)) / 3 * 100
}
// TODO: добавить влияние поколения на шансы
