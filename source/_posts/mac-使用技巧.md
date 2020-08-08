---
title: mac 使用技巧
date: 2020-08-05 09:15:10
tags:
- brew
- iterm2
categories:
---





---

<!-- more -->



## brew

> mac 下软件管理工具，类似node的npm，python的pip，，，



### 安装 `node-v12`

```bash
brew install node@12
```

### 安装 `iterm2`

```bash
brew cask install iterm2
```



> [引用](https://www.zhihu.com/question/22624898/answer/22782144)
>
> `brew install ` ，前者是是从下载源码解压然后 ./configure && make install ，同时会包含相关依存库。并自动配置好各种环境变量，而且易于卸载。
>
>  `brew cask install` ，是已经编译好的包，只需要下载解压放在统一的目录中（/opt/homebrew-cask/Caskroom）



### 搜索软件

```bash
brew search node
```



### brew services

```bash
[sudo] brew services [list]:
		列出当前用户的所有服务。

[sudo] brew services run (formula|--all):
		运行没有注册启动的服务。

[sudo] brew services start (formula|--all):
		启动服务

[sudo] brew services stop (formula|--all):
    关闭服务

[sudo] brew services restart (formula|--all):
    重启服务

[sudo] brew services cleanup:
    移除所有未使用的服务。

```



## iterm2

### 快捷键

| 快捷键      | 说明       |
| ----------- | ---------- |
| Control + U | 清空当前行 |
| Control + Y | 恢复当前行 |
|             |            |



### vim

| 快捷键 | 说明       |
| ------ | ---------- |
| dd     | 删除当前行 |
|        |            |
|        |            |

