+++
authors = ["lzy"]
title = "使用Git同步博客资源"
date = "2025-08-22"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

## 概述
本文介绍了如何使用Git将Hugo生成的静态网站资源同步到Web服务器，实现网站发布。核心方法是利用Git的hook钩子功能，实现Git仓库与项目文件分离管理。

## 步骤详解

### 1. 服务器上创建Git仓库
在ECS服务器上创建Git仓库，将Git仓库与HTML资源文件分离：
- Git仓库路径：`/u01/data/hugo/public.git/`（仅作版本控制）
- HTML资源文件路径：`/u01/data/hugo/html`（Web服务器根目录）

创建命令：
```bash
cd /u01/data/hugo/
git init --bare public.git
mkdir html
```

配置post-receive钩子实现自动部署：
```bash
cat hooks/post-receive << EOF
#!/bin/sh
git --work-tree=/u01/data/hugo/html --git-dir=/u01/data/hugo/public.git checkout -f
EOF
chmod +x hooks/post-receive
```

### 2. 本地git clone和git push
在本地主机上克隆远程仓库：
```bash
cd blog/
rm -rf public/
git clone ssh://admin@www.ityoudao.cn:666/u01/data/hugo/public.git
```
> 注意：如果服务器使用自定义SSH端口，Git地址必须包含端口号

测试推送：
```bash
cd public/
echo "Hello hugo~~~" > hello.html
git add -A
git commit -m "init"
git push
```

### 3. 检查服务器同步结果
验证推送是否成功：
```bash
ll /u01/data/hugo/html/
```
成功后会看到推送的文件（如`hello.html`）

### 4. 使用Hugo生成静态文件并推送
生成Hugo静态文件：
```bash
hugo
```

推送生成的静态文件：
```bash
cd public/
git add -A
git commit -m "update site"
git push
```

## 关键点
- 使用`--bare`参数创建裸仓库，只存储版本历史
- 通过post-receive钩子实现自动将代码部署到Web目录
- 自定义SSH端口时需在Git地址中指定
- Hugo生成的静态文件位于`public`目录，需将此目录作为Git工作目录