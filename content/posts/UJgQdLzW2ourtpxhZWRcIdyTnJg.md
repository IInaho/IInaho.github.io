+++
authors = ["lzy"]
title = "Linux Namespace"
date = "2025-09-10"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

## namspace 创建
每个 namespace 在创建的时候会自动创建一个回环接口 `lo` ，默认不启用，可以通过 `ip link set lo up` 启用

```bash
ip netns ls        # 查看ns列表
ip netns add {ns}  # 添加ns
ip netns del {ns}  # 删除ns
ip netns exec {ns} {command}    # 在ns中执行命令
```

- 示例
```bash
# 创建两个ns
ip netns add ns_0
ip netns add ns_1
ip netns ls
```

## namespace 网络

- 新创建的 namespace 默认不能和主机网络，以及其他 namespace 通信
- 使用 Linux 提供的 `veth pair` 来完成通信

![](../static/BNi5bf1QtoJ1WlxupiWcQhp9nUs.png)

- 创建 veth pair

![](../static/KjB6bGGaFo1qgwx14UUcKdqAngf.png)

```bash
# 创建一对veth
ip link add <veth name> type veth peer name <peer name>
# 查看veth
ip link ls type veth
# 将veth xx加入到namespace yy中
ip link set <veth name> netns <ns name>
# 给veth pair配上ip地址
ip netns exec <ns name> ip link set <veth name> up
```

## 示例

```bash
# 创建一对veth并移动到两个ns
ip link add veth_0 type veth peer name veth_1
ip link set veth_0 netns ns_0
ip link set veth_1 netns ns_1
# 启用
ip netns exec ns_0 ip link set veth_0 up
ip netns exec ns_1 ip link set veth_1 up
# 查看ip地址
ip netns exec ns_0 ip addr
ip netns exec ns_1 ip addr
# 配置ip地址
ip netns exec ns_0 ip addr add 10.1.1.1/24 dev veth_0
ip netns exec ns_1 ip addr add 10.1.1.2/24 dev veth_1
# 查看路由表
ip netns exec ns_0 ip route
ip netns exec ns_1 ip route
# 测试连接
ip netns exec ns_0 ping 10.1.1.2
```

### 使用 bridge 来转接

![](../static/Qa4zbIsFwoBg6zxlxB3cZ8JSnXc.png)

```bash
# 新建一个bridge
ip link add br0 type bridge
ip link set dev br0 up

# 创建 3 个 veth pair
ip link add type veth
ip link add type veth
ip link add type veth

# 配置第 1 个 net0
ip link set dev veth1 netns net0
ip netns exec net0 ip link set dev veth1 name eth0
ip netns exec net0 ip addr add 10.0.1.1/24 dev eth0
ip netns exec net0 ip link set dev eth0 up
ip link set dev veth0 master br0
ip link set dev veth0 up

# 配置第 2 个 net1
ip link set dev veth3 netns net1
ip netns exec net1 ip link set dev veth3 name eth0
ip netns exec net1 ip addr add 10.0.1.2/24 dev eth0
ip netns exec net1 ip link set dev eth0 up
ip link set dev veth2 master br0
ip link set dev veth2 up

# 配置第 3 个 net2
ip link set dev veth5 netns net2
ip netns exec net2 ip link set dev veth5 name eth0
ip netns exec net2 ip addr add 10.0.1.3/24 dev eth0
ip netns exec net2 ip link set dev eth0 up
ip link set dev veth4 master br0
ip link set dev veth4 up
```

docker 为了安全性，将 iptables 里面 filter 表的 FORWARD 链的默认策略设置成了 drop，所有不符合 docker 规则的数据包都不会被 forward，导致 ping 不通

### 为 br0 添加一条 iptables 规则

```bash
iptables -A FORWARD -i br0 -j ACCEPT
```
