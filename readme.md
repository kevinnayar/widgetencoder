# widgetencoder

A proof of concept to take object definitions for UI entities like "widgets" and enable fast searching capabilities against them.

## Steps
1. Create a custom encoding scheme to translate objects into simple strings with the ability to transform between objects and string with speed.
1. Leverage existing string search algorithms (like Jaro-Winkler in this case) to measure the edit distance between two string sequences.
1. Index a wide range of existing configurations to create the source search dataset.