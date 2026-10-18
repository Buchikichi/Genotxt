import { GenotxtMale } from './GenotxtMale.js';
import { GenotxtFemale } from './GenotxtFemale.js';
import { GenotxtFetus } from './GenotxtFetus.js';
import { GenotxtOther } from './GenotxtOther.js';

export class GenotxtNodeFactory {
  static newInstance(doc, info) {
    let instance;
    // console.log(info);
    if ('[' == info.type) {
      instance = new GenotxtMale(doc, info);
    }
    if ('[[' == info.type) {
      instance = new GenotxtMale(doc, info);
    }
    if ('(' == info.type) {
      instance = new GenotxtFemale(doc, info);
    }
    if ('((' == info.type) {
      instance = new GenotxtFemale(doc, info);
    }
    if ('<' == info.type) {
      instance = new GenotxtOther(doc, info);
    }
    if ('/' == info.type) {
      instance = new GenotxtFetus(doc, info);
    }
    return instance;
  }
}
