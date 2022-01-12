---
title: 第一章
---

@[TOC](这里写目录标题)

# 修改 yum 源

**163yum 源：**
1）备份当前 yum 源防止出现意外还可以还原回来

```
cd /etc/yum.repos.d/
cp /CentOS-Base.repo /CentOS-Base-repo.bak
```

2）使用 wget 下载 163yum 源 repo 文件

```
wget http://mirrors.163.com/.help/CentOS7-Base-163.repo
```

3. 清理旧包

```
yum clean all
```

4）把下载下来 163repo 文件设置成为默认源

```
mv CentOS7-Base-163.repo CentOS-Base.repo
```

5）生成 163yum 源缓存并更新 yum 源

```
yum makecache
yum update
```

**阿里云 yum 源：**
1）备份当前 yum 源防止出现意外还可以还原回来

```
cd /etc/yum.repos.d/
cp /CentOS-Base.repo /CentOS-Base-repo.bak
```

2）使用 wget 下载阿里 yum 源 repo 文件

```
wget http://mirrors.aliyun.com/repo/Centos-7.repo
```

3. 清理旧包

```
yum clean all
```

4）把下载下来阿里云 repo 文件设置成为默认源

```
mv Centos-7.repo CentOS-Base.repo
```

5）生成阿里云 yum 源缓存并更新 yum 源

```
yum makecache
yum update
```

# 全盘搜索

pwd 获取当前目录
/ 根目录
ls -l 查看隐藏文件
ls -h 人性化展示文件
ls -a 查看隐藏文件
vim .test 文件名前加 “.” 创建一个隐藏文件
tree dir 显示 dir 文件目录结构
mkdir -p a/b/c/d/e 递归创建文件夹及文件

## find / -name file 名

/代表是全盘搜索,也可以指定目录搜索

find 搜索文件的命令格式：

find [搜索范围] [匹配条件]

选项：

-name 根据名字查找

-size 根据文件大小查找, +,-:大于设置的大小,直接写大小是等于

-user 查找用户名的所有者的所有文件

-group 根据所属组查找相关文件

-type 根据文件类型查找(f 文件,d 目录,l 软链接文件)

-inum 根据 i 节点查找

-amin 访问时间 access

-cmin 文件属性 change

-mmin 文件内容 modify

## where is \*\*\*

## who am i

## 建立多个虚拟机

1）使用课程提供的 CentOS 7 镜像即可，CentOS-7-x86_64-Minimal-1611.iso

```
链接：https://pan.baidu.com/s/1UuBLvuljNmScqtjuXDqsOA
提取码：3zoq
```

（2）创建虚拟机：打开 Virtual Box，点击“新建”按钮，点击“下一步”，输入虚拟机名称为 hbase-standalone，选择操作系统为 Linux，选择版本为 Red Hat-64bit，分配 2048 MB 内存，后面的选项全部用默认，在 Virtual Disk File location and size 中，一定要自己选择一个目录来存放虚拟机文件，最后点击“create”按钮，开始创建虚拟机。

（3）设置虚拟机网卡：选择创建好的虚拟机，点击“设置”按钮，在网络一栏中，连接方式中，选择“Bridged Adapter”。虚拟机必须有一块网卡，这块网卡是通过什么方式去宿主机里的网卡进行通讯，桥接网卡，就可以让你的虚拟机里的网卡跟你宿主机的一块网卡进行通讯

（4）安装虚拟机中的 CentOS 7 操作系统：选择创建好的虚拟机，点击“开始”按钮，选择安装介质（即本地的 CentOS 7 镜像文件），按照课程选择后自动安装即可

（5）安装完以后，CentOS 会提醒你要重启一下，就是 reboot，你就 reboot 就可以了。

（6）配置网络

```
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

先让它动态分配一个 ip 地址

```

ONBOOT=yes

service network restart

ip addr
```

再设置静态 ip 地址

```
BOOTPROTO=static
IPADDR=192.168.31.250
NETMASK=255.255.255.0
GATEWAY=192.168.31.1


service network restart
ip addr
```

配置 DNS

```
检查NetManager的状态：systemctl status NetworkManager.service
检查NetManager管理的网络接口：nmcli dev status
检查NetManager管理的网络连接：nmcli connection show
设置dns：nmcli con mod enp0s3 ipv4.dns "114.114.114.114 8.8.8.8"
让dns配置生效：nmcli con up enp0s3
```

（7）配置 hosts

vi /etc/hosts
配置本机的 hostname 到 ip 地址的映射

（8）配置 SecureCRT

此时就可以使用 SecureCRT 从本机连接到虚拟机进行操作了

一般来说，虚拟机管理软件，virtual box，可以用来创建和管理虚拟机，但是一般不会直接在 virtualbox 里面去操作，因为比较麻烦，没有办法复制粘贴

SecureCRT，在 windows 宿主机中，去连接 virtual box 中的虚拟机

收费的，我这里有完美破解版，跟着课程一起给大家，破解

（9）关闭防火墙

```
systemctl stop firewalld.service
systemctl disable firewalld.service

