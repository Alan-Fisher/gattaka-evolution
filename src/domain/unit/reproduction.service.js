import _ from 'lodash'

import { generateRandomHexadecimal } from 'common/helpers'

import UnitStore from './unit.store'

const MAX_MUTATIONS = 2 // TODO: плавный просчет количества возможных мутаций?
const REPRODUCTION_CHANCE = 0.3

class ReproductionService {
  getNewbornUnits = () => {
    const shouldReproduce = () => (Math.random() < REPRODUCTION_CHANCE)

    const getUnitsGenes = ([parent1, parent2]) => ([parent1.genes, parent2.genes])
    const getParentsIds = ([parent1, parent2]) => ([parent1.id, parent2.id])

    const newUnitsGenes = this.getUnitsPairs(UnitStore.aliveUnits)
      .map(unitPair => {
        if (shouldReproduce()) {
          const { newGenes, mutationHistory } = this.mutateGenes(this.mixGenes(...getUnitsGenes(unitPair)))

          return ({
            genes: newGenes,
            parentsIds: getParentsIds(unitPair),
            mutationHistory,
          })
        }

        return null
      })
      .filter((u) => u)

    UnitStore.load(newUnitsGenes)

    return newUnitsGenes.length
    // TODO: добавить вероятность рождения нескольких потомков?
  }

  mixGenes = (genes1, genes2) => {
    const g1 = genes1.split('')
    const g2 = genes2.split('')

    return g1.reduce((acc, elem, i) => { // TODO: Рефакт
      let nextGene = g1[i]

      if (_.random(1, 2) === 2) {
        nextGene = g2[i]
      }

      return acc + nextGene
    }, '')
  }

  mutateGenes = (genes) => {
    const generateMutationIndexes = () => {
      const mutationsCount = _.random(0, MAX_MUTATIONS)

      const mutationIndexes = []
      while (mutationIndexes.length < mutationsCount) {
        const r = _.random(0, genes.length - 1)

        if (!mutationIndexes.includes(r)) {
          mutationIndexes.push(r)
        }
      }

      return mutationIndexes
    }

    const genesArr = genes.split('')

    const mutationHistory = []

    generateMutationIndexes()
      .forEach(idx => {
        const randomHexadecimal = generateRandomHexadecimal()
        genesArr[idx] = randomHexadecimal

        mutationHistory.push({ idx, hex: randomHexadecimal })
      })

    return ({
      newGenes: genesArr.join(''),
      mutationHistory,
    })
  }

  // TODO: образовывать количество пар равное количеству юнитов, а не юниты/2?
  getUnitsPairs = (currentUnits) => {
    const unitsWithoutPair = currentUnits
    const pairs = []

    while (unitsWithoutPair.length >= 2) {
      const r1 = Math.random() * unitsWithoutPair.length
      const unit1 = unitsWithoutPair.splice(r1, 1)[0]

      const r2 = Math.random() * unitsWithoutPair.length
      const unit2 = unitsWithoutPair.splice(r2, 1)[0]

      pairs.push([unit1, unit2])
    }

    return pairs
  }
}

export default new ReproductionService()
