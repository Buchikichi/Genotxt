import * as Param from './param.js';

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

  createRelationships() {
    const group = this.female.createGroup();
    const path = this.female.doc.createElementNS(Param.SVG_NS, 'path');
    const d = [];
    const y = this.female.radius;
    const v = Param.GRID_HALF / 2;
    const h = (this.male.x - this.female.x) * Param.GRID_WIDTH;

    d.push(`M 0 ${y}`);
    d.push(`v ${v}`);
    d.push(`h ${h}`);
    d.push(`v ${-v}`);
    if (1 < this.children.length) {
      const first = this.children[0];
      const last = this.children[this.children.length - 1];
      const x1 = (first.x - this.female.x) * Param.GRID_WIDTH;
      const y1 = this.female.radius + Param.GRID_WIDTH - Param.GRID_HALF / 2;
      const h1 = (last.x - first.x) * Param.GRID_WIDTH;
      const h2 = -h1 / 2;

      d.push(`M ${x1} ${y1}`);
      d.push(`h ${h1}`);
      d.push(`m ${h2} 0`);
      d.push(`v ${-v}`);
    }
    this.children.forEach(c => {
      const cx = (c.x - this.female.x) * Param.GRID_WIDTH;
      const cy = this.female.radius + Param.GRID_WIDTH - Param.GRID_HALF / 2;

      d.push(`M ${cx} ${cy}`);
      d.push(`v ${v}`);
    });
    path.setAttribute('d', d.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'lightgrey')
    path.setAttribute('stroke-width', Param.STROKE_WIDTH);
    group.appendChild(path);
    return group;
  }

  toString() {
    return `${this.male.id}_${this.female.id}`;
  }
}
