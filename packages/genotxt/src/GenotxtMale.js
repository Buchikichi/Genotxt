import { GenotxtMark } from './GenotxtMark.js';
import { GenotxtPair } from './GenotxtPair.js';
import * as Param from './param.js';

export class GenotxtMale extends GenotxtMark {
  constructor(doc, info) {
    super(doc, info);
    this.gender = 'm';
  }

  createElement() {
    const group = this.createGroup();
    const rect = this.doc.createElementNS(Param.SVG_NS, 'rect');

    rect.setAttribute('x', -this.radius);
    rect.setAttribute('y', -this.radius);
    rect.setAttribute('width', this.width);
    rect.setAttribute('height', this.height);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('stroke-width', Param.STROKE_WIDTH);
    group.appendChild(rect);
    this.createText(group);
    return group;
  }

  partnerWith(her) {
    const exists = this.partners.some(p => p.female.id == her.id);

    if (!exists) {
      this.partners.push(new GenotxtPair(this, her));
    }
  }

  addChildren(her, children) {
    her.addChildren(this, children);
  }
}
