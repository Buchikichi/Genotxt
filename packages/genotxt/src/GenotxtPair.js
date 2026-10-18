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

  updateGeneration(generation) {
    this.children.forEach(c => c.updateGeneration(generation + 1));
  }
}