```

关闭 windows 的防火墙

后面要搭建集群，有的大数据技术的集群之间，在本地你给了防火墙的话，可能会没有办法互相连接，会导致搭建失败

（10）配置 yum

```
yum clean all
yum makecache
yum install wget
```

（11）安装 JDK

1、将 jdk-8u131-linux-x64.rpm 通过 WinSCP 上传到虚拟机中
2、安装 JDK：rpm -ivh jdk-8u131-linux-x64.rpm
3、配置 jdk 相关的环境变量
vi ~/.bashrc

```
export JAVA_HOME=/usr/java/latest
export PATH=$PATH:$JAVA_HOME/bin
```

source ~/.bashrc

4、测试 jdk 安装是否成功：java -version

（12）在另外 2 个虚拟机中安装 CentOS 集群

按照上述步骤，再安装 2 台一模一样环境的 linux 机器

安装好之后，在每台机器的 hosts 文件里面，配置好所有的机器的 ip 地址到 hostname 的映射关系

比如说，的 hosts 里面

```
192.168.31.xxx hadoop01
192.168.31.xxx hadoop02
192.168.31.xxx hadoop03
```

（13）配置 3 台 CentOS 为 ssh 免密码互相通信

首先在三台机器上分别各自执行下面的命令生成自己的文件：ssh-keygen -t rsa

生成本机的公钥，过程中不断敲回车即可，ssh-keygen 命令默认会将公钥放在/root/.ssh 目录下

在三台机器上分别各自进入目录，拷贝自己的公钥文件为 authroized_keys 文件，让三台机器先各自对自己免密码 ssh 可以登录

```
cd /root/.ssh
cp id_rsa.pub authorized_keys
```

将公钥复制为 authorized_keys 文件，此时使用 ssh 连接本机就不需要输入密码了

接着配置三台机器互相之间的 ssh 免密码登录，在每台机器上执行下面的命令
使用 ssh-copy-id -i hostname 命令将本机的公钥拷贝到指定机器的 authorized_keys 文件中

## 配置多虚拟机之间的免密登录

**配置步骤：**
1、首先，进入相应目录，删除原来生成的文件（三台服务器都需要删除）

```
#默认路径，可能是其他路径
cd ~/.ssh/
rm -rf *
```

2、分别在三台服务器上生产秘钥

```
ssh-keygen -t rsa
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/121d8cbf6fc64598b0a5c7f1592004aa.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_19,color_FFFFFF,t_70,g_se,x_16)
3、分别把 node02 和 node03 上的 id_rsa.pub 通过 scp 复制到 node01 的.ssh 目录下。

```
#分别在node02,node03上执行下面命令
 scp id_rsa.pub root@node01:$PWD/id_rsa.pub2
 #或
 scp id_rsa.pub root@node01:$PWD/id_rsa.pub3
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/231054bedeec4db79ade02542b0e4518.png)
4、把公钥写入 authorized_keys

```
cat id_rsa.pub >> authorized_keys
cat id_rsa.pub2 >> authorized_keys
cat id_rsa.pub3 >> authorized_keys
```

5、然后把 authorized_keys 在复制到 node02 和 node03 上

```
scp authorized_keys root@node02:$PWD
scp authorized_keys root@node03:$PWD
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/64820ed300c445efbb7fdc5f77954136.png)
6、完成上述操作后，重新启动 hadoop 即可。
7、`ssh root@node1`

## 查看 linux 安装版本

lsb_release -a

## linux 安装 mysql （方法一）

### 查看 mysql 服务

-   ps -ef|grep mysql
-   netstat -nlp

### 启动 mysql

```
启动
– systemctl start mysqld

重启
- systemctl restart mysqld.service

关闭
– systemctl stop mysqld

状态
– systemctl status mysqld
```

**第一大步：检查是否已安装过 mysql**

1、查看 mysql 安装了哪些东西

`rpm -qa |grep -i mysql`

2、开始卸载

例如：

