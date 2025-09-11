+++
authors = ["lzy"]
title = "sing-box 代理工具"
date = "2025-09-10"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++


## 安装

sing-box 是一个基于 Go 语言的代理工具，支持 Linux、macOS、Windows 等操作系统。

```bash
# manjaro下使用yay包管理安装
yay -S sing-box
```

## 命令

```sql
Usage:
  sing-box [command]

Available Commands:
  check       Check configuration
  completion  Generate the autocompletion script for the specified shell
  format      Format configuration
  generate    Generate things
  geoip       GeoIP tools
  geosite     Geosite tools
  help        Help about any command
  merge       Merge configurations
  rule-set    Manage rule-sets
  run         Run service
  tools       Experimental tools
  version     Print current version of sing-box

Flags:
  -c, --config stringArray             set configuration file path
  -C, --config-directory stringArray   set configuration directory path
  -D, --directory string               set working directory
      --disable-color                  disable color output
  -h, --help                           help for sing-box

Use "sing-box [command] --help" for more information about a command.
```

## 配置

参考链接：[https://sing-box.sagernet.org/zh/configuration/](https://sing-box.sagernet.org/zh/configuration/)

```json
{
    // 定义log级别
    "log": {
        "level": "info",
        "disabled": false,
        "timestamp": true
    },
    // 定义dns
    "dns": {
        "servers": [
            {
                "tag": "alidns",
                "address": "https://223.5.5.5/dns-query",
                "detour": "direct",
                "strategy": "prefer_ipv4"
            },
            {
                "tag": "cloudflare",
                "address": "1.1.1.1",
                "detour": "direct",
                "strategy": "prefer_ipv4"
            },
            {
                "tag": "block",
                "address": "rcode://success"
            }
        ],
        "rules": [
            {
                "rule_set": "geosite-category-ads-all",
                "server": "block"
            },
            {
                "rule_set": "geosite-cn",
                "server": "alidns"
            },
            {
                "clash_mode": "direct",
                "server": "alidns"
            },
            {
                "clash_mode": "global",
                "server": "alidns"
            }
        ],
        "strategy": "prefer_ipv4",
        "independent_cache": true,
        "final": "alidns"
    },
    // 定义路由
    "route": {
        "final": "proxy-selector",
        "auto_detect_interface": true,
        "rule_set": [
            {
                "tag": "geosite-cn",
                "type": "local",
                "format": "binary",
                "path": "./geosite-cn.srs"
            },
            {
                "tag": "geoip-cn",
                "type": "local",
                "format": "binary",
                "path": "./geoip-cn.srs"
            },
            {
                "tag": "geosite-category-ads-all",
                "type": "local",
                "format": "binary",
                "path": "./geosite-category-ads-all.srs"
            }
        ],
        "rules": [
            {
                "protocol": "dns",
                "outbound": "dns-out"
            },
            {
                "clash_mode": "direct",
                "outbound": "direct"
            },
            {
                "clash_mode": "global",
                "outbound": "proxy-selector"
            },
            {
                "rule_set": [
                    "geosite-cn",
                    "geoip-cn"
                ],
                "outbound": "direct"
            },
            {
                "ip_is_private": true,
                "outbound": "direct"
            }
        ]
    },
    // 入端口
    "inbounds": [
        {
            "type": "mixed",
            "tag": "mixed-in",
            "listen": "::",
            "listen_port": 5353,
            "tcp_fast_open": true,
            "udp_fragment": true,
            "sniff": true,
            "sniff_override_destination": true,
            "set_system_proxy": true
        }
    ],
    // 出端口
    "outbounds": [
        {
            "type": "direct",
            "tag": "direct"
        },
        {
            "type": "block",
            "tag": "block"
        },
        {
            "type": "dns",
            "tag": "dns-out"
        },
        {
            "type": "selector",
            "tag": "proxy-selector",
            "outbounds": [
                "Relay-HK1",
                "Relay-JP1",
                "direct"
            ]
        },
        {
            "type": "shadowsocks",
            "tag": "Relay-HK1",
            "server": "xxxxxxx",
            "server_port": 1027,
            "password": "xxxxxxx",
            "method": "chacha20-ietf-poly1305",
            "connect_timeout": "15s",
            "tcp_fast_open": true
        },
        {
            "type": "shadowsocks",
            "tag": "Relay-JP1",
            "server": "xxxxxxxxx",
            "server_port": 994,
            "password": "xxxxxxx",
            "method": "chacha20-ietf-poly1305",
            "connect_timeout": "15s",
            "tcp_fast_open": true
        },
    ],
    // 实验特性
    "experimental": {
        "cache_file": {
            "path": "cache.db",
            "cache_id": "sing-box-cache",
            "store_fakeip": true,
            "store_rdrc": true,
            "rdrc_timeout": "7d",
            "enabled": true
        },
        "clash_api": {
            "external_controller": "127.0.0.1:9090",
            "external_ui": "./ui",
            "secret": "",
            "default_mode": "rule"
        }
    }
}
```

## 启动

```bash
sing-box run config.json
```
