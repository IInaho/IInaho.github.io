+++
authors = ["lzy"]
title = "manjaro 安装及美化"
date = "2025-02-24 15:42:00"
description = ""
tags = [
    "linux"
]
categories = [
    "技术文档"
]
+++

# manjaro 安装及美化

## Manjaro 的 Linux 内核管理

### 安装内核

```bash
mhwd-kernel -h                      #查看帮助
mhwd-kernel -li                     #列出已安装的内核
mhwd-kernel -l                      #列出可用内核
sudo mhwd-kernel -i linux515        #切换新内核
sudo mhwd-kernel -i linux515 rmc    #切换新内核替换现有内核，现有内核被删除
```

### 删除内核

```bash
sudo mhwd-kernel -r linux515            #删除内核
sudo pacman -R linux515-headers         #删除内核头文件
sudo pacman -R linux515-extramodules    #删除内核的额外模块
```

### 管理驱动

```bash
mhwd -h       #显示帮助
mhwd --pci    #列出pci设备和驱动程序配置
mhwd --usb    #列出USB设备和驱动程序配置
mhwd -li      #列出已安装的驱动程序配置
mhwd -lh      #识别并列出计算机硬件
mhwd -lh -d --pci    #列出通过pci连接的硬件的详细列表
mhwd -li -d --pci    #列出通过pci连接的硬件所使用的驱动程序详细列表
mhwd -l --pci        #获取所有可用驱动程序的列表
```

### 处理器微码

```bash
# 安装处理器微码(Intel处理器)
sudo pacman -S intel-ucode
# 安装处理器微码(AMD处理器)
sudo pacman -S amd-ucode
```

## 配置软件源

### 手动配置国内源

```bash
sudo vim /etc/pacman.d/mirrorlist
```

```bash
# manjaro 稳定源
# 中科大
Server = https://mirrors.ustc.edu.cn/manjaro/stable/$repo/$arch
# 清华源
Server = https://mirrors.tuna.tsinghua.edu.cn/manjaro/stable/$repo/$arch
# 上交源
Server = https://mirrors.sjtug.sjtu.edu.cn/manjaro/stable/$repo/$arch
# 浙大源
Server = https://mirrors.zju.edu.cn/manjaro/stable/$repo/$arch

# Archlinux 源
# 清华源
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
# 163 源
Server = http://mirrors.163.com/archlinux/$repo/os/$arch
# 阿里源
Server = http://mirrors.aliyun.com/archlinux/$repo/os/$arch
```

### 手动添加 archlinuxcn 社区源

```bash
vim /etc/pacman.conf             #添加archlinuxcn软件源
```

```bash
[archlinuxcn]
SigLevel = Optional TrustedOnly
# 阿里源
Server = https://mirrors.aliyun.com/archlinuxcn/$arch
# 163源
Server = http://mirrors.163.com/archlinux-cn/$arch
# 中科大源
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch

[arch4edu]
SigLevel = TrustAll
Server = https://mirrors.aliyun.com/arch4edu/$arch
Server = http://mirrors.163.com/arch4edu/$arch
```

### 手动配置 AUR 源

```bash
# （AUR）Arch User Repository
# AUR 包含了一些不被官方源收录的软件
yay --aururl "https://aur.tuna.tsinghua.edu.cn" --save    # 此源不可用
# 生成 ～/.config/yay/config.json 配置文件
yay -P -g    #查看配置
```

### 自动配置国内源

```bash
sudo pacmn-mirrors -i -c China -m rank    # 更新镜像排名
vim /etc/pacman.d/mirrorlist     # 这个文件，保存pacman国内软件源地址
```

## 系统基本配置

### 签名问题

```bash
pacman -Syu haveged
systemctl start haveged
systemctl enable haveged
# 清理签名
rm -rf /etc/pacman.d/gnupg
pacman-key --init  # 初始化key
pacman -Sy archlinux-keyring manjaro-keyring #同步key数据
pacman-key --populate manjaro    # 重新加载签名密钥
pacman-key --populate archlinux
pacman-key --refresh-keys        #更新所有密钥

sudo pacman -Syyu
sudo pacman -S archlinuxcn-keyring
pacman-key --populate archlinuxcn
pacman-key --refresh-keys    # 更新密钥

#修改keyserver
vim /etc/pacman.d/gnupg/gpg.conf
#修改keyserver
keyserver hkp://pgp.mit.edu:11371
# 或者 (80端口不可用)
keyserver hkps://hkps.pool.sks-keyservers.net:443
# 或者(IPV6不可用)
keyserver hkp://ipv4.pool.sks-keyservers.net:11371
# 通过代理更新
vim /etc/gnupg/dirmngr.conf and /etc/pacman.d/gnupg/dirmngr.conf
修改 honor-http-proxy

#修改/etc/pacman.conf
SigNever = Never
```

