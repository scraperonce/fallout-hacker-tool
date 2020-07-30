import Word from "../types/Word";

export interface EvaluateParameters {
  words: string[];
  likenesses: Array<number | null>;
  length: number;
}

export interface EvaluatedResultState {
  possibilities: number[];
  errors: Array<string | null>;
  mostPossibleIndexes: number[];
}

const validate = (words: string[], length: number): Array<string | null> => (
  words.map(v => {
    if (v === '') return null;

    if (v.length !== length) {
      return 'length not matched';
    }

    if (words.indexOf(v) !== words.lastIndexOf(v)) {
      return 'duplicated';
    }

    return null;
  })
);

const calcuratePossibilities = (words: Word[], likenesses: Array<number | null>): number[] => {
  const similarityRelations = words.map((item, i, ar) => item.calcurateSimilarities(ar));

  const ignoredWordIndexes = likenesses.reduce((list, likeness, wordIndex) => (
    likeness === null ? list : [...list, ...(similarityRelations[wordIndex].reduce((a, c, i) => c !== likeness ? [...a, i] : a, []))]
  ), [] as number[]).filter((item, i, ar) => ar.indexOf(item) === i);


  const result = similarityRelations.map((item, i, ar) => (
    ignoredWordIndexes.indexOf(i) > -1 ? 0 : item.reduce((a, b) => a + b, 0)
  ));

  const total = result.reduce((a, c) => a + c, 0);

  return total ? result.map(q => q / total) : result;
};

const selectHigherPossibilities = (possibilities: number[]): number[] => {
  const high = Math.max(...possibilities);

  return high === 0 ? [] : possibilities.reduce((a, c, i) => c === high ? [...a, i] : a, [] as number[]);
};

export const evaluate = ({words, likenesses, length}: EvaluateParameters): EvaluatedResultState => {
  const errors = validate(words, length);

  if (errors.filter(v => v !== null).length) {
    return {
      possibilities: Array.from(words, () => 0),
      errors,
      mostPossibleIndexes: [],
    };
  }

  const objectiveWords = words.map((w, i) => new Word(w));
  const possibilities = calcuratePossibilities(objectiveWords, likenesses);

  return {
    possibilities,
    errors,
    mostPossibleIndexes: selectHigherPossibilities(possibilities),
  };
}
