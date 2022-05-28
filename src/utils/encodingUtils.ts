import distance from 'jaro-winkler';
import { WidgetType, Widget, SelectOption, SearchResult } from '../types/widgetTypes';
import {
  widgetList,
  widgetTypeToKeyMap,
  widgetKeyToTypeMap
} from '../constants';

function widgetEncoder(abbr: string, widget: Widget): string {
  let encoded = abbr;

  encoded += widget.required ? "1" : "0";
  encoded += widget.label ? "1" : "0";

  if ("min" in widget && "max" in widget) {
    encoded += widget.min.toString().padStart(3, "0");
    encoded += widget.max.toString().padStart(3, "0");
  }

  if ("step" in widget) {
    encoded += widget.step.toString().padStart(3, "0");
  }

  if ("options" in widget) {
    encoded += widget.options.length.toString().padStart(3, "0");
  }

  if ("defaultOption" in widget) {
    encoded += widget.defaultOption ? "1" : "0";
  }

  return encoded;
}

function widgetDecoder(type: WidgetType, encoded: string): Widget {
  const widgetBuild = {
    type,
    required: encoded[3] === "1",
    label: encoded[4] === "1" ? "Placeholder label" : undefined,
    min: undefined as undefined | number,
    max: undefined as undefined | number,
    step: undefined as undefined | number,
    options: undefined as undefined | SelectOption[],
    defaultOption: undefined as undefined | boolean
  };

  if (type === "WidgetInputNumber" || type === "WidgetScale") {
    widgetBuild.min = parseInt(encoded.slice(5, 8), 10);
    widgetBuild.max = parseInt(encoded.slice(8, 11), 10);

    if (type === "WidgetScale") {
      widgetBuild.step = parseInt(encoded.slice(11, 14), 10);
    }
  }

  if (type === "WidgetSelect" || type === "WidgetCheckbox") {
    const numOptions = parseInt(encoded.slice(5, 8), 10);

    widgetBuild.options =
      type === "WidgetSelect"
        ? Array.from(Array(numOptions)).map((_, i) => ({
          value: `${i + 1}`,
          displayValue: `Option ${i + 1}`
        }))
        : [
          { value: "yes", displayValue: "Yes" },
          { value: "no", displayValue: "No" }
        ];
    widgetBuild.defaultOption = encoded[8] === "1";
  }

  const widget: any = {};

  for (const [key, value] of Object.entries(widgetBuild)) {
    if (value !== undefined) {
      widget[key] = value;
    }
  }

  return widget as Widget;
}

export function encodeWidgets(widgets: Widget[]): string {
  let encoded = "";

  for (const widget of widgets) {
    const key = widgetTypeToKeyMap[widget.type];
    encoded += widgetEncoder(key, widget);
  }

  return encoded;
}

export function decodeWidgets(
  encoded: string,
  widgets: Widget[] = []
): Widget[] {
  if (!encoded) return widgets;

  const decoded: Widget[] = [...widgets];

  const key = encoded.slice(0, 3);
  const { type, size } = widgetKeyToTypeMap[key];

  const widgetEncoded = encoded.slice(0, size);
  const remainEncoded = encoded.slice(size, encoded.length);

  const widget = widgetDecoder(type, widgetEncoded);
  decoded.push(widget);

  return decodeWidgets(remainEncoded, decoded);
}

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
    case "WidgetInputText": {
      return {
        type: "WidgetInputText",
        required,
        label,
        title: ""
      };
    }
    case "WidgetInputNumber": {
      return {
        type: "WidgetInputNumber",
        required,
        label,
        min,
        max
      };
    }
    case "WidgetScale": {
      return {
        type: "WidgetScale",
        required,
        label,
        min,
        max,
        step
      };
    }
    case "WidgetSelect": {
      return {
        type: "WidgetSelect",
        required,
        label,
        options: [
          { value: "yes", displayValue: "Yes" },
          { value: "no", displayValue: "No" }
        ],
        defaultOption: null
      };
    }
    case "WidgetCheckbox": {
      return {
        type: "WidgetCheckbox",
        required,
        label,
        options: [
          { value: "yes", displayValue: "Yes" },
          { value: "no", displayValue: "No" }
        ],
        defaultOption: { value: "yes", displayValue: "Yes" }
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

