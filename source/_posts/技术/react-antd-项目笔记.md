---
title: react+antd 项目笔记
tags:
  - React
  - antd
  - 踩坑
categories: 技术
abbrlink: e6509c17
date: 2020-01-26 12:19:14
---

> **Atwood 定律**
>
> Any application that can be written in JavaScript, will eventually be written in JavaScript. （任何能够用JavaScript实现的应用，最终都必将由JavaScript实现。） – Jeff Atwood

记录react学习进程，以及使用 `antd` 和 `react` 写 `demo` 时候遇到的问题。

项目地址：https://github.com/popring/ofo-ms/tree/ofo-ms-js

<!-- more -->

> 记录学习React心路历程，以及开发过程中遇到的疑难杂症

# React

## [React 生命周期](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)（按顺序从上往下）

### Mounting

| lifecycle name     | description                                                  |
| ------------------ | ------------------------------------------------------------ |
| constructor        | react 组件挂载前会调用它的构造函数                           |
| componentWillMount | ***过时***，挂载前调用                                       |
| render             | class组件中唯一必须实现的方法，最好为纯函数，代码更加简洁易懂 |
| componentDidMount  | 组件挂载后调用                                               |

### Updating

| lifecycle name                                      | description                                                  |
| --------------------------------------------------- | ------------------------------------------------------------ |
| componentWillReceiveProps`                          | ***过时***，在已挂载的组件接收新的props之前被调用            |
| shouldComponentUpdate(nextProps, nextState)         | 根据此函数的返回值判断 React 组件的输出是否受当前 state 或 props 更改的影响，默认为`true`， `state` 或 `props` 更新时是否需要重新渲染视图 |
| componentWillUpdate                                 | **过时**，当组件接收新的props或state时，会在渲染之前调用     |
| componentDidUpdate(preveProps, prevState, snapshot) | 组件更新后调用，首先渲染不会被调用                           |

### Unmounting

| lifecycle name       | description                                                  |
| -------------------- | ------------------------------------------------------------ |
| componentWillUnmount | 组件卸载及销毁前调用，此方法中执行必要的清除操作（例如：清除定时器，取消网络请求，清除在 `componentDidMount()` 中创建的订阅） |

## 组件内部的函数 `this` 指向问题

> 多半刚入门 `react` 的新手都会遇到这个问题，组件内函数this[**的指向问题**]()

**React组件**中函数**不能**直接这么写，调用的时候使用**setState**会有问题，需要解决this指向问题

```jsx
import React from 'react'

export default class Life extends React.Component {
  handleBindClick() {
    this.setState({
      count: this.state.count + 1
    })
  }
}
```

解决1, 绑定this指向

```jsx
import React from 'react'

export default class Life extends React.Component {
  handleBindClick() {
    this.setState({
      count: this.state.count + 1
    })
  }
  
  render() {
    return (
    	<div>
      	<button onClick={this.handleBindClick.bind(this)}>+1</button>
      </div>
    )
  }
}
```

解决2, 直接使用箭头函数

```jsx
import React from 'react'

export default class Life extends React.Component {
  handleBindClick = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
  
  render() {
    return (
    	<div>
      	<button onClick={this.handleBindClick}>+1</button>
      </div>
    )
  }
}
```

## State

状态管理

```js
class Example extends React.Component {
  // 可以在这里定义
  state = {}
	
	constructor(props) {
    super(props)
    // 也可以在这里定义
    this.state = {}
  }
}
```

修改状态

- 不要直接修改 `state` ，使用 `this.setState()`
-  `state` 可能是异步的

## React父子之间相互调用

### 父子间数据传递

#### 父传子

> 父组件发生变化，值传入子组件，从而重新渲染
>
> 子组件接收的为一个值。

```js
// 子组件
class Children extends React.Component {
  render() {
    console.log(this.props); // 输出父组件传过来的参数
    return (
      <div>
        <button>子组件 --- {this.props.flag}</button>
      </div>
  	);
  }
}
// 父组件
class Father extends React.Component {
  state = {
    flag: 1
  };
  handleClick = () => {
    this.setState({
      flag: this.state.flag + 1
    });
  };
  render() {
    return (
      <div>
      	<button onClick={this.handleClick}>这是父组件</button>
      	<Children flag={this.state.flag} />
      </div>
    );
	}
}
```

#### 子传父

> 父组件

```js
// 子组件
class Children extends React.Component {
  state = {
   flag: 0 
  }
  handleClick = ()=>{
    const flag = this.state.flag + 1;
    this.setState({
      flag
    })
    this.props.fn(flag);
  }
  render() {
    return (
      <button onClick={this.handleClick}>点击flag加1</button>
    )
  }
}

// 父组件
class Father extends React.Component {
  state = {
    flag: 0
  }

