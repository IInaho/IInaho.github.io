+++
authors = ["lzy"]
title = "Claude Code 安装配置"
date = "2025-09-10 16:20:20"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

## Claude Code 安装

```bash
# npm安装
npm install -g @anthropic-ai/claude-code
npm install -g @musistudio/claude-code-router
```

## claude-code-router 配置

claude-code-router 一款强大的工具，可将 Claude Code 请求路由到不同的模型，并自定义任何请求。

```json
// cat ~/.claude-code-router/config.json

{
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "sk-xxxxxxx",
      "models": ["deepseek-chat", "deepseek-reasoner"],
          "transformer": {
        "use": [
          [
            "maxtoken",
            {
              "max_tokens": 8000
            }
          ]
        ]
      }
        }
  ],
  "Router": {
    "default": "deepseek,deepseek-chat",
    "think": "deepseek,deepseek-reasoner"
  }
}
```

> [https://github.com/musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)


## claude-code-router 基础命令

```bash
# 使用 router 启动 Claude Code
ccr code

# 修改配置文件后，需要重启服务使配置生效
ccr restart

# 使用 UI 模式来管理您的配置
ccr ui
```
