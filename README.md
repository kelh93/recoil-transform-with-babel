# Babel转义Recoil
尝试使用babel转义recoil，使得recoil兼容IE版本

## `webpack` 配置
编译js文件时，使用`include`手动指定编译范围。
- srcDir
- recoil
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        include: [srcDir, path.resolve(__dirname, '../node_modules/recoil')]
      }
    ]
  }
}
```

## babel.config.json

安装babel基础依赖 `babel-loader` 和 `@babel/core`.
```bash
  npm install babel-loader @babel/core -D
```

配置 **presets** `@babel/preset-env` 、`@babel/preset-react` 

由于`recoil`采用了`ES6+`语法，所以需要设置`polyfill`进行兼容处理。

### 方案一

`babel.config.json` 

```json
  {
    "presets": [
      [
        "@babel/preset-env", 
        {
          "useBuiltIns": "entry",
          "corejs": {
            "version": "3",
            "proposals": true
          },
          "targets": {
            "chrome": 75,
            "ie": 10
          }
        }
      ],
      ["@babel/preset-react"]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime", 
        {
          "corejs": false,
          "proposals": true
        }
      ]
    ]
  }
```
`index.js` 

```javascript
  import 'core-js-pure/stable';
  import 'regenerator-runtime/runtime';
```

### 编译
执行 `npm run build`，运行`dist/index.html`选择 IE11打开。 

运行结果，`IE11`报错. 

```js
  module.exports = require("regenerator-runtime");
```
