import * as React from 'react';

type Props = {
  title: string;
  content: any;
};

export const CodeSection = ({ title, content }: Props) => {
  return (
    <div className="code-section">
      <h2>{title}</h2>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
};