```css
yum remove mysql-community-common-5.7.20-1.el7.x86_64
yum remove mysql-community-client-5.7.20-1.el7.x86_64
yum remove mysql57-community-release-el7-11.noarch
yum remove mysql-community-libs-5.7.20-1.el7.x86_64
yum removemysql-community-server-5.7.20-1.el7.x86_64
```

4、查找 mysql 相关目录

```swift
find / -name mysql
```

5、删除相关目录 rm -rf

6、删除/etc/my.cnf

7、rm -rf /var/log/mysqld.log（如果不删除这个文件，会导致新安装的 mysql 无法生存新密码，导致无法登陆）

**第二大步：下载好 rpm 文件拷贝到 centos 中**

下载地址：http://mirrors.ustc.edu.cn/mysql-ftp/Downloads/MySQL-8.0/

**第三大步：卸载掉已有的 mysql-libs**

**报错**：Failed dependencies: mariadb-libs is obsoleted by MySQL-_-1.el7.x86_64_

**解决**：`yum -y remove mariadb-libs`

**第四大步：按顺序安装 mysql 各个组件**

rpm -ivh mysql-community-common-5.7.29-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.29-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.29-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.29-1.el7.x86_64.rpm

**第五大步：重启 mysql 服务**

`systemctl restart mysqld.service`

### 查看初始密码

grep 'temporary password' /var/log/mysqld.log

### 关闭密码

`vim /etc/my.cnf`

在最底部添加 skip-grant-tables 保存退出，重启 mysql

### 更改密码

1、`mysql> update user set authentication_string=password("root") where user="root";`

// 刷新 MySQL 权限相关的表

`mysql> flush privileges; mysql> exit;`

编辑`vim /etc/my.cnf`,去掉刚才添加的内容`skip-grant-tables`

2、用 set password 命令
语法：set password for ‘用户名’@’登录地址’=password(‘密码’)

mysql> set password for 'root'@'localhost'=password('123456');

3、 mysqladmin
语法：mysqladmin -u 用户名 -p 旧的密码 password 新密码

mysql> mysqladmin -uroot -p123456 password 1234abcd

注意：mysqladmin 位于 mysql 安装目录的 bin 目录下

### 创建用户

```
#用老的加密方式
create user 'imooc'@'%' identified with mysql_native_password by 'Imooc@123456';
```

```
create user 'repl'@'192.168.116.%' identified by 'repl';

create user 'repl'@'192.168.116.%' identified by 'repl_Password';
```

## linux 安装 mysql （方法二）

```
https://dev.mysql.com/downloads/repo/yum/
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a72542aec075426eada1bd91c92df407.png)
上传至虚拟机`/usr/local`目录下

```
shell> sudo yum install mysql80-community-release-el7-3.noarch.rpm
shell> sudo yum install mysql-community-server
shell> systemctl start mysqld
shell> sudo grep 'temporary password' /var/log/mysqld.log
shell> mysql -uroot -p
shell> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';

# Mysql 8.0 使用mysql_native_password加密创建用户
shell> CREATE USER 'imooc'@'%' IDENTIFIED WITH mysql_native_password BY 'Imooc@123456';
shell> GRANT ALL ON *.* TO 'imooc'@'%';
shell> FLUSH PRIVILEGES;
```

### linux 中 mysql 出现：Access denied for user 'root'@'192.168.\*\*.1' (using password: YES)

**针对 root 用户**：grant all privileges on _._ to root@'%' identified by 'root';

grant all on _._ to 'repl'@'192.168.116.%';

**普通用户**：grant replication slave on _._ to 'repl'@'192.168.116.%' identified by 'repl';

### 查看用户权限

mysql> grant select,create,drop,update,alter on _._ to 'yangxin'@'localhost' identified by 'yangxin0917' with grant option;
mysql> show grants for 'root'@'localhost';

### 回收权限

删除 yangxin 这个用户的 create 权限，该用户将不能创建数据库和表。

mysql> revoke create on _._ from 'yangxin@localhost';
mysql> flush privileges;

### 删除用户

drop user repl@'192.168.153.%';

### 关于 MySQL 8.0 调整密码验证规则

mysql> set global validate_password.policy=0;
mysql> set global validate_password.length=1;

或者 vim /etc/my.cnf 增加下面两句

validate_password_policy=0
validate_password_length=4

### 查看 mysql 的密码校验策略

### show variables like '%password%';

show variables like '%log_bin%';

### show variables like '%character%';

validate_password_policy：密码策略，默认为 MEDIUM 策略
validate_password_dictionary_file：密码策略文件，策略为 STRONG 才需要
validate_password_length：密码最少长度
validate_password_mixed_case_count：大小写字符长度，至少 1 个
validate_password_number_count ：数字至少 1 个
validate_password_special_char_count：特殊字符至少 1 个

### mysql 乱码

配置默认编码为 utf8:
修改/etc/my.cnf 配置文件:

[mysqld]
character_set_server=utf8
init_connect='SET NAMES utf8'

systemctl restart mysqld
show variables like '%character%';

### 卸载 mysql8

1、`rpm -qa | grep -i mysql`

2、`yum remove -y mysql80-*-*3.*`

## 关闭防火墙

//临时关闭 systemctl stop firewalld

//禁止开机启动 systemctl disable firewalld

//查看 firewall 服务状态 systemctl status firewalld

1.查看已开放的端口(默认不开放任何端口)
firewall-cmd --list-ports

2.开启 80 端口
firewall-cmd --zone=public(作用域) --add-port=80/tcp(端口和访问类型) --permanent(永久生效)

3.重启防火墙
firewall-cmd --reload

4.停止防火墙
systemctl stop firewalld.service

5.禁止防火墙开机启动
systemctl disable firewalld.service

6.删除
firewall-cmd --zone= public --remove-port=80/tcp --permanent

## 安装 jdk

需要安装 openjdk-devel 包

[root@namenode ~]# yum install java-1.8.0-openjdk-devel.x86_64
[root@namenode ~]# which jps
/usr/bin/jps

## 生成 git 公钥

```
$ cat ~/.ssh/id_rsa.pub
$ ssh-keygen -t rsa -C "458666482@qq.com"
```

## 【CentOS8】安装 git

```javascript
// 安装
$ yum install git

