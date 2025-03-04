+++
authors = ["lzy"]
title = "Assume总结"
date = "2020-11-04"
description = ""
tags = [
    "CPP"
]
categories = [
    "技术文档"
]
+++


# Assume总结

## 概念介绍

- 机器语言，计算机将高低电平转换为 0-1 数字，在 x86 处理器中，指令与数据以同等地位保存在存储器中，每一种微处理器都有机器指令集，也就是机器语言。
- 存储单元，8086CPU 中，一个字为 2 个字节，一个字节为 8 比特，存储单元包括寄存器、主存、现存等等。
- 内存地址空间，CPU 通过主板上的总线与各个设备的寄存器以及各存储器相连，在物理上，这些存储器并没有连接在一起，但在逻辑上它们组成一个连续的内存空间，称为内存地址空间。
- 寄存器，用于信息存储，汇编语言是通过寄存器来实现对 CPU 的控制，8086CPU 的所有寄存器为 16 位。
- 寻址方法，8086CPU 采用两个 16 位地址合成的方法来形成 20 位的物理地址，一个称为段地址，一个称为偏移地址，实际物理地址=段地址*16+ 偏移地址
- 中断向量表，当发生中断时，CPU 要执行中断处理程序，而中断处理程序的入口地址是通过中断向量表找到的，也就是说中断向量表也就是各个中断处理程序的入口地址的列表，8086CPU 中，中断向量表放在内存 0 处，从 0：0 到 0：03FF 的 1024 个单元存放中断向量表。
- 端口及端口地址空间，PC 机系统中，CPU 通过总线和各种芯片相连，包括各种存储器，接口卡上的芯片以及主板上的接口芯片，这些芯片中都有一组可以有 CPU 读写的寄存器，这些寄存器与 CPU 的总线相连，CPU 通过向其芯片发送端口读写命令实现读或写，从 CPU 的角度将这些寄存器都当作端口，进行统一编址，从而建立统一的端口地址空间，每个端口在此空间中都有一个地址。

## 寄存器

8086CPU 中，寄存器有 16 种，分别为 AX、BX、CX、DX、SI、DI、SP、BP、IP、CS、SS、DS、ES、PSW，其中 AX、BX、CX、DX 被称为通用寄存器，用于存放一般性的数据，这四种寄存器可以分成两个独立的 8 位寄存器来使用，例如 AX 可分为 AH 和 AL，BX 可分为 BH 和 BL 等。

- CS 寄存器，代码段寄存器，存放指令在内存中的段地址
- IP 寄存器，指令指针寄存器，存放指令在内存某段的具体位置，与 CS 寄存器组合来确定指令在内存的具体位置。
- DS 寄存器，用于存放数据的短地址，例如 DS:[8]，代表段地址保存在 ds 寄存器中，偏移地址为 8，也可以隐式使用,例如写成[8]，则默认段地址保存在 DS 寄存器中。
- ES 寄存器,段地址寄存器,与 DS 功能类似,但必须显式使用.
- SS 寄存器，栈顶的段地址寄存器
- SP 寄存器，栈的偏移地址寄存器，与 SS 寄存器组合，始终指向栈顶.
- CX 寄存器，通常存放循环次数,与 loop 指令联用.
- SI 寄存器,与 BX 功能相近的寄存器,通常使用 DS:[si]代表数据源
- DI 寄存器,与 BX 功能相近的寄存器,通常使用 ES:[di]代表目的地址
- BP 寄存器,与 SI、DI 功能类似，可以在[]中进行内存单元寻址。
- PSW，标志位寄存器。

  - 标志 1 0
  - OF，OV、NV，是否溢出
  - SF，NG、PL，判断正负
  - ZF，ZR、NZ，是否为 0
  - PF，PE、PO，判断奇偶
  - CF，CY、NC，是否进位
  - DF，DN、UP，方向标志位

## 指令大全

debug 指令，用于实模式 8086 方式的程序调试

- R 命令查看、修改 CPU 寄存器的内容
- D 命令查看内存中的内容
- E 命令改写内存中的内容
- U 命令将内存中的机器指令翻译成汇编指令
- T 命令执行一条机器指令
- A 命令以汇编形式在内存中写入一条机器指令

masm 指令，用于汇编器编译源代码

link 指令，用于连接相关文件形成可执行文件

assume 操作符，用于将标号所在段和一个段寄存器联系起来。

mov 指令，用于数据的移动

```c
mov ax,18    ;将数值18移入ax寄存器
mov al,18    ;将数值18移入al寄存器，也就是ax的低8位
```

add 指令，用于将数值与寄存器的内容相加，并存入寄存器

```c
add ax,18    ;将ax寄存器的内容加18，结果存入ax寄存器
add ax,bx    ;将ax的内容与bx的内容相加，结果存入bx寄存器
```

adc 指令，带进位的加法指令，比 add 指令多加了 CF 位的值。

sub 指令，寄存器的内容与某数值相减，结果存入寄存器

```c
sub ax,ax    ;ax的内容减去ax的内容，结果存入ax
```

