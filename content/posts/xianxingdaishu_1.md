+++
authors = ["lzy"]
title = "向量计算"
date = "2025-03-15"
description = ""
tags = [
    "数学"
]
categories = [
    "数学"
]
+++

## 向量乘法

### 列向量与行向量相乘

设列向量\\(\boldsymbol{a}=\begin{bmatrix}a_1\\\\a_2\\\\\vdots\\\\a_m\end{bmatrix}\\)，行向量 \\(\boldsymbol{b} = [b_1,b_2,\cdots,b_n]\\)。

根据矩阵乘法规则，当列向量\\(\boldsymbol{a}\\)（\\(m\times1\\)矩阵）与行向量\\(\boldsymbol{b}\\)（\\(1\times n\\)矩阵）相乘时，要求前者的列数等于后者的行数，这里满足条件。

它们相乘的结果\\(\boldsymbol{a}\boldsymbol{b}=\begin{bmatrix}a_1b_1&a_1b_2&\cdots&a_1b_n\\\\a_2b_1&a_2b_2&\cdots&a_2b_n\\\\\vdots&\vdots&\ddots&\vdots\\\\a_mb_1&a_mb_2&\cdots&a_mb_n\end{bmatrix}\\) ，是一个\\(m\times n\\)的矩阵。
 
而如果是行向量乘列向量，即\\(\boldsymbol{b}\boldsymbol{a} = [b_1,b_2,\cdots,b_n]\begin{bmatrix}a_1\\\\a_2\\\\\vdots\\\\a_m\end{bmatrix}\\) ，当\\(m = n\)时，结果是一个 \(1\times1\\) 的矩阵，也就是一个标量，值为\\(\sum_{i = 1}^{n}b_ia_i\\) 。 


### 行向量与列向量相乘

同样设\\(n\\)维列向量\\(\boldsymbol{\alpha}=\begin{bmatrix}a_1\\\\a_2\\\\\vdots\\\\a_n\end{bmatrix}\\)，\\(n\\)维行向量\\(\boldsymbol{\beta} = \begin{bmatrix}b_1&b_2&\cdots&b_n\end{bmatrix}\\)，此时运算要将行向量的各元素与列向量对应位置元素相乘，再把这些乘积相加，最终结果是一个标量（数值），即\\(\boldsymbol{\beta}\boldsymbol{\alpha} =a_1b_1 + a_2b_2 + \cdots + a_nb_n\\) 。