$ git --version

// 配置
$ git config --global user.name "AndyTiTi"

$ git config --global user.email "458666482@qq.com"

$ git config --list

// 配置淘宝源
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
// 建立cnpm软链
ln -s /usr/local/nodejs/bin/cnpm  /usr/local/bin/cnpm
// 查看是否配置成功
ls -al /usr/local/bin
```

# 淘宝镜像源

```javascript
1.通过cnpm使用淘宝镜像：
npm install -g cnpm --registry=https://registry.npm.taobao.org

2.将npm设置为淘宝镜像：
npm config set registry https://registry.npm.taobao.org

3. 查看cnpm镜像设置：
npm config get registry

4.查看cnpm镜像设置：
cnpm config get registry
```

# 【CentOS7】安装 NodeJS

### 一 安装

下载地址：https://nodejs.org/en/download/

### 二 解压/安装

将文件放入 /usr/local 下，进行解压，并重命名文件夹：

```
cd /usr/local
tar -xvf node-v12.18.3-linux-x64.tar
mv node-v12.18.3-linux-x64 nodejs
```

### 三 配置

全局引用 / 配置软连接

```
ln -s /usr/local/nodejs/bin/npm /usr/local/bin
ln -s /usr/local/nodejs/bin/node /usr/local/bin
```

### 四 查看

```
node -v
npm -v
```

# 【CentOS7】安装 cnpm\pm2

npm install -g cnpm --registry=https:``//registry.npm.taobao.org

### 更改 npm 源

**查看当前使用的源** npm config get registry

npm config set registry https://registry.npm.taobao.org

如果想换回原来官方的源，则执行 npm config set registry https://registry.npmjs.org/

### 安装 pm2

```javascript
# 全局安装
npm install pm2 -g

# 设置环境变量
vim  /etc/profile
export PATH=$PATH:/usr/local/nodejs/lib/node_modules/pm2/bin
source  /etc/profile

