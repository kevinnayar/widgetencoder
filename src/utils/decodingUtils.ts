import { WidgetType, Widget, SelectOption } from '../types/widgetTypes';
import { widgetKeyToTypeMap } from '../constants';

function widgetDecoder(type: WidgetType, encoded: string): Widget {
  const widgetBuild = {
    type,
    required: encoded[3] === '1',
    label: encoded[4] === '1' ? 'Placeholder label' : undefined,
    min: undefined as undefined | number,
    max: undefined as undefined | number,
    step: undefined as undefined | number,
    options: undefined as undefined | SelectOption[],
    defaultOption: undefined as undefined | boolean
  };

  if (type === 'WidgetInputNumber' || type === 'WidgetScale') {
    widgetBuild.min = parseInt(encoded.slice(5, 8), 10);
    widgetBuild.max = parseInt(encoded.slice(8, 11), 10);

    if (type === 'WidgetScale') {
      widgetBuild.step = parseInt(encoded.slice(11, 14), 10);
    }
  }

  if (type === 'WidgetSelect' || type === 'WidgetCheckbox') {
    const numOptions = parseInt(encoded.slice(5, 8), 10);

    widgetBuild.options =
      type === 'WidgetSelect'
        ? Array.from(Array(numOptions)).map((_, i) => ({
          value: `${i + 1}`,
          displayValue: `Option ${i + 1}`
        }))
        : [
          { value: 'yes', displayValue: 'Yes' },
          { value: 'no', displayValue: 'No' }
        ];
    widgetBuild.defaultOption = encoded[8] === '1';
  }

  const widget: any = {};

  for (const [key, value] of Object.entries(widgetBuild)) {
    if (value !== undefined) {
      widget[key] = value;
    }
  }

  return widget as Widget;
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