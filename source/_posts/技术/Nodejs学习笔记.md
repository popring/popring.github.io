---
title: Node.js 学习笔记
tags:
  - node
  - 笔记
categories: 技术
abbrlink: 20e30b1b
date: 2019-05-16 17:15:07
---



早期在学习 `node` 时候，做的笔记。

<!--more-->



## NodeJS 简介

**非阻塞IO**，**运行在Chome V8**，**事件驱动**



## 环境 调试

- CommonJS
- global
- process

### `CommonJS`

- 每个文件是一个模块，有自己的作用域
- 在模块内部 `module` 变量代表模块本身
- `module.exports` 属性代表模块对外接口

### `require` 规则

- `/` 表示绝对路径， `./` 表示相对当前文件的路径

- 支持 js, json, node 拓展名，不写依次尝试
- 不写路径认为是 build-in 模块或者各级 `node_modules`内的第三方模块

### `require` 特性

- `module` 被加载的时候执行，加载后缓存
- 一旦出现某个模块被循环加载，就只输出已经执行的部分，还未执行的部分不会输出

### [`chalk` 模块](https://github.com/chalk/chalk)

将所有的模块安装在 `node_modules` 下，无论是项目的依赖还是模块的依赖，或者是共同的依赖，都安装在 `node_modules` 下，早期的 `npm` 会将 模块的依赖安装在自身文件夹下的 `node_modules` 下，而如今的 `npm` 则是统一安装在项目根目录下的 `node_modules` 下。



### `modules.exports` 和 `exports` 区别

> exports = modules.exports;
>
> 两者是相等的

```js
const exports = modules.exports;

(
    function(exports, require, module, __filename, __dirname){
        // code
	}
)

exports.test = 100;

// 这样会改变 exports 的指向，故失效
exports = {
    a: 1,
    b: 2,
    test: 100
};

// 如果要修改为字面量形式
module.exports = {
    a: 1,
    b: 2,
    test: 100
}
```

### `global` 变量

- CommonJS
- Buffer, process, console
- timer
  - setTimeout
  - SetInterval

### [process](http://nodejs.cn/api/process.html)

