import React, { useCallback, ChangeEvent, useState, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  list?: string;
  onChange: (value: string) => void;
  value: string;
  error?: boolean;
  tabIndex?: number;
}

const InputView = styled.input<{error: boolean}>`
  color: ${props => props.error ? 'red !important;' : 'inherit'};
`;

const WordInput: React.FC<Props> = ({value, onChange, list, error = false, ...props}) => {
  const [text, setText] = useState('');

  useEffect(
    () => {
      if (value !== text) setText(value);
    },
    [value],
  )

  const handleChange = useCallback(
    () => onChange(text.toUpperCase()),
    [onChange, text]
  );

  return (
    <InputView
      error={error}
      type='text'
      autoComplete='on'
      value={text}
      tabIndex={props.tabIndex}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
      onBlur={handleChange}
      list={list}
    />
  );
};

export default WordInput;
