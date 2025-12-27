---
title: 友情链接
date: 2025-12-27 12:00:00
comments: true
---

## 我的朋友们

以下是我的朋友们，欢迎互换友链！

<div class="links-container">
  <div class="link-card">
    <a href="https://home.shuaxinjs.cn/" target="_blank" rel="noopener noreferrer">
      <div class="link-avatar" style="background-image: url(https://avatars.githubusercontent.com/u/32100575?v=4); background-size: cover; background-position: center;">
      </div>
      <div class="link-info">
        <div class="link-name">刷新的个人主页</div>
        <div class="link-site">home.shuaxinjs.cn</div>
        <div class="link-description">我的朋友</div>
      </div>
      <div class="link-arrow">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </a>
  </div>
</div>

<style>
.links-container {
  margin: 40px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.link-card {
  position: relative;
  background: #e5e7eb;
  border-radius: 16px;
  padding: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.link-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.link-card:hover::before {
  opacity: 1;
}

.link-card a {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  gap: 16px;
  transition: all 0.3s ease;
  z-index: 1;
}

.link-avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-avatar svg {
  width: 32px;
  height: 32px;
}

.link-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.link-card:hover .link-avatar {
  transform: rotate(360deg) scale(1.1);
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-site {
  font-size: 12px;
  color: #3b82f6;
  font-family: 'Monaco', 'Consolas', monospace;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-description {
  font-size: 13px;
  color: #718096;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-arrow {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #a0aec0;
  transition: all 0.3s ease;
  opacity: 0;
}

.link-arrow svg {
  width: 100%;
  height: 100%;
}

.link-card:hover .link-arrow {
  opacity: 1;
  transform: translateX(4px);
  color: #3b82f6;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .link-card {
    background: #374151;
  }
  
  .link-card a {
    background: #1f2937;
  }
  
  .link-name {
    color: #f9fafb;
  }
  
  .link-description {
    color: #9ca3af;
  }
  
  .link-site {
    color: #60a5fa;
  }
  
  .link-card:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }
  
  .link-avatar {
    background: #374151;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .links-container {
    grid-template-columns: 1fr;
  }
  
  .link-avatar {
    width: 48px;
    height: 48px;
  }
  
  .link-avatar svg {
    width: 28px;
    height: 28px;
  }
  
  .link-name {
    font-size: 15px;
  }
}

/* 添加多个友链时的不同配色方案 */
.link-card:nth-child(2) {
  background: #e5e7eb;
}

.link-card:nth-child(2)::before {
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
}

.link-card:nth-child(3) {
  background: #e5e7eb;
}

.link-card:nth-child(3)::before {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

.link-card:nth-child(4) {
  background: #e5e7eb;
}

.link-card:nth-child(4)::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
</style>

---

## 友链申请

欢迎交换友链！如果你也想加入友链，请在下方评论区留言或通过 [邮箱](mailto:koler778@gmail.com) 联系我。

**申请格式：**
- 网站名称：你的网站名称
- 网站地址：你的网站URL
- 网站描述：简短描述（一句话介绍）

**本站信息：**
- 网站名称：popring's Blog
- 网站地址：https://popring.cn
- 网站描述：探索、记录、分享

