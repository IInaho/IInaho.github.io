+++
authors = ["lzy"]
title = "物理层概念与数据通信基础"
date = "2020-01-21"
description = ""
tags = [
    "计算机网络"
]
categories = [
    "计算机基础知识"
]
series = ["计算机网络"]
+++

# 物理层概念与数据通信基础

## 物理层基本概念

物理层解决如何在连接各种计算机的传输媒体上传输数据比特流，而不是指具体的传输媒体。

物理层的主要任务描述为： 确定传输媒体的接口的一些特性即：

- 机械特性：例接口形状，大小，引线数目
- 电气特性：例规定电压范围（-5v，+5v）
- 功能特性：例规定-5v 表示 0，+5v 表示 1
- 过程特性：也称规程特性，规定建立连接时各个相关部件的工作步骤

## 网络性能

### 速率

链接在计算机网络上的主机在数字信道上传送数据位数的速率，也称为 data rate 或 bit rate，单位 b/s，kb/s，mb/s，gb/s。

### 带宽

数据通信领域中，数字信道所能传送的最高数据率，单位 b/s，kb/s，mb/s，gb/s。

### 吞吐量

即在单位时间内通过某个网络的数据量

### 时延

- 发送时延 = 数据块长度(bit)/信道带宽(bit/s) 信号波完全传播完
- 传播时延 传播的过程所用时间
- 处理时延 收到信号波后处理时间
- 排队时延 多个信号排队等待时间

### 时延带宽积

时延带宽积 = 传播时延 * 带宽 （传播时线路上有多少 bit）

### 往返时间

从发送方发送数据开始，到发送方收到接收方确认

### 利用率

- 信道利用率 = 有数据通过时间/有无数据通过时间
- 网络利用率 = 信道利用率加权平均值
  D = D0 / （1-U） D0:网络空闲时的时延，D:网络当前时延，U: 信道利用率

## 数据通信

### 数据通信基本模型

![](../static/A9q7bdmOyor5T3x7Vp4cNHjonFb.png)

### 相关术语

- 数据(data)— 运送消息的实体
- 信号(signal)—数据的电气或电磁的表现
- “模拟信号”—代表消息的参数的取值是连续的。
- “数字信号”—代表消息的参数的取值是离散的。
- 码元(code)—在使用时间域的波形表示数字信号时，则代表不同离散数值的基本波形就成为码元。在数字通信中常常用时间间隔相同的符号来表示一个二进制数字，这样的时间间隔内的信号称为二进制码元。而这个间隔被称为码元长度，1 码元可以携带 nbit 的信息量。
