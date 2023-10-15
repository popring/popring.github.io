---
title: linux实战技能100讲 笔记
date: 2021-06-02 20:35:00
tags: [linux, 笔记]
categories: 技术
---

Linux入门时做的笔记， `shell` 相关笔记没有学完不全，以后有空继续学习。

主要为常规的一些命令、压缩打包、权限等。

<!--more-->

## 万能帮助命令

- man
- help
- info
- 网络资源

## 系统操作

| command | description                                                                   |
| ------- | ----------------------------------------------------------------------------- |
| ls      | 查看当前文件夹目录，`-l` 长格式显示， `-a`显示隐藏文件， `-r`逆序显示， `-t`按时间顺序显示， `-R`递归显示，`-h` 文件大小单位 |
| cd      | 切换目录                                                                          |
| pwd     | 显示当前目录名称                                                                      |
| mkdir   | 创建文件夹                                                                         |
| rmdir   | 删除空目录                                                                         |
| rm      | `-r` 删除非空目录 `-f` 强制删除不提示                                                      |
| cp      | 复制文件, `-p` 保留原来的修改时间，`-a`保留权限，`-r` 复制目录                                       |
| mv      | 移动文件                                                                          |
| touch   | 创建文件                                                                          |
| cat     | 查看文件                                                                          |
| head    | 查看文件头                                                                         |
| tail    | 查看文件尾                                                                         |
| wc      | 统计统计文件信息                                                                      |

### 通配符

用途:操作多个相似(有简单规律律)的⽂文件 常⽤用通配符

- `*` 匹配任何字符串串
- `?` 匹配1个字符串串
- `[xyz]` 匹配xyz任意⼀一个字符 [a-z] 匹配⼀一个范围
- `[!xyz]` 或 `[^xyz]`  不不匹配

### 打包解压缩

> 常用压缩格式为 `.tar.gz .tar.bz2 .tgz`

| command | descrption         |
| ------- | ------------------ |
| tar     | `c` 打包             |
|         | `x` 解包             |
|         | `f` 指定操作类型为文件      |
|         | `z` gzip 格式压缩和解压缩  |
|         | `j` bzip2 格式压缩和解压缩 |

### 用户与权限相关

#### 用户管理相关命令

> 添加用户之后会产生几个目录或添加文件内容等，比如添加wilson
> 
> - `/home/wilson`
> - `/etc/passwd`，会添加 `wilson` 相关信息
> - `/etc/shadow`，和密码相关

| command  | description         |
| -------- | ------------------- |
| useradd  | 添加用户, `-g` 指定用户组    |
| id       | 查看用户信息              |
| passwd   | 修改用户密码              |
| userdel  | 删除用户，`-r` 删除包括用户的数据 |
| usermod  | 修改⽤用户属性，`-g` 修改用户组  |
| chage    | 修改⽤用户属性             |
| groupadd | 添加用户组               |
| groupdel | 删除用户组               |

#### 用户切换

| command | description          |
| ------- | -------------------- |
| su      | 切换用户                 |
| sudo    | 赋予普通用户执行管理员命令        |
| visudo  | 设置需要使⽤用 sudo 的⽤用户(组) |

#### 用户配置文件

##### /etc/passwd

> 用户配置文件

![image-20200819154215497](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200819154222.png)

```
wilson:x:1001:1001::/home/wilson:/bin/bash
```

其中

- `wilison` : 表示用户名
- `x` : 表示此用户是否需要密码登录
- `1001` : uid
- `1001` : gid
- `空` : `1001` 与`/home/wilison` 之间为注释
- `/home/wilson` : 用户的 `home` 目录
- `/bin/bash` : 用户登录后的命令解释器，如果为 `/sbin/nologin` 则不允许登录

##### /etc/shadow

> 用户密码配置相关文件

```
wilson:$6$wB5SlwF0OiEnRvc7$kdfaxXgiQySteIrPxnTd70DZSFTvBIB3TpXYEuQbiRYLnlgcQGUST2E0M/uQwhGd.ZwIJLLaV/B36d8ijSUxP0:18493:0:99999:7:::
```

- `wilson` : 用户名称
- `$...0` : 加密后的密码

##### /etc/group

> 用户组配置文件

```
group1:x:1003:
```

- `group1` : 用户组名称
- `x` : 是否需要密码验证
- `1003` : 组的 gid

### 文件权限

![image-20200819162242107](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200819162242.png)

#### 文件类型

- `-` : 普通文件类型
- `d` : 目录文件
- `b` : 块文件类型 ("设备")
- `c` : 字符特殊文件 ("设备")
- `l` : 符号链接 ("快捷方式")
- `f` : 命名管道
- `s` : 套接字文件

