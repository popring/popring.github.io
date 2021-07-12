---
title: react-ts 重构笔记
date: 2020-02-07 15:51:33
tags:
- react
- typescript
categories: JavaScript

---

先前的 [小黄车后台管理系统](https://github.com/popring/ofo-ms/tree/ofo-ms-js) ，开发完成后，现看来，目录过于复杂，代码冗余，对强迫症的我来说，实属看不下去了，趁着过年有时间，使用 ts 进行了重构，并在之前的基础上对 `react ` 和 `typescript` 有了进一步的理解。

参考了 github 的开源项目 [react-admin](https://github.com/yezihaohao/react-admin)，感谢大佬的代码，给了很多灵感。

<!-- more -->

## [create-react-app 自定义配置]([https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE](https://ant.design/docs/react/use-with-create-react-app-cn#高级配置))

> 类似 `vue` 中的 `vue.config.js`

使用 [react-app-rewired](https://github.com/timarney/react-app-rewired) 进行自定义配置，需要依赖  [customize-cra](https://github.com/arackaf/customize-cra) 。

```bash
yarn add react-app-rewired customize-cra
```

修改运行配置

```json
/* package.json */
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app eject"
 }
```

项目根目录创建 `config-override.js` 修改配置

### 配置别名路径

```js
// config-override.js
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    "src": path.resolve(__dirname, './src'),
    "components": path.resolve(__dirname, './src/components'),
    "router": path.resolve(__dirname, './src/router')
  })
)
```

### [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 中配置别名（alias）

> webpack 配置 alias后，再配置tsconfig，vscode对应提示会更加友好

如果在`tsconfig.json`中定义别名、路径，项目启动后会被删除 `paths`节点

[github 大佬解决办法](https://github.com/facebook/create-react-app/issues/5645#issuecomment-436613740)

`paths.json`

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "svg/*": ["src/svg/*"],
      "components/*": ["src/components/*"]
    }
  }
}
```

in `tsconfig.json` I have

```
{
  "extends": "./paths.json"
}
```

## ts 的使用

### react 模板继承  Componet的类型

```js
class Page extends Component<Props, state> {}

export default Page;
```

### 定义对象索引

[索引签名](https://jkchao.github.io/typescript-book-chinese/typings/indexSignatures.html#%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)

[文章](https://jkchao.github.io/typescript-book-chinese/typings/indexSignatures.html#%E4%BD%BF%E7%94%A8%E4%B8%80%E7%BB%84%E6%9C%89%E9%99%90%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F)

```js
type Index = 'success' | 'error' | 'info' | 'warning' | 'loading';
type messageType = { [k in Index]: string };

(a: messageType) => {
  // xxx
}
```

### antd 使用 Form 高阶组件

```js
// BaseFormProps 为 BaseForm 所定义的Props
export default Form.create<BaseFormProps>()(BaseForm);
```

## Hooks

> 普通  function 无状态，class 有状态
>
> `Hook` 的出现，在不编写 class 的情况下使用 react 的其他特性。

### State Hook

> 简化 `state` 的使用方式

```jsx
import React, { useState } from 'react';

function Example(props) {
  const [count, setCount] = useState(0);
  return (
  	<div onClick={() => setCount(count+1)}>{count}</div>
  )
}
```

### Effect Hook

> useEffect 相当于 `react class` 生命周期函数的  componentDidMount，componentDidUpdate 和 componentWillUnmount  三合一版本

useEffect() 内返回一个函数，用于防止内存泄漏，清除定时器、订阅外部数据源等。

```jsx
import React, { useEffect } from 'react';

function Example(props) {
  useEffect = (()=>{
    // xxx
    return function clearup(){ 
      /*xxx*/ 
    }
  }, [input])
  return (
  	<div onClick={() => setCount(count+1)}>{count}</div>
  )
}
```

### Context

```js
const {useState, useEffect, useContext} = React;
const MyContext = React.createContext(0);
function Children() {
  const flag = useContext(MyContext);
  return (
    <div>{flag}</div>
  )
}

function Father() {
  const [flag, setFlag] = useState(0);
  return (
    <MyContext.Provider value={flag}>
      <button onClick={()=> setFlag(flag+1)}>点击+1</button>
      <p>{flag}</p>
      <Children />
    </MyContext.Provider>
  )
}

ReactDOM.render(<Father />, document.getElementById('app'))
```

## 项目的总结

为了路由更好的配置和管理，修改为类似 `vue-router` 的配置，遍历动态生成路由，还可进行鉴权。

如果有官网，一定要去看完官网再看二手知识，毕竟大家水平残次不齐，尤为像我一样的新手无法鉴别文章是否有误，而官网的文档，就没这么多担忧了。虽然很多都是英文文档，坚持看下去，会有不一样的收获。

`Typescript` 刚开始用起来确实有点繁琐，不过用过一段时间，潜移默化的感觉到会对项目有更深入的了解，当然数据类型检查啥的，降低了项目的出错率，以后的代码维护也会轻松许多。

## Reference

 [react-admin](https://github.com/yezihaohao/react-admin)

[antd](https://ant.design/docs/react/use-with-create-react-app-cn)

[React Hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)

