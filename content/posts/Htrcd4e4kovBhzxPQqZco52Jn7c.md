+++
authors = ["lzy"]
title = "高斯约旦消元法"
date = "2020-01-16"
description = ""
tags = [
    "数学"
]
categories = [
    "数学"
]
+++

# 高斯约旦消元法

# 线性系统

矩阵更准确的说是对线性系统的描述，所谓的线性系统指的是例如 3x + 4y + z = 8 之类的线性方程组，未知数只能是一次方项。而非线性方程则例如 sin(x) = Π 等坐标图上呈曲线的方程组。

## 消元法解线性方程

在小学初中我们学过如何用消元法解线性方程组，例如 x + y = 2；2x + 3y = 12；的线性方程组，我们可以用第二个方程减去二倍的第一个方程，然后便可以消去 x，得到 y 的值，然后将 y 带入第一个方程，我们便可以得到 x 与 y 的值，即线性方程组的解。

## 高斯消元法

学习矩阵的概念之后，我们可以将方程组的系数拿下来组成系数矩阵，然后基于矩阵的操作去得到线性方程组的解，例如 x + y + z = 6；2x + y + z = 7；x + y + 2z = 9;将其系数拿下来之后，我们可以得到矩阵

1 1 1

2 1 1

1 1 2

将方程组的结果也拿下来可以得到该矩阵的增广矩阵

1 1 1 | 6

2 1 1 | 7

1 1 2 | 9

经过第二行减二倍的第一行后，我们可以得到

1 1 1 | 6

0 -1 -1 |-5

1 1 2 | 9

然后用第三行减去第一行，可以得到

1 1 1 | 6

0 -1 -1 |-5

0 0 1 | 3

将第二行乘以-1，可以得到最终的矩阵

1 1 1 | 6

0 1 1 | 5

0 0 1 | 3

此矩阵最后一行的 1 则代表 z 的值，通过回代，便可得到 x 与 y 的值。通过观察，我们可以发现结果矩阵的对角线元素都为 1，而矩阵的下一行总比上一行多一个 0，我们将每一行的第一个 1 称为此行的主元，我们把第 i-1 行根据第 i 行的主元进而不断消去一个未知数的方法称为高斯消元法。

## 高斯约旦消元法

通过以上的消元,最终我们只能得到最后一个未知数的值，上述矩阵，可以写成以下方程组

x + y + z =6;

y + z = 5;

z = 3;

通过回代的方式，可以得到 x，y，z 的值，但还是有一些麻烦。针对此矩阵，我们还可以在进行变换，将第二行减去第三行可得

1 1 1 | 6

0 1 0 | 2

0 0 1 | 3

将第一行减去第三行可得

1 1 0 | 3

0 1 0 | 2

0 0 1 | 3

将第一行减去第二行可得

1 0 0 | 1

0 1 0 | 2

0 0 1 | 3

进行这样的变换后，便可以直观的看出 x，y，z 的值，而坐标的系数矩阵则化成了单位矩阵，这种向下消元然后向上消元的方法被称为高斯约旦法。主要分为两个过程：

### 前向过程(从上到下)

1. 选择最上的主元，化为 1
2. 主元下面的所有行减去主元所在行的某个倍数，使得主元下面所有元素都为 0

### 后向过程(从下到上)

1. 选择最下的主元
2. 主元上面的所有行减去主元所在行的某个倍数，使得主元上面所有元素都为 0

### python 代码演示

```python
from .Matrix import Matrix
from .Vector import Vector

class LinearSystem:
    def __init__(self,A,b):
        assert A.row_num() == len(b),"row number of A must be equal to the length"
        self._m = A.row_num()
        self._n = A.col_num()
        assert self._m == self._n # TODO: no this restriction
        self.Ab = [Vector(A.row_vector(i).underlying_list()+[b[i]])
                   for i in range(self._m)]

    def _max_row(self,index,n):
        best,ret = self.Ab[index][index],index
        for i in range(index + 1,n):
            if self.Ab[i][index] < best:
                best,ret = self.Ab[i][index],i
        return ret

    def _forward(self):
        n = self._m
        for i in range(n):
            # Ab[i][i]为主元
            max_row = self._max_row(i,n)
            self.Ab[i],self.Ab[max_row] = self.Ab[max_row],self.Ab[i]
            # 将主元归一
            self.Ab[i] = self.Ab[i] / self.Ab[i][i] #TODO: self.Ab[i][i] == 0
            for j in range(i+1,n):
                self.Ab[j] = self.Ab[j] - self.Ab[j][i] * self.Ab[i]

    def _backward(self):
        n = self._m
        for i in range(n-1,-1,-1):
            for j in range(i-1,-1,-1):
                self.Ab[j] = self.Ab[j] - self.Ab[j][i] * self.Ab[i]

    def gauss_jordan_elimination(self):
        self._forward()
        self._backward()

    def fancy_print(self):
        for i in range(self._m):
            print(" ".join(str(self.Ab[i][j]) for j in range(self._n)),end=" ")
            print("|",self.Ab[i][-1])
```

### 测试代码

```python
from playLA.Matrix import Matrix
from playLA.Vector import Vector
from playLA.LinearSystem import LinearSystem

if __name__ == "__main__":
    A = Matrix([[1,1,1],[2,1,1],[1,1,2]])
    b = Vector([6,7,9])
    Ab = LinearSystem(A,b)
    Ab.gauss_jordan_elimination()
    Ab.fancy_print()
```
