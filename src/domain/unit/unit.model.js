class UnitModel {
  id
  genes
  genereation
  isDead
  parentsIds
  mutationHistory

  constructor({
    generation = 1, genes, id, isDead = false, parentsIds, mutationHistory = [],
  }) {
    this.id = id
    this.genes = genes
    this.generation = generation
    this.isDead = isDead
    this.parentsIds = parentsIds
    this.mutationHistory = mutationHistory
  }

  destroy() {
    this.isDead = true
  }

  increaseGeneration() {
    this.generation += 1
  }
}

export default UnitModel
