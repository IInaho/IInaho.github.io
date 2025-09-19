+++
authors = ["lzy"]
title = "从coredump到systemtap的完整指南"
date = "2025-09-19 16:18:20"
description = ""
tags = [
    "linux", "故障排查", "coredump", "auditd", "systemtap"
]
categories = [
    "技术文档"
]
+++

### 一、coredump文件：程序崩溃现场的完整快照

coredump文件是程序崩溃时内存状态的完整快照，包含了崩溃时刻的变量值、堆栈信息、寄存器状态等关键数据，相当于程序崩溃瞬间的"现场照片"。对于Go程序等后台服务，当遇到不明原因的崩溃、内存溢出或死锁时，coredump文件能提供直接的线索，帮助工程师快速定位问题根源。

在微服务架构和容器化环境中，coredump分析尤为重要，因为这些环境中的服务往往运行在隔离的容器中，生命周期可能较短，导致问题更难复现和排查。通过正确配置和分析coredump文件，我们可以显著缩短故障定位和修复时间。

##### 1. 开启系统coredump功能

默认情况下，Linux系统可能限制了coredump文件的生成。我们需要先检查并配置系统参数：

```bash
ulimit -c # 查看当前coredump文件大小限制，如果显示0表示未开启
ulimit -c unlimited # 设置为无限制，允许生成任意大小的coredump文件
# 为了永久生效，需要将配置添加到/etc/security/limits.conf文件
# 添加以下两行到文件末尾
# * soft core unlimited
# * hard core unlimited
```

##### 2. 配置Go程序的GOTRACEBACK环境变量

对于Go程序，GOTRACEBACK环境变量控制panic发生时的行为和堆栈输出详细程度。通过合理设置，可以让程序在崩溃时生成更完整的调试信息。

| 值     | 行为                                                                                                   |
|--------|--------------------------------------------------------------------------------------------------------|
| none   | 不打印任何堆栈跟踪信息，不过崩溃的原因和哪行代码触发的panic还是会打印                                    |
| single | 只打印当前正在运行的触发panic的goroutine的堆栈以及runtime的堆栈；如果panic是runtime里发出的，则打印所有goroutine的堆栈跟踪信息 |
| all    | 打印所有用户创建的goroutine的堆栈信息（不包含runtime的）                                                 |
| system | 在前面all的基础上把runtime相关的所有协程的堆栈信息也一起打印出来                                         |
| crash  | 打印的内容和前面system一样，但还会额外生成对应操作系统上的coredump文件                                   |

##### 3. 生成并管理coredump文件

设置GOTRACEBACK=crash可以让Go程序在崩溃时生成coredump文件：

```bash
go build -gcflags="-N -l" main.go # 关闭编译器优化，保留调试信息
GOTRACEBACK=crash ./main # 运行程序并在崩溃时生成coredump

# 使用coredumpctl管理coredump文件
coredumpctl list # 查看系统中所有的coredump文件
coredumpctl info <进程id> # 查看特定进程的coredump详细信息
coredumpctl debug <进程id> # 使用gdb调试特定的coredump文件
# 指定调试器和参数
coredumpctl debug <进程id> --debugger=ggdb -A "bt full"
```

##### 4. 实际调试场景示例

当服务意外崩溃时，我们可以通过以下步骤快速分析：

```bash
# 1. 查找最近的coredump记录
coredumpctl list | head -5

# 2. 查看崩溃详情，获取进程ID和时间戳
coredumpctl info <进程id>

# 3. 使用gdb调试coredump
coredumpctl debug <进程id>
# 在gdb中可以使用以下命令分析
(gdb) bt # 查看堆栈跟踪
(gdb) info threads # 查看所有线程
(gdb) info registers # 查看寄存器状态
(gdb) print variable_name # 打印变量值
(gdb) quit # 退出调试
```

### 二、auditd审计：系统行为的全方位监控

auditd是Linux系统的审计服务，能够详细记录系统调用、文件访问、进程执行等行为，相当于系统的"黑匣子"。当服务异常终止或被意外终止时，auditd可以帮助我们追踪到是谁、通过什么方式、在什么时间执行了关键操作。

在企业级系统和安全敏感环境中，auditd不仅是故障排查的利器，也是安全审计和合规性检查的重要工具。通过预先配置的规则，auditd可以实时监控系统关键路径，为服务崩溃问题提供完整的上下文信息。

