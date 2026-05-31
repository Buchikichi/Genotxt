export class GenotxtPair {
  constructor(male, female) {
    this.male = male;
    this.female = female;
    this.children = [];
  }

  addChildren(children) {
    const map = new Map([...this.children, ...children].map(c => [c.id, c]));
    const ids = this.children.map(c => c.id);
    const ext = children.map(c => c.id);
    const uniq = [...new Set([...ids, ...ext])];

    this.children = uniq.map(id => {
      const child = map.get(id);

      child.parents = this;
      return child;
    });
  }

  updateGeneration(generation, sourceId) {
    console.log(`sourceId: ${sourceId}`);
    if (this.male.id != sourceId) {
      console.log(`male: ${this.male.id}:${generation}`);
      this.male.updateGeneration(generation, sourceId);
    }
    if (this.female.id != sourceId) {
      console.log(`female: ${this.female.id}:${generation}`);
      this.female.updateGeneration(generation, sourceId);
    }
  }

  updateDescendantsGeneration(generation, sourceId) {
    this.children.filter(c => c.id != sourceId)
      .forEach(c => c.updateGeneration(generation + 1, sourceId));
  }
}