# 查看
pm2 -v
```

### 启动 pm2

启动类似 node xxx.js 的项目

> pm2 start --name xxxsname xxx.js # 将运行的实例命名为 xxxsname

启动类似 npm start 的项目

> pm2 start --name appname npm -- start # 设置应用名为 appname

启动类似 npm run serve 的项目

> pm2 start --name servename npm -- run serve # 设置应用名为 servename

--name xxx 或者 -n xxx 表示将应用命名为 xxx

![在这里插入图片描述](https://img-blog.csdnimg.cn/055d6c4e23a54e78bea6db5e1f7cc3d8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

# 【Docker】启动和关闭命令

docker 启动

-   systemctl start docker

重启 docker 服务

-   systemctl restart docker

关闭 docker

-   systemctl stop docker

查看是否启动成功

-   docker ps -a

# 【Vagrant】修改 root 密码

sudo -s
passwd

# [征服诱人的 Vagrant！](https://blog.csdn.net/u012824908/article/details/85037368)

# Vagrant 和 Docker 的使用场景和区别?

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7dd425cbc8646599f27b25aa853377c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/aabaf1ec2eff411c85c729600ab12ccc.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc542fc2120c4eb78822af0fd92cd65a.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)

# 【Vagrant】新增 root 用户

sudo passwd root 根据提示输入两次新密码
su root 切换到 root 用户

# 配置 vagrant 创建的虚拟机配置网络

[root@localhost network-scripts]# vi /etc/sysconfig/network-scripts/ifcfg-eth1

```
#VAGRANT-BEGIN
#The contents below are automatically generated by Vagrant. Do not modify.
NM_CONTROLLED=yes
BOOTPROTO=none
ONBOOT=yes
IPADDR=192.168.56.10
NETMASK=255.255.255.0
GATEWAY=192.168.56.1
DNS1=114.114.114.114
DNS2=8.8.8.8
DEVICE=eth1
PEERDNS=no
#VAGRANT-END
```

# vagrant up 下载 centos7 慢的解决办法

安装完 vagrant 后

执行命令 vagrant init centos/7 进行初始化 会出现一个 Vagrantfile 文件

![img](https://img-blog.csdnimg.cn/20200716161351411.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NzgwNjQzMA==,size_16,color_FFFFFF,t_70)

将红线里的地址复制到浏览器，通过浏览器进行下载

执行命令 **vagrant box add centos/7 F:\download\CentOS-7-x86_64-Vagrant-2004_01.VirtualBox.box** 添加本地 box

add 后面的 centos/7 和我上面初始化的名字一样，一定要一样哦

然后**vagrant up** 启动

打开 virtual-box，能看到新加了一个 centos7 的虚拟机

# ifconfig: command not found

首先判断一下是不是缺少了 ifconfig，它是在/sbin 目录下的

[root@localhost ~]# cd /sbin
[root@localhost sbin]# ls

查看一下是否有 ifconfig

没有 ifconfig 的话安装 net-tools package

[root@localhost sbin]# sudo yum install net-tools

# CentOS7 安装 docker

```
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

```
$ sudo yum install -y yum-utils

$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
$ sudo yum install docker-ce docker-ce-cli containerd.io
$ sudo systemctl start docker
$ sudo docker -v
$ sudo docker images
```

# 【Docker】开机自启

```
$ sudo systemctl enable docker

```

# 配置镜像加速器

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://dz1ntnxu.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

# 【Docker 容器】开机自启

```
## 在docker启动容器可以增加参数来达到,当docker 服务重启之后 自动启动容器：
docker run -d --restart=always <CONTAINER ID>

## 当然如果你的容器已经启动,可以通过update命令进行修改. 命令如下：
sudo docker update <CONTAINER ID> --restart=always

## 如果你想取消掉 命令如下:
sudo docker update <CONTAINER ID> --restart=no
```

# docker pull mysql:5.7

```java
docker run -p 3306:3306 --name mysql \
 -v /mydata/mysql/log:/var/log/mysql \
 -v /mydata/mysql/data:/var/lib/mysql \
 -v /mydata/mysql/conf:/etc/mysql/ \
 -e MYSQL_ROOT_PASSWORD=root \
 -d mysql:5.7

### 参数说明
-p 3306:3306 将容器的端口号3306映射到Linux主机的3306端口号
-v /mydata/mysql/log:/var/log/mysql \ 将配置文件夹挂载到主机
-v /mydata/mysql/data:/var/lib/mysql \ 将日志文件夹挂载到主机
-v /mydata/mysql/conf:/etc/mysql \ 将配置文件夹挂载到主机
-e MYSQL_ROOT_PASSWORD=root\ 初始化root的密码

### 进入容器
$ docker exec -it mysql /bin/bash
### 退出容器
$ exit;

```

\*\*
docker 中的任何软件都是一个独立的容器。

-   修改 mysql 的字符编码
    进入 vi /mydata/mysql/conf/my.cnf 配置参数。

```
[client]
# 对本地的mysql客户端的配置
default-character-set = utf8
# 对其他远程连接的mysql客户端的配置
[mysql]
default-character-set = utf8

# 本地mysql服务的配置
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve

```

```

$ docker restart mysql
```

# docker 安装 redis