jmp 指令，跳转指令，用于修改 CS 与 IP 实现程序的跳转

```c
jmp 0000：0010        ;跳转到0000：0010地址处
jmp short s            ;实现段内段转移，转移到标号s处，ip修改范围-128-127
jmp near ptr s        ;段内近转移，(IP)=(IP)+16位位移
jmp far ptr s        ;段间转移,CS为标号所在段的段地址，IP是标号在段中的偏移地址
jmp ax                ;修改IP寄存器的值为ax
```

push 指令与 pop 指令，用于栈操作

```c
push ax        ;将ax的值存入栈中
pop  ax        ;将栈顶的数据存入ax中
```

loop 指令,循环指令,每次循环使 cx 寄存器的值减 1,然后跳到标号处,如果 cx 的值为 0,则循环结束.

```c
loop 标号    ;判断cx的值是否为0,如果不为零则跳转标号处,然后使cx的值自减
```

inc 指令与 dec 指令,使寄存器的值加一或减一

```c
inc ax        ;使ax的值增1
dec ax        ;使ax的值减1
```

dw 操作符,用于定义字型数据,db 用于定义字节型数据，dd 用于定义双字型数据

```c
dw 0123h,0456h,0789h
db 11h,12h,13h
dd 01230456h
```

dup 操作符，用于进行数据的重复

```c
db 128 dup(0)    ;定义了128个db型数据，其值都为0
```

and 指令,逻辑与指令,按位进行与运算

```c
mov al,01100011B
and al,00111011B
al = 00100011B
```

or 指令,逻辑或指令,按位进行或运算

```c
mov al,01100011B
or al,00111011B
al = 01111011B
```

div 除法指令，除数有 8 位和 16 位两种，在一个寄存器或内存单元中，被除数默认放在 AX 或 DX 和 AX 中，如果除数为 8 位，被除数为 16 位，放在 AX 中。如果除数为 16 位，被除数为 32 位，DX 存放高 16 位，AX 存放低 16 位。

```c
div reg                    ;AX除reg中的内容
div word ptr es:[0]        ;16位除法
div byte ptr [bx]        ;8位除法
```

offset 操作符，用于取得标号的偏移地址

```c
mov bx,offset s            ;将标号s的地址给bx寄存器
```

seg 操作符，用于取得标号所在段地址

jcxz 指令，如果 cx 为零，则跳转

```c
jcxz s            ;如果cx为0，则跳转到s标号处
```

ret 指令，用栈中数据，修改 IP 的内容，相当于 pop IP

retf 指令，用栈中数据，修改 CS 和 IP 的内容，相当于 pop IP 与 pop CS 指令

call 指令，将 CS 与 IP 压入栈中，然后在转移，通常和 ret 指令配合使用，实现函数功能。

```c
call s        ;将CS与IP的值压入栈中，然后跳转到s标号处
s: ret        ;将栈中数据，修改CS与IP的内容，跳到call指令后
```

mul 指令，乘法指令，两个相乘的数要么都是 8 位，要么都是 16 位，如果是 8 位，一个放在 AL 中，另一个放在 8 位 reg 或内存单元中，结果存放在 AX 中。如果都是 16 位，一个放在 AX 中，另一个放在 16 位 reg 或内存单元中，结果高位在 DX 中，低位在 AX 中。

```c
mul byte ptr ds:[0]        ;8位乘法
mul word ptr [bx]        ;16位乘法
```

cmp 指令，比较指令，执行后改变标志位寄存器相应位置的值，与下列指令可以配合使用

- je 指令，等于则转移
- jne 指令，不等于则转移
- jb 指令，低于则转移
- jnb 指令，不低于则转移
- ja，高于则转移
- jna 指令，不高于则转移

movsb 指令，将 ds:si 指向的内存单元中的字节送入 es:di 中，然后根据标志寄存器 df 位的值，将 si 和 di 递增或递减，movsw 则是将 si 或 di 递增 2 或递减 2

rep 指令，根据 cx 的值，重复执行后面的传传送指令，通常写法为 rep movsp 或 rep movsw

cld 指令，将标志寄存器 df 置 0

std 指令，将标志寄存器 df 置 1

pushf 指令，将标志寄存器置压栈

popf 指令，从栈中弹出数据，送入标志寄存器

int 指令，中断指令

```c
int n        ;n为中断类型码
```

iret 指令，中断返回指令，相当于 pop cs，pop ip，popf

shl 指令与 shr 指令，移位指令，shl 将最后移出的位写入 CF,shr 与其相反。

```c
mov al,01001000b
shl al,1
al=10010000b,cf=0

mov al,01001000b
mov cl,2
shl al,cl
al=00100000b,cf=1

mov al,01001000b
shr al,1
al=00100100b,cf=0
```

sti 命令与 cli 命令，sti 设置 IF 为 1，cli 设置 IF 为 0，如果 IF 为 1，则 CPU 执行完当前指令后响应中断，如果 IF 为 0，则不响应可屏蔽中断.