#### 1. 安装与基础配置

首先需要安装auditd并启动服务：

```bash
# CentOS/RHEL系统
yum install audit -y
# Ubuntu/Debian系统
apt-get install auditd -y

systemctl start auditd # 启动服务
systemctl enable auditd # 设置开机自启
systemctl status auditd # 检查服务状态
```

配置auditd服务参数，优化日志管理：

```bash
# 编辑/etc/audit/auditd.conf文件
max_log_file = 100                  # 单个日志文件的最大大小（MB）
num_logs = 10                       # 保留的日志文件数量
max_log_file_action = ROTATE        # 达到大小限制时的操作：ROTATE表示轮转
space_left = 75                     # 剩余空间警告阈值（MB）
space_left_action = SYSLOG          # 达到警告阈值时的操作
admin_space_left = 50               # 管理员警告阈值（MB）
admin_space_left_action = SUSPEND   # 达到管理员阈值时的操作

systemctl restart auditd # 重启服务使配置生效
```

#### 2. 配置关键审计规则

针对服务崩溃排查，我们需要配置关键的审计规则，特别是监控信号发送和程序执行：

```bash
# 监控kill信号，用于追踪谁终止了服务进程
-a exit,always -F arch=b64 -S kill -k service_termination

# 监控execve系统调用，记录程序执行情况
-a exit,always -F arch=b64 -S execve -k program_execution

# 监控特定服务的可执行文件（以nginx为例）
-w /usr/sbin/nginx -p rwxa -k nginx_service

# 监控系统关键目录
-w /etc/systemd/system/ -p rwxa -k system_services
-w /var/run/ -p rwxa -k runtime_files

# 保存规则并重启服务
auditctl -R /etc/audit/audit.rules
systemctl restart auditd
```

#### 3. 实时监控和搜索审计日志

配置好规则后，可以使用以下命令实时监控和搜索审计日志：

```bash
# 实时监控审计事件
auditctl -l # 查看当前加载的规则
tail -f /var/log/audit/audit.log # 实时查看审计日志

# 使用ausearch搜索特定事件
# 搜索终止服务的kill信号
ausearch -k service_termination -i
# 搜索特定时间段内的事件
ausearch -k nginx_service -ts today -te now -i
# 搜索失败的系统调用
ausearch -m SYSCALL -sv no -i
# 搜索特定进程ID相关的事件
ausearch -p 1234 -i
```

#### 定义规则

audit 可以指定控制规则、文件系统规则、系统调用规则这三种类型的审计规则

审计规则可以在命令行上使用 auditctl 命令定义

- 记录对/etc/passwd 文件的访问和属性更改的规则

```bash
auditctl -w etc/passwd -p rwxa -k passwd_file
```

- 记录/etc/selinux/目录中所有文件的访问和属性更改的规则

```bash
auditctl -w etc/selinux/ -p rwxa -k selinux_dir
```

- 记录/bin/id 程序执行的规则

```bash
auditctl -a always,exit -F exe=/bin/id -F arch=b64 -S execve -k id_exe
```

以上通过命令行方式定义的规则将会在重启后消失

使规则重启后仍存在，则打开/etc/audit/rules.d/audit.rules 文件，将规则添加到文件中

```bash
-w /etc/passwd -p rwxa -k passwd_file
-w /etc/selinux/ -p rwxa -k selinux_dir
-a always,exit -F exe=/bin/id -F arch=b64 -S execve -k id_exe
```

然后重启 Audit

```bash
service auditd restart
```

#### 4. 审计日志详细分析

审计日志包含大量系统行为信息，下面通过一个实际案例来详细解析日志内容：

**场景说明**：假设我们的Nginx服务在生产环境中意外终止，通过系统日志只知道服务停止了，但没有明确的原因。此时，我们可以通过auditd日志来追踪可能的终止原因。

通过auditd日志发现了以下记录：

