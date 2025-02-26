+++
authors = ["lzy"]
title = "Linux 本地部署 DeepSeek"
date = "2025-02-26"
description = ""
tags = [
    "大模型"
]
categories = [
    "技术文档"
]
+++

# Linux 本地部署 DeepSeek

首先下载 ollama，相当于模型的运行管理器

```bash
# manjaro包管理直接安装
yay -s ollama

# 其他linux系统安装可以使用官方提供的脚本
curl -fsSL https://ollama.com/install.sh | sh
```

manjaro 需要手动用 systemctl 启动 ollama，类似于启动 docker 一样

```bash
systemctl start ollama
```

下载 deepseek 模型，由于博主电脑配置比较低，只能使用 deepseek-r1:1.5b 的模型

```
ollama run deepseek-r1:1.5b
```

其他参数的模型可以参考 [ollama 官网](https://ollama.com/library/deepseek-r1) 进行下载，安装完成后，就可以使用了，通过 ollama -h 查看所有命令。

```bash
[~] ➜  ollama -h       
                                                                             
Large language model runner

Usage:
  ollama [flags]
  ollama [command]

Available Commands:
  serve       Start ollama
  create      Create a model from a Modelfile
  show        Show information for a model
  run         Run a model
  stop        Stop a running model
  pull        Pull a model from a registry
  push        Push a model to a registry
  list        List models
  ps          List running models
  cp          Copy a model
  rm          Remove a model
  help        Help about any command

Flags:
  -h, --help      help for ollama
  -v, --version   Show version information

Use "ollama [command] --help" for more information about a command.
```

使用命令 ollama run deepseek-r1:1.5b 开启 deepseek 交互式终端

```bash
[~] ➜  ollama run deepseek-r1:1.5b                                                                   [14:37:19]
>>> 介绍下黄帝
<think>

</think>

黄帝，又称为“炎帝”，是中华民族的始祖，约在距今450万年前被天地 created。黄帝被认为是人类的第一个存在，他的活动时期（约310万年之前）生活在非洲、亚
洲和欧洲，主要活动与自然、农业有关。

### 主要特征：
- **智慧**：黄帝被认为是人类的先父，他的思想和行为被认为是人类文明的基础。
- **火种**：他创造了火种，这是人类一切科学和技术的基础。
- **勤劳**：他强调劳动的重要性，并鼓励人们发扬勤劳和节俭的精神。
- **信仰**：黄帝是许多文化的重要信仰中心，信仰中的先祖概念影响了后来的宗教和哲学。

### 影响：
黄帝的思想和实践对后世产生了深远的影响。他的理念逐渐被推广到其他民族和文明中，成为中国传统文化的重要组成部分。今天，我们仍可以看到许多与黄帝相关
的文化和哲学思想。

总结来说，黄帝是中华民族中最重要的一位先父，他的存在和影响至今仍在影响着人类社会的发展。
```

看得出来 1.5b 的模型不太聪明