### 安装 Wifi 驱动

```bash
# 要关闭bios安全启动模式boot secure mod
lspci | grep Net             #查看网卡型号
yay -S rtw89-dkms-git        #安装rtw驱动
# RTL8852AE 无线网卡没有对应的驱动，需要安装rtw89驱动

pacman -Ss linux-headers     #查询可用的linux-headers
mhwd-kernel -li              #查询当前正在使用的内核版本
pacman -S linuxXX-headers    #安装符合内核版本的linux-headers
sudo modprobe rtw89pci       #开启驱动
sudo modprobe -r rtw89pci    #关闭驱动
```

### yay 包管理

```bash
sudo pacman -S yay    #安装yay
yay -Ps               #查看已安装软件
yay -u                #展示所有待更新的包
yay -Ss keyword       #搜索包
yay -Qs keyword       #查看已安装软件
yay -R pkg_name       #删除单个软件包，保留其依赖
yay -Rns pkg_name     #删除包及没有使用的依赖
yay -Sc    #清理软件包缓存
yay -Scc   #清理所有缓存文件
yay -U file.pkg.tar.xz    #安装本地包
yay -U http://www.example.com/repo/example.pkg.tar.xz    #安装远程包
yay -Sw    #下载包不安装
sudo pacman -R $(pacman -Qdtq)    #清理系统中无用的包
pacman -Qq             #列出所有本地软件包
pacman -Qqe            #列出所有显式安装
pacman -Qqd            #列出自动安装的包
pacman -Qqdt
```

### Paru 包管理

```bash
sudo pacman -S paru
# 优势在于可以用一行命令清除系统上所有不需要的包依赖项
```

### 配置环境软件

```bash
# 安装基础包，yay构建包会使用
yay -S base-devel

# 额外安装字体
sudo pacman -S adobe-source-han-serif-cn-fonts wqy-zenhei noto-fonts-cjk noto-fonts-emoji noto-fonts-extra
sudo locale    # 查看字符编码
localectl set-locale LANG=en_US.UTF-8

# 常用开发软件
sudo pacman -S git nodejs npm yarn
yay -S docker docker-compose

# 配置git
git config --global user.name  "inaho"
git config --global user.email "qq@aa.com"
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890

# 生成ssk-key
ssh-keygen -t rsa -C "qq@aa.com"
ssh-keygen -t ed25519 -C "qq@aa.com"

# docker默认是root用户
sudo groupadd docker              # 添加docker组
sudo gpasswd -a ${USER} docker    # 将用户添加到docker组
sudo systemctl restart docker
newgrp - docker                   # 切换会话到docker

# 花里胡哨
sudo pacman -S neofetch lolcat    # neofetch快速查看系统信息,lolcat彩色输出
ls | lolcat
```

### 输入法安装

```bash
# 安装输入法框架
yay -S fcitx5-im
vim ~/.pam_environment
```

```latex
GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE  DEFAULT=fcitx
XMODIFIERS    DEFAULT=\@im=fcitx
SDL_IM_MODULE DEFAULT=fcitx
```

```bash
yay -S fcitx5-rime            #安装输入法引擎
yay -S rime-cloverpinyin      #安装输入方案
vim ~/.local/share/fcitx5/rime/default.custom.yaml  #注意yaml缩进格式： 四个空格
```

```latex
patch:
  "menu/page_size": 5
  schema_list:
    - schema: clover
```

## KDE 界面美化

### 自用美化方案

```yaml
应用程序风格: Fusion
Plasma视觉风格: Blur-Glassy
窗口装饰元素: Utterly-Round
颜色: Breeze微风浅色
图标: McMojave-circle
登录屏幕: Sugar Candy
Yakuake配色: Utterly-Sweet
```

```bash
~/.local/share/plasma/look-and-feel/  # 存放全局主题
~/.local/share/plasma/desktoptheme/   # 存放 plasma 视觉风格
~/.local/share/plasma/plasmoids/      # 存放插件
~/.local/share/aurorae/themes/          # 存放窗口装饰
~/.local/share/color-schemes/          # 存放颜色
~/.local/share/icons/                  # 存放图标
~/.local/share/fonts/                  # 存放字体
~/.local/share/sddm/themes/              # 欢迎屏幕
~/.local/share/backgrounds/              # 壁纸
```

### 改善字体渲染效果

