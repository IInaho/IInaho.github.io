+++
authors = ["lzy"]
title = "golang 安装与配置"
date = "2025-03-01"
description = ""
tags = [
    "golang"
]
categories = [
    "技术文档"
]
+++

# golang 安装与配置

## Golang 安装

### Ubuntu 系统如何安装

```bash
# 下载golang安装包
wget http://golang.google.cn/dl/go1.17.10.linux-amd64.tar.gz
# 解压&安装
sudo tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
#修改环境变量
sudo vim ~/.bashrc
export GOPATH=$HOME/gopath
export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
source ~/.bashrc
# 查看版本
go version
```

### GoModule 源配置

```bash
#更换gomodule源
#七牛云
go env -w GOPROXY=https://goproxy.cn,direct
#阿里云
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
#指定哪些域名下的仓库不去校验CA证书
go env -w GOINSECURE=private.repo.com
#指定私有仓库ip（可选，如果有的话，比如私网gitlab）
go env -w GOPRIVATE=xxx.com
#清除缓存
go clean --modcache
```

### Go 交叉编译

#### 关闭 cgo 交叉编译

```bash
# 没有CGO调用的情况下，交叉编译只需带上三个参数便可以实现
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build

#关闭CGO，CGO不支持交叉编译
#GOOS 和 GOARCH 指定要构建的平台
#-s -w 去掉调试信息， --extldflags "-static -fpic" 完全静态编译
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
-ldflags '-s -w --extldflags "-static -fpic"' main.go
```

#### 开启 cgo 交叉编译

借助第三方编译器实现

```bash
#mac
brew install FiloSottile/musl-cross/musl-cross

#manjaro
yay -S musl

#开启cgo交叉编译
#CC=x86_64-linux-musl-gcc 来指定GCC编译器
#CGO_LDFLAGS="-static"来指定CGO部分的编译为静态编译
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-musl-gcc \
CGO_LDFLAGS="-static" go build -a -v
```

### VScode 配置 Go 环境

> 最新 delve 仅支持调试 go1.14 及以上版本的代码，但有时有需要用较低版本 golang，不方便升级 golang，使用 dlvFlags 参数忽略 或者降级 dlv 版本

[delve/CHANGELOG.md at master · go-delve/delve · GitHub](https://github.com/go-delve/delve/blob/master/CHANGELOG.md)

```json
// launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch",
            "type": "go",
            "request": "launch",
            "mode": "debug",
            //项目路径
            "program": "./app/test",
            //设置环境变量
            "env": {
                "GO111MODULE": "on",
                // "CGO_ENABLED": 1
            },
            "args": [
                // 设置运行参数
                "-f", "config.yaml"
            ],
            "showLog": true,
            "buildFlags": "-tags=test",   // 编译加tag
            "dlvFlags": ["--check-go-version=false"] //忽略dlv版本报错
            "justMyCode": false    // 是否调试进入代码库
        }
    ]
}
```

###### 禁止保存代码时格式化

```json
// settings.json
{
    "[go]": {
        "editor.formatOnSave": false
    }
}
```

#### go 常用命令

```bash
#检测你的程序有没有发生竞态条件
go run -race program.Go
#检查逃逸分析做了什么
go build -gcflags="-m"
#关闭编译优化
go run -gcflags '-l -N' xxxx.go
```

## Go 多版本管理

```bash
# 安装某个版本的go
go install -v golang.org/dl/go1.20.7@latest
go1.20.7 download    # Go放在~/sdk/go1.20.7目录下

# download完成后, 会在go/bin下多一个带版本的go二进制，可以这样使用
go1.20.7 build main.go
```
