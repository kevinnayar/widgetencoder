export type WidgetType =
  | 'WidgetInputText'
  | 'WidgetInputNumber'
  | 'WidgetScale'
  | 'WidgetSelect'
  | 'WidgetCheckbox';

type WidgetBase = {
  required: boolean;
  label?: string;
};

type WidgetInputText = WidgetBase & {
  type: 'WidgetInputText';
  title: string;
  placeholder?: string;
};

type WidgetInputNumber = WidgetBase & {
  type: 'WidgetInputNumber';
  placeholder?: string;
  min: number;
  max: number;
};

type WidgetScale = WidgetBase & {
  type: 'WidgetScale';
  min: number;
  max: number;
  step: number;
};

export type SelectOption = {
  value: string;
  displayValue: string;
};

type WidgetSelect = WidgetBase & {
  type: 'WidgetSelect';
  options: SelectOption[];
  defaultOption: null | SelectOption;
};

type WidgetCheckbox = WidgetBase & {
  type: 'WidgetCheckbox';
  options: [SelectOption, SelectOption];
  defaultOption: null | SelectOption;
};

export type Widget =
  | WidgetInputText
  | WidgetInputNumber
  | WidgetScale
  | WidgetSelect
  | WidgetCheckbox;

export type WidgetEncodingConfig = {
  type: WidgetType;
  size: number;
};

export type SearchResult = {
  match: string;
  score: number;
};
