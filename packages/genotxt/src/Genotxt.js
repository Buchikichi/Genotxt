import { GenotxtNodeFactory } from './GenotxtNodeFactory.js';
import * as Param from './param.js';

export class Genotxt {
  static regexNode = /^([0-9]+|[a-z0-9]+)([\[\(</]{1,2})(.+?)([\]\)>/]{1,2})(\d{4})?\~?(\d{4})?$/;
  static regexRel = /^([a-z0-9]+)_([a-z0-9]+)(?:\:([a-z,]+))?$/;

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
    const [male, female] = 'm' == instance1.gender ? [instance1, instance2] : [instance2, instance1];

    // console.log(`rel: ${male.id}_${female.id}`);
    if ('m' == male.gender && 'f' == female.gender) {
      if (info.children) {
        const children = info.children.split(',')
          .map(id => this.getNode(id.trim()))
          .filter(c => !c.parents);

        female.partnerWith(male, children);
      } else {
        female.partnerWith(male);
      }
    } else {
      // ToDo: error
    }
  }

  getRoot() {
    const roots = [...this.ids.values()].filter(n => (n.getParents() === null)).toSorted((a, b) => a.parnerNumber - b.parnerNumber);
    const male = roots.filter(n => 'm' == n.gender);
    const female = roots.filter(n => 'f' == n.gender);

    if (1 < male.length && 1 < female.length) {
      console.warn(`There are male ${male} roots.`);
      console.warn(`There are female ${female} roots.`);
      return null;
    }
    return male.length == 1 ? male[0] : female[0];
  }

  updateGeneration() {
    const root = this.getRoot();

    if (root === null) {
      console.warn('No root node found.');
      return;
    }
    // console.log(`Root: ${root}`);
    root.updateGeneration();
    root.updateOrder();
  }

  shiftPosition(target, diffX) {
    const nodes = [...this.ids.values()].filter(n => n.generation === target.generation && n.x >= target.x);

    nodes.forEach(n => n.x += diffX);
  }

  updatePosition() {
    const root = this.getRoot();
    const generation = [...this.ids.values()].reduce((max, n) => max.generation < n.generation ? n : max, root).generation;

    // console.log(`Generation: ${generation + 1}`);
    for (var g = 0; g <= generation; g++) {
      const nodes = [...this.ids.values()].filter(n => n.generation === g).toSorted((a, b) => a.getPath().localeCompare(b.getPath()));

      nodes.forEach((n, ix) => n.x = ix * 2);
    }
    const relations = this.ids.values()
      .filter(n => 'f' == n.gender)
      .flatMap(f => f.partners)
      .filter(p => p.children.length);

    [...relations].toSorted((a, b) => {
      const byGeneration = b.male.generation - a.male.generation;

      if (byGeneration !== 0) {
        return byGeneration;
      }
      return a.male.getPath().localeCompare(b.male.getPath());
    }).forEach(p => {
      // console.log(`Relation: ${p.male.id}_${p.female.id}`);
      const { target, deviation } = p.detectDeviation();
      if (target) {
        // console.log(`detectDeviation: ${target} deviation: ${deviation}`);
        this.shiftPosition(target, deviation);
      }
    });
  }

  generateActors(text) {
    const lines = text.split(/\r?\n/).filter(l => l).map(l => l.trim());

    lines.forEach(l => {
      if (l.startsWith('#')) {
        return;
      }
      const matchNode = Genotxt.regexNode.exec(l);
      const matchRel = Genotxt.regexRel.exec(l);

      if (matchNode) {
        const [, id, type, name, close, begin, end] = matchNode;

        this.addNode({
          id,
          type,
          name,
          close,
          begin,
          end,
        });
      } else if (matchRel) {
        const [, id1, id2, children] = matchRel;

        this.addRel({
          id1,
          id2,
          children,
        });
      }
    });
    this.updateGeneration();
    this.updatePosition();
  }

  fillSvg(svg) {
    const relations = this.ids.values()
      .filter(n => 'f' == n.gender)
      .flatMap(f => f.createRelationships())
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
