---
title: 初学vue笔记
tags: Vue
categories: 技术
abbrlink: 2b382936
date: 2019-12-27 18:13:21
---


大致为一下几个方面

- 指令
- 生命周期函数
- Watch
- computed
- filter
- 插槽
- 路由

<!-- more -->

# 初学Vue笔记

## day01

### Vue初体验

> <u>***amazing***</u>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <div>{{ msg }}</div>
  </div>

  <script src="js/vue.js"></script>
  <script>
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'Hello World'
      }
    })
  </script>
</body>
</html>
```

### Vue 指令

#### v-cloak

> 隐藏未编译的`Mustache`标签，编译后再显示

```css
[v-cloak] {
    display: none;
}

<div v-cloak>
	{{ msg }}
</div>
```

#### v-text

> 指令与差值表达式同时存在时，会覆盖标签内的内容（插值表达式），相当于`js`的`innnerText`

```html
<span v-text="msg1">{{msg2}}</span>
<!-- 编译后 -->
<span>上海</span>

<script>
	new Vue({
        data: {
            msg1: '上海',
            msg2: '海上'
        }
    })
</script>
```

#### v-html

> 与 **v-text** 类似，不过可以将内容解析为 HTML，相当于原生js中的 `innerHTML`，有安全问题，慎用。

```html
<span v-text="msg"></span>
<!-- 编译后的h1标签会被解析为html，而v-text中的不会 -->
<span><h1>上海</h1></span>

<script>
	new Vue({
        data: {
            msg: '<h1>上海</h1>'
        }
    })
</script>
```

#### v-pre

> 跳过这个元素和它的子元素编译过程，可以来显示原始的 Mustache 标签，跳过大量没有指令的节点会加快编译。

```html
<span v-pre>{{ this will not be compiled }}</span>
```

#### v-once

> 应用场景： 如果显示的信息后续不需要修改，则可以使用 **v-once** ，提高性能，只编译一次。

```html
<span v-once>{{ msg }}</span>
```

#### v-on

指令写法

```html
<button v-on:click="handle"> </button>
```

缩写形式

```html
<button @click="handle"> </button>
```

参数： event

##### 事件修饰符

- `.stop` 调用 `event.stopPropagation()` 阻止冒泡
- `.prevent` 调用 `event.preventDefault()` 阻止默认事件
- `.self` 只当事件是从侦听器绑定的元素本身触发时才触发回调。
- `.once` 只触发一次回调

```html
<input type="button" value="aaaa" @click="say($event)">

<script>
	new Vue({
    	methods: {
            say($event) {
                // $event 为当前被点击对象
                console.log($event);
            }
        }
    })
</script>
```

```html
<!-- 修饰符连用 -->
<div>
    <a @click.prevent.once="handle" href="http://www.baidu.com"></a>
</div>
```

#### v-bind

指令用法

```html
<a v-bind:href="url"> 跳转链接 </a>
```

简写形式

```html
<a :href="url"> 跳转链接 </a>
```

还可以这样

```html
<div :class="{isActive: 'active'}"> 这只是一个div </div>
<div :class="['active', 'now']"> 这只是第二个div </div>

<!-- 编译后 -->
<div class="active"> 这只是一个div </div>
<div class="active now"> 这只是第二个div </div>

<script>
	new Vue({
		data: {
			isActive: true
		}
	})
</script>
```

同样也可以绑定style，与class一样可以绑定对象或数组

##### 修饰符

- `.prop` 被用于绑定DOM属性

#### v-if ... v-else if ... v-else

> 重绘结构，控制DOM的是否渲染

```html
<div v-if="false"> </div>
<div v-else></div>
```

#### v-show

> 通过样式来控制显示，**display:none**

#### v-model

> 双向数据绑定
>
> 原理：数据劫持，**Object.defineProperty()**
>
> 使用范围：只可在表单中使用，input, textarea, select

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title></title>
  <script type='text/javascript' src='js/vue.js'></script>
</head>
<body>
  <div id='app'>
    <div>{{ msg }}</div>
    <input type="text" v-model="msg">
  </div>
  <script type='text/javascript'>
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'Hello Vue'
      }
    });
  </script>
</body>
</html>
```

#### v-for

> 遍历数组
>
> `:key` 帮助 Vue 区别不同的元素，可提高 `Vue` 的性能

### MVVM

M (model)

V (view)

VM (View-Model)

### 按键修饰符

.enter

.delete

```html
<input @keyup.enter="onEnter">
```



## day-02

> 主要学习常用特性
>
> `directive` 和 `filter` 均分为 全局和局部
>
> `computed`用于定义一种可以随着所依赖数据发生变化的属性， `watch`监听data中定义的数据的变化