```bash
yay -S ttf-sarasa-gothic    #安装更纱字体
# 字体全部改为更纱黑体，字体DPi调整为140
vim ~/.fonts.conf        #调整字体展示优先级
# 配置终端字体
yay -S nerd-fonts-jetbrains-mono
# 字体选择 NotoSansMono Nerd Font 9pt
```

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias>
    <family>sans-serif</family>
    <prefer>
      <family>Sarasa Gothic SC</family>
      <family>Sarasa Gothic TC</family>
      <family>Sarasa Gothic J</family>
      <family>Sarasa Gothic K</family>
    </prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer>
      <family>Sarasa Mono SC</family>
      <family>Sarasa Mono TC</family>
      <family>Sarasa Mono J</family>
      <family>Sarasa Mono K</family>
    </prefer>
  </alias>
</fontconfig>
```

### KDE 高分屏缩放

```bash
xdpyinfo | grep -B 2 resolution    #查看当前分辨率
sudo vim /etc/sddm.conf.d/kde_settings.conf
[X11]
EnableHiDPI=true
ServerArguments=-nolisten tcp -dpi 192(当前分辨率*缩放倍数)
```

### Vscode 代码字体美化

```bash
yay -S ttf-fira-code    #安装连体字
# vscode进入设置搜索font，编辑settings.json内容如下
"editor.fontSize": 15,
"editor.fontWeight": "normal",
"editor.fontFamily": "Fira code",
"editor.fontLigatures": true,
```

## 好用的软件

### Clamav

```bash
pacman -S clamav
sudo freshclam    #更新病毒库
systemctl enable clamav-freshclam.service    #开机启动病毒库自动更新
systemctl enable clamav-daemon.service       #开机启动守护进程服务
clamscan -ri / --move=/home/virus/ --max-scansize=4000M
# -r 递归检查子目录    -i只打印受感染的病毒文件   --move 受感染的文件移至文件夹
# --max-scansize=4000M    支持扫描文件大小    -o 跳过打印ok文件
# --no-summary  不再结束时打印摘要    --bell  病毒检测响铃通知    -l 冲定向文件
# --remove 删除受感染的文件
sudo nice -n 15 clamscan && sudo clamscan --bell -i -r /home    #减少CPU
```

### Docsify 神器

```bash
proxychains npm i -g docsify-cli    #安装
docsify init ./docs    #初始化项目
# - index.html 入口文件
# - README.md 作为主页内容渲染
# - nojekyll 阻止GithubPages会忽略掉下划线开头的文件
docsify serve    #通过localhost:3000访问
```

### Systemd 分析工具

```bash
systemd-analyze                    #查看系统启动时间
systemd-analyze blame              #查看各项启动时间
systemd-analyze plot > plot.svg    #绘制启动过程的SVG图表
```

### 命令行回收站

```bash
yay -S trash-cli
trash-put        #删除文件和目录（仅放入回收站中）
trash-list       #列出被删除了的文件和目录
trash-restore    #从回收站中恢复文件或目录 trash.
trash-rm         #删除回收站中的文件
trash-empty      #清空回收站
```

### rar/7z 压缩工具

```bash
yay -S p7zip    # 7z格式压缩包(7z x file.tar
yay -S rar      # rar压缩包(unrar e test.tar)
```

### Openvpn 安装配置

```bash
yay -S openvpn         # 安装openvpn
/etc/openvpn/client    # ovpn文件路径
openvpn --config /etc/openvpc/client/xxxx.conf
```

### Clash 代理/终端代理

```bash
#科学上网
yay -S clash clash-for-windows-bin    #clash工具
yay -S nftables iproute2              #开启service mode
# 终端命令代理
yay -S proxychains
sudo nvim /etc/proxychains.conf    #编辑最后一行为代理IP:PORT
> proxychains [command]
export https_proxy="socks5://127.0.0.1:1080"
export https_proxy="127.0.0.1:1080"
export http_proxy="127.0.0.1:1080"
export http_proxy="http://用户名:密码@代理地址:代理端口" # 符号@用%40代替
# SwitchyOmega插件，自动分流规则(国内ip/国外ip)
# https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt
```

### V2xray 代理

```bash
yay -S v2raya  # v2rayA UI
yay -S xray    # v2ray-core
# 访问127.0.0.1:2017
```

### metasploit

> Metasploit（MSF）是一个免费的、可下载的框架，通过它可以很容易地获取、开发并对计算机软件漏洞实施攻击。它本身附带数百个已知软件漏洞，是一款专业级漏洞攻击工具

```bash
# 安装postgresql
yay -S postgres
postgres --version # 检查版本
# 创建用户
sudo -iu postgres
# 初始化数据目录
initdb -E UTF8 -D '/var/lib/postgres/data/'
# 开启数据库服务器
pg_ctl -D /var/lib/postgres/data/ -l 日志文件 start
# 启动服务
systemctl start postgresql
systemctl enable postgresql
# 进入数据库
psql
# 修改数据库密码
\password postgres
# 安装metasploit
yay -S metasploit
msfdb init    #初始化msf数据库
msfconsole    #进入控制台
```

### VNC 安装配置

```bash
# 安装vnc
yay -S tigervnc
vncpasswd # 设置连接密码
sudo vim /etc/tigervnc/vncserver.users    #添加连接用户
```

> :1=user

> :1 为 tcp 端口 5901(5900+1)，其他类推

```bash
sudo nano ~/.vnc/config # vnc配置文件

