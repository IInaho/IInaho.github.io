+++
authors = ["lzy"]
title = "oh-my-zsh 终端美化"
date = "2025-02-20"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

# oh-my-zsh 终端美化

## 安装 zsh

```bash
yay -S zsh
chsh -s /bin/zsh # 设置默认终端
```

## 安装 oh-my-zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 或者
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

> 注意：安装过程中要同意使用 Oh-my-zsh 的配置模板覆盖已有的 `.zshrc`

如果之前在使用 `bash` 时自定义了一些环境变量、别名等，那么在切换到 `zsh` 后，你需要手动迁移这些自定义配置

## 自定义主题

```bash
sudo wget -O $ZSH_CUSTOM/themes/haoomz.zsh-theme https://cdn.haoyep.com/gh/leegical/Blog_img/zsh/haoomz.zsh-theme

vim ~/.zshrc
ZSH_THEME="haoomz"
source ~/.zshrc
```

查看所有 zsh 内置的主题样式和对应的主题名

```bash
cd ~/.oh-my-zsh/themes && ls
```

## 安装插件

### **zsh -autosuggestions**

[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 是一个命令提示插件，当你输入命令时，会自动推测你可能需要输入的命令，按下右键可以快速采用建议。

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 中国用户可以使用下面任意一个加速下载# 加速1git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速2git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速3git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### **zsh-syntax-highlighting**

[zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) 是一个命令语法校验插件，在输入命令的过程中，若指令不合法，则指令显示为红色，若指令合法就会显示为绿色。

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 中国用户可以使用下面任意一个加速下载
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### 内置插件

- `oh-my-zsh` 内置了 `z` 插件。`z` 是一个文件夹快捷跳转插件，对于曾经跳转过的目录，只需要输入最终目标文件夹名称，就可以快速跳转，避免再输入长串路径，提高切换文件夹的效率。
- `oh-my-zsh` 内置了 `extract` 插件。`extract` 用于解压任何压缩文件，不必根据压缩文件的后缀名来记忆压缩软件。使用 `x` 命令即可解压文件。
- oh-my-zsh 内置了 `web-search` 插件。`web-search` 能让我们在命令行中使用搜索引擎进行搜索。使用 `搜索引擎关键字+搜索内容` 即可自动打开浏览器进行搜索。

```bash
x test.tar.gz # x命令

google 天气预报 # web-search
baidu 新闻
```

## 启用插件

```bash
# 修改~/.zshrc中插件列表
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
source ~/.zshrc
```

## root 用户

当配置好登陆用户的 zsh 后，如果使用 `sudo su` 命令进入 `root` 用户的终端，发现还是默认的 `bash`。建议在 `root` 用户的终端下，也安装 `on my zsh`，设置与普通用户不同的主题以便区分，插件可以使用一样的。 `root` 用户的 `~/.zshrc` 配置，仅供参考：

```bash
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
# 或
plugins=(git colored-man-pages colorize cp man command-not-found sudo suse ubuntu archlinux zsh-navigation-tools z extract history-substring-search python zsh-autosuggestions zsh-syntax-highlighting)
```

## 配置本地代理

如果配置了本地代理，并希望终端的 git 等命令使用代理，那么可以在 `~/.zshrc` 中添加

```bash
# 为 curl wget git 等设置代理
proxy () {
  export ALL_PROXY="socks5://127.0.0.1:1089"
  export all_proxy="socks5://127.0.0.1:1089"
}

# 取消代理
unproxy () {
  unset ALL_PROXY
  unset all_proxy
}
```

使用 `git` 等命令之前，只需要在终端中输入 `proxy` 命令，即可使用本地代理

## 卸载 Oh My Zsh

```bash
uninstall_oh_my_zsh
Are you sure you want to remove Oh My Zsh? [y/N]  Y
```

## 手动更新 Oh My Zsh

```bash
upgrade_oh_my_zsh
```