### 表单

> 注意多选的表单，`v-model` 绑定的数据为数组

#### 表单域修饰符

.number	 转换为 `number` 类型

.trim			去除开头和结尾的空格

.lazy			 将`input事件`切换为`change事件`

### 自定义指令

#### 全局指令 Vue.directive

> 自定义指令后，调用时需加前缀 `v-`

```js
Vue.directive('指令名称', {
    inserted: function(el) {
        // el为绑定指令的DOM元素
    }
})
```

```html
<div v-focus>xxxxxxxx</div>

<script>
	Vue.directive('focus', {
        inserted: function(el) {
            // el为绑定指令的DOM元素
            el.focus();
        }
    })
</script>
```

#### 局部指令 directives

```html
<input type="text" v-focus>

<script>
	var vm = new Vue({
        el: '#app',
        data: {
            msg: {
                color: 'orange'
            }
        },
        methods: {

        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus();
                }
            }
        }
    });
</script>
```

### 过滤器 filter

> 通过管道符，可以处理字符，然后将处理后的字符返回
>
> 与自定义指令类似

#### 全局

```js
Vue.filter('format', function(val) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
});
```

#### 局部

```js
filters: {
    upper(val, str=' 哈哈哈'){
        return val+' '+str;
    }
}
```

### computed

- 初次进入就会立刻执行函数
- 只要是函数的返回值中有一个值变化就会此函数就会被立刻调用
- 函数执行后会有缓存，如果数据不变化，再次调用`computed`会读取缓存，节省性能
- `methods` 不存在缓存

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <div>{{msg}}</div>
    <div>{{reverseString}}</div>
  </div>
  <script type="text/javascript" src="js/vue.js"></script>
  <script type="text/javascript">
    /*
      计算属性
    */
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'Nihao'
      },
      computed: {
        reverseString: function(){
          return this.msg.split('').reverse().join('');
        }
      }
    });
  </script>
</body>
</html>
```



### 侦听器 watch

- 适用于异步和性能开销较大的场景。
- 初次进入不会执行

- 只要属性被监听，属性一被改变，则会触发watch函数，只会触发一次

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title></title>
  <script type='text/javascript' src='js/vue.js'></script>
</head>
<body>
  <div id='app'>
    <div>
      <input type="text" v-model="aa">
      <input type="text" v-model="bb">
      <p>{{cc}}</p>
    </div>
  </div>
  <script type='text/javascript'>
    var vm = new Vue({
      el: '#app',
      data: {
        aa: 'Hello',
        bb: 'World',
        cc: ''
      },
      methods: {
        
      },
      watch: {
        aa(val){
          this.cc = val + this.bb;
        },
        bb(val) {
          this.cc = val + this.aa;
        }
      },
    });
  </script>
</body>
</html>
```

### 生命周期函数（重点）



