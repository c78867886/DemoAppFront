import * as math from 'mathjs';
import Matrix = mathjs.Matrix;

export class CMatrix {
  private _values: Matrix;
  private _type: string;

  constructor(type?: string) {
    this.values = math.matrix();
    if ( type ) {
      this.type = type;
    }
  }

  populateMainEffect(noGroups: number) {
    if (!Number.isInteger(noGroups)) {
      throw new Error('You have a fractional number of groups in your main effect. This is not a valid.');
    } else if (noGroups < 2) {
      throw Error('You have less than 2 groups in your main effect. This is not a valid.');
    } else {
      const ident = math.diag(Array(noGroups - 1).fill(-1), 'dense');
      const vec  = math.ones([noGroups - 1, 1]);
      this.values = math.matrix(math.concat(vec, ident));
      console.log(this.values);
    }
  }

  toTeX(): string {
    let texString = '$\\begin{bmatrix}';
    let row = 0;
    this.values.forEach(function (value, index, matrix) {
      if (index[0] > row) {
        row = index[0];
        texString = texString.slice(0, texString.length - 2) + '\\\\';
      }
      texString = texString + value + ' & '
    })
    texString = texString.slice(0, texString.length - 2) + '\\end{bmatrix}$';
    return texString;
  }

  get values(): Matrix {
    return this._values;
  }

  set values(value: Matrix) {
    this._values = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }
}
