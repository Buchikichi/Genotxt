import * as Param from './param.js';

export class GenotxtNode {
  constructor(doc, info) {
    this.width = Param.GRID_WIDTH;
    this.height = Param.GRID_WIDTH;
    this.radius = Param.GRID_HALF;
    this.doc = doc;
    this.info = info;
    this.id = info.id;
    this.generation = 0; // 0-based
    this.parents = null;
    this.partners = [];
  }

  get y() {
    return Param.GRID_WIDTH + this.generation * Param.GRID_WIDTH * 2
  }

  createGroup() {
    const group = this.doc.createElementNS(Param.SVG_NS, 'g');

    group.setAttribute('transform', `translate(${this.info.x}, ${this.y})`);
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

  updateGeneration(generation = null, sourceId = null) {
    if (sourceId == this.id) {
      return;
    }
    if (sourceId == null) {
      sourceId = this.id;
    }
    // console.log(`updateGeneration: ${this.id}:${generation}`);
    if (generation && generation != this.generation) {
      this.generation = generation;
    }
    if (this.parents && this.generation <= this.parents.generation) {
      const parent = this.generation;

      this.generation++;
      console.log(`parents: ${this.id}:${parent}`);
      this.parents.updateGeneration(parent, sourceId);
    }
    this.partners.forEach(p => p.updateDescendantsGeneration(this.generation, sourceId))
  }

  updatePos(pos = null, sourceId = null) {
  }
}