```bash
type=SYSCALL msg=audit(1621174287.258:73): arch=c000003e syscall=2 success=yes exit=3 a0=7ffc42299672 a1=0 a2=1fffffffffff0000 a3=7ffc42296a60 items=1 ppid=1769 pid=1913 auid=1000 uid=0 gid        =0 euid=0 suid=0 fsuid=0 egid=0 sgid=0 fsgid=0 tty=pts0 ses=3326 comm="cat" exe="/usr/bin/cat" key="passwd_file"
type=CWD msg=audit(1621174287.258:73):  cwd="/etc/audit/rules.d"
type=PATH msg=audit(1621174287.258:73): item=0 name="/etc/passwd" inode=27059 dev=fd:01 mode=0100644 ouid=0 ogid=0 rdev=00:00 objtype=NORMAL cap_fp=0000000000000000 cap_fi=0000000000000000         cap_fe=0 cap_fver=0
type=PROCTITLE msg=audit(1621174287.258:73): proctitle=636174002F6574632F706173737764
```

#### 日志审计分析

##### 第一条记录

> type=SYSCALL

type字段为记录的类型，SYSCALL表示此记录是由对内核的系统调用触发的


> msg=audit(1621174287.258:73)

msg字段记录:
1. 表单中记录的时间戳和唯一ID, 如果多条记录是作为同一审计事件的一部分生成的，则它们的时间戳和ID相同
2. 内核或用户空间应用程序提供的特定于事件的对。

> arch=c000003e

arch字段为CPU架构的信息, 值以十六进制编码，使用ausearch命令搜索审计记录时，加上-i选项可将c000003e转换为x86_64显示

> syscall=2

syscall字段记录发送到内核的系统调用类型。2表示open，ausyscall命令可以将系统调用编号转换为等效的系统调用显示

`ausyscall --dump` 命令则显示所有编号及系统调用。

> success=yes

success字段记录该特定事件中记录的系统调用是成功还是失败，yes为成功。

> exit=3

exit字段记录系统调用返回的退出代码。

> a0=7ffc42299672 a1=0 a2=1fffffffffff0000 a3=7ffc42296a60

a0至a3字段记录前4个参数，值以十六进制编码

> items=1

items字段包含跟在系统调用记录之后的PATH辅助记录的数量

> ppid=1769

ppid字段记录父进程ID。1769是父进程的PPID，例如bash

> pid=1913

pid字段记录进程ID。在这种情况下，1913是cat进程的PID。

> auid=1000

auid字段记录审计用户ID
此ID在登录时分配给用户，即使用户的身份发生更改（例如使用su命令切换用户账户），每个进程也会继承此ID

> uid=0

uid字段记录启动分析进程用户的用户ID。使用ausearch命令搜索审计记录上，加上-i选项可将0转换为root显示。

> gid=0

gid字段记录启动分析进程用户的组ID

> euid=0

euid字段记录启动分析进程用户的有效用户ID

> suid=0

suid字段记录启动分析进程用户的设置用户ID

> fsuid=0

fsuid字段记录启动分析进程用户的文件系统用户ID

> egid=0

egid字段记录启动分析进程用户的有效组ID

> sgid=0

sgid字段记录启动分析进程用户的集合ID

> fsgid=0

fsgid字段记录启动分析进程用户的文件系统组ID

> tty=pts0

tty字段记录调用分析进程的终端

> ses=3326

ses字段记录调用分析进程会话的会话ID

> comm="cat"

comm字段记录调用分析进程命令的命令名称。在这种情况下，触发此审计事件的是cat命令

> exe="/usr/bin/cat"

exe字段记录调用分析进程的可执行文件路径

> key="passwd_file"

key字段记录与生成此事件的规则相关联的管理员定义的字符串

##### 第二条记录

> type=CWD

type字段值为CWD（当前工作目录），此类型记录调用第一条记录中指定的系统调用进程所执行的工作目录

> msg=audit(1621174287.258:73)

msg字段与第一条记录具有相同的时间戳和ID值

> cwd="/etc/audit/rules.d"

cwd字段包含调用系统调用目录的路径

##### 第三条记录

> type=PATH

type字段值为path，审计事件包含path作为参数传递给系统调用的每个路径
此审计事件中，只有一个路径/etc/passwd用作参数

> msg=audit(1621174287.258:73)

msg字段与第一条和第二条记录具有相同的时间戳和ID值

> item=0

item字段指示当前记录是系统调用类型记录中引用的总项数的哪个项。这个数从0开始，值为０表示它是第一项

> name="/etc/passwd"

name字段记录作为参数传递给系统调用的文件或目录路径。在这种情况下，它是/etc/passwd文件

