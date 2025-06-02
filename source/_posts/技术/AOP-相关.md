---
title: AOP 相关
abbrlink: 326cfd21
date: 2025-06-01 20:20:03
tags:
categories: 技术
---

关键词： AOP, DI, IoC

## 名词概念


AOP：`Aspect-Oriented Programming` 面向切面编程，是一种编程范式，旨在通过分离横切关注点来实现（如日志、性能监控、安全检查等功能），提高系统模块化和可维护性。相比之下或许 OOP（面向对象编程） 可能会耳熟。

DI：`Dependency Injection` 依赖注入，是一种软件设计模式，用于实现对象之间的解耦。它通过将对象的依赖（如服务、组件或资源）在创建时注入，而不是由对象自己直接创建或寻找依赖，从而提高代码的可测试性、可扩展性和灵活性。简单来说，依赖注入让对象不直接负责依赖的获取，而是由外部系统提供这些依赖。

IoC：`Inversion of Control` 控制反转，是一种设计原则或架构模式，主要通过将对象的创建和依赖关系管理交由外部容器（如依赖注入容器）实现，从而降低模块之间的耦合度。它实现了对象控制权的“反转”——由框架或容器负责控制对象的生命周期和依赖，开发人员只需专注于业务逻辑。

## 关系
IoC是基础，提供对象的生命周期管理和依赖管理。
它为依赖注入提供了环境，确保对象的创建和依赖关系是由容器控制。

DI是实现IoC的手段，注入依赖以实现松耦合。
通过DI，应用中的对象不再自行创建依赖，而是由容器在实例化时注入所需的依赖。

AOP通常依赖于IoC和DI，借助容器在运行时动态管理和应用切面。
AOP框架（如Spring AOP）通常集成在依赖注入容器中，利用动态代理或字节码增强，在对象被创建后，通过容器自动应用切面。

## JavaScript AOP 实现

[opensumi/di](https://github.com/opensumi/di)

[meld](https://github.com/cujojs/meld)


### 参考

[AOP WIKI](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%9A%84%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)

[OpenSumi 依赖注入](https://opensumi.com/zh/docs/develop/basic-design/dependence-injector)

[JavaScript中AOP的应用](https://juejin.cn/post/6844903838172839943)

[Aspect-Oriented Programming in JavaScript - ctnicholas.dev](https://www.ctnicholas.dev/notes/aspect-oriented-programming-in-javascript)

[Aspect-Oriented Programming in JavaScript - bitsrc.io](https://blog.bitsrc.io/aspect-oriented-programming-in-javascript-c4cb43f6bfcc)
