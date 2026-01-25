---
title: 通过 Webpack Loader 实现打包优化
tags:
  - webpack
  - 性能优化
categories: 前端
abbrlink: bffc2e83
date: 2024-05-13 11:19:42
---

> 一句话总结：通过配置 `pitching-loader` 实现按需打包，实现开发模式下打包加速。

<!--more-->

## 背景

在翻项目代码时，发现了个比较有意思的设计，总结下来。

适用于当前端项目单一仓库项目比较庞大，而且还是SPA页面时，需要解决使用 `webpack` 打包会非常之缓慢问题。

若前端项目页面刚好是按照业务维度划分，所以只需要按照启动时配置秩序打包指定文件夹即可。

## 解法思路

使用 `webpack` 自定义 `loader` 过滤跳过打包文件，进而加快打包速度。

[pitching-loader](https://webpack.docschina.org/api/loaders#pitching-loader) 刚好可以在处理前进行判断，具体可看官方。

## 实践

通过 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 进行修改 `webpack` 配置。

```js
// 在开发环境下配置一个自定义loader
if (process.env.BUILD_ENV === 'development') {
  chain.module.rule('vue').use('vue-loader-v15').loader(require.resolve('./loaders/partial-loader.js'))
}
```


```js
// partial-loader.js 实现

// SUB_APP 为当前启动需运行的项目（需打包的文件夹名）
const knownModule = [
  'folder-a',
  'folder-b',
  'folder-c',
].filter(i => i !== process.env.SUB_APP)

// 需排除打包的文件夹名称
let excluded = [...knownModule]

function isSkippedPartial(module, resourceQuery, resourcePath) {
  const isForceLoad = resourceQuery && resourceQuery.indexOf('force') > -1
  if (isForceLoad) {
    console.warn('强制 build', resourcePath)
  }

  const includedReg = new RegExp(`^((?!${excluded.join('|')}).)*$`)
  const isExluded = resourcePath && !resourcePath.match(includedReg)

  if (!isForceLoad && isExluded) {
    let requiredByRoute = false
    try {
      let issuer = module.issuer
      let i = 0
      while (i < 6) {
        if (!issuer) {
          break
        }
        if (issuer.resource.endsWith('routes.config.js')) {
          requiredByRoute = true
          break
        }
        issuer = issuer.issuer
        i += 1
      }
    } catch {
      requiredByRoute = false
    }
    if (requiredByRoute) {
      console.warn('忽略 build', resourcePath)
      return true
    }
  }
  return false
}

module.exports = code => code

module.exports.pitch = function pitch() {
  if (isSkippedPartial(this._module, this.resourceQuery, this.resourcePath)) {
    return ''
  }
}

```

## 参考

[编写 loader](https://webpack.docschina.org/contribute/writing-a-loader/)
