import { GenotxtNodeFactory } from './GenotxtNodeFactory.js';
import * as Param from './param.js';

export class Genotxt {
  static regexNode = /^([0-9]+|[a-z0-9]+)([\[\(</]{1,2})(.+?)([\]\)>/]{1,2})(\d{4})?\~?(\d{4})?$/;
  static regexRel = /^([a-z0-9]+)-([a-z0-9]+)(?:\:([a-z,]+))?$/;

  constructor(doc) {
    this.doc = doc;
    this.ids = new Map();
  }

  getNode(id, type = '<') {
    if (this.ids.has(id)) {
      return this.ids.get(id);
    }
    const instance = GenotxtNodeFactory.newInstance(this.doc, {
      id: id,
      type: type,
      name: id,
    });
    this.ids.set(id, instance);
    return instance;
  }

  addId(instance) {
    const info = instance.info;

    if (!this.ids.has(info.id)) {
      // New ID.
      this.ids.set(info.id, instance);
      return;
    }
    // Update info. ToDo: 後で考える
    const old = this.ids.get(info.id);

    if (!old.name) {
      old.name = info.name;
    }
  }

  addNode(info) {
    const instance = GenotxtNodeFactory.newInstance(this.doc, info);

    this.addId(instance);
    return instance;
  }

  addRel(info) {
    // console.log(info);
    const instance1 = this.getNode(info.id1, '[');
    const instance2 = this.getNode(info.id2, '(');
    const { gender: g1 } = instance1;
    const { gender: g2 } = instance2;

    if ('m' == g1 && 'f' == g2 || 'm' == g2 && 'f' == g1) {
      instance1.partnerWith(instance2);
      instance2.partnerWith(instance1);
      if (info.children) {
        const children = info.children.split(',')
          .map(id => this.getNode(id.trim()))
          .filter(c => !c.parents);

        instance1.addChildren(instance2, children);
      }
    } else {
      // ToDo: error
    }
  }

  generateActors(text) {
    const lines = text.split(/\r?\n/).filter(l => l).map(l => l.trim());
    let psudoX = Param.GRID_WIDTH;

    lines.forEach(l => {
      const matchNode = Genotxt.regexNode.exec(l);
      const matchRel = Genotxt.regexRel.exec(l);

      if (matchNode) {
        const [, id, type, name, close, begin, end] = matchNode;

        this.addNode({
          x: psudoX,
          id: id,
          type: type,
          name: name,
          close: close,
          begin: begin,
          end: end,
        });
        psudoX += 200;
      } else if (matchRel) {
        const [, id1, id2, children] = matchRel;

        this.addRel({
          id1: id1,
          id2: id2,
          children: children,
        });
      }
    });
    for (const actor of this.ids.values()) {
      actor.updateGeneration();
      actor.updatePos();
    }
  }

  fillSvg(svg) {
    const relations = this.ids.values()
      .map(a => a.createRelationships())
      .filter(g => g);

    for (const rel of relations) {
      svg.appendChild(rel)
    }
    svg.setAttribute('width', '2000');
    svg.setAttribute('height', '2000');
    svg.setAttribute('viewBox', '0 0 2000 2000');
    for (const value of this.ids.values()) {
      svg.appendChild(value.createElement());
    }
  }

  addBgToText(svg) {
    const texts = svg.querySelectorAll('text');

    texts.forEach(t => {
      const bbox = t.getBBox();
      const padding = 2;
      const bg = this.doc.createElementNS(Param.SVG_NS, 'rect');

      bg.setAttribute('x', bbox.x - padding);
      bg.setAttribute('y', bbox.y - padding / 2);
      bg.setAttribute('width', bbox.width + (padding * 2));
      bg.setAttribute('height', bbox.height + padding);
      bg.setAttribute('stroke', 'none');
      bg.setAttribute('fill', 'rgba(240, 240, 240, 0.95)');
      t.parentNode.insertBefore(bg, t);
    });
  }

  generate(view, text) {
    const svg = this.doc.createElementNS(Param.SVG_NS, 'svg');

    this.generateActors(text);
    this.fillSvg(svg);
    view.replaceChildren(svg);
    // this.addBgToText(svg);
    return svg;
  }
}