#### 文件权限

- `r` : 读权限，数字代表 `4`
- `w` : 写权限，数字代表 `2`
- `x` : 执行权限，数字代表 `1`

#### 目录权限

- `x` : 进入目录
- `rx` : 显示目录内的文件名
- `wx` : 修改目录内的文件名

#### 文件权限表示方式

```
-rw-r-xr-- 1 userame groupname mtime filename
```

- `rw-` : 文件属主的权限
- `r-x` : 文件属组的权限
- `r--` : 其他用户的权限

### 修改权限

#### chmod

> 修改⽂文件、⽬目录权限

```bash
# 增加所属主的权限 可读
chmod u+r afile
# 增加所属组的权限 可写
chmod g+w afile
# 减去其他用户的权限 可写
chmod o-w afile
# 设置所属主的权限 可读写执行
chmod u=rwx afile
# 添加所属主、所属组、其他用户权限 均可读
chmod a+r afile
# 使用数字代表权限，6=r+w, 4=r, 以下命令表示 rw-r--r--
chmod 644 afile
```

#### chown

> 更改属主、属组

```bash
chown user1:group1 afile.txt
```

### 特殊权限

- SUID：⽤于二进制可执⾏文件，执⾏命令时取文件属主权限
- SGID：⽤于目录，在该⽬录下创建新的⽂件和⽬录，权限自动更改为该目录的属组
- SBIT：⽤于目录，该目录下新建的文件和目录，仅 root 和⾃己可以删除

## 系统管理

### 网络管理

#### ⽹络状态查看

net-tools

- ifconfig
- route
- netstat

iproute

- ip
- ss

ifconfig

eth0第一块网卡(网络接口). 你的第一个网络接口可能叫做下面的名字  eno1板载网卡

- ens33 PCI-E网卡
- enp0s3 无法获取物理信息的PCI-E网卡
- CentOS 7使用了- -致性网络设备命名，以上都不匹配则使用eth0

#### ⽹络配置

```
ifconfig <接口> <IP地址> [netmask 子网掩码]
ifup <接口>
ifdown <接口>
```

#### 路由命令

添加网关

- route add default gw <网关ip>
- route add -host <指定ip> gw <网关ip>
- route add -net < <指定网段> netmask <子网掩码> gw <网关ip>

#### ⽹络故障排除

- ping
- traceroute
- mtr
- nslookup
- telnet
- tcpdump
- netstat
- SS

#### ⽹络服务管理

网络服务管理程序分为两种，分别为SysV和systemd

- service network startlstoplrestart
- chkconfig -list network
- systemctl list-unit-files NetworkManager.service
- systemctl startlstoplrestart NetworkManger
- systemctl enableldisable NetworkManger

#### 常用⽹络配置文件

- ifcfg-eth0
- /etc/hosts

### 软件安装

#### 软件包管理器

包管理器是方便软件安装、卸载，解决软件依赖关系的重要工具

- CentOS、RedHat使用yum包管理器，软件安装包格式为rpm
- Debian、 Ubuntu使用apt包管理器， 软件安装包格式为deb

#### rpm包和rpm命令

![image-20200821154942269](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200821154942.png)

| command | description |
| ------- | ----------- |
| rpm     | `-q` 查询软件包  |
|         | `-i` 安装软件包  |
|         | `-e` 卸载软件包  |

#### yum仓库

> `rpm` 需要自己解决依赖关系，软件包来源不可靠，所以出现了`yum`

##### yum 更改源

1. 备份

```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

2. 下载新的 CentOS-Base.repo 到 /etc/yum.repos.d/

**CentOS 6**

```
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-6.repo
```

或者

```
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-6.repo
```

**CentOS 7**

```
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
```

或者

```
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
```

**CentOS 8**

```
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-8.repo
```

或者

```
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-8.repo
```

3. 运行 yum makecache 生成缓存

##### yum 命令

| command | description     |
| ------- | --------------- |
| yum     | `install` 安装软件包 |
|         | `remove` 卸载软件包  |
|         | `list           |
|         | `update` 升级软件包  |

#### 升级内核

| command                     | description    |
| --------------------------- | -------------- |
| `uname -r`                  | 查看内核版本         |
| `yum install kernel-3.10.0` | 升级内核版本         |
| `yum update`                | 升级已安装的其他软件包和补丁 |

#### grub 配置文件

- grub 配置文件
  
  - /etc/default/grub
  - /etc/grub.d/
  - /boot/grub2/grub.cfg
  - grub2-mkconfig -0 /boot/grub2/grub.cfg

