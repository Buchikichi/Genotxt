import { GenotxtMark } from './GenotxtMark.js';
import * as Param from './param.js';

export class GenotxtFetus extends GenotxtMark {
  constructor(doc, info) {
    super(doc, info);
  }

  createElement() {
    const group = this.createGroup();
    const triangle = this.doc.createElementNS(Param.SVG_NS, 'polygon');
    const ratio = 1.2;
    const width = this.width * ratio;
    const radius = width / 2;
    const translateY = radius / 2 - (radius - this.radius);
    const leftRadian = -210 / 180 * Math.PI;
    const leftX = Math.cos(leftRadian) * radius;
    const leftY = Math.sin(leftRadian) * radius;
    const rightRadian = -330 / 180 * Math.PI;
    const rightX = Math.cos(rightRadian) * radius;
    const rightY = Math.sin(rightRadian) * radius;
    const points = [
      `0,${-radius}`,
      `${leftX},${leftY}`,
      `${rightX},${rightY}`,
    ].join(' ');

    // group.appendChild(this.createCircle());
    triangle.setAttribute('transform', `translate(0, ${translateY})`);
    triangle.setAttribute("points", points);
    triangle.setAttribute('fill', 'none');
    triangle.setAttribute('stroke', 'black')
    triangle.setAttribute('stroke-width', Param.STROKE_WIDTH);
    group.appendChild(triangle);
    this.createText(group);
    return group;
  }
}