  fn = (cflag)=>{
    this.setState({
      flag: cflag
    })
  }
  render() {
    return (
      <div>
        <Children fn={this.fn} />
        <p>这是父组件.显示子组件flag值： {this.state.flag}</p>
      </div>
    )
  }
}

React.render(<Father />, document.getElementById('app'))
```

> Tips: 这样也有明显的缺点，如果父子间传值层数或者值过多，这个方法显然过于麻烦，因此 `React` 官方给出了解决方法。 [Context](#Context)

### 调用方法

#### 父调用子方法

```js
class Children extends React.Component {
        constructor(props) {
          super();
          props.onRef(this);
        }
        handleClick() {
          console.log("调用了子组件的方法");
        }
        render() {
          return (
            <div>
              <button onClick={this.handleClick}>子组件</button>
            </div>
          );
        }
      }

      class Father extends React.Component {
        handleClick = () => {
          this.child.handleClick();
        };

        render() {
          return (
            <div>
              <button onClick={this.handleClick}>这是父组件</button>
              <Children onRef={ref => (this.child = ref)} />
            </div>
          );
        }
      }

      ReactDOM.render(<Father />, document.getElementById("root"));
```

#### 子调用父方法

```js
class Children extends React.Component {
  handleClick = () => {
    this.props.handleClick();
  };
	render() {
    return (
      <div>
      <button onClick={this.handleClick}>子组件</button>
    </div>
    );
  }
}

class Father extends React.Component {
  handleClick = () => {
    console.log("调用了父组件的方法");
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>这是父组件</button>
        <Children handleClick={this.handleClick} />
      </div>
    );
  }
}
```

## Context

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

```js
const MyContext = React.createContext(0);

class Children extends React.Component {
  static contextType = MyContext;
  render() {
    return (
       <p>子组件组件显示父组件flag值 {this.context}</p>
    )
  }
}

class Father extends React.Component {
  state = {
    flag: 0
  }
  handleClick = ()=>{
    const flag = this.state.flag+1;
    this.setState({
      flag
    })
  }
  render() {
    return (
      <div>
        <MyContext.Provider value={this.state.flag}>
          <Children />
        </MyContext.Provider>
        <p>父组件 flag值 {this.state.flag}</p>
        <button onClick={this.handleClick}>点击flag加1</button>
      </div>
    )
  }
}

ReactDOM.render(<Father />, document.getElementById('app'))
```

## Fragments

> 单组件返回多个元素，解决不需要根节点包裹的情况。

段语法

```js
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```



## 配置相对路径

> 配置后 **@**表示根目录下的 **src**路径，配置  `jsconfig` 后 `vscode` 提示更加友好

**webpack.config.js**

```js
alias: {
	//...,
	'@': path.resolve(__dirname, '../src')
}
```

**jsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": [
    "node_modules"
  ]
}
```

[jsconfig 配置详情](https://code.visualstudio.com/docs/languages/jsconfig)



# Koa


### 异步延时函数

> setTimeout 会被加入异步队列，需使用promise来解决
>
> [为此还专门在思否提问](https://segmentfault.com/q/1010000021028375)

```js
async function delayer(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async (ctx, next) => {
  await delayer(1000);
  await next();
  ctx.body = 'hello';
}
```



# 其他

## 对象的操作

### 对象的赋值

假设

```js
obj1 = {
  a: 1,
  b: 2,
  c: 3
}
```

```js
obj2 = {
  c: 33,
  d: 44
}
```

将对象 `obj2` 属性的值赋值到 `obj1`中的属性 ，相同的属性覆盖，但**不修改**`obj1`的其他值。俗称，浅拷贝

```js
Object.assign(obj1,obj2);

// 或者使用ES6语法，更简单
obj1 = { ...obj1, ...obj2};
```

### 判断对象中是否含有某个属性

仍以上面两个对象为例，则

```js
// true
obj1.hasOwnProperty('a');

// false
obj2.hasOwnProperty('a');
```

### 过滤对象属性

> props: 原对象
>
> arr: 需要过滤掉的键
>
> newProps: 过滤后剩下的键值组成的对象

```js
const props = {
  onRef: "1",
  apiGetList: "2",
  post: 3,
  ok: "ok",
  omg: "111"
};
const arr = ["onRef", "apiGetList"];
const newProps = {};

Object.keys(props)
  .filter(item => !arr.includes(item))
  .forEach(key => {
  newProps[key] = props[key];
});

console.log(newProps);
// {post: 3, ok: "ok", omg: "111"}

```

操作函数拆分解释

**Object.keys(obj)**

返回 由 **obj** 的**键**组成的数组

**Array.prototype.filter**

数组过滤的方法，传入的函数中的返回值为 true 则过滤，为 false 则留下。返回一个新数组，不会改变原数组。

**Array.prototype.includes()**

判断数组内是否包含指定的值。包含返回 true，反之 fales。

**forEach**

遍历对象和数组。