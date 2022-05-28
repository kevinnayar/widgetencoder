# ⚙️ widgetencoder

A proof of concept to take object definitions for UI entities like "widgets" and enable fast searching capabilities against them.

## Steps
- Create a custom encoding/decoding scheme to translate objects into simple strings and back.
- Leverage existing search algorithms (like Jaro-Winkler) to measure the edit distance between string sequences.
- Index a wide range of existing configurations to create the source search dataset.

Perform search as UI changes. Profit!