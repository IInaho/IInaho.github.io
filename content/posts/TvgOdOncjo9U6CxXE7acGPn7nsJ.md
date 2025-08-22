+++
authors = ["lzy"]
title = "升级 chromium 任意版本"
date = "2025-08-22"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++


# 升级 chromium 任意版本

### 前言

众所周知适配 chromium 是非常困难的，需要依赖各种 lib 库，下面提供一个邪修方法可以升级任意版本的 chromium，并且一次编译好后，后续安装十分简单。

### 编译流程

首先需要编译安装 glibc，如果是容器适配，需要在容器内进行，如果是宿主机 ecs 适配，则在裸机执行即可。

```bash
# 首先安装基础库
yum install -y texinfo
yum install -y mlocate
yum install -y bzip2
yum install -y bison
yum install -y python3
yum install -y gcc gcc-c++
```

其次编译安装 glibc 库

```bash
# 下载对应的包
cd /home
wget https://mirrors.aliyun.com/gnu/glibc/glibc-2.36.tar.gz
wget https://mirrors.aliyun.com/gnu/gcc/gcc-9.3.0/gcc-9.3.0.tar.gz
wget https://mirrors.aliyun.com/gnu/make/make-4.3.tar.gz

# 编译安装gcc
tar -zxf gcc-9.3.0.tar.gz && cd gcc-9.3.0
./contrib/download_prerequisites
mkdir build && cd build
../configure --enable-checking=release --enable-language=c,c++ --disable-multilib --prefix=/usr
make -j$(cat /proc/cpuinfo| grep "processor"| wc -l)
make install && gcc -v

# 编译安装make
tar -zxf make-4.3.tar.gz
cd make-4.3 && mkdir build && cd build
../configure --prefix=/usr && make && make install
make -v

# 编译安装glibc
cd glibc-2.36/ && mkdir build && cd build
../configure --prefix=/tmp/glibc_install --disable-profile --enable-add-ons --with-headers=/usr/include --with-binutils=/usr/bin --disable-sanity-checks --disable-werror
make -j$(cat /proc/cpuinfo| grep "processor"| wc -l)
make install
# 最后一步有可能会报错，报错后先不管，看下/tmp/glibc_install目录的lib库是否生成
# 如果生成则没问题，忽略后续错误

# 将chromium安装目录创建好
mkdir /home/headless-shell/lib
cp /tmp/glibc_install/lib/*.so*  /home/headless/lib
```

接下来需要借助一个 docker 镜像： **chromedp/headless-shell:latest**

```bash
# 这一步主要是从上述镜像中将编译好的chromium二进制和依赖的lib拿出来
docker pull chromedp/headless-shell:latest
docker run -d -it --name "chromium" chromedp/headless-shell:latest bash
mkdir -p /home/headless-shell/bin
docker cp chromium:/headless-shell/* /home/headless-shell/bin
```

最后一步，还需要修改二进制硬编码的 ld 动态库的默认路径

```bash
# 需要使用patchelf工具，manjaro系统可以yay安装
yay -S patchelf
# 下面命令修改
patchelf --set-interpreter '/opt/headless-shell/lib64/ld-linux-x86-64.so.2' ./headless-shell
```

然后通过指定 lib 库即可运行

```bash
vim headless-shell

# ----

#!/bin/bash
export LD_LIBRARY_PATH=/opt/headless-shell/lib/:/usr/lib64/:$LD_LIBRARY_PATH
exec /opt/headless-shell/bin/headless-shell "$@"


chmod +x headless-shell
```

注意： 如果替换了系统的 libc，需要刷新 rpm 数据库

```bash
rpm --rebuilddb
```
