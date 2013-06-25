stylus graph
---------

[![Build Status](https://travis-ci.org/samccone/stylus-graph.png?branch=master)](https://travis-ci.org/samccone/stylus-graph)

### a stylus asset graph generator

#### current status

* detects imports

#### todo

* detect background image requirements
* detect font requirements


#### how to use

```js

  stylusGraph = require('stylus-graph');
  paths = stylusGraph.getDependencies(<file path>);

  console.log(paths);
```