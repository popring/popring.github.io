---
title: 指令示调起一个弹窗Vue和React版本（未完成版）
date: 2024-10-22 17:34:14
tags: Vue, react
categories:
---

该功能在Vue、React版本实现起来思路一致。

**核心思路**

- 使用一个函数，可以创建组件实例
- 将新创建的实例，挂载到 DOM 上
- 如果有特殊场景，需要将上下文进行绑定（本文内实现的暂未绑定上下文）

TODO: ant-design 在新版本实现了可以绑定上下文的 hooks，`Modal.useModal`，具体还没细看👀，后续有空再看看。


<!--more-->


## Vue 实现

1. 首先定义一个 `CustomModal.vue`

```vue
<template>
  <div class="modal-container" v-if="visible">
    <div class="modal-content">
      <slot></slot>
      <button @click="closeModal" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, watch } from 'vue';

const visible = ref(false);

const openModal = () => {
  visible.value = true;
};

const closeModal = () => {
  visible.value = false;
};

watch(visible, val => {
  console.log('%c [custom modal val ]-24', 'font-size:13px; background:#1c4295; color:#6086d9;', val)
})

defineExpose({
  visible,
  openModal,
  closeModal,
})
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background-color: #4299e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

2. 定义指令 `showModal` 方法，写在 `modal.js` 中，核心代码在这里

```js
import { createApp, nextTick, watch } from 'vue';

export function showModal(component) {
  // 创建一个 Vue 示例
  const app = createApp(component);
  // 创建一个容器，用来放 Modal 组件
  const root = document.createElement('div');

  // 将内容挂载到页面
  document.body.appendChild(root);

  // 将 Modal 组件挂载到页面上
  const instance = app.mount(root);
  // 手动调用组件内部函数，展示组件
  instance.openModal();

  // 定义卸载函数
  const unmount = () => {
    app.unmount();
    document.body.removeChild(root);
  };

  // 监听 Modal 组件是否关闭
  watch(
    () => instance.visible,
    () => {
      nextTick(unmount);
    }
  );

  return {
    instance,
    unmount,
  };
}

```

3. 在调用处使用

```vue
<template>
  <button @click="handleOpen">打开模态框</button>
</template>

<script setup>
import { showModal } from './modal.js'
import CustomModal from './CustomModal.vue'

function handleOpen() {
  showModal(CustomModal)
}
</script>
```

## React 实现

一样的步骤

1. 首先实现一个 `CustomModal.tsx`

```tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface ModalProps {
  children?: React.ReactNode;
  defaultVisible?: boolean;
  onAfterClose?: () => void
}

const Modal: React.FC<ModalProps> = forwardRef((props, ref) => {
  const { children, defaultVisible, onAfterClose } = props;
  const [isVisible, setIsVisible] = useState(defaultVisible ?? true);

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    onAfterClose?.()
  };

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal,
    }
  });

  return (
    <div>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            {children}
            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#4299e1',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Modal;
```

2. 定义指令 `showModal` 方法，写在 `modal.ts` 中，核心代码在这里

```ts
import { createRoot } from "react-dom/client"

export function showModal (node: React.ReactElement) {
  // 一样的流程，新创建一个 dom
  const app = document.createElement('div')
  // 挂载到文档中
  document.body.appendChild(app)
  // 创建一个 React 实例
  const root = createRoot(app)
  // 进行渲染
  root.render(node)

  return {
    // 卸载函数
    unmount: () => {
      root.unmount()
      document.body.removeChild(app)
    }
  }
}
```

3. 在调用处使用

```tsx
import { showModal } from './modal.ts';
import CustomModal from './CustomModal.tsx';

function App () {

  function handleOpenModal() {
    const modal = showModal(
      <CustomModal
        onAfterClose={() => {
          {/* 关闭后进行卸载 */}
          modal.unmount();
        }}
      />
    );
  }

  return (
    <div>
      <button onClick={handleOpenModal}>打开模态框</button>
    </div>
  )
}

```


## 参考


[vant 实现源码(Vue)](https://github.com/youzan/vant/blob/3d55c87d4cfcfd27895dd61e5d8f50932207cc0c/packages/vant/src/toast/function-call.tsx#L44)

[ant-design 实现源码(React)](https://github.com/react-component/util/blob/7aaa1d88174b30d7fb9c94b41b7a34cea5fc37f3/src/React/render.ts#L48)

