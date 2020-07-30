import React, { useState, useEffect } from 'react';

interface Props {
  id: string;
  data: string[];
}

const Datalist: React.FC<Props> = ({id, data}) => {
  return (
    <datalist id={id}>
      { data.map((s, i) => <option key={i} value={s} />) }
    </datalist>
  );
};

export default Datalist;
