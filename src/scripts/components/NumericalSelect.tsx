import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  value: number | null;
  onSelect: (value: number | null) => void;
  minimum?: number;
  maximum?: number;
  tabIndex?: number;
}

const minimumValue = 0;
const maximumValue = 14;

const parse = (rawValue: string) => {
  if (rawValue && /^[0-9]+$/.test(rawValue)) {
    return parseInt(rawValue, 10);
  } else {
    return null;
  }
}

const fallback = (val: number | null, min: number, max: number) => {
  if (val === null) {
    return null;
  }

  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
};

const InputView = styled.input`
  text-align: right;
  max-width: 3rem;
`;

const NumericalSelect: React.FC<Props> = ({value, onSelect, minimum = minimumValue, maximum = maximumValue, ...props}) => {
  const [current, setCurrent] = useState<number | null>(value);
  const handleSelect = () => onSelect(fallback(current, minimum, maximum));

  useEffect(
    () => {
      if (value !== current) {
        setCurrent(value);
      }
    },
    [value],
  );

  useEffect(
    () => {
      const timer = setTimeout(handleSelect, 1000);
      return () => {
        clearTimeout(timer);
      }
    },
    [current],
  );

  return (
    <InputView
      type='number'
      max={maximum}
      min={minimum}
      step='1'
      value={current ?? ''}
      required
      tabIndex={props.tabIndex}
      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setCurrent(parse(e.target.value)) }
      onBlur={ handleSelect }
    />
  )
};

export default NumericalSelect;
