import { GenotxtNode } from './GenotxtNode.js';
import { GenotxtPair } from './GenotxtPair.js';
import * as Param from './param.js';

export class GenotxtFemale extends GenotxtNode {
  constructor(doc, info) {
    super(doc, info);
    this.gender = 'f';
  }

  createRelationships() {
    const upper = super.createRelationships();

    if (this.partners.length == 0) {
      return upper;
    }
    const group = this.createGroup();
    const path = this.doc.createElementNS(Param.SVG_NS, 'path');

    if (upper) {
      group.appendChild(upper);
    }
    this.partners.forEach(p => {
      const d = [];
      const y = this.radius;
      const h = p.male.info.x - this.info.x;
      const v = this.radius;
      d.push(`M 0 ${y}`);
      d.push(`v ${v}`);
      d.push(`h ${h}`);
      d.push(`v ${-v}`);
      if (0 < p.children.length) {
        d.push(`M ${h / 2} ${y + v}`);
        d.push(`v ${v / 2}`);
      }
      path.setAttribute('d', d.join(' '));
    });
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black')
    path.setAttribute('stroke-width', Param.STROKE_WIDTH);
    group.appendChild(path);
    return group;
  }

  createElement() {
    const group = this.createGroup();

    group.appendChild(this.createCircle());
    this.createText(group);
    return group;
  }

  partnerWith(him, children = []) {
    const exists = this.partners.find(p => p.male.id === him.id);

    if (exists) {
      exists.addChildren(children);
    }
    const pair = new GenotxtPair(him, this);

    pair.addChildren(children)
    this.partners.push(pair);
    him.partners.push(pair);
  }
}
