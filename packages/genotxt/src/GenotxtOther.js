import { GenotxtMark } from './GenotxtMark.js';
import * as Param from './param.js';

export class GenotxtOther extends GenotxtMark {
  constructor(doc, info) {
    super(doc, info);
  }

  createElement() {
    const group = this.createGroup();
    const rect = this.doc.createElementNS(Param.SVG_NS, 'rect');
    const width = this.width * 0.75;
    const half = width / 2;

    // group.appendChild(this.createCircle());
    rect.setAttribute('x', -half);
    rect.setAttribute('y', -half);
    rect.setAttribute('width', width);
    rect.setAttribute('height', width);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('stroke-width', Param.STROKE_WIDTH);
    rect.setAttribute('transform', 'rotate(45, 0, 0)');
    group.appendChild(rect);
    this.createText(group);
    return group;
  }
}
