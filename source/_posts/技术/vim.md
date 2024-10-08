---
title: vim 笔记
tags: vim
categories: 技术
abbrlink: bceeaa0d
date: 2021-02-02 20:55:44
---



`vim` 神器，依旧宝刀未老，用起来真香。



<!-- more -->

## `i` insert 模式，可以输入文字

## `v` visual 模式



## nomal 模式

> 刚打开 vim 是 `normal` 模式，可以输入指令



### 基础操作

> 还可以配合数字使用，例如 `5w` 表示，光标移至后五个单词的位置。

`h` 光标左移

`l` 光标右移

`j` 光标下移

`k` 光标上移



`w` 光标移至下一单词的起始位置

`b` 光标移至上一单词的起始位置

`e` 光标移至单词的结束位置



`0` 跳转至当前行开始位置 

`$` 跳转至当前行结束位置



`%` 匹配括号时光标位置切换置另一位置



`gg` 光标切换至顶部

`G` 光标切换至底部

`number G` 光标切换至指定行起始位置(number 为待跳转至的行数，与 `G` 之间无空格)



`*` 向后查找当前字符

`#` 向前查找当前字符



`/char` 查找指定字符字符串(char 为待查找的字符串) 

`n`  查找到指定字符串后，查找下一个

`N`  查找到指定字符串后，查找上一个



`o` 光标下一行插入一行，并且光标定位至下一行

`O` 光标上一行插入一行，并且光标定位至上一行



`x`  删除光标位置字符



`s char` 替换光标位置字符(char 为替换后字符，中间无空格)



`d command` 进入删除指令，结合 `w` 删除第一个单词。

`dd` 剪切当前行

`p` 粘贴



`.` 重复前一次操作



`:u` 撤回上次操作

`:set nu` 显示行数





## 参考资料

[Vim 从入门到精通 PDF](https://github.com/wsdjeg/vim-galore-zh_cn)： 强烈推荐

[openvim](https://www.openvim.com/)： vim 入门教程

[vim-adventures](https://vim-adventures.com/)：vim 入门游戏

[vimonlineeditor](https://www.vimonlineeditor.com/)：网页在线vim，本地无环境可尝试使用