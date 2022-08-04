import _ from 'lodash'

import { generateRandomHexColor } from 'common/helpers'

import UnitStore from './unit.store'

class GenerationService {
  createFirstGeneration() {
    UnitStore.unload()

    const randomHexColors = _.range(0, 13)
      .map(() => ({ genes: generateRandomHexColor() }))

    UnitStore.load(randomHexColors)
  }

  increaseGenerationForAliveUnits = () => {
    UnitStore.aliveUnits.forEach(unit => {
      unit.increaseGeneration()
    })
  }
}

export default new GenerationService()
