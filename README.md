# prepost loader for webpack

A loader add prefix or postfix string to source file for webpack. based on [imports-loader](https://github.com/webpack/imports-loader)

## Installation

```
npm install prepost-loader
```

## Usage Examples


1. Auto import `React` and `React.Component` for all `.jsx` files.

  ```javascript
  // ./webpack.config.js

  module.exports = {
      ...
      module: {
          loaders: [
              {
                  test: /\.jsx$/,
                  loader: "prepost",
                  query: {
                    prefix: ['var React = require("react");', 'var Component = React.Component;'],
                    postfix: ''
                  }
              }
          ]
    };
  ```


2. If you have tow files: `/path/to/foo.jsx` and `/path/to/foo.sass`. Every time you require `foo.jsx`, you want auto require `foo.sass`, then you can write something like this in webpack config file.

  ```javascript
  // ./webpack.config.js

  module.exports = {
      ...
      module: {
          loaders: [
              {
                  test: /\.jsx$/,
                  loader: "prepost",
                  query: {
                    autoRequireExtensions: ['sass', 'scss', 'css']
                  }
              }
          ]
    };
  ```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)



## License

[MIT](http://www.opensource.org/licenses/mit-license.php)
