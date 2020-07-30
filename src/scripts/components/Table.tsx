import React from 'react';
import styled from 'styled-components';

interface Props {
  show?: boolean;
}

const TableView = styled.table<Props>`
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`;

const Table: React.FC<Props> = ({show = true, children}) => {
  return (
    <TableView show={show} cellSpacing='6'>
      <thead>
        <tr>
          <th>WORD DISPLAYED</th>
          <th>LIKENESS</th>
          <th>POSSIBILITY</th>
        </tr>
      </thead>
      <tbody>
      {children}
      </tbody>
    </TableView>
  )
};

export default Table;