- `argv` 返回进程启动时的命令行参数。 第一个元素是 [`process.execPath`](http://nodejs.cn/s/MCrAya)。 使用 `process.argv0` 可以获取 `argv[0]` 原始的值。 第二个元素是当前执行的 JavaScript 文件的路径。 剩余的元素都是额外的命令行参数。
- `argv0` 返回进程启动时传入的 `argv[0]` 的原始值。
- `execArgv` 返回 Node.js 特定的命令行选项。
- `execPath` 返回 Node.js 启动文件绝对路径
- `env` 返回用户的环境信息
- `cwd` 返回进程的当前工作目录

### [调试方法](https://nodejs.org/zh-cn/docs/guides/debugging-getting-started/)

chrome

vscode

webstrom

...

## Node.js 基础

### path

> normalize, join, resolve,
>
> basename, extname, dirname, 
>
> parse, format
>
> sep, delimiter, win32, posix

```js
const {normalize} = require('path');
const normalize = require('path').normalize;
```

```js
// parse 返回当前 路径的 文件/文件夹信息
let parse = path.parse('D://nodejs/demo4/01_path.js');
console.log(parse);

// 返回
{ 
  root: 'D:/',
  dir: 'D://nodejs/demo4',
  base: '01_path.js',
  ext: '.js',
  name: '01_path' 
}

// format 与 parse 正好相反
let format = path.format({
    root: '/ignored',
    dir: '/home/user/dir',
    base: 'file.txt'
});
console.log(format);

// 返回
`/home/user/dir\file.txt`
```

path.format(pathObject)

当为 `pathObject` 提供属性时，请记住有一个组合，其中一个属性优先于另一个属性：

- 如果提供了 `pathObject.dir`，则忽略 `pathObject.root`。
- 如果 `pathObject.base` 存在，则忽略 `pathObject.ext` 和 `pathObject.name`。



> `__dirname`, `__filename`  总是返回文件的绝对路径
>
> process.cwd() 总是返回执行 node 命令所在文件夹

### Buffer

> - Buffer 用于处理二进制数据流
>
> - 实例类似整数数组，大小固定
>
> - C++ 代码在 V8 堆外分配物理内存
>
> - Buffer.byteLength
>   Buffer.isBuffer() 是否为`Buffer`对象
>   Buffer.concat()
>
> - buf.length
>
>   buf.toString()
>
>   buf.fill()
>
>   buf.equals()
>
>   buf.indexOf()
>
>   buf.copy()



### [events(事件)](http://nodejs.cn/api/events.htm)

```js
const EventEmitter = require('events');
class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();
ce.on('test', () => {
    console.log('This is a test!');
})

setInterval(() => {
    ce.emit('test');
}, 500)

```

emitter.once() 事件只触发一回

emitter.emit() 触发事件

emitter.on()  --  emitter.addListener() 都为绑定事件

emitter.removeListener() 移除事件

emitter.removeAllListeners() 移除所有事件

### [fs](http://nodejs.cn/api/fs.html)

> readFile 读文件
>
> writeFile 写文件
>
> stat 提供文件相关信息
>
> rename 更改文件名
>
> unlink 删除文件
>
> readdir 读文件夹
>
> mkdir 创建文件夹
>
> rmdir 删除文件夹
>
> watch 监视文件/文件夹
>
> readstream



### 解决回调地狱问题

> Promise
>
> promisify
>
> async await

```js
// promisify
const {promisify} =  require('util');

const read = promisify(fs.readFile);
read('b.txt').then( data => {
    console.log(data.toString());
}).catch( err => {
    console.log(err);
});

console.log(123);
```

```js
// async await
async function test() {
    try {
        const content = await read('b.txt')
        console.log(content.toString());
    } catch (err) {
        console.log(err);
    }
}
test();
```

## 项目初始化

### .gitignore

`git` 忽略文件

> 匹配模式前 `/` 代表项目根目录
>
> 匹配模式最后加 `/` 代表是目录
>
> 匹配模式前加 `!` 代表取反
>
> `*` 代表任意字符
>
> `?` 匹配任意一个字符
>
> `**` 匹配多级目录

### .npmignore

`npm` 忽略文件 

### .EditorConfig

>  EditorConfig有助于为跨越各种编辑器和IDE的同一项目的多个开发人员维护一致的编码样式。EditorConfig项目由用于定义编码样式**的文件格式**和一组**文本编辑器插件组成**，这些**插件**使编辑器能够读取文件格式并遵循定义的样式。EditorConfig文件易于阅读，与版本控制系统配合使用。

官方模板

```
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

### .eslintignore

> 需要 `eslint` 忽略检查的文件
>
> 规范同 `gitignore`

也可以在 `package.json` 中查找忽略的文件 `eslintIgnore`

```json
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
      "env": {
          "browser": true,
          "node": true
      }
  },
  "eslintIgnore": ["hello.js", "world.js"]
}
```

### ESLint

> JavaScript 代码检查工具。

```bash
# 安装
yarn add --dev eslint
# 生成ESLint配置
./node_modules/.bin/eslint --init
```

#### [内联禁用 `ESLint`规则](http://eslint.cn/docs/user-guide/configuring#disabling-rules-with-inline-comments)

```js
/* eslint-disable */

alert('foo');

/* eslint-enable */
```

```js
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```

```js
alert('foo'); // eslint-disable-line

// eslint-disable-next-line
alert('foo');
```

## 静态资源服务器

### 创建服务器

```js
// 引入 http 模块
const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const server = http.createServer((req, res)=> {
    
});

