+++
authors = ["lzy"]
title = "ICMP 与 IGMP 协议"
date = "2023-07-07"
description = ""
tags = [
    "计算机网络"
]
categories = [
    "技术文档"
]
series = ["计算机网络"]
+++

# ICMP 与 IGMP 协议

## ICMP 简介

为了提高 IP 数据报交付成功的机会，在网际层使用了网际控制报文协议 ICMP(Internet Control Message Protocol).

- ICMP 允许主机或路由器报告差错情况和提供有关异常情况的报告。
- ICMP 不是高层协议，而是 IP 层的协议。
- ICMP 报文作为 IP 层数据报的数据，加上数据报的首部，组成 IP 数据包发送出去。

## ping 命令诊断网络故障

- PING(Packet Internet Grope),因特网包探索器，用于测试网络连接量的程序。Ping 发送一个 ICMP 回声请求消息给目的地并报告是否收到所希望的 ICMP 回声应答。
- ping 指的是端对端连通，通常用来作为可用性的检查，但是某些病毒木马会强行大量远程执行 ping 命令抢占你的网络资源，导致系统变慢，网速变慢。严禁 ping 入侵作为大多数 防火墙的一个基本功能提供给用户进行选择。
- 如果你打开 IE 浏览器访问网站失败，你可以通过 ping 命令测试到 Internet 的网络连通，可以为你排除网络故障提供线索，下面展示 ping 命令返回的信息以及分析其原因。

### 使用 ICMP 协议的命令

TTL 是数据报的生存时间，每过一个路由器就会减 1，作用是防止数据报在网络中循环。

TTL 默认初始值如下：

- Linux 64
- Windows 128
- Unix 255

### ping 与 pathping 命令

pathing 能跟踪数据包路径，发现问题位置。

Windows 上跟踪数据包路径的命令：tracerert ip 地址

路由器上跟踪数据包路径的命令： traceroute ip 地址

## IGMP 协议与多播

数据通信分为点到点通信，广播通信，还有组播通信。组播也称为多播通信。

多播通信可以跨网段，将数据同时传递给多个计算机，避免了占用大量带宽。

使用多播一般用于直播，网络会议等。

IGMP 协议的作用就是周期性扫描本网段内有没有主机在访问多播数据包。
