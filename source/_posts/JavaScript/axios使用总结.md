---
title: axios使用总结
date: 2019-12-10 13:32:49
tags:
- axios
- ajax
categories: JavaScript
---

# axios使用总结

## 安装

推荐 `yarn`

```bash
yarn add axios
```

或者 使用 `npm`

```bash
npm i axios
```

<!-- more -->

## 使用

可以像`jQuery`中的ajax那样使用

```js
$.ajax({
  url: '/api/userlist'
  methods: 'get',
  dataType: 'json',
  success: funciton() {
  	// xxx
	}
})
// ...
```

但是不需要采用`jQuery`中的回调，避免产生[地狱回调](https://www.baidu.com/s?wd=%E5%9C%B0%E7%8B%B1%E5%9B%9E%E8%B0%83)的问题，所以我们采用 `ES6` 的 [promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 写法。

如下

```js
axios({
  method:'get',
  url:'/api/userlist',
  responseType:'json'
})
  .then(function(response) {
  	// xxx
	});
```

### 请求方法的别名

如果你发送的是 `get` 类型的请求数据，可以忽略 `methods` 参数。

为了探索新的大陆，当然也是为了简（tou）洁（lan），来尝试一下新的方法。

axios起了别名，可以更加方便的调用请求方法。

话说，最常用的还是这两个。

##### axios.get(url[, config])

##### axios.post(url[, data[, config]])

```js
axios.get('/api/userlist')
	.then(res=> {
  	// xxx
	})
```

### 全局默认值 baseURL

在一个项目中，请求不可能只有几个，而每个请求大多都是基于同一个地址，那么，就可以设置根URL。

优点显而易见，可以避免更换服务器而导致所有的请求地址都要改变，也可以避免没必要的同时出现相同的字符串，只需写后面的接口地址即可。

```js
// 这是 axios 的全局默认值，设置后其他URL也都会以这个域名为根地址
axios.defaults.baseURL = 'https://www.api.com';
```

```js
// 假如设置后发送一个请求
axios.get('/api/userlist')
	.then(res=> {
  	// xxx
	})
// 这个时候发送的地址就为 https://www.api.com/api/userlist
```

### 拦截器

在很多场景中，用户登录后，需要将用户的token一起发送给后端，而每次请求都设置一边请求头，显然不符合实际。`axios` 提供了拦截器，发送前和数据返回后都可以做下处理然后继续发给服务器或者交给页面处理。

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
```

```js
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
```

同时这里也可以统一处理错误情况，提高了开发效率。

### 在Vue、React中使用axios

#### Vue

假设已经使用 `vue-cli` 脚手架搭建出基本框架，那么加下来就可以直接挂在Vue的原型上，这样在每个页面都可以调用 `axios`

**/src/main.js**

```js
// xxx

// 引入axios
import axios from 'axios'
Vue.prototype.$http = axios

// xxx
```

在其他组件调用就可以这样

**/pages/home/home.vue**

```js
<template>
  <div>
    <div>{{userinfo}}</div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      userinfo: null
    }
  },
  methods: {
    getUserInfo() {
      this.$http.get('/api/userinfo').then(res => {
        this.userinfo = res.data
      })
    }
  },
}
</script>
```

#### React

React用法同Vue，还是采用脚手架搭建，然后在`/src/index.js`将axios绑定到`React`上

**/src/index.js**

```js
// 这里我导入的是自己配置的axios
import axios from './config/axiosConfig';
// axios绑定到React
React.Component.prototype.axios = axios;
```

**/src/config/axiosConfig**

```js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data;
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default axios;
```

组件中的调用

```jsx
import React from 'react';

export default class table extends React.Component {

  state = {
    dataSource: null
  }

  componentDidMount() {
    this.getDataSource();
  }

  getDataSource = () => {
    this.axios.get('/api/userinfo')
      .then((res) => {
        this.setState({
          dataSource: res.data
        })
      });
  }

  render() {
    const dataSource = this.state.dataSource;
    return (
      <div>
        <div>{dataSource}</div>
      </div>
    );
  }
}
```

## 最后

现在的前端工程大都已经将接口统一管理了，只会在页面调用接口，然后在页面写处理的逻辑。这篇文章知识提供一个思路。