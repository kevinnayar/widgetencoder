import * as React from 'react';
import { useState } from 'react';

import { CodeSection } from './components/CodeSection';
import { WidgetDisplay } from './components/WidgetDisplay';
import { Dropdown } from './components/Dropdown';
import { Checkbox } from './components/Checkbox';
import { Button } from './components/Button';

import { Widget, WidgetType, SearchResult } from './types/widgetTypes';
import { widgetList, encodedLists } from './constants';
import {
  createWidget,
  encodeWidgets,
  decodeWidgets,
  getSearchResults,
  // generateRandomCollections
} from './utils/encodingUtils';

const App = () => {
  const [widgetType, setWidgetType] = useState<WidgetType>('WidgetInputText');
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const [encoded, setEncoded] = useState<string>(encodeWidgets(widgets));
  const [showEncoded, setShowEncoded] = useState(false);

  const [decoded, setDecoded] = useState<Widget[]>(decodeWidgets(encoded));
  const [showDecoded, setShowDecoded] = useState(false);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSetWidgetType = (e: any) => {
    const type = e.target.value as WidgetType;
    setWidgetType(type);
  };

  const handleUpdateSearch = (newWidgets: Widget[]) => {
    const newEncoded = encodeWidgets(newWidgets);
    const newDecoded = decodeWidgets(newEncoded);
    const newSearchResults = getSearchResults(newEncoded, encodedLists).slice(0, 5);

    setWidgets(newWidgets);
    setEncoded(newEncoded);
    setDecoded(newDecoded);
    setResults(newSearchResults);
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

  // const handleGenerateWidgets = () => {
  //   generateRandomCollections(5000);
  // };

  return (
    <div className='app'>
      <div className="header">
        <Dropdown list={widgetList} onChange={handleSetWidgetType} />
        <Button onClick={handleCreateWidget}>Create</Button>
        {/* <Button onClick={handleGenerateWidgets}>Generate</Button> */}
        <Checkbox value="Show Results" checked={showResults} setChecked={setShowResults} />
        <Checkbox value="Show Decoded" checked={showDecoded} setChecked={setShowDecoded} />
        <Checkbox value="Show Encoded" checked={showEncoded} setChecked={setShowEncoded} />
      </div>

      <div className="content">
        {widgets.length ? (
          <>
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
              <div className="search-results">
                {showResults ? results.map(({ match, score }, index) => {
                  const widgets = decodeWidgets(match);
                  return (
                    <div className="widgets" key={`${match}.${score}.${index}`}>
                      {widgets.map(({ type }, index) => (
                        <WidgetDisplay key={`${type}.${index}`} type={type} index={index} />
                      ))}
                    </div>
                  );
                }) : <div className="no-results">Results are hidden!</div> }
              </div>
            </div>
          </>
        ) : (
          <div className="no-results">No data to show. Create some widgets!</div>
        )}
      </div>

      <div className="sections">
        {showDecoded && <CodeSection title="Decoded Widgets" content={decoded} />}
        {showEncoded && <CodeSection title="Encoded Widgets" content={encoded} />}
      </div>
    </div>
  );
}

export default App;