> inode=27059

inode字段包含与此事件中记录的文件或目录相关联的inode编号
使用find etc -inum 27059 -print命令可以在/etc目录查找与27059关联的文件或目录

> dev=fd:01

dev字段指定包含此事件中记录的文件或目录设备的主要和次要ID。fd:01表示/dev/fd/1设备

> mode=0100644

mode字段记录文件或目录权限，以stat命令（st_mode字段）返回的数字编码
0100644表示-rw-r--r--，即/etc/passwd文件的权限为644

> st_mode 的结构(花括号中的数字都是二进制)

![](../static/UEaLbvYmtogaSrxSEoMchf2InJh.jpeg)

> ouid=0

ouid字段记录对象所有者的用户ID

> ogid=0

ogid字段记录对象所有者的组ID

> rdev=00:00

rdev字段包含仅用于特殊文件的记录设备标识符。在这种情况下，它不被使用，因为记录的文件是一个普通文件

> objtype=NORMAL

objtype字段记录给定系统调用上下文中每个路径记录操作的意图

> cap_fp=0000000000000000

cap_fp字段记录与文件或目录对象允许的基于文件系统能力设置相关的数据

> cap_fi=0000000000000000

cap_fi字段记录与文件或目录对象继承的基于文件系统能力设置相关的数据

> cap_fe=0

cap_fe字段记录文件或目录对象基于文件系统能力有效位的设置

> cap_fver=0

cap_fver字段记录文件或目录对象基于文件系统能力的版本

##### 第四条记录

> type=PROCTITLE

type字段为记录的类型
PROCTITLE表示此记录提供触发此审计事件的完整命令行，该事件由对内核的系统调用触发

> proctitle=636174002F6574632F706173737764

proctitle字段记录用于调用分析进程命令的完整命令行
值以十六进制编码，不允许用户影响审计日志解析器
通过解码即可得到触发此审核事件的命令
使用ausearch命令搜索审计记录时，加上-i选项可将636174002F6574632F706173737764转换为`cat /etc/passwd`显示

#### 搜索审计日志

ausearch 是用于搜索审计日志文件特定事件的工具

> 默认会搜索/var/log/audit/audit.log 文件，可以使用-if 选项指定其他审计日志文件

- 在/var/log/audit/audit.log 文件搜索失败的登录尝试。

```bash
ausearch -m USER_LOGIN -sv no -i
```

- 搜索所有用户、组和角色更改。

```bash
ausearch -m ADD_USER -m DEL_USER -m ADD_GROUP -m USER_CHAUTHTOK -m DEL_GROUP -m CHGRP_ID -m ROLE_ASSIGN -m ROLE_REMOVE -i
```

- 使用用户的登录 ID（auid）搜索用户执行的所有记录操作。

```bash
ausearch -ua 1000 -i
```

- 搜索从昨天到现在所有失败的系统调用。

```bash
ausearch -ts yesterday -te now -m SYSCALL -sv no -i
```

#### 5. 生成审计报告和统计

aureport工具可以将审计日志转换为结构化的报告，便于分析和统计：

```bash
# 生成审计活动概述报告
aureport

# 生成时间范围报告
aureport -t

# 生成特定服务（如nginx）的活动报告
aureport -x | grep nginx

# 生成失败事件的摘要报告
aureport -u --failed --summary -i

# 生成按用户分组的命令执行统计
aureport -x --summary -i

# 生成自定义查询的报告
ausearch -k service_termination -i | aureport --summary
```

#### 6. 服务崩溃排查实战示例

当服务意外崩溃时，可以通过以下流程快速定位原因：

```bash
# 1. 确定服务崩溃的大致时间
journalctl -u <service_name> | grep -i failed

# 2. 在审计日志中搜索该时间段内的相关事件
ausearch -ts "2025-09-19 14:00:00" -te "2025-09-19 14:10:00" -k service_termination -i

# 3. 分析找到的kill信号记录，确定发起者和原因
# 4. 如果是权限问题，检查相关文件访问记录
ausearch -k nginx_service -ts today -i | grep -i permission

# 5. 生成综合报告，记录问题详情
ausearch -k service_termination -i > crash_analysis_report.txt
```


