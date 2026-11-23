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
    this.x = 0;
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

      text.textContent = this.info.name;
      // text.textContent = this.info.name + `(${this.getPath()})`;
      text.setAttribute('x', 0);
      text.setAttribute('y', 50 + 20);
      text.setAttribute('font-size', Param.FONT_SIZE);
      // text.setAttribute('font-weight', 'bold');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('stroke', 'white');
      text.setAttribute('stroke-width', '8');
      text.setAttribute('stroke-linejoin', 'round');
      text.setAttribute('stroke-opacity', '0.6');
      text.setAttribute('class', 'name');
      group.appendChild(text);
    }
  }

  createRelationships() {
    return this.partners.map(p => p.createRelationships());
  }

  updateGeneration(generation = 0) {
    this.generation = generation;
    this.partners.forEach(p => p.updateGeneration(generation));
  }

  updateOrder(order = 10) {
    this.order = order;
    this.partners.forEach(p => p.updateOrder(order));
  }

  toString() {
    return `${this.id}(${this.info.name})`;
  }
}