```
mkdir -p /mydata/redis/conf
touch /mydata/redis/conf/redis.conf

docker run -p 6379:6379 --name redis -v /mydata/redis/data:/data \
-v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf \
-d redis redis-server /etc/redis/redis.conf
## 参数说明
 （运行一个redis容器，将内部6379端口映射到外部6379端口）
 （将docker内的/data文件夹映射到外部/mydata/redis/data文件夹下）

## 直接连接redis客户端，不用进入到bash里
$ docker exec -it redis redis-cli
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201226113750444.png)

# docker 安装 ElasticSearch

```
$ mkdir -p /mydata/elasticsearch/config
$ mkdir -p /mydata/elasticsearch/data
$ echo "http.host: 0.0.0.0" >> /mydata/elasticsearch/config/elasticsearch.yml
```

特别注意：yml 文件格式要正确 http.host: 空格 0.0.0.0
否则会报错 nested: ParsingException[Failed to parse object: expecting token of type [START_OBJECT] but found [VALUE_STRING]];

第三步： 启动：
== 给挂载目录赋权值 ==

```
chmod -R 777 /mydata
```

否则报错： “Caused by: java.nio.file.AccessDeniedException: /usr/share/elasticsearch/data/nodes”,

```
docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e "discovery.type=single-node" \
-e ES_JAVA_OPTS="-Xms64m -Xmx512m" \
-v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2
```

访问http://192.168.56.10:9200/

```json
{
	"name": "8834eaeb2d5f",
	"cluster_name": "elasticsearch",
	"cluster_uuid": "6EdiJcbzQ-iZclZGFR4a7A",
	"version": {
		"number": "7.4.2",
		"build_flavor": "default",
		"build_type": "docker",
		"build_hash": "2f90bbf7b93631e52bafb59b3b049cb44ec25e96",
		"build_date": "2019-10-28T20:40:44.881551Z",
		"build_snapshot": false,
		"lucene_version": "8.2.0",
		"minimum_wire_compatibility_version": "6.8.0",
		"minimum_index_compatibility_version": "6.0.0-beta1"
	},
	"tagline": "You Know, for Search"
}
```

==报错处理==

> NoNodeAvailableException[None of the configured nodes are available:
> [{#transport#-1}{192.168.1.99}{192.168.1.99:9200}]] at org.elasticsearch.clien

```bash
vi elasticsearch.yml
```

```yaml
http.host: 0.0.0.0
# 新增下列一行配置
transport.host: 0.0.0.0
```

## CentOS8 安装 Jenkins

需要先配置下配置 jenkins 的 yum 源

```shell
[root@jenkins ~]# wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
[root@jenkins ~]# rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

yum install jenkins -y

# 如果很慢，直接ctrl+c中止原命令，执行如下命令通过清华大学地址下载

wget https://mirrors.tuna.tsinghua.edu.cn/jenkins/war/latest/jenkins.war
```

```shell
systemctl start jenkins
systemctl enable jenkins
```

jenkins 默认服务提供的端口为 8080(如果是阿里云服务器，记得去配置安全组开放这个端口)

> 补充：如果出现下面这个失败报错，说明是【jenkins】这个用户没有权限去访问 docker 这个服务，所以我们需要将用户添加进这个服务对应的组中
> sudo gpasswd -a jenkins docker
> sudo service jenkins restart

## CentOS8 安装 Java

`yum install -y java `

## docker 安装 Kibana

```
docker run --name kibana -e ELASTICSEARCH_HOSTS=http://192.168.56.10:9200 -p 5601:5601 \
-d kibana:7.4.2
```

http://192.168.56.10:5601/app/kibana

GET ip/\_cat/nodes 查看所有节点
GET ip/\_cat/health 查看 es 健康状况
GET ip/\_cat/master 查看主节点
GET ip/\_cat/indices 查看所有索引

# CentOS8 安装 nginx

Centos 8 下安装 nginx，使用 yum install nginx，提示没有可用的软件包。
`报错提示no match nginx` 原因是 nginx 位于第三方的 yum 源里面，而不在 centos 官方 yum 源里面

很多软件包在 yum 里面没有的，解决的方法，就是使用 epel 源,也就是安装 epel-release 软件包。EPEL (Extra Packages for Enterprise Linux)是基于 Fedora 的一个项目，为“红帽系”的操作系统提供额外的软件包，适用于 RHEL、CentOS 等系统。可以在下面的网址上找到对应的系统版本，架构的软件包

解决办法，安装 epel
`sudo yum install epel-release`
　　更新（更新时间稍微长一些，耐心等待）
`yum update`
　　重新试一下：
`yum install -y nginx`

```js
//进入到local目录下
cd /usr/local

//创建一个文件夹用于存放下载的zip文件
nkdir tarzip

//执行以下命令在线下载nginx
cd tarzip
wget  http://nginx.org/download/nginx-1.17.6.tar.gz