```bash
# 生成审计活动的概述
aureport
# 所有审计日志文件包含的事件时间范围的报告。
aureport -t
# 过去三天记录的事件的报告
aureport -ts 01/01/2021 -te 01/04/2021
# 所有可执行文件事件的报告。
aureport -x
# 所有可执行文件事件的摘要报告。
aureport -x --summary
# 所有用户失败事件的摘要报告。
aureport -u --failed --summary -i
# 每个系统用户所有失败登录尝试的摘要报告。
aureport -l --summary -i
# 从 ausearch 搜索用户 ID 为 1000 的所有文件访问事件的查询生成摘要报告。
ausearch -ul 1000 -r | aureport -f --summary
```

### 三、systemtap动态跟踪：深入内核的问题诊断

systemtap是一个强大的动态跟踪工具，能够深入Linux内核和用户空间程序，实时监控系统行为和性能特征。与coredump（事后分析）和auditd（偏向安全审计）不同，systemtap提供了一种主动式、低开销的监控方法，可以在不中断服务的情况下，持续监控系统状态，特别适合排查那些难以复现或间歇性出现的崩溃问题。

在复杂的分布式系统中，systemtap能够帮助工程师在生产环境中进行"无损调试"，捕获导致服务崩溃的微小异常和竞争条件，为问题排查提供前所未有的深度和灵活性。

#### 1. 系统环境准备

使用systemtap需要确保内核支持必要的调试特性：

```bash
# 检查内核是否支持所需特性
cat /boot/config-$(uname -r) | grep -E "CONFIG_DEBUG_INFO|CONFIG_KPROBES|CONFIG_DEBUG_FS|CONFIG_RELAY"
# 所有选项都应该显示为y或m

# 如果缺少这些配置，需要重新编译内核或安装支持这些特性的内核版本
```

安装必要的开发包和调试信息：

```bash
# CentOS/RHEL系统
yum install gcc kernel-devel-$(uname -r) kernel-debuginfo-$(uname -r) kernel-debuginfo-common-$(uname -m)-$(uname -r) -y
# 或从官方仓库下载对应版本的debuginfo包
# http://debuginfo.centos.org/$(rpm -E %rhel)/x86_64/

# Ubuntu/Debian系统
apt-get install gcc linux-headers-$(uname -r) -y
# 安装调试信息包
echo "deb http://ddebs.ubuntu.com $(lsb_release -cs) main restricted universe multiverse" | sudo tee -a /etc/apt/sources.list.d/ddebs.list
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 428D7C01
apt-get update
apt-get install linux-image-$(uname -r)-dbgsym -y
```

安装systemtap工具：

```bash
# CentOS/RHEL系统
yum install systemtap systemtap-runtime -y

# Ubuntu/Debian系统
apt-get install systemtap systemtap-sdt-dev -y

# 验证安装是否成功
stap -v -e 'probe vfs.read { exit() }'
```

#### 2. 实用systemtap脚本示例

以下是几个经过实战验证的、用于服务监控和崩溃排查的实用systemtap脚本，这些脚本可以直接在生产环境中使用或根据具体需求进行定制：

##### 2.1 进程IO监控脚本（增强版）

```bash
#!/usr/bin/stap
// 监控进程IO活动，可用于排查IO导致的服务崩溃

global reads, writes, start_time
start_time = gettimeofday_s()

// 监控读操作
probe vfs.read.return {
    if (bytes_read > 0) {
        reads[execname(), pid(), uid()] += bytes_read
    }
}

// 监控写操作
probe vfs.write.return {
    if (bytes_written > 0) {
        writes[execname(), pid(), uid()] += bytes_written
    }
}

// 每5秒打印一次top 10 IO进程
probe timer.s(5) {
    now = gettimeofday_s()
    elapsed = now - start_time
    printf("\n===== IO统计报告 (过去%d秒) =====\n", 5)
    printf("%16s\t%8s\t%8s\t%12s\t%12s\t%12s\n", "进程名", "PID", "UID", "读取(KB)", "写入(KB)", "总IO(KB)")
    
    // 计算总IO并排序输出
    foreach ([name, pid, uid] in reads-) {
        total_read = reads[name, pid, uid]/1024
        total_write = writes[name, pid, uid]/1024
        total_io = total_read + total_write
        if (total_io > 0) {
            printf("%16s\t%8d\t%8d\t%12d\t%12d\t%12d\n", name, pid, uid, total_read, total_write, total_io)
        }
    }
    
    // 清除统计数据，准备下一轮监控
    delete reads
    delete writes
}

// 捕获SIGINT信号，优雅退出
probe signal.handle(SIGINT) {
    printf("\n监控已停止，共运行%d秒\n", gettimeofday_s() - start_time)
    exit()
}
```