cd /usr/share/xsessions    #查看桌面环境
#添加内容
session=plasma
geometry=2560x1600
#localhost    屏蔽localhost
alwaysshared
```

```bash
systemctl enable vncserver@:1.service    #开机启动
systemctl start vncserver@:1.service    #启动vnc
systemctl status vncserver@:1.service    #查看vnc
systemctl stop vncserver@:1.service    #关闭vnc
```

### Timeshift 安装使用

```bash
yay -S timeshift                          #备份、回滚工具
sudo timeshift --list    #列出节点
sudo timeshift --restore --snapshot Name --skip-grub    #还原节点
```

### 安装 virtualbox

```bash
mhwd-kernel -li              #内核版本
yay -S virtualbox
yay -S linux515-virtualbox-host-modules
vboxmanage --version         #查看virtualbox版本
yay -S virtualbox-ext-oracle #安装拓展包
```

### 安装 cockpit

- cockpit 是好用的虚拟机管理软件
- 将 iso 镜像移动到 /var/lib/libvirt/images 路径下
- 虚拟机-> 网络-> 启动 default 并打开自启

```bash
yay -S cockpit cockpit-machines cockpit-packagekit cockpit-pcp cockpit-storaged
yay -S qemu
```

### 安装其他常用软件

```bash
yay -S tldr                        #安装tldr
yay -S ranger                      #安装终端文件浏览器
yay -S wps-office wps-office-mui-zh-cn    #安装wps
yay -S netease-cloud-music                #安装网易云
yay -S yesplaymusic                       #网易三方客户端
yay -S google-chrome                      #安装谷歌浏览器
yay -S baidunetdisk                       #安装百度网盘
yay -S wiznote                            #安装为知笔记
yay -S marktext-bin                       #md文件编辑器
yay -S xmind-bin                          #xmind思维导图, 装jre8
yay -S flameshot                          #截图工具
yay -S calibre                            #电子书管理器
yay -S supervisor                         #安装进程管理
yay -S mpv vlc                            #视频播放器
yay -S screenkey                          #显示按下的键
yay -S lazygit                            #懒人的git神器
yay -S telegram-desktop                   #安装telegram
yay -S mycli                              #mysql命令行神器
yay -S neovim                             #vim福音
nvim test.txt
yay -S figlet                             #生成logo
echo hello | figlet
yay -S cmatrix                        #矩阵雨
yay -S sl                             #火车
yay -S fortune-mod                    #名言
yay -S cowsay                         #牛对话
yay -S latte-dock                     #dock美化栏
yay -S visual-studio-code-bin         #安装vscode
yay -S bless                          #Hex编辑器
yay -S peek                           #gif制作器
yay -S tcpdump                        #抓包工具
yay -S obs-studio                     #录屏直播软件
yay -S todesk-bin                         #远程控制软件
sudo systemctl restart todeskd.service    #启用服务,否则无法连接
yay -S mysql-workbench                #mysql客户端
yay -S kmail                          #邮箱客户端
yay -S dingtalk-bin                   #安装钉钉
yay -S nmap                           #安装nmap扫描工具
yay -S balena-etcher                  #镜像刻录
yay -S feishu-bin          #飞书
yay -S fzf                 #模糊搜索
yay -S fd                  #加强版find
yay -S ripgrep             #加强版grep
yay -S jq                  # 格式化json，cat log.json | jq
yay -S htop glances gtop   #增强版top,3种
yay -S ctop                #docker命令行监控
yay -S traceroute          #追踪网络数据包的路由途径
#portainer是docker的ui监控
docker pull portainer/portainer
docker run -d --name portainer -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
localhost:9000
yay -S bat       #增强版cat
yay -S httpie    #增强版curl
yay -S exa lsd   #增强版ls
yay -S mycli     #mysql命令行增强版
yay -S cloc      #统计代码行数、空白
yay -S duf       #增强版df
```

### 游戏工具

```bash
yay -S steam    # 使用proton Experimental运行win游戏
yay -S hmcl     # Minecraft的第三方启动器，无法登录微软账户
```

### 其他命令

```bash
rm ~/.zhistory        #删除命令记录
vimtutor              #vim教学
```
