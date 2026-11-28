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
    const bottomOfParents = this.female.radius;
    const v = Param.GRID_WIDTH - Param.GRID_HALF / 2;
    const h = this.male.x - this.female.x;

    // Relationship of male and female
    d.push(`M 0 ${bottomOfParents}`);
    d.push(`v ${v}`);
    d.push(`h ${h}`);
    d.push(`v ${-v}`);
    // Relationship of parents and children
    if (1 < this.children.length) {
      const first = this.children[0];
      const last = this.children[this.children.length - 1];
      const x1 = first.x - this.female.x;
      const y1 = first.top - this.female.y - v;
      const h1 = last.x - first.x;
      const h2 = -h1 / 2;

      d.push(`M ${x1} ${y1}`);
      d.push(`h ${h1}`);
      d.push(`m ${h2} 0`);
    }
    if (0 < this.children.length) {
      const first = this.children[0];
      const last = this.children[this.children.length - 1];
      const center = (first.x + last.x) / 2 - this.female.x;
      const centerY = first.top - this.female.y - v;
      const remainV = first.top - this.female.bottom - v * 2;

      d.push(`M ${center} ${centerY}`);
      d.push(`v ${-remainV}`);
    }
    // Each child's horn.
    this.children.forEach(c => {
      const cx = c.x - this.female.x;
      const cy = c.top - this.female.y;

      d.push(`M ${cx} ${cy}`);
      d.push(`v ${-v}`);
    });
    path.setAttribute('d', d.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', Param.STROKE_WIDTH);
    path.setAttribute('class', 'relationship');
    group.appendChild(path);
    return group;
  }

  detectDeviation() {
    const center = (this.male.pos + this.female.pos) / 2;

    if (this.children.length === 0) {
      return {};
    }
    if (this.children.length === 1) {
      const target = this.children[0];
      const deviation = center - target.pos;

      if (0 < deviation) {
        // console.log(`detect: ${target} deviation: ${deviation}`);
        return { target, deviation };
      }
      if (deviation < 0) {
        // console.log(`detect: ${target} deviation: ${deviation}`);
        return { target: this.female, deviation: -deviation };
      }
      return {};
    }
    const first = this.children[0];
    const last = this.children[this.children.length - 1];
    const centerOfChildren = (first.pos + last.pos) / 2;
    const deviation = center - centerOfChildren;

    if (deviation < 0) {
      return { target: this.male, deviation: -deviation };
    }
    return {};
  }

  toString() {
    return `${this.male.id}_${this.female.id}`;
  }
}
