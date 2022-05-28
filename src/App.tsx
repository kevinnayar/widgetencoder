import * as React from 'react';
import { useState } from 'react';
import {
  createWidget,
  encodeWidgets,
  decodeWidgets,
  getSearchResults,
  generateRandomCollections
} from './utils/encodingUtils';

import { CodeSection } from './components/CodeSection';
import { WidgetDisplay } from './components/WidgetDisplay';
import { Dropdown } from './components/Dropdown';
import { Checkbox } from './components/Checkbox';
import { Button } from './components/Button';

import { Widget, WidgetType, SearchResult } from './types/widgetTypes';
import { widgetList, encodedLists } from './constants';


const App = () => {
  const [widgetType, setWidgetType] = useState<WidgetType>('WidgetInputText');
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const [encoded, setEncoded] = useState<string>(encodeWidgets(widgets));
  const [decoded, setDecoded] = useState<Widget[]>(decodeWidgets(encoded));

  const [showEncoded, setShowEncoded] = useState(false);
  const [showDecoded, setShowDecoded] = useState(false);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSetWidgetType = (e: any) => {
    const type = e.target.value as WidgetType;
    setWidgetType(type);
  };

  const handleUpdateSearch = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);

    const newEncoded = encodeWidgets(newWidgets);
    setEncoded(newEncoded);

    const newDecoded = decodeWidgets(newEncoded);
    setDecoded(newDecoded);

    const newSearchResults = getSearchResults(newEncoded, encodedLists).slice(
      0,
      5
    );
    setSearchResults(newSearchResults);
  };

  const handleCreateWidget = () => {
    if (widgetType) {
      const widget = createWidget(widgetType);
      const newWidgets = [...widgets, widget];
      handleUpdateSearch(newWidgets);
    }
  };

  const handleDeleteWidget = (index: number) => {
    if (index > -1) {
      const newWidgets = [...widgets];
      newWidgets.splice(index, 1);
      handleUpdateSearch(newWidgets);
    }
  };

  const handleGenerateWidgets = () => {
    generateRandomCollections(5000);
  };

  return (
    <div className='app'>
      <div className="header">
        <Dropdown list={widgetList} onChange={handleSetWidgetType} />
        <Button onClick={handleCreateWidget}>Create</Button>
        <Button onClick={handleGenerateWidgets}>Generate</Button>
        <Checkbox value="Show Decoded" checked={showDecoded} setChecked={setShowDecoded} />
        <Checkbox value="Show Encoded" checked={showEncoded} setChecked={setShowEncoded} />
      </div>

      {widgets.length ? (
        <div className="content">

          <div className="content__preview">
            <h2>Preview</h2>
            <div className="widgets">
              {widgets.map(({ type }, index) => (
                <WidgetDisplay key={`${type}.${index}`} type={type} index={index} onDeleteWidget={handleDeleteWidget} />
              ))}
            </div>
          </div>

          <div className="content__results">
            <h2>Search Results</h2>
            <div className="search__results">
              {searchResults.map(({ match, score }, index) => {
                const widgets = decodeWidgets(match);
                return (
                  <div className="widgets" key={`${match}.${score}.${index}`}>
                    {widgets.map(({ type }, index) => (
                      <WidgetDisplay key={`${type}.${index}`} type={type} index={index} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-results">No data to show</div>
      )}

      <div className="sections">
        {showDecoded && <CodeSection title="Decoded Widgets" content={decoded} />}
        {showEncoded && <CodeSection title="Encoded Widgets" content={encoded} />}
      </div>
    </div>
  );
}

export default App;
