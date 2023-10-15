---
title: go 入门
date: 2020-10-17 23:07:19
tags: Go
categories: 技术
---





<!--more-->



## 首先配置仓库来源

> 天朝特殊环境，不得不配置为国内的源

打开终端并执行

```
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```



macOS 或 Linux

```bash

export GO111MODULE=on
export GOPROXY=https://goproxy.cn

# 或者
echo "export GO111MODULE=on" >> ~/.profile
echo "export GOPROXY=https://goproxy.cn" >> ~/.profile
source ~/.profile
```



windows

```powershell
$env:GO111MODULE = "on"
$env:GOPROXY = "https://goproxy.cn"
```





## 相关Go资料

[Goproxy 中国](https://goproxy.cn/)

[Go语言101](https://gfw.go101.org/article/101.html)

[Go官方语言规范 - 英文](https://go.dev/ref/spec#Introduction)：据说看完此文档，Go基本就入门了

[Go by Example](https://gobyexample-cn.github.io/)：通过实践入门

[7天用Go从零实现Web框架Gee教程](https://geektutu.com/post/gee.html)