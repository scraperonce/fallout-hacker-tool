type Popularity = {[key in string]: number};

const popularityReducer = (a: Popularity, c: string): Popularity => {
  a[c] = a[c] ? 1 + a[c] : 1;

  return a;
};

export default class Word {
  private chars: string[] = [];

  constructor(private original: string) {
    if (this.original.length) {
      this.chars = this.original.split('');
    }
  }

  public get length(): number {
    return this.original.length
  }

  public calcurateSimilarities(operands: Word[]): number[] {
    return operands.map(operand => {
      if (this === operand || this.length === 0) {
        return 0;
      }

      const norm = this.chars.map((c, i) => c === operand.chars[i] ? 1 : 0).reduce((a, c) => a + c, 0);

      return norm;
    });
  }
}
