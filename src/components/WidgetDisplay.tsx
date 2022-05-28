import * as React from 'react';
import { WidgetType } from '../types/widgetTypes';
import { Button } from './Button';

const InlineWidgetDisplay = ({ type }: { type: WidgetType }) => {
  let src = '';

  switch(type) {
    case 'WidgetCheckbox': {
      // @ts-ignore
      src = require('../images/WidgetCheckbox.jpg');
      break;
    }
    case 'WidgetInputNumber': {
      // @ts-ignore
      src = require('../images/WidgetInputNumber.jpg');
      break;
    }
    case 'WidgetInputText': {
      // @ts-ignore
      src = require('../images/WidgetInputText.jpg');
      break;
    }
    case 'WidgetScale': {
      // @ts-ignore
      src = require('../images/WidgetScale.jpg');
      break;
    }
    case 'WidgetSelect': {
      // @ts-ignore
      src = require('../images/WidgetSelect.jpg');
      break;
    }
    default: {
      throw new Error(`Unexpected type: ${type}`);
    }
  }

  return (
    <div className='widget'>
      <img alt={`${type}`} src={src} />
    </div>
  );
};

type Props = {
  type: WidgetType;
  index: number;
  onDeleteWidget?: (i: number) => void;
};

export const WidgetDisplay = ({ type, index, onDeleteWidget }: Props) => {
  return onDeleteWidget ? (
    <div className='widget-with-delete' key={`${type}.${index}`}>
      <InlineWidgetDisplay type={type} />
      <Button classNames={['button--delete']} onClick={() => onDeleteWidget(index)}>
        +
      </Button>
    </div>
  ) : (
    <InlineWidgetDisplay type={type} />
  );
};
