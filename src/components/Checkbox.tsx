import * as React from 'react';

type Props = {
  value: string;
  checked: boolean;
  setChecked: (c: boolean) => void;
};

export const Checkbox = ({ value, checked, setChecked }: Props) => {
  const id = value.replace(/ /g, "-").toLowerCase();
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id={id}
        name={id}
        value={value}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label htmlFor={id}>{value}</label>
    </div>
  );
};
