---
title: mac 使用技巧
date: 2020-08-05 09:15:10
tags:
- brew
- iterm2
categories: Command
---

快捷键

- brew
- iterm2
- mac

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



## iterm2快捷键

| 快捷键      | 说明             |
| ----------- | ---------------- |
| Control + U | 清空当前行       |
| Control + Y | 恢复当前行       |
| Control + A | 光标置于当前行首 |
| Control + E | 光标置于当前行尾 |
| Control + W | 删除光标前的内容 |
| Control + K | 删除光标后的内容 |
| CMD + T     | 打开一个新窗口   |
| CMD + W     | 关闭当前窗口     |



## vim

> 只整理了个人常用的快捷键，其他还请查看文档。

| 快捷键       | 说明                   |
| ------------ | ---------------------- |
| :q           | 退出                   |
| :q!          | 忽略更改退出           |
| :wq          | 保存退出               |
| A            | 在光标所在行尾开始插入 |
| I            | 在光标所在行头开始插入 |
| dd           | 删除当前行             |
| u            | 撤销修改               |
| ctrl+R       | 重做                   |
| 上下左右     | k,j,h,l                |
| 0,  `<Home>` | 行首                   |
| $, `<End>`   | 行尾                   |
| i            | 输入模式               |
| yy           | 复制当前行             |
| p            | 粘贴                   |
| :set nu      | 显示行号               |



## mac快捷键

| 快捷键                | 说明               |
| --------------------- | ------------------ |
| Control + command + D | 查询               |
| command + Q           | 退出当前软件       |
| command + Shift + .   | 显示/隐藏 隐藏文件 |
