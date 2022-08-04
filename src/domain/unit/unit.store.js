import {
  computed, makeAutoObservable, observable,
} from 'mobx'

import UnitModel from './unit.model'

class UnitStore {
  byId = observable.map()

  constructor() {
    makeAutoObservable(this, {
      aliveUnits: computed,
    })
  }

  get units() {
    return Array.from(this.byId.values())
  }

  get aliveUnits() {
    return [...this.byId.values()].filter(({ isDead }) => !isDead)
  }

  get currentHighestId() {
    const ids = Array.from(this.byId.keys())
      .map(key => parseInt(key, 10))
    if (ids.length) {
      return Math.max(...ids)
    }
    throw new Error('No elements in store')
  }

  load(units) {
    units.forEach(u => {
      let id
      // TODO: улучшить конструкцию?
      try {
        id = this.currentHighestId + 1
      } catch {
        id = 1
      }

      this.byId.set(id, new UnitModel({ ...u, id }))
    })
  }

  unload() {
    this.byId.clear()
  }
}

export default new UnitStore()
