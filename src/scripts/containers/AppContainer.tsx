import React, { useState, useCallback, useMemo, useEffect } from 'react';
import WordInput from '../components/WordInput';
import Datalist from '../components/Datalist';
import listofwords from '../data/listofwords.json'
import { evaluate, EvaluatedResultState } from '../utils/Evaluate';
import NumericalSelect from '../components/NumericalSelect';
import styled from 'styled-components';
import Table from '../components/Table';

const DATALIST_ID = 'wordsList';

function mergeArrayReducerFactory <T>(key: number, val: T) {
  return (a:T[], c:T, i:number) => a.concat([ i === key ? val : c ]);
}

const FlexView = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  min-width: 50%;
`;

const PossibilityLabel = styled.div<{highlight: boolean}>`
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
`

const AppContainer: React.FC = () => {
  const [length, setLength] = useState<number | null>(null);
  const [wordList, setWordList] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [likenesses, setLikenesses] = useState<Array<number | null>>([]);
  const [state, setState] = useState<EvaluatedResultState | null>(null);

  const handleWordChangeFactory = (key: number) => (val: string) => setWords(words.reduce(mergeArrayReducerFactory(key, val), []));
  const handleLikenessChangeFactory = (key: number) => (val: number | null) => setLikenesses(likenesses.reduce(mergeArrayReducerFactory(key, val), []));

  useEffect(
    () => {
      if (length) {
        const baseWordList = listofwords.data.filter(v => v.length === length);
        const baseArray = new Array(baseWordList.length > 40 ? 40 : baseWordList.length);

        setWordList(baseWordList);
        setWords(Array.from(baseArray, () => ''));
        setLikenesses(Array.from(baseArray, () => null));
      }
    },
    [length],
  );

  useEffect(
    () => {
      if (length) {
        setState(evaluate({words, likenesses, length}));
      }
    },
    [words, likenesses],
  );

  return (
    <div className='app-container'>
      <div className='card'>
        <FlexView>
          <Label style={{marginRight: ".5rem"}}>INPUT WORD LENGTH (4-14): </Label>
          <NumericalSelect tabIndex={1} value={length} minimum={4} maximum={14} onSelect={ (n) => setLength(n) } />
        </FlexView>
        <Table show={!!(wordList.length && words.length && likenesses.length && state)}>
        {
          words.map((value, i) => {
            const likeness = likenesses[i];
            const possibility = state?.possibilities[i] ?? 0;
            const error = state?.errors[i];
            const mostPossible = (state?.mostPossibleIndexes.indexOf(i) ?? -1) > -1;
            return (
              <tr key={i}>
                <td>
                  <WordInput
                    list={DATALIST_ID}
                    value={value}
                    onChange={ handleWordChangeFactory(i) }
                    error={!!error}
                    tabIndex={i + 2}
                  />
                </td>
                <td>
                  <NumericalSelect
                    value={likeness}
                    onSelect={ handleLikenessChangeFactory(i) }
                    tabIndex={i + 2 + words.length}
                  />
                </td>
                <td>
                  <PossibilityLabel highlight={mostPossible}>
                    {(possibility * 100).toFixed(2)} %
                  </PossibilityLabel>
                </td>
              </tr>
            );
          })
        }
        </Table>
      </div>
      <Datalist data={wordList} id={DATALIST_ID} />
    </div>
  )
};

export default AppContainer;