![vue](https://cn.vuejs.org/images/lifecycle.png)



- beforeCreate	
  - `data`和`methods`中的函数还没有加载完
- created    
  - `data`和`methods`中的函数加载完
  - DOM结构还没有渲染完
- beforeMount
  - `data`和`methods`中的函数加载完
  - DOM结构渲染完，但data中的数据还未解析
- mounted
  - `data`和`methods`中的函数加载完
  - DOM结构渲染完，data中的数据已解析

### 修改响应式数据

```js
Vue.set(vm.items, indexOfIgtem, newValue)

vm.$set(vm.items, indexOfIgtem, newValue)
```

### ES6 操作数组函数

filter

some

findIndex

## day 03

### 组件化开发

```html
<button-counter></button-counter>

<script>
	Vue.component('button-counter', {
        data: function(){
            return {
                count: 0
            }
        },
        template: "<button @click='count++'> 点击了{{count}}次 </button>"
    })
</script>
```

### 组件注册注意事项

- data必须是一个函数
- 组件模板内容必须是单个根元素
- 组件命名方式
  - 驼峰式命名组件，使用组件时，只能在字符串模板中使用，普通标签模板中使用必须转换为短横线的方法使用组件
  - 不能与原生的html标签冲突

### 组件间的互相传值

#### 父组件给子组件传值 - props

##### props 属性名规则

- 在 `props`中使用驼峰形式，模板中需使用短横线形式
- 字符串形式的模板中没有限制
- 如若嫌麻烦，全部用小写，则无此烦恼

##### props属性值类型

- 字符串 String
- 数值 Number
- 布尔值 Boolean
- 数组 Array
- 对象 Object

#### 子组件向父组件传值 $emit()

```html
<!DOCTYPE html>
<html lang='en'>

<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title></title>
  <script type='text/javascript' src='js/vue.js'></script>
</head>

<body>
  <div id='app'>
    <son @tofa="app($event)"></son>
  </div>
  <script type='text/javascript'>
    var son = {
      data(){
        return {
          msg: '这是子元素的内容'
        }
      },
      methods: {
        fff(){
          this.$emit('tofa', this.msg);
        }
      },
      template: `<div @click="fff">{{msg}}</div>`
    }
    var vm = new Vue({
      el: '#app',
      data: {

      },
      methods: {
        app(val){
          console.log(val);
        }
      },
      components: {
        son
      }
    });
  </script>
</body>

</html>
```

#### 兄弟组件相互传值

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title></title>
  <script type='text/javascript' src='js/vue.js'></script>
</head>
<body>
  <div id='app'>
    <div>
      <bro></bro>
      <girl></girl>
    </div>
  </div>
  <script type='text/javascript'>
    // 新建公共 数据仓库
    let eventBus  = new Vue();

    Vue.component('bro', {
      data(){
        return {
          msg1: '兄弟元素送来的祝福',
          msg2: ''
        }
      },
      template: `
        <div>
            <div>我是兄弟元素 ======= {{ msg2 }}</div>
            <button @click="setBro">点击发送给girl元素</button>
        </div>
      `,
      methods: {
        setBro(){
          eventBus.$emit('setInfo1', this.msg1);
        }
      },
      mounted() {
        eventBus.$on('setInfo2', val=>{
          console.log(val);
          this.msg2 = val;
        })
      }
    });

    Vue.component('girl', {
      data(){
        return {
          msg1: '',
          msg2: '姐妹元素送来的祝福'
        }
      },
      template: `
        <div>
          <div>我是姐妹元素 ======= {{ msg1 }}</div>
          <button @click="setGirl">点击发送给bro元素</button>           
        </div>
      `,
      methods: {
        setGirl(){
          eventBus.$emit('setInfo2', this.msg2)
        }
      },
      mounted() {
        eventBus.$on('setInfo1', val=>{
          console.log(val);
          this.msg1 = val;
        })
      },
    })
    var vm = new Vue({
      el: '#app',
      data: {
        
      },
      methods: {
        
      }
    });
  </script>
</body>
</html>
```



### 生命周期函数

![生命周期函数](https://cn.vuejs.org/images/lifecycle.png)

### [插槽](https://cn.vuejs.org/v2/guide/components-slots.html)

> 占位，以便展示内容

```html
<!-- 编译后的标签的内容为 456 -->
<alert-box>456</alert-box>
<!-- 编译后的标签的内容为 123 -->
<alert-box></alert-box>


<script type='text/javascript'>
    Vue.component('alert-box', {
        template: `
			<div>
				<slot>123</slot>
    		</div>
		`,
    })

    var vm = new Vue({
        el: '#app',
        data: {

        },
        methods: {

        }
    });
</script>
```

#### 具名插槽

> 声明：此种方法被2.6以上版本废弃，但仍可使用，建议用新版 v-slot

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <base-layout>
      <p slot='header'>标题信息</p>
      <p>主要内容1</p>
      <p>主要内容2</p>
      <p slot='footer'>底部信息信息</p>
    </base-layout>

    <base-layout>
      <template slot='header'>
        <p>标题信息1</p>
        <p>标题信息2</p>
      </template>
      <p>主要内容1</p>
      <p>主要内容2</p>
      <template slot='footer'>
        <p>底部信息信息1</p>
        <p>底部信息信息2</p>
      </template>
    </base-layout>
  </div>
  <script type="text/javascript" src="js/vue.js"></script>
  <script type="text/javascript">
    /*
      具名插槽
    */
    Vue.component('base-layout', {
      template: `
        <div>
          <header>
            <slot name='header'></slot>
          </header>
          <main>
            <slot></slot>
          </main>
          <footer>
            <slot name='footer'></slot>
          </footer>
        </div>
      `
    });
    var vm = new Vue({
      el: '#app',
      data: {
        
      }
    });
  </script>
</body>
</html>
```

**v-slot**

> 用法与以上相同，只是将 `slot='header'` 替换为 `v-slot:header`
>
> 同时 `v-slot:` 可以简写为 `#`，同理可得以上可简写为 `#header`

```html
<!DOCTYPE html>
<html lang='en'>

<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title></title>
  <script type='text/javascript' src='js/vue-2.6.10.js'></script>
</head>

<body>
  <div id='app'>
    <base-layout>
      <template #header="{ user }">
        <h2>{{ user.firstName }} </h2>
      </template>

      <p>A paragraph for the main content.</p>
      <p>And another one.</p>

      <template #footer>
        <p>Here's some contact info</p>
      </template>
    </base-layout>
  </div>
  <script type='text/javascript'>
    Vue.component('base-layout', {
      data() {
        return {
          user: {
            firstName: 'Harry',
            lastName: 'Hao'
          }
        }
      },
      template: `
        <div class="container">
          <header>
            <slot name="header" :user="user">{{ user.lastName}}</slot>
          </header>
          <main>
            <slot></slot>
          </main>
          <footer>
            <slot name="footer"></slot>
          </footer>
        </div>
      `,
    })
    var vm = new Vue({
      el: '#app',
      data: {

      },
      methods: {

      }
    });
  </script>
</body>

</html>
```

### 遍历数组

- 普通for循环
- array.forEach  没有返回值，条件满足就终止循环
- for..in  一般情况下用来遍历对象
- for...of
- array.filter
- array.some   有返回值，条件满足就终止循环
- array.findIndex  返回满足条件的索引值
- map
- reduce
- every

## day 04

> SPA ( Single Page Application)单页面应用程序
>
> 原理之一：基于URL地址的hash

### 路由引入

> 引入 router.js 文件

https://router.vuejs.org/zh/

```html
<router-link to="/user">跳转到user页面</router-link>

<srcript>
const router = new VueRouter({
	routes:[
    	{path: '/user', component: User}
    ]
})
</srcript>
```

### 重定向

```js
//...

routes:[
    {path: '/', redirect: '/user'},
    {path: '/user', component: user}
    //...
]
```

### 子路由

```js
routes:[
    {path: '/', redirect: '/user'},
    {path: '/user', component: user, children;[
     	{path: '/user/tab1', component: tab1},
     	{path: '/user/tab2', component: tab2},
     ]}
    //...
]
```

### 动态匹配路由

**props 可为 boolean，Object，函数**

```js
routes:[
    {path: '/', redirect: '/user'},
    {path: '/user', component: user, props: true}
    //...
]
```

```js
routes:[
    {path: '/', redirect: '/user'},
    {path: '/user', component: user, props: {
    	'name': 'ls', age: 23
    }}
    //...
]
```

```js
routes:[
    {path: '/', redirect: '/user'},
    {path: '/user', component: user, props: 
    	name: 'ls',
     	age: 17,
     	id: $route.params.id
    }
    //...
]
```

### 命名路由

> 给路由命名，然后以对象的形式绑定在`router-link` 中的 `to`属性

```js
<router-link :to="{ name: 'user', params: {id: 3} }">User3</router-link>


{
    // 命名路由
    name: 'user',
    path: '/user/:id',
    component: User,
    props: route => ({ uname: 'zs', age: 20, id: route.params.id })
},
```

### 编程式导航

`this.$router.push()`

`this.$router.go()`



this.$router.push('/user')

this.$router.push({path: '/user'})

this.$router.push({name: 'user'})



this.$router.push({name: 'user', params: {id: 2}})

this.$router.push({path: '/user/2'})

this.$router.push({path: '/user', query: {id: 3}})



### 模块化规范

AMD

CMD
CommonJS

ES6

## day 05

### ES6

#### 导入导出

> 每个模块中，只允许使用一次 `export default`
>
> export 可以多次使用，导出和导入的名字需相同，如有需重命名的变量使用 `as`

```js
// 导出
export default {}

// 导入
import xx from './m1.js'


// 导入
export aa
export bb

// 导入
import {aa as qq, bb} from './m2.js'
```

### `webpack`

#### npm装包

```bash
npm i webpack webpack-cli -D
```

#### 打包命令

```bash
npm run build
```

#### `package.json` 配置

...

#### 自动打包

```js
npm i webpack-dev-server -D
```

## Vuex

> 实现组件全局状态（数据）管理的一种机制，可以方便的实现组件之间数据的共享。

**优点**

- 集中管理共享数据，易于开发和维护
- 高效实现组件之间的数据共享，提高开发小绿
- vuex中的数据都是响应式的，能够实时保持数据与页面的同步

### state

`vuex` 导入 `mapState`

```html
<template>
	<div>
        {{ count }}
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([count])
    }
}
</script>
```

### mutation

> 用于修改state中的数据，不推荐在其他组件中直接修改vuex中的数据
>
> 异步执行使用`Action`
>
> 



`store.js`

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state) {
      state.count++
    }
  },
  actions: {

  }
})
```

单个组件中

```js
this.$store.commit("add")
```

### actions

> 此方法中均为调用异步的方法
>
> 操作`state`中的数据还是要调用`mutations`



定义

```js
actions: {
    addAsync (context) {
        setTimeout(() => {
            context.add()
        }, 1000);
    }
}
```

调用

```js
this.$store.dispatch('addAsync')
```

### Getter

> 用法同上

