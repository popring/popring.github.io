---
title: HTTPS 握手过程详解
tags:
  - http
  - 面试题
categories: 面试
abbrlink: 1449f691
date: 2021-04-21 09:45:51
---

##  概括

- 客户端发起连接，提供协议版本号、随机数`(Client random)`、支持加密方法
- 服务端收到后，确认双方的加密方法，然后生成随机数`(Server random)`，以及自己的数字证书，发送给客户端
- 客户端收到后，确认数字证书是否有效，然后生成新的随机数`(Premaster secret)`，使用数字证书加密这个随机数，发送给服务端。
- 服务端使用自己的私钥，对随机数进行解密。
- 此时服务端和客户端就可以根据前面约定的加密方法进行通信，使用前面生成的三个随机数生成 **对话秘钥(session key)**，用来加密接下来的整个对话过程



细节

- 数字证书的加密和解密过程是属于**非对称加密**，在之后使用对话秘钥加密的方式是对称加密



[图解SSL/TLS协议](https://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)

[SSL/TLS协议运行机制的概述](https://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)

