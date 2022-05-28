import * as React from 'react';
import { ChangeEventHandler } from 'react';

type Props = {
  list: string[],
  onChange: ChangeEventHandler<HTMLSelectElement>
};

export const Dropdown = ({ list, onChange }: Props) => {
  return (
    <select onChange={onChange}>
      {list.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};