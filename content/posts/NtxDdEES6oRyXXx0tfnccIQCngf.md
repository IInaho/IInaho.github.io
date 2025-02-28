+++
authors = ["lzy"]
title = "ssl证书介绍"
date = "2025-02-28"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

# ssl 证书介绍

## 证书相关文件格式

证书相关文件有多种格式，常见格式：.crt，.key，.req，.csr，.pem，.der

```bash
xx.crt：证书文件
xx.key：私钥文件
xx.req：请求文件
xx.csr：请求文件
xx.pem：证书文件为 pem 格式（文本文件）
xx.der：证书文件为 der 格式（二进制文件）
```

### pem 格式的文件为文本文件

证书文件：

```bash
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
```

私钥文件：

```bash
-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----
```

请求文件：

```bash
-----BEGIN CERTIFICATE REQUEST-----
-----END CERTIFICATE REQUEST-----
```

## 证书种类

证书分为根证书、服务器证书、客户端证书。

根证书文件（ca.crt）和根证书对应的私钥文件（ca.key）由 CA（证书授权中心，国际认可）生成和保管

### 服务器如何获得证书

向 CA 申请步骤

1. 服务器生成自己的公钥（server.pub）和私钥（server.key）。后续通信过程中，客户端使用该公钥加密通信数据，服务端使用对应的私钥解密接收到的客户端的数据；
2. 服务器使用公钥生成请求文件（server.req），请求文件中包含服务器的相关信息，比如域名、公钥、组织机构等；
3. 服务器将 server.req 发送给 CA。CA 验证服务器合法后，使用 ca.key 和 server.req 生成证书文件（server.crt）——使用私钥生成证书的签名数据；
4. CA 将证书文件（server.crt）发送给服务器。

由于 ca.key 和 ca.crt 是一对，ca.crt 文件中包含公钥，因此 ca.crt 可以验证 server.crt 是否合法——使用公钥验证证书的签名。

## 验证方式

单向验证是指通信双方中一方验证另一方是否合法。通常是指客户端验证服务器。

```bash
客户端需要：ca.crt(公钥)
服务器需要：server.crt(服务器公钥,用于验证是否合法)，server.key(私钥)
```

## CFSSL

[CloudFlare's PKI/TLS toolkit](https://github.com/cloudflare/cfssl)

证书生成示例,生成 kubernetes 证书

### CA 证书生成

新建 CA 配置文件

```shell
cat > ca-config.json <<EOF
{
  "signing": {
    "default": {
      "expiry": "8760h"
    },
    "profiles": {
      "kubernetes": {
        "usages": ["signing", "key encipherment", "server auth", "client auth"],
        "expiry": "8760h"
      }
    }
  }
}
EOF
```

新建 CA 凭证签发请求文件:

```shell
cat > ca-csr.json <<EOF
{
  "CN": "Kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "China",
      "L": "Shanghai",
      "O": "Kubernetes",
      "OU": "Shanghai",
      "ST": "Shanghai"
    }
  ]
}
EOF
```

生成 CA 凭证和私钥:

```shell
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

结果将生成以下两个文件：

```
ca-key.pem
ca.pem
```

### 签发 Kubelet 客户端凭证

给每台 worker 节点创建凭证和私钥：

```bash
# 此处只给 worker-1 创建，若你有多个 worker 节点，请替换相应的值并继续操作
export WORKER1_HOSTNAME=worker-1
# 请替换为你所用节点的 IP
export WORKER1_IP=192.168.1.1
cat > worker-1-csr.json <<EOF
{
  "CN": "system:node:${WORKER1_HOSTNAME}",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "China",
      "L": "Shanghai",
      "O": "system:nodes",
      "OU": "Kubernetes",
      "ST": "Shanghai"
    }
  ]
}
EOF
cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -hostname=${WORKER1_HOSTNAME},${WORKER1_IP} \
  -profile=kubernetes \
  worker-1-csr.json | cfssljson -bare worker-1
```

结果将产生以下几个文件：

```
worker-1-key.pem
worker-1.pem
```

### 查看证书信息

```bash
# local certificate files
cfssl certinfo -cert ca.pem
# local CSR file
cfssl certinfo -csr ca.csr
```

## OpenSSL

查看证书内容

```bash
# check a Certificate Signing Request (CSR)
openssl req -text -noout -verify -in CSR.csr
# Check a private key
openssl rsa -in privateKey.key -check
# Check a certificate
openssl x509 -in certificate.crt -text -noout
# Check a PKCS#12 file (.pfx or .p12)
openssl pkcs12 -info -in keyStore.p12

# 提取证书内容
host=www.example.com
port=443
openssl s_client -showcerts -connect ${host}:${port} < /dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p'
```
