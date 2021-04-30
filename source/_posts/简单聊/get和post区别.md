---
title: get和post区别
date: 2021-04-21 10:22:13
tags:
categories: 简单聊
---





- GET在浏览器回退时是无害的，而POST会再次提交请求。
- GET产生的URL地址可以被Bookmark，而POST不可以。
- GET请求会被浏览器主动cache，而POST不会，除非手动设置。
- GET请求只能进行url编码，而POST支持多种编码方式。
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
- GET请求在URL中传送的参数是有长度限制的，而POST么有。
- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。
- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
- GET参数通过URL传递，POST放在Request body中。



额外可以聊

- GET 的body中也可以放数据，但是由于规范中不建议，所以大多数浏览器也没有处理，也就导致不会接收到 GET请求中body的数据
- URL限制长度，在http statue code（状态码）中 415 就是URL Too Long。本身协议没有限制长度，但浏览器会有限制，太长了也不方便后端、爬虫处理。



[GET 和 POST 到底有什么区别？ - 大宽宽的回答 - 知乎]( https://www.zhihu.com/question/28586791/answer/767316172)