- 使用单用户进入系统(忘记root密码)
  
  ![image-20200821160012669](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200821160012.png)
  
  - 第一步，开机时选择内核这里选择合适的内核，光标停留，按 `e` 选择
  
  - 第二步，修改 `grub` 启动信息。（光标后的信息是没有的，需要自己手动添加，centos6 为 `single`，centos7.8 `rd.break`），然后按照指示 `ctrl+x` 来启动
    
    ![image-20200821160321084](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200821160321.png)
  
  - 启动后执行一下命令，重新挂载一下根目录
    
    ```bash
    mount -o remount,rw /sysroot
    ```

- 继续执行 
  
  ```bash
  chroot /sysroot
  ```

- 然后就可以修改密码了(`password` 为修改后的密码)
  
  ```bash
  echo password | passwd --stdin root
  ```

- 可能还会有SELinux进行监测，暂时性关闭
  
  ```bash
  vi /etc/selinux/config
  ```
  
  ![image-20200821161107110](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200821161107.png)
  
  设置为 `SELINUX=disabled`

- 然后退出重启就可以按照刚才设置的root用户进行登录了。
  
  ```bash
  exit
  
  rebooot
  ```

## shell

> Shell 是一个用 C 语言编写的程序，它是用户使用 Linux 的桥梁。Shell 既是一种命令语言，又是一种程序设计语言。
> 
> Shell 是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务。
> 
> Ken Thompson 的 sh 是第一种 Unix Shell，Windows Explorer 是一个典型的图形界面 Shell。

查看 `shell` 类型

```bash
cat /etc/shells
```

### Linux 引导过程

```
BIOS -> MBR -> BootLoader(grub) -> kernel -> systemd(initd) -> 系统初始化 -> shell
```

### shell 脚本格式

- UNIX 哲学：一条命令只做一件事
- 为了组合命令和多次执行，使用脚本文件来保存需要执行的命令
- 赋予该文件执行权限（chmod u+rx filename）
  - 二进制文件 给个 x 权限（可执行）即可
  - shell 脚本需要 rx 权限（可读可执行）
- `shell` 文件后缀为 `.sh`
- `#` 开头为注释 `#!/bin/bash` 开头表示使用 `bash` 执行脚本

### 管道与重定向

#### 管道

`|` : 讲两个命令分隔开，将前一个的输出传入到第二个命令的输入。

```bash
# 查找当前文件夹内的 .txt 后缀的文件
ls -l | grep .txt
```

#### 重定向

输入重定向 `<`

```bash
# 将 text.txt 文件内的内容赋值给 var 变量
read var < text.txt

# 通过本命令查看是否赋值成功
echo $var
```

输出重定向 `>`

```bash
# 将 123 输出到 a.txt 文件内
echo 123 > a.txt

# 将 123 追加到 a.txt 文件内
echo 123 >> a.txt

# 将 错误内容 输出到 a.txt
ak 2> a.txt

# 无论正确还是错误，都输出到 a.txt
ls -l &> a.txt
```

### 变量

#### 命名规则

- 字母、数字、下划线
- 不能以数字开头

#### 赋值

- 变量名=变量值
- 计算赋值`let a=10+20`
- 将命令赋值给变量 `l=ls`
- 将命令结果赋值给变量 `letc=$(ls -l /etc)`

#### 变量的引用

- `${变量名}`
- `echo ${变量名}`
- 省略写法为 `$变量名`

#### 变量的引用范围

> 只在当前进程生效，不回影响到别的进程，巧用 source,  bash...

- 导出变量 `export`
- 删除变量 `unset`

#### 环境变量、预定义变量与位置变量

- $PATH 命令索引
- 获取命令运行参数 $0 $1...

#### 环境变量配置文件

- /etc/profile
- /etc/profile.d/
- ~/.bash_profile
- ~/.bashrc
- /etc/bashrc

#### 数组

- 定义数组

```bash
ipts=(10.0.0.1 10.0.0.2 10.0.0.3)
```

- 显示数组所有元素

```bash
echo ${ipts[@]}
```

- 显示数组元素个数

```bash
echo ${#ipts[@]}
```

- 显示数组的第一个元素

```bash
echo ${ipts[0]}
```

#### 转义和引用

> 一个字符不仅有字面意义，还有元意(meta-meaning)

- `#` 注释
- `;` 分号
- `\` 转义符号（`\r \n \t \$ \\ ...`）
- `"` （完全引用，解释变量）和 `' ` 引号（不完全引用，不解释变量）

#### 运算符

- 赋值运算符 let "变量名=变量值" （简化为 双圆括号 `(( a=10))`）
- 算数运算符 使用 `expr 4 + 5（只支持整数）`
- 数字常量： 0开头八进制，0x十六进制


## 其他资料

[bash-simple-guide-chinese](https://github.com/jpcr987i/bash-simple-guide-chinese)