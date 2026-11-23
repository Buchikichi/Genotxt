import { GenotxtNode } from './GenotxtNode.js';
import { GenotxtPair } from './GenotxtPair.js';

export class GenotxtFemale extends GenotxtNode {
  constructor(doc, info) {
    super(doc, info);
    this.gender = 'f';
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
    this.parnerNumber = him.partners.length;
    him.parnerNumber = this.partners.length;
  }
}