//将下载好的zip文件解压到指定的目录
cd /usr/local
mkdir software
cd software
mkdir nginx
tar -zxvf /usr/local/tarzip/nginx-1.17.6.tar.gz -C /usr/local/software/nginx

//ngimx依赖gcc环境,安装前先安装gcc
yum -y install gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel

//进入到刚才解压的nginx目录nginx-1.17.6
cd /usr/local/software/nginx/nginx-1.17.6

//开始安装
./configure && make && make install

//启动nginx
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

```js
// 启用并启动Nginx服务：
$ sudo systemctl enable nginx
$ sudo systemctl start nginx
// 停止服务：
$ sudo systemctl stop nginx
// 要验证服务是否正在运行，检查其状态：
$ sudo systemctl status nginx

firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
```

出现这种情况一般是 80 端口被占用，使用 sudo fuser -k 80/tcp 命令关闭 80 端口即可

# docker 安装 Nginx

$ mkdir /mydata/nginx
$ docker run -p 8888:80 --name nginx -d nginx:latest
$ docker container cp nginx:/etc/nginx .
$ docker stop nginx
$ docker rm nginx
$ cd /mydata/nginx
$ mv nginx conf

```java
docker run -p 8888:80 --name envdm_nginx \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx \
-v /mydata/nginx/conf:/etc/nginx \
-d nginx:latest
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210223204834553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)

-   修改 vagrant 默认网络配置
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210223203141118.png)
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210223203921365.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)

# 使用 Docker 安装 RabbitMQ

![在这里插入图片描述](https://img-blog.csdnimg.cn/af6751916548434ca07d6c2d1ba2a959.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)

```java
#  rabbitmq安装命令
docker run --name rabbitmq \
 -p 5671:5671 -p 5672:5672 \
 -p 4369:4369 -p 25672:25672 \
 -p 15671:15671 \
 -p 15672:15672 \
 rabbitmq:3.8.6-management

```

1、拉取镜像

```java
// 指定版本号
docker pull rabbitmq:3.8.6-management
// 安装最新版
docker pull rabbitmq:management
docker pull haproxy:latest
// 运行单节点
docker run --name rabbitmq -d -p 15672:15672 -p 5672:5672 rabbitmq:3.8.6-management
// 开机自启动
docker container update --restart=always 容器名字
// 删除镜像
docker rmi 镜像id
// 删除容器
docker rm 容器id
// 停止所有容器
docker stop $(docker ps -aq)
```

2、创建 docker 网络，用于 haproxy 和 rabbimq 通信

```
docker network create rabbtimanet
```

3、创建容器

```
docker run -d --name=master130 -p 5672:5672 -p 15672:15672 -e RABBITMQ_NODENAME=master130 -e RABBITMQ_ERLANG_COOKIE='ANDYTITI' -h master130 --net=rabbitmqnet rabbitmq:3.8.6-management

docker run -d --name=slave131 -p 5673:5672 -p 15673:15672 -e RABBITMQ_NODENAME=slave131 -e RABBITMQ_ERLANG_COOKIE='ANDYTITI' -h slave131 --net=rabbitmqnet rabbitmq:3.8.6-management

docker run -d --name=slave132 -p 5674:5672 -p 15674:15672 -e RABBITMQ_NODENAME=slave132 -e RABBITMQ_ERLANG_COOKIE='ANDYTITI' -h slave132 --net=rabbitmqnet rabbitmq:3.8.6-management
```

4、 加入集群
**salve 加入集群操作(注意做这个步骤的时候：需要配置/etc/hosts 必须相互能够寻地到 我们已通过-h 指定 hostname)
分别进入 slave131、slave132 容器(docker exec -it 容器 id /bin/bash)，执行一下：**

```java
rabbitmqctl stop_app
rabbitmqctl join_cluster --ram master130@master130
rabbitmqctl start_app
```

> 退出集群：
> rabbitmqctl stop_app
> rabbitmqctl reset
> rabbitmqctl start_app

-   访问任意管控台 http://localhost:15674/#/ 如下图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220184644718.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpYW9mYW5ndWFu,size_16,color_FFFFFF,t_70)

```java
#logging options
global
	log 127.0.0.1 local0 info
	maxconn 5120
	chroot /usr/local/etc/haproxy
	uid 99
	gid 99
	daemon
	quiet
	nbproc 20
	pidfile /var/run/haproxy.pid