使用方法：
```bash
stap io_monitor.stp
# 或保存为文件后执行
chmod +x io_monitor.stp
./io_monitor.stp
```

##### 2.2 进程崩溃监控脚本

```bash
#!/usr/bin/stap
// 监控进程异常终止，记录信号和堆栈信息

global crash_count

// 监控进程收到致命信号
probe signal.send {
    if (sig_pid && sig_name != "SIGCHLD") {
        // 只关注可能导致崩溃的信号
        if (sig_name ~ /SIGSEGV|SIGABRT|SIGFPE|SIGILL|SIGBUS|SIGTRAP/) {
            crash_count[execname(), sig_pid, sig_name]++
            printf("[%s] 进程 %s (PID: %d) 收到致命信号 %s\n", 
                   ctime(gettimeofday_s()), execname(), sig_pid, sig_name)
            printf("  发送者: %s (PID: %d)\n", cmdline_str(), pid())
            printf("  当前工作目录: %s\n", cwd())
            printf("  进程命令行: %s\n", cmdline_str(sig_pid))
            printf("\n")
        }
    }
}

// 每60秒打印一次统计报告
probe timer.s(60) {
    printf("\n===== 进程崩溃统计报告 =====\n")
    if (@count(crash_count) > 0) {
        printf("%16s\t%8s\t%10s\t%8s\n", "进程名", "PID", "信号", "次数")
        foreach ([name, pid, sig] in crash_count+) {
            printf("%16s\t%8d\t%10s\t%8d\n", name, pid, sig, crash_count[name, pid, sig])
        }
    } else {
        printf("在过去60秒内没有检测到进程崩溃事件\n")
    }
    printf("============================\n\n")
}
```

##### 2.3 系统调用监控脚本

```bash
#!/usr/bin/stap
// 监控特定进程的系统调用，用于排查异常行为

probe begin {
    printf("开始监控系统调用，按Ctrl+C停止...\n")
    printf("%10s\t%12s\t%10s\t%8s\t%s\n", "时间", "进程名", "PID", "系统调用", "结果")
}

// 监控所有系统调用
probe syscall.* {
    // 可以添加过滤条件，比如只监控特定进程
    // if (execname() == "nginx" || pid() == target_pid) {
        printf("%10d\t%12s\t%10d\t%8s\t", 
               gettimeofday_s(), execname(), pid(), ppfunc())
    // }
}

probe syscall.*.return {
    // 只打印执行时间超过100ms的系统调用
    if (gettimeofday_us() - @entry(gettimeofday_us()) > 100000) {
        printf("%10d\t%12s\t%10d\t%8s\t返回值: %d (耗时: %dms)\n", 
               gettimeofday_s(), execname(), pid(), ppfunc(), 
               returnval(), (gettimeofday_us() - @entry(gettimeofday_us()))/1000)
    }
}

probe end {
    printf("监控已停止\n")
}
```

#### 3. systemtap排查服务崩溃的实际案例

当遇到难以定位的服务崩溃问题时，可以结合多个脚本进行综合分析：

```bash
# 场景：Nginx服务间歇性崩溃，但没有coredump文件

# 1. 首先运行崩溃监控脚本
stap crash_monitor.stp &

# 2. 同时运行IO监控脚本，检查是否存在IO问题
stap io_monitor.stp &

# 3. 针对Nginx进程运行系统调用监控
stap -e 'probe syscall.* { if (execname() == "nginx") { printf("%s\t%s\t%d\n", ctime(gettimeofday_s()), ppfunc(), pid()); } }'

# 4. 监控内存分配和释放
stap -e 'global alloc, free
probe process("/usr/sbin/nginx").function("malloc") { alloc[tid()] += $size }
probe process("/usr/sbin/nginx").function("free") { free[tid()] += $ptr }
probe timer.s(10) { printf("当前内存分配: %d bytes\n", @sum(alloc) - @sum(free)) }'

# 5. 当服务再次崩溃时，分析收集到的信息，定位问题根源
```
```
