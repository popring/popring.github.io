---
title: react+antd 项目笔记
date: 2020-01-26 12:19:14
tags:
- React
- antd
- 踩坑
categories:
	- JavaScript
---

记录react学习进程，以及使用 `antd` 和 `react` 写 `demo` 时候遇到的问题。

项目地址：https://github.com/popring/OFO-MS/tree/master

<!-- more -->

> 记录学习React心路历程

## [React 生命周期](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

- `getDefaultProps`
- `getInitialState`



- `constructor`    在 React 组件挂载之前，会调用它的构造函数 

- `componentWillMount`    **过时**，在挂载前调用
- `render`     是 class 组件中唯一必须实现的方法。 
- `componentDidMount`    组件挂载后立即调用



- `componentWillReceiveProps `   **过时**，在已挂载的组件接收新的props之前被调用



- `shouldComponentUpdate(nextProps, nextState)`     根据此函数的返回值判断 React 组件的输出是否受当前 state 或 props 更改的影响，默认为`true`
- `componentWillUpdate`    **过时**，当组件接收新的props或state时，会在渲染之前调用
- `componentDidUpdate(preveProps, prevState, snapshot)`   组件更新后调用



- `componentWillUnmount `   组件卸载或销毁前调用



### 组件内部的函数

组件内函数this的指向问题

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



### 对象的操作

#### 对象的赋值

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

#### 判断对象中是否含有某个属性

仍以上面两个对象为例，则

```js
// true
obj1.hasOwnProperty('a');

// false
obj2.hasOwnProperty('a');
```



## React父子之间传值和调用方法

### 传值

> 用了 `redux` 之后，真香。

#### 父传子

> 点击父组件按钮，子组件的获取到的值也会变化

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

```js
// 子组件
class Children extends React.Component {
  state = {
    flag: 1
  };
  handleClick = () => {
    this.setState({
      flag: this.state.flag + 1
    });
    this.props.fn(this.state.flag);
  };
  render() {
    return (
      <div>
      	<button onClick={this.handleClick}>子组件</button>
      </div>
    );
  }
}
// 父组件
class Father extends React.Component {
  state = {
    flag: null
  }
  handleClick = (flag) => {
    console.log(flag);
    this.setState({
      flag: flag
    })
  }
  render() {
    return (
      <div>
        <button>
        	这是父组件 --- {this.state.flag}
        </button>
        <Children fn={this.handleClick} />
   	 	</div>
    );
	}
}

ReactDOM.render(<Father />, document.getElementById("root"));
```



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




## 配置绝对路径

> 返回./../../** 这么繁琐的操作了，配置后 **@**表示根目录下的 **src**路径

**webpack.config.js**

```js
alias: {
	//...,
	'@': path.resolve(__dirname, '../src')
}
```





# Koa




### 异步延时函数

> setTimeout 会被加入异步队列，需使用promise来解决

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



