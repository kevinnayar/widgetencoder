import distance from 'jaro-winkler';
import { encodeWidgets } from './encodingUtils';
import { WidgetType, Widget, SearchResult } from '../types/widgetTypes';
import { widgetList } from '../constants';

export function createWidget(
  type: WidgetType,
  isRequired?: boolean,
  label?: string,
  range?: { min: number; max: number; step?: number }
): Widget {
  const required = Boolean(isRequired);
  const min = range ? range.min : 0;
  const max = range ? range.max : 100;
  const step = range && range.step ? range.step : 10;

  switch (type) {
    case 'WidgetInputText': {
      return {
        type: 'WidgetInputText',
        required,
        label,
        title: ''
      };
    }
    case 'WidgetInputNumber': {
      return {
        type: 'WidgetInputNumber',
        required,
        label,
        min,
        max
      };
    }
    case 'WidgetScale': {
      return {
        type: 'WidgetScale',
        required,
        label,
        min,
        max,
        step
      };
    }
    case 'WidgetSelect': {
      return {
        type: 'WidgetSelect',
        required,
        label,
        options: [
          { value: 'yes', displayValue: 'Yes' },
          { value: 'no', displayValue: 'No' }
        ],
        defaultOption: null
      };
    }
    case 'WidgetCheckbox': {
      return {
        type: 'WidgetCheckbox',
        required,
        label,
        options: [
          { value: 'yes', displayValue: 'Yes' },
          { value: 'no', displayValue: 'No' }
        ],
        defaultOption: { value: 'yes', displayValue: 'Yes' }
      };
    }
    default: {
      throw new Error(`Unsupported widget type: ${type}`);
    }
  }
}

function createRandonWidget(): Widget {
  const index = Math.floor(Math.random() * widgetList.length);
  const type = widgetList[index] as WidgetType;
  return createWidget(type);
}

export function createRandomCollection(): Widget[] {
  const widgets: Widget[] = [];
  const list = [5, 6, 7, 8, 9, 10];
  const len = list[Math.floor(Math.random() * list.length)];

  for (let i = 0; i < len; i += 1) {
    const widget = createRandonWidget();
    widgets.push(widget);
  }

  return widgets;
}

export function generateRandomCollections(iter: number): string[] {
  const encodedList: string[] = [];

  for (let i = 0; i < iter; i += 1) {
    const collection: Widget[] = createRandomCollection();
    const encodedCollection = encodeWidgets(collection);
    encodedList.push(encodedCollection);
  }

  console.log({ encodedList });
  return encodedList;
}

export function getSearchResults(encoded: string, encodedLists: string[]) {
  const results: Array<SearchResult> = [];

  for (const match of encodedLists) {
    const score = distance(encoded, match);
    results.push({ match, score });
  }

  return results.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });
}
