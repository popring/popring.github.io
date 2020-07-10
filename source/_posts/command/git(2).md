---
title: Git 学习笔记2
date: 2020-07-03 17:35:23
tags:
- Git
- Notes
categories:
- Command
---

> 官方中文文档 https://git-scm.com/book/zh/v2
>
> 推荐学习 `git` 小游戏 https://learngitbranching.js.org/

git 系列命令

温馨提示：文章内有大图，谨慎浏览

***

<!-- more -->

当你本地想建立一个本地仓库(repo)，并与远程仓库进行同步时

```bash
# 初始化
mkdir repo
cd repo
git init

# 添加文件操作。。。

# 提交到本地仓库
git add .
git commit -m "commit description"

# 接下来，连接远程仓库(如果在github或gitee创建个空仓库时，它会提醒你如何将本地仓库和远程仓库连接，username体寒为你账号的用户名,xxx为你的仓库名)
git remote add origin git@github.com:username/xxx.git
# 将本地变更提交到远程仓库，后续还需要提交只需要运行 git push 即可
git push -u origin master
```



### git clone

```bash
# 示例
git clone git@github.com:popring/xxx.git
```

### git add

```bash
# 常用，将所有变更添加到缓存区
git add .

# 也可添加指定文件或指定类型文件
git add README.md
git add *.md
```

### git commit

```bash
# 常用，将缓存区的文件提交到本地仓库
git commit -m "commit description"

# 一次性提交本地修改或删除文件，无论它们是否添加到了缓存区（新增文件不会被提交到仓库）
 git commit -a -m "commit description"
```

### git push

```bash
# 常用，将本地仓库 master 分支提交至远程仓库 master 分支
git push origin master

# 将本地仓库 foo 分支 提交至远程仓库 master
git push origin foo:master

# 甚至还有高级用法，将本地仓库（ foo 分支的前一个提交） 提交至远程仓库 master
git push origin foo^:master
```

### git branch

```bash
# 创建 foo 分支
git branch foo
# 创建并切换到 foo 分支
git checkout -b foo

# 删除 foo 分支
git branch -d foo

# 删除远程 foo 分支
git push origin --delete foo
```

### git fetch

```bash
# 获取远程仓库所有最新代码
git fetch --all
```

### git merge

```bash
# 合并两个分支

# 当前所在分支为 foo，执行以下命令后，会将foo和bar分支进行合并，并生成一个新的提交
git merge bar
```

### git pull

```bash
# 相当于 git fetch + git merge

# 每次提交前记得与远程仓库进行同步
git pull

# 首先本地创建一个foo分支，从远程仓库 master 分支下载提交记录，合并到 foo（，然后在与本地的分支进行合并，再次生成提交）
git pull origin master:foo
```

### git rm

```bash
# 删除本地文件，并添加到暂存区
git rm a.txt

# 相当于
rm a.txt
git add a.txt
```

### git cherry-pick

```bash
# 与git rebase 类似，不过这个命令可以自定义选择的提交记录进行复制到指定位置，rebase只能将指定分支前的提交记录复制到指定位置
git cherry-pick c2 c4
```

![](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200704094158.gif)

### git rebase

```bash
# 变基操作

# 当前在 bar分支，执行如下命令会将 foo 分支前的操作（ foo与bar 的共同父节点除外 ）都复制到 bar 分支之后
git rebase foo
```

### git reset

```bash
# 撤销变更
git reset [hash]
```

### git log

```bash
# 查看历史提交记录
git log

# 一行显示，显示简要信息
git log --onelien
```



### rebase和merge

---

> 引用自：https://learngitbranching.js.org/?locale=zh_CN

以下是关于 rebase 的优缺点：

优点:

- Rebase 使你的提交树变得很干净, 所有的提交都在一条线上

缺点:

- Rebase 修改了提交树的历史

比如, 提交 C1 可以被 rebase 到 C3 之后。这看起来 C1 中的工作是在 C3 之后进行的，但实际上是在 C3 之前。

一些开发人员喜欢保留提交历史，因此更偏爱 merge。而其他人（比如我自己）可能更喜欢干净的提交树，于是偏爱 rebase。

---

