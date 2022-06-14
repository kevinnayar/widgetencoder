import { Widget } from '../types/widgetTypes';
import { widgetTypeToKeyMap } from '../constants';

function widgetEncoder(abbr: string, widget: Widget): string {
  let encoded = abbr;

  encoded += widget.required ? '1' : '0';
  encoded += widget.label ? '1' : '0';

  if ('min' in widget && 'max' in widget) {
    encoded += widget.min.toString().padStart(3, '0');
    encoded += widget.max.toString().padStart(3, '0');
  }

  if ('step' in widget) {
    encoded += widget.step.toString().padStart(3, '0');
  }

  if ('options' in widget) {
    encoded += widget.options.length.toString().padStart(3, '0');
  }

  if ('defaultOption' in widget) {
    encoded += widget.defaultOption ? '1' : '0';
  }

  return encoded;
}

export function encodeWidgets(widgets: Widget[]): string {
  let encoded = '';

  for (const widget of widgets) {
    const key = widgetTypeToKeyMap[widget.type];
    encoded += widgetEncoder(key, widget);
  }

  return encoded;
}


