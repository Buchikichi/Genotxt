import { GenotxtNode } from './GenotxtNode.js';
import * as Param from './param.js';

export class GenotxtMale extends GenotxtNode {
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
}
