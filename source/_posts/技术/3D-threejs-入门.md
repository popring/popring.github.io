---
title: 3D/threejs 入门
categories: 技术
abbrlink: dda1bd91
date: 2025-06-02 12:23:59
tags:
---

<!-- more -->

## 3D 相关课程/文章

- [course: threejs-journey](https://threejs-journey.com/)
- [book: discoverthreejs](https://discoverthreejs.com/zh/book/introduction/about-the-book/)
- [book: zxg_神说要有光 threejs 小册子](https://juejin.cn/book/7481132169944498226?enter_from=course_center&utm_source=course_center)
- [article: 3d-modeling-basics-for-developers](https://daily.dev/blog/3d-modeling-basics-for-developers)
- [doc: 官方入门文档](https://threejs.org/manual/#zh/fundamentals)

---

## 专业名词

- Geometry：几何体，描述物体的形状
- Material：材质，描述物体的外观
- Mesh：网格，几何体和材质的组合
- Scene：场景，包含所有要渲染的物体
- Camera：相机，用于观察场景
- Renderer：渲染器，将场景渲染到屏幕上
- Light：光源，用于照亮场景
- Animation：动画，用于给物体添加动画
- Group：组，用于将多个物体组合在一起，可以设置组的整体属性
- Texture：纹理，用于给物体添加纹理
- Shader：着色器，用于给物体添加着色
- uv: 纹理坐标，用于描述纹理在物体上的位置


## JavaScript module 技巧

- import link 导入
- importmap 导入 [importmap - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/script/type/importmap)

```html
<!-- 通过链接导入 -->
<script type="module">
import * as THREE from "https://esm.sh/three@0.174.0/build/three.module.js";
</script>

<!-- 通过 importmap 导入 -->
<script type="importmap">
  {
      "imports": {
          "three": "https://esm.sh/three@0.174.0/build/three.module.js"
      }   
  }
</script>
<script type="module">
    import * as THREE from "three";

    console.log(THREE);
</script>
```


## 步骤

1. 创建 `Geometry` 和 `Material`，加入到 `Mesh` 中
2. 创建 `Light` 光源
3. 创建 `Scene` 场景，将 `Mesh` 和 `Light` 加入到 `Scene` 中
4. 创建 `Camera` 相机
5. 创建 `Renderer` 渲染器，将 `Scene` 和 `Camera` 渲染到屏幕上
6. 创建 `OrbitControls` 控制相机（传入 `Camera` 和 `Renderer`），用于控制相机的位置和角度


## 可视化控制

可以通过 `dat-gui` / `lil-gui` 来可视化控制参数，从而实现交互式效果。

`dat-gui` 已经不再维护了， star `7.6k`
`lil-gui` 内置在 `three.js` 中, star `1.3k`

- [dat.GUI](https://github.com/dataarts/dat.gui)
- [lil-gui](https://github.com/georgealways/lil-gui)
- [control-panel](https://github.com/freeman-lab/control-panel)
- [ControlKit](https://github.com/automat/controlkit.js)
- [Uil](https://github.com/lo-th/uil)
- [Tweakpane](https://tweakpane.github.io/docs/)
- [Guify](https://github.com/colejd/guify)
- [Oui](https://github.com/wearekuva/oui)

## 视锥体和相机

通过创建 `CameraHelper` 来实现模拟相机视锥体，可视化相机角度，并通过 GUI 来实时控制 `PerspectiveCamera` 的 `fov`、 `aspect` 、`near`、`far` 参数。

`fov`: 可视角度，离物体的远近，默认 `50`
`aspect`: 宽高比，通常是浏览器窗口的宽高比 `window.innerWidth / window.innerHeight`，默认 `1`
`near`: 近截面，通常是 `0.1`，默认 `0.1`
`far`: 远截面，通常是 `1000`，默认 `1000`


## 几何体

3D 物体都是有顶点构成的三角形网格模型，所有几何体都是由一堆三角形构成的。

如我们正常看到的三角形，是会有 3 个顶点；正方形则是由两个三角形构成的，有 6 个顶点。

可以通过 `BufferGeometry` 创建自定义集合体；

比如这里我们创建一个正方形，有 6 个顶点，每个顶点有 3 个坐标，所以需要 18 个数字。

```js
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,

    0, 100, 0,
    100, 0, 0,
    100, 100, 0
]);

const attributes = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attributes;
```

有可以看出其实有一些数据是重复的 `Three.js` 提供了优化顶点存储的方案：存储一份不重复的顶点数据，然后存储一份顶点索引就可以了。

```js
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,

    // 0, 100, 0,
    // 100, 0, 0,
    100, 100, 0
]);

const attributes = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attributes;
const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);
geometry.index = new THREE.BufferAttribute(indices, 1);
```

## 噪声

噪声函数可以生成随机值，用于生成随机形状。

[SimplexNoise](https://www.npmjs.com/package/simplex-noise) 是 `three.js` 中的一种噪声函数，用于生成随机值。

## uv

UV 坐标是纹理坐标，用于描述纹理在物体上的位置。

texture.offset 可以让纹理贴图偏移一段距离，相当于改变了 uv 坐标，所以修改 texture.offset 的动画也叫做 uv 动画。

还可以结合 texture.wrapT、textrue.wrapS 来实现纹理的重复。

```js
const loader = new THREE.TextureLoader();
const texture = loader.load('./texture.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.offset.x = 0.5; // 水平偏移
texture.offset.y = 0.5; // 垂直偏移
texture.repeat.x = 2; // 水平重复
texture.repeat.y = 2; // 垂直重复
```

## 动画

使用相同的时间间隔来更新动画，可以保证动画的流畅性。

方法一：

```js
let time = Date.now()

const tick = () => {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    mesh.rotation.y += 0.001 * deltaTime
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```

方法二：

```js
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = 0.001 * elapsedTime
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```

## 动画库

- [gsap](https://greensock.com/gsap/)
- [tween.js](https://github.com/tweenjs/tween.js/)

## find texture website

- [poliigon.com](https://poliigon.com/)
- [3dtextures.me](https://3dtextures.me/)
- [arroway-textures.ch](https://www.arroway-textures.ch/)
