---
title: 初次使用git配置
date: 2020-07-27 12:48:24
tags:
- git
categories:
- command
---



配置个信息

连接github

配置git代理：http、https、ssh



---

<!-- more -->

## 配置个人信息

```bash
# 设置用户名
git config --global user.name "your name"

# 设置邮箱
git config --global user.email "xx@emial.com"
```



## 连接github

```bash
# 生成key在 ～/.ssh/id_rsa.pub 公匙
ssh-keygen -t rsa -C "xx@email.com"
# 一路回车，知道本程序结束
```

然后在 github 点击个人头像，进入 settings。

选择 SSH and GPL keys。

New SSH Key，显示需要添加 title、key。

title 随意，key为本地的公匙（`～/.ssh/id_rsa.pub `）

```bash
# 测试是否添加成功
～/.ssh/id_rsa.pub

Hi xxx! You've successfully authenticated, but GitHub does not provide shell access. #出现词句话，说明设置成功。
```



## 配置 git http代理

```bash
# 具体端口号，修改为自己本地代理配置

git config --global http.proxy socks://127.0.0.1:1080

git config --global https.proxy socks://127.0.0.1:1080


# 取消代理

git config --global --unset http.proxy

git config --global --unset https.proxy
```



## 配置 git ssh 代理

修改`~/.ssh/config` （如不存在自行创建）

```bash
# 必须是 github.com
Host github.com
   HostName github.com
   User git
   # 走 HTTP 代理
   # ProxyCommand socat - PROXY:127.0.0.1:%h:%p,proxyport=8080
   # 走 socks5 代理（如 Shadowsocks）
   # ProxyCommand nc -v -x 127.0.0.1:1080 %h %p
```





## 参考

https://gist.github.com/chuyik/02d0d37a49edc162546441092efae6a1