defaults
	log global
	#使用4层代理模式，”mode http”为7层代理模式
	mode tcp
	#if you set mode to tcp,then you nust change tcplog into httplog
	option tcplog
	option dontlognull
	retries 3
	option redispatch
	maxconn 2000
	timeout connect 5s
    #客户端空闲超时时间为 60秒 则HA 发起重连机制
    timeout client 60s
    #服务器端链接超时时间为 15秒 则HA 发起重连机制
    timeout server 15s
#front-end IP for consumers and producters

listen rabbitmq_cluster
	bind 0.0.0.0:5677
	#配置TCP模式
	mode tcp
	#balance url_param userid
	#balance url_param session_id check_post 64
	#balance hdr(User-Agent)
	#balance hdr(host)
	#balance hdr(Host) use_domain_only
	#balance rdp-cookie
	#balance leastconn
	#balance source //ip
	#简单的轮询
	balance roundrobin
	#rabbitmq集群节点配置
	#inter 每隔五秒对mq集群做健康检查， 2次正确证明服务器可用，2次失败证明服务器不可用，并且配置主备机制
	server master130 192.168.116.132:5672 check inter 5000 rise 2 fall 2
	server slave131 192.168.116.132:5673 check inter 5000 rise 2 fall 2
	server slave132 192.168.116.132:5674 check inter 5000 rise 2 fall 2
#配置haproxy web监控，查看统计信息
listen stats
	bind 0.0.0.0:8100
	mode http
	option httplog
	stats enable
	#设置haproxy监控地址为http://localhost:8100/rabbitmq-stats
	stats uri /rabbitmq-stats
	stats refresh 5s
	stats auth admin:123456
listen rabbitmq_admin #监听8000端口转发到rabbitmq的客户端
    bind 0.0.0.0:8000
    server master130 192.168.116.132:15672 check inter 5000 rise 2 fall 2
	server slave131 192.168.116.132:15673 check inter 5000 rise 2 fall 2
	server slave132 192.168.116.132:15674 check inter 5000 rise 2 fall 2
```

# 目标：从服务器 A 免密登录服务器 B

【配置方法】

1. 在服务器 A 生成密钥文件，直接使用以下命令：
   ssh-keygen
   中间遇到输入内容一路回车即可，完成后会在 ~/.ssh 目录下生成两个文件：id_rsa（私钥文件）和 id_rsa.pub（公钥文件，在服务器 B 要用到的）

2. 登录服务器 B，编辑~/.ssh/authorized_keys 文件，将服务器 A 里的~/.ssh/id_rsa.pub 内容复制进去保存，并授予权限 644。另外~/.ssh 目录授权 700
   vim ~/.ssh/authorized_keys
   chmod 644 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   如果~/.ssh 目录不存在，请手动创建，命令为：mkdir ~/.ssh
   或者直接用在服务器 A 上用 ssh-copy-id 命令：
   ssh-copy-id -i ~/.ssh/id_rsa.pub root@服务器 B 地址
   其中 -i 参数是指定公钥文件
   完成以上两步就可以实现了，如果遇到问题无法连接，请继续往下看：

【常见问题】

1. 服务器 B 没打开公钥登录权限
   解决方法：编辑/etc/ssh/sshd_config 文件，注意以下几项的值：
   PermitRootLogin yes
   PubkeyAuthentication yes
   AuthorizedKeysFile .ssh/authorized_keys
   编辑完保存，重启 sshd 服务（ubuntu 是 ssh ，centos 是 sshd）
   这些值其实也是默认的，默认也是开启的，如果连不上还是需要检查下）

2. 服务器 B 目录和文件权限
   解决方法：检查并设置以下权限
   ~/.ssh/　　 700
   ~/.ssh/autorized_keys 　　 644

3. 服务器 B 开启了 selinux
   解决方法：使用以下命令关闭
   setenforce 0
   并且编辑配置文件（永久关闭）
   vim /etc/selinux/config
   改变里面的值
   SELINUX=disabled
   然后保存

4. 遇到问题：从 A 服务器可以免密访问 B 服务器，但是 B 访问 A 却需要输入密码
   原因：A 服务器有 id_rsa 和 id_rsa.pub id_dsa 和 id_dsa.pub 2 套文件。B 服务器只有 id_dsa 和 id_dsa.pub
   解决： 在 B 服务器也生成 id_rsa 和 id_rsa.pub，把 B 服务器的 id_rsa.pub 写入 A 服务器 的 authorized_keys

5. 其他权限问题：
   //用户权限
   chmod 700 /home/username
   //.ssh 文件夹权限
   chmod 700 ~/.ssh/
   // ~/.ssh/authorized_keys 文件权限
   chmod 600 ~/.ssh/authorized_keys