server.listen(conf.port, conf.hostname, ()=> {
  const address = `http://${conf.hostname}:${conf.port}`;
  console.info(`Server started at the ${chalk.green(address)}`);
})
```

> 将配置信息分离出

```js
module.exports = {
    root: process.cwd(),
    hostname: '127.0.0.1',
    port: 9527
}
```

#### content-type: 文件内容

> 普通内容：text/plain ...
>
> [HTTP Content -Type 对照表](http://tool.oschina.net/commons/)

#### 压缩文件

> accept-encoding: gzip,bar,deflate...

#### range范围请求

#### 缓存

> 使用缓存技术，减少服务器压力

#### 版本号

```
x.y.z
x 大版本，不保证兼容
y 新增功能，并且兼容前面版本
z 修复bug

1.2.* 同等于 ~1.2.0
永远是用最新的1.2.*


```

### supervisor模块

> 监听当前文件夹下的变化, 文件有变化 重新加载文件
>
> 自动重新载入服务器
>
> supervise 模块需要全局安装

```
# 使用supervise 模块加载js文件
supervisor app.js
```

### handlebars 模块

> 模板引擎，类似`art-template`, ejs 等 

2019年3月5日 23点25分

> 网站访问路径没有处理好

跳过

## 本地构建

> gulp, babel, webpack

### gulp

glob

> `*`匹配任意字符
>
> `?`匹配一个字符
>
> `[...]`匹配范围内的字符
>
> `!(parttern1|pattern2)`匹配取反
>
> `?(parttern1|pattern2)`匹配0个或1个
>
> `+(parttern1|pattern2)`匹配1个或多个
>
> `*(a|b|c)`匹配任意个
>
> `@(pattern|pat*|pat?erN)`匹配特定的一个
>
> `**`任意层级匹配

### babel

### webpack

## 单元测试和UI测试

[chai](https://www.chaijs.com/)

[mocha](https://mochajs.org/)

[istanbul](<https://github.com/gotwarlost/istanbul>)

### 专业术语

> TDD, BDD

#### TDD：测试驱动开发

测试驱动开发是敏捷开发中的一项核心实践和技术，也是一种设计方法论。TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。TDD的基本思路就是通过测试来推动整个开发的进行，但测试驱动开发并不只是单纯的测试工作，而是把需求分析，设计，质量控制量化的过程。TDD首先考虑使用需求（对象、功能、过程、接口等），主要是编写测试用例框架对功能的过程和接口进行设计，而测试框架可以持续进行验证。 



#### BDD：行为驱动开发（Behavior Driven Development）

行为驱动开发是一种敏捷软件开发的技术，它鼓励软件项目中的开发者、QA和非技术人员或商业参与者之间的协作。主要是从用户的需求出发，强调系统行为。BDD最初是由Dan North在2003年命名，它包括验收测试和客户测试驱动等的极限编程的实践，作为对测试驱动开发的回应。

转载自 [某乎](https://www.zhihu.com/question/20161970/answer/100003242)

### Mocha

```js
const {should, expect, assert} = require('chai');
const {add, mul} = require('../src/math');

should();

add(3, 2).should.equal(5);

expect(add(2, 3)).to.equal(5);

assert.equal(add(2, 3), 5);
```

### Mocha

```js
const {should, expect, assert} = require('chai');
const {add, mul} = require('../src/math');

describe('#math', () => {
    describe('add', () => {
        it('should return 5 when 3 + 2', () => {
            assert.equal(add(2, 3), 5);
        });

        it('should return 6 when 3 + 3', () => {
            assert.equal(add(3, 3), 6);
        });
    })

    describe('mul', () => {
        it('should return 6 when 3 * 2', () => {
            assert.equal(mul(2, 3), 6);
        });
    })
})
```

### istanbul

<http://www.ruanyifeng.com/blog/2015/06/istanbul.html>



# References

[Node.js 中文网](http://nodejs.cn/api/)

[npmingore 介绍](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package)

[gitignore 介绍](https://git-scm.com/docs/gitignore)

[EditorConfig](https://editorconfig.org/)

[ESLint 中文网](http://eslint.cn/)

[babel 官网](https://babeljs.io/)

[webpack 官网](https://webpack.docschina.org/)

