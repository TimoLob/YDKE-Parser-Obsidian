# Obsidian Sample Plugin

This is a plugin for Obsidian (https://obsidian.md).

It renders code blocks of the form
```ydke
ydke://pANYA6QDWAOkA1gDx5o/BMeaPwTHmj8E8v2qAvL9qgLy/aoCxS7OBMUuzgTFLs4EVj7qBFY+6gRWPuoERaWvAkWlrwJFpa8CORMVAdG96ATRvegE0b3oBOsB+wTrAfsEznRXA6ab9AFZe2MEPqRxAR43ggEeN4IB/YmcBf2JnAX9iZwF1fbWANX21gDV9tYAIkiZACJImQAiSJkA+9wUAQ==!NaoqBY6sXAFWLQ4FfrikAYP4xwMzyWoFdr+1AzmHDACEROwDhETsA4RE7ANJkjQD6yv/AsJPQQBxxNgB!YHT3BGB09wRgdPcEryPeAK8j3gCvI94AxzRIA2DpMwJg6TMCe2QdAntkHQJ7ZB0Cb3bvAG927wBvdu8A!
```

as decklist with card images.
YDKE is an encoding for Yu-Gi-Oh decklists.
Format:
ydke://Main Deck!Extra Deck!Side Deck  
Each deck is a base64 encoded list of 32-Bit Integer Card ids.

## Template Plugin

This plugin was developed starting from the Template Plugin at https://github.com/obsidianmd/obsidian-sample-plugin