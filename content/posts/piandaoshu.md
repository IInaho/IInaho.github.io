+++
authors = ["lzy"]
title = "偏导数"
date = "2025-03-15"
description = ""
tags = [
    "数学"
]
categories = [
    "数学"
]
+++


## 偏导数

偏导数是多元函数中用于衡量函数在某一自变量方向上变化率的概念。

对于多元函数，如\\(z = f(x,y)\\)，在固定其他自变量的情况下，对某一个自变量求导得到的导数就是偏导数。

例如，\\(f_x(x,y)\\)是\\(z = f(x,y)\\)对\\(x\\)的偏导数，计算时把\\(y\\)看作常数，按照一元函数求导法则对\\(x\\)求导。其几何意义是，\\(f_x(x_0,y_0)\\)表示曲面\\(z = f(x,y)\\)与平面\\(y = y_0\\)的交线在点\\((x_0,y_0,f(x_0,y_0))\\)处的切线对\\(x\\)轴的斜率。

## 求偏导数

对于公式\\(\sum_{i = 1}^{m}(y_i - wx_i - b)^2\\)，分别对\\(w\\)和\\(b\\)求偏导数，以下是具体步骤：

### 1. 对\\(b\\)求偏导数
- 设\\(L(w,b)=\sum_{i = 1}^{m}(y_i - wx_i - b)^2\\)，将\\(w\\)看作常数。
- 根据复合函数求导法则\\((u^n)^\prime = nu^{n - 1}u^\prime\\)，这里\\(u=y_i - wx_i - b\\)，\\(n = 2\\)。
- 对\\((y_i - wx_i - b)^2\\)关于\\(b\\)求导，可得：\\(\frac{\partial (y_i - wx_i - b)^2}{\partial b}=2(y_i - wx_i - b)\times(- 1)=-2(y_i - wx_i - b)\\)。
- 再对\\(L(w,b)\\)求偏导，因为求和符号对于求偏导运算可以分配，即\\(\frac{\partial}{\partial b}\sum_{i = 1}^{m}(y_i - wx_i - b)^2=\sum_{i = 1}^{m}\frac{\partial (y_i - wx_i - b)^2}{\partial b}\\)。
- 所以\\(\frac{\partial L(w,b)}{\partial b}=\sum_{i = 1}^{m}-2(y_i - wx_i - b)= -2\sum_{i = 1}^{m}(y_i - wx_i - b)\\)。

### 2. 对\\(w\\)求偏导数
- 同样设\\(L(w,b)=\sum_{i = 1}^{m}(y_i - wx_i - b)^2\\)，此时将\\(b\\)看作常数。
- 对\\((y_i - wx_i - b)^2\\)关于\\(w\\)求导，根据复合函数求导法则，\\(u=y_i - wx_i - b\\)，\\(n = 2\\)，\\(\frac{\partial u}{\partial w}=-x_i\\)。
- 则\\(\frac{\partial (y_i - wx_i - b)^2}{\partial w}=2(y_i - wx_i - b)\times(-x_i)=-2x_i(y_i - wx_i - b)\\)。
- 对\\(L(w,b)\\)求关于\\(w\\)的偏导数，\\(\frac{\partial L(w,b)}{\partial w}=\sum_{i = 1}^{m}\frac{\partial (y_i - wx_i - b)^2}{\partial w}\\)。
- 所以\\(\frac{\partial L(w,b)}{\partial w}=\sum_{i = 1}^{m}-2x_i(y_i - wx_i - b)=-2\sum_{i = 1}^{m}x_i(y_i - wx_i - b)\\) 。

在通过最小二乘法求解线性回归参数时，会令\\(\frac{\partial L(w,b)}{\partial b}=0\\)和\\(\frac{\partial L(w,b)}{\partial w}=0\\)，得到关于\\(w\\)和\\(b\\)的方程组，进而求解出\\(w\\)和\\(b\\)的最优值。 