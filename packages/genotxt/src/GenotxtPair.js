export class GenotxtPair {
  constructor(male, female) {
    this.male = male;
    this.female = female;
    this.children = [];
    this.order = null;
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

  getParents() {
    return this.male.parents ?? this.female.parents ?? null;
  }

  getPath() {
    const parents = this.getParents()?.getPath() ?? '';
    const order = `${100 + this.order}`.slice(1);

    return `${parents}/${order}`;
  }

  updateGeneration(generation) {
    if (this.male.generation === null) {
      this.male.updateGeneration(generation);
      this.children.forEach(c => c.updateGeneration(generation + 1));
    }
    if (this.female.generation === null) {
      this.female.updateGeneration(generation);
      this.children.forEach(c => c.updateGeneration(generation + 1));
    }
  }

  updateOrder(order) {
    if (this.male.order === null) {
      const parnerNumber = (this.female.partners.length - this.male.parnerNumber + 1) * 2;
      const newOrder = order - parnerNumber;

      this.male.updateOrder(newOrder);
      this.order = newOrder + 1;
    }
    if (this.female.order === null) {
      const parnerNumber = this.female.parnerNumber * 2;
      const newOrder = order + parnerNumber;

      this.female.updateOrder(newOrder);
      this.order = newOrder - 1;
    }
    this.children.forEach((c, ix) => c.updateOrder((ix + 1) * 10));
  }

  toString() {
    return `${this.male.id}_${this.female.id}`;
  }
}
