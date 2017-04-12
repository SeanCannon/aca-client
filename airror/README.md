# AIRROR

JavaScript Errors are so hard to work with.

Airror makes it easy like breathing air.

```js

var airror = require('airror');

if (somethingBad()) {
  throw airror({ code : 3, message : 'shit' });
}

```
