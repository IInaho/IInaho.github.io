+++
authors = ["lzy"]
title = "pprof 性能分析"
date = "2025-02-24"
description = ""
tags = [
    "golang"
]
categories = [
    "技术文档"
]
+++

# pprof 性能分析

## 概要

在 golang 项目开发测试过程中，程序经常会出现各种崩溃卡死的恶性 bug，例如内存飙升、CPU 占用太高、Goroutine 泄露等，有些仅从代码层面无法排查到，这时候就需要借助 pprof 工具来排查问题。

## 简要介绍

pprof 工具集，提供了 Go 程序内部多种性能指标的采样能力，我们常会用到的性能采样指标有这些：

- profile：默认进行 30s 的 CPU Profiling，得到一个分析用的 profile 文件，访问路径为 `$HOST/debug/pprof/profile`
- heap：查看活动对象的内存分配情况， 访问路径为 `$HOST/debug/pprof/heap`
- goroutine：查看当前所有运行的 goroutines 堆栈跟踪，访问路径为 `$HOST/debug/pprof/goroutine`
- allocs: 查看过去所有内存分配的样本，访问路径为 `$HOST/debug/pprof/allocs`(包括已经被 GC 回收的内存)
- threadcreate：查看创建新 OS 线程的堆栈跟踪，访问路径为 `$HOST/debug/pprof/threadcreate`
- mutex：查看导致互斥锁的竞争持有者的堆栈跟踪，访问路径为 `$HOST/debug/pprof/mutex`
- block：查看导致阻塞同步的堆栈跟踪，访问路径为 `$HOST/debug/pprof/block`

分析方式主要分为两种：

- 根据 pprof 工具基于 web 图形界面进行分析
- 基于交互式的命令行进行分析

## Web 界面分析

```go
_// pprof的init函数会将pprof里的一些handler注册到http.DefaultServeMux上_
**import** _ "net/http/pprof"

**go** **func**() {
    http**.**ListenAndServe("0.0.0.0:8080", nil)
}()

// http://0.0.0.0:8080/debug/pprof/goroutine?debug=1
```

在对应的访问路径上新增 `?debug=1` 的话，就可以直接在浏览器访问

若不新增 `debug` 参数，那么将会直接下载对应的 profile 文件

```bash
# 图形界面分析
go tool pprof --http :7777 http://192.168.131.100:19528/debug/pprof/heap
# 生成图片
go tool pprof -alloc_space -cum -svg http://127.0.0.1:8080/debug/pprof/heap > heap.svg
```

## 命令行分析 Heap

```bash
# 命令行交互模式(inuse_space、inuse_objects、alloc_space、alloc_objects)
go tool pprof -alloc_space http://localhost:6061/debug/pprof/heap
top10         # 查看累积分配内存较多的一些函数调用
top10 -sum    # 将函数调用关系中的数据进行累积
# 常用命令
top、list、traces、web、tree、png、svg
```

- inuse_space — 已分配但尚未释放的内存空间
- inuse_objects——已分配但尚未释放的对象数量
- alloc_space — 分配的内存总量(已释放的也会统计)
- alloc_objects — 分配的对象总数(无论是否释放)

## 命令行分析 CPU

```bash
$ go tool pprof http://localhost:6060/debug/pprof/profile\?seconds\=60
Fetching profile over HTTP from http://localhost:6060/debug/pprof/profile?seconds=60
Saved profile in /Users/eddycjy/pprof/pprof.samples.cpu.002.pb.gz
Type: cpu
Duration: 1mins, Total samples = 37.25s (61.97%)
Entering interactive mode (type "help" for commands, "o" for options)(pprof)
```

执行该命令后，需等待 60 秒，pprof 会进行 CPU Profiling，结束后将默认进入 pprof 的命令行交互式模式，可以对分析的结果进行查看或导出。

输入查询命令 `top10`，以此查看对应资源开销。

```bash
(pprof) top10
Showing nodes accounting for 36.23s, 97.26% of 37.25s total
Dropped 80 nodes (cum <= 0.19s)
Showing top 10 nodes out of 34
      flat  flat%   sum%        cum   cum%  Name
    32.63s 87.60% 87.60%     32.70s 87.79%  syscall.syscall
     0.87s  2.34% 89.93%      0.88s  2.36%  runtime.stringtoslicebyte
     0.69s  1.85% 91.79%      0.69s  1.85%  runtime.memmove
     0.52s  1.40% 93.18%      0.52s  1.40%  runtime.nanotime
     ...
(pprof)
```

## 命令行分析 Goroutine

```cpp
$ go tool pprof http://localhost:6060/debug/pprof/goroutine
Fetching profile over HTTP from http://localhost:6060/debug/pprof/goroutine
Saved profile in /Users/eddycjy/pprof/pprof.goroutine.003.pb.gz
Type: goroutine
Entering interactive mode (type "help" for commands, "o" for options)(pprof)
```

查看 goroutine 时，我们可以使用 `traces` 命令，这个命令会打印出对应的所有调用栈。

```shell
(pprof) traces
Type: goroutine
-----------+-------------------------------------------------------
         2   runtime.gopark
             runtime.netpollblock
             internal/poll.runtime_pollWait
             ...
-----------+-------------------------------------------------------
         1   runtime.gopark
             runtime.netpollblock
             ...
             net/http.ListenAndServe
             main.main
             runtime.main
```
