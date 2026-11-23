import * as Param from './param.js';

export class GenotxtNode {
  constructor(doc, info) {
    this.width = Param.GRID_WIDTH;
    this.height = Param.GRID_WIDTH;
    this.radius = Param.GRID_HALF;
    this.doc = doc;
    this.info = info;
    this.id = info.id;
    this.generation = null; // 0-based
    this.parents = null;
    this.partners = [];
    this.parnerNumber = null;
    this.order = null;
  }

  get y() {
    return Param.GRID_WIDTH + this.generation * Param.GRID_WIDTH * 2
  }

  getParents() {
    return this.parents ?? this.partners.find(p => p.getParents() !== null)?.getParents() ?? null;
  }

  getPath() {
    const parents = this.getParents()?.getPath() ?? '';
    const order = `${100 + this.order}`.slice(1);

    return `${parents}/${order}`;
  }

  createGroup() {
    const group = this.doc.createElementNS(Param.SVG_NS, 'g');
    const x = Param.GRID_WIDTH + this.x * Param.GRID_WIDTH;

    group.setAttribute('transform', `translate(${x}, ${this.y})`);
    return group;
  }

  createCircle(ratio = 1) {
    const circle = this.doc.createElementNS(Param.SVG_NS, 'circle');

    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', this.radius * ratio);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'black')
    circle.setAttribute('stroke-width', Param.STROKE_WIDTH);
    return circle;
  }

  createText(group) {
    if (this.info.name) {
      const text = this.doc.createElementNS(Param.SVG_NS, 'text');

      text.textContent = this.info.name + `  (${this.getPath()})`;
      text.setAttribute('x', 0);
      text.setAttribute('y', 50 + 20);
      text.setAttribute('font-size', Param.FONT_SIZE);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      group.appendChild(text);
    }
  }

  createRelationships() {
    if (!this.parents) {
      return null;
    }
    const group = this.createGroup();
    const path = this.doc.createElementNS(Param.SVG_NS, 'path');
    const d = [];
    const y = -this.radius;
    const v = -this.radius / 2;
    d.push(`M 0 ${y}`);
    d.push(`v ${v}`);
    path.setAttribute('d', d.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black')
    path.setAttribute('stroke-width', Param.STROKE_WIDTH);
    group.appendChild(path);
    return group;
  }

  updateGeneration(generation = 0) {
    this.generation = generation;
    this.partners.forEach(p => p.updateGeneration(generation));
  }

  updateOrder(order = 10) {
    this.order = order;
    this.partners.forEach(p => p.updateOrder(order));
  }

  updatePos(pos = null, sourceId = null) {
  }

  toString() {
    return `${this.id}(${this.info.name})`;
  }
}
