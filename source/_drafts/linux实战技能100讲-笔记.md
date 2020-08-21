---
title: linux实战技能100讲 笔记
tags: linux
---







## 万能帮助命令

- man
- help
- info
- 网络资源



## 系统操作

| command | description                                                  |
| ------- | ------------------------------------------------------------ |
| ls      | 查看当前文件夹目录，`-l` 长格式显示， `-a`显示隐藏文件， `-r`逆序显示， `-t`按时间顺序显示， `-R`递归显示，`-h` 文件大小单位 |
| cd      | 切换目录                                                     |
| pwd     | 显示当前目录名称                                             |
| mkdir   | 创建文件夹                                                   |
| rmdir   | 删除空目录                                                   |
| rm      | `-r` 删除非空目录 `-f` 强制删除不提示                        |
| cp      | 复制文件, `-p` 保留原来的修改时间，`-a`保留权限，`-r` 复制目录 |
| mv      | 移动文件                                                     |
| touch   | 创建文件                                                     |
| cat     | 查看文件                                                     |
| head    | 查看文件头                                                   |
| tail    | 查看文件尾                                                   |
| wc      | 统计统计文件信息                                             |

### 通配符

用途:操作多个相似(有简单规律律)的⽂文件 常⽤用通配符

- `*` 匹配任何字符串串
- `?` 匹配1个字符串串
-  `[xyz]` 匹配xyz任意⼀一个字符 [a-z] 匹配⼀一个范围
-  `[!xyz]` 或 `[^xyz]`  不不匹配



### 打包解压缩

> 常用压缩格式为 `.tar.gz .tar.bz2 .tgz`

| command | descrption                 |
| ------- | -------------------------- |
| tar     | `c` 打包                   |
|         | `x` 解包                   |
|         | `f` 指定操作类型为文件     |
|         | `z` gzip 格式压缩和解压缩  |
|         | `j` bzip2 格式压缩和解压缩 |

### 用户与权限相关

#### 用户管理相关命令

> 添加用户之后会产生几个目录或添加文件内容等，比如添加wilson
>
> - `/home/wilson`
> - `/etc/passwd`，会添加 `wilson` 相关信息
> - `/etc/shadow`，和密码相关

| command  | description                       |
| -------- | --------------------------------- |
| useradd  | 添加用户, `-g` 指定用户组         |
| id       | 查看用户信息                      |
| passwd   | 修改用户密码                      |
| userdel  | 删除用户，`-r` 删除包括用户的数据 |
| usermod  | 修改⽤用户属性，`-g` 修改用户组   |
| chage    | 修改⽤用户属性                    |
| groupadd | 添加用户组                        |
| groupdel | 删除用户组                        |

#### 用户切换

| command | description                      |
| ------- | -------------------------------- |
| su      | 切换用户                         |
| sudo    | 赋予普通用户执行管理员命令       |
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

| command | description     |
| ------- | --------------- |
| rpm     | `-q` 查询软件包 |
|         | `-i` 安装软件包 |
|         | `-e` 卸载软件包 |

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

| command | description                   |
| ------- | ----------------------------- |
| yum     | `install` 安装软件包          |
|         | `remove` 卸载软件包           |
|         | `list | grouplist` 查看软件包 |
|         | `update` 升级软件包           |



#### 升级内核

| command                     | description                  |
| --------------------------- | ---------------------------- |
| `uname -r`                  | 查看内核版本                 |
| `yum install kernel-3.10.0` | 升级内核版本                 |
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

    