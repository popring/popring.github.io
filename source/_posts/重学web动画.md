---
title: 重学 Web 动画（一）：CSS 动画基础
tags:
  - web动画
  - CSS
  - animation
  - transition
abbrlink: 22aaf562
date: 2026-01-02 02:20:51
categories:
  - 技术
---


## 动画库相关

这里列举了部分流行的 css 动画库，我感觉都还不错各有特色

[easings.net](https://easings.net/): 动画缓动函数，可以直接预览一些常用的动画缓动函数 cubic-bezier 函数

[tw-animate-css](https://github.com/Wombosvideo/tw-animate-css?tab=readme-ov-file#readme): 一个动画库，内置了大量的动画效果，可以方便的添加到项目中

[tailwindcss-radix](https://github.com/ecklf/tailwindcss-radix): 一个 Tailwind CSS 的插件，将 radix 的组件状态转换为 Tailwind CSS 的类名

## CSS 动画相关属性

### opacity 属性

透明度，取值 0~1，0 是完全透明，1 是完全不透明。这个属性本身没什么复杂的，但它是做动画时最常用的属性之一。

最典型的场景就是淡入淡出效果：

```css
.fade-in {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade-in.visible {
  opacity: 1;
}
```

值得一提的是，opacity 是可以被 GPU 加速的属性，所以用它来做动画性能很好，不会卡顿。

### transform 属性

transform 是做动画的核心属性，它可以让元素移动、旋转、缩放、倾斜，而且不会触发页面重排，性能非常好。

常用的几个函数：

**translate - 位移**

```css
/* 水平移动 */
transform: translateX(100px);
/* 垂直移动 */
transform: translateY(50px);
/* 同时移动 */
transform: translate(100px, 50px);
/* 3D 移动，可以触发 GPU 加速 */
transform: translate3d(100px, 50px, 0);
```

实际开发中，如果要移动元素位置，用 `translate` 比改 `left`/`top` 性能好太多了。因为 `left`/`top` 会触发重排，而 `translate` 只会触发合成。

**rotate - 旋转**

```css
transform: rotate(45deg);      /* 顺时针旋转 45 度 */
transform: rotate(-45deg);     /* 逆时针旋转 45 度 */
transform: rotateX(45deg);     /* 沿 X 轴旋转，有 3D 效果 */
transform: rotateY(45deg);     /* 沿 Y 轴旋转 */
```

**scale - 缩放**

```css
transform: scale(1.5);         /* 放大 1.5 倍 */
transform: scale(0.5);         /* 缩小到 0.5 倍 */
transform: scaleX(2);          /* 只在水平方向拉伸 */
```

hover 放大效果用这个很方便：

```css
.card:hover {
  transform: scale(1.05);
}
```

**组合使用**

多个变换可以写在一起，但要注意顺序会影响结果：

```css
/* 先移动再旋转 vs 先旋转再移动，效果是不一样的 */
transform: translateX(100px) rotate(45deg);
transform: rotate(45deg) translateX(100px);
```

**transform-origin**

默认情况下，变换是以元素中心为原点的。如果想改变原点位置，可以用 `transform-origin`：

```css
transform-origin: top left;    /* 左上角 */
transform-origin: center;      /* 中心，默认值 */
transform-origin: 50% 100%;    /* 底部中心 */
```

### transition 属性

transition 是最简单的动画方式，当属性值变化时，它会自动产生过渡效果。

完整语法：

```css
transition: property duration timing-function delay;
```

举个例子：

```css
.button {
  background: #333;
  transition: background 0.3s ease;
}

.button:hover {
  background: #666;
}
```

**四个子属性**

- `transition-property`: 要过渡的属性，可以写 `all` 表示所有属性
- `transition-duration`: 过渡时长，比如 `0.3s`、`300ms`
- `transition-timing-function`: 缓动函数，这个是灵魂
- `transition-delay`: 延迟时间

**timing-function 缓动函数**

这是 transition 里最重要的部分。不同的缓动函数会让动画感觉完全不一样。

内置的几个：
- `linear`: 匀速，比较生硬
- `ease`: 默认值，先快后慢
- `ease-in`: 慢进
- `ease-out`: 慢出，感觉比较自然
- `ease-in-out`: 慢进慢出

但很多时候内置的不够用，这时候就要用 `cubic-bezier()` 自定义曲线。前面提到的 [easings.net](https://easings.net/) 就是专门预览和复制这些曲线的，非常好用。

```css
/* 弹性效果 */
transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### animation 属性

如果 transition 满足不了需求，比如要做循环动画、多阶段动画，就得用 animation 了。

基本语法：

```css
animation: name duration timing-function delay iteration-count direction fill-mode;
```

看起来参数很多，但常用的就那几个：

```css
.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**常用子属性**

- `animation-name`: 对应 @keyframes 的名字
- `animation-duration`: 动画时长
- `animation-timing-function`: 缓动函数，和 transition 一样
- `animation-delay`: 延迟
- `animation-iteration-count`: 播放次数，`infinite` 表示无限循环
- `animation-direction`: 播放方向
  - `normal`: 正常播放
  - `reverse`: 反向播放
  - `alternate`: 来回播放，做呼吸灯效果很好用
- `animation-fill-mode`: 动画结束后的状态
  - `forwards`: 保持在最后一帧，这个最常用
  - `backwards`: 保持在第一帧
  - `both`: 两者都应用
- `animation-play-state`: `running` 或 `paused`，可以用来暂停动画

**fill-mode 踩坑**

刚学的时候经常遇到的问题：动画播完元素就跳回原位了。这时候就需要设置 `animation-fill-mode: forwards`，让元素保持在动画结束时的状态。

### @keyframes 规则

@keyframes 用来定义动画的关键帧，有两种写法：

**from...to 写法**

适合简单的两帧动画：

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**百分比写法**

适合多阶段动画：

```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
```

也可以把相同的帧合并写：

```css
@keyframes flash {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0;
  }
}
```

## clip-path 属性

clip-path 可以裁剪元素的显示区域，做一些不规则形状的效果。配合 transition 可以做出很有意思的动画。

**circle() - 圆形**

```css
/* 以中心为圆心，半径 50% 的圆 */
clip-path: circle(50%);
/* 指定圆心位置 */
clip-path: circle(50% at 0% 50%);
```

一个常见的应用是 hover 时从某个点展开：

```css
.card {
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.5s ease;
}

.card:hover {
  clip-path: circle(100% at 50% 50%);
}
```

**polygon() - 多边形**

可以画任意多边形，参数是各个顶点的坐标：

```css
/* 三角形 */
clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
/* 菱形 */
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
```

**inset() - 矩形内缩**

从四边向内裁剪：

```css
/* 四边各裁掉 10px */
clip-path: inset(10px);
/* 分别设置上右下左 */
clip-path: inset(10px 20px 30px 40px);
/* 还可以加圆角 */
clip-path: inset(10px round 10px);
```

## 性能优化小技巧

做动画时最怕的就是卡顿，这里总结一下怎么让动画更流畅。

**只用 transform 和 opacity**

这两个属性是性能最好的，因为它们只会触发合成（Composite），不会触发重排（Layout）和重绘（Paint）。

如果你要移动元素，用 `transform: translate()` 而不是改 `left`/`top`。要改透明度就用 `opacity` 而不是 `visibility`。

**will-change 提前告知**

如果知道某个元素马上要做动画，可以用 `will-change` 提前告诉浏览器：

```css
.will-animate {
  will-change: transform;
}
```

这样浏览器会提前做好优化准备。但不要滥用，用完记得移除，不然会占用额外内存。

**transform: translate3d() 或 translateZ(0)**

这是个小技巧，加上 Z 轴的变换可以强制开启 GPU 加速：

```css
.gpu-accelerated {
  transform: translateZ(0);
  /* 或者 */
  transform: translate3d(0, 0, 0);
}
```

**避免动画这些属性**

以下属性会触发重排，尽量不要用它们做动画：
- `width`、`height`
- `top`、`left`、`right`、`bottom`
- `margin`、`padding`
- `font-size`

如果非要改变大小，可以用 `transform: scale()` 代替。

## 做的比较好的可参考的网站

- [Vercel 官网](https://vercel.com/home)
- [Vercel 设计系统](https://vercel.com/geist/introduction)
- [Linear 官网](https://linear.app/)
- [Aave 官网](https://aave.com/)
- [Aave 文档](https://aave.com/docs)
