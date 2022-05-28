import * as React from 'react';

type Props = {
  children: any;
  disabled?: boolean;
  classNames?: string[];
  onClick: () => void;
};

export const Button = ({ children, disabled, classNames, onClick }: Props) => (
  <button
    type="submit"
    disabled={disabled}
    className={`button ${classNames ? classNames.join(' ') : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);

