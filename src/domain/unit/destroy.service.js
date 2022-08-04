import { getCurrentUnitsChances } from './chances.service'
import UnitStore from './unit.store'

class DestroyService { // TODO: переименовать? Как называть уничтожение и рождение?
  async destroySomeUnits() {
    const chancesByUnitIds = getCurrentUnitsChances()

    let destroyCount = 0
    await UnitStore.aliveUnits.forEach(unit => {
      const { surviveChance } = chancesByUnitIds.find(({ id }) => id === unit.id)

      const shouldBeDestroyed = (Math.random() < surviveChance)
      // TODO: (!) тут, похоже, неправильно считается, с обратным шансом выживания
      // TODO: понять почему NaN и 0 вылетают в surviveChance!

      if (shouldBeDestroyed) { // TODO: добавить удаление при вылете за предел возможных поколений
        destroyCount += 1

        unit.destroy()
      }
    })

    return destroyCount
  }

  async epidemicDestroy() {
    const chancesByUnitIds = getCurrentUnitsChances()

    let destroyCount = 0
    await UnitStore.aliveUnits.forEach(unit => {
      const { surviveChance } = chancesByUnitIds.find(({ id }) => id === unit.id)

      const shouldBeDestroyed = (Math.random() < surviveChance * 3)

      if (shouldBeDestroyed) { // TODO: добавить удаление при вылете за предел возможных поколений
        destroyCount += 1

        unit.destroy()
      }
    })

    return destroyCount
  }
}

export default new DestroyService()
