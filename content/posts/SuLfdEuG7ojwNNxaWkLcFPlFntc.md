+++
authors = ["lzy"]
title = "银行家算法"
date = "2020-11-05"
description = ""
tags = [
    "CPP"
]
categories = [
    "技术文档"
]
+++

# 银行家算法

## 简介

银行家算法（Banker’s Algorithm）是一个避免死锁（Deadlock）的著名算法，是由艾兹格·迪杰斯特拉在 1965 年为 T.H.E 系统设计的一种避免死锁产生的算法。它以银行借贷系统的分配策略为基础，判断并保证系统的安全运行。

## 算法原理

我们可以把操作系统看作是银行家，操作系统管理的资源相当于银行家管理的资金，进程向操作系统请求分配资源相当于用户向银行家贷款。

为保证资金的安全，银行家规定：

- 当一个顾客对资金的最大需求量不超过银行家现有的资金时就可接纳该顾客；
- 顾客可以分期贷款，但贷款的总数不能超过最大需求量；
- 当银行家现有的资金不能满足顾客尚需的贷款数额时，对顾客的贷款可推迟支付，但总能使顾客在有限的时间里得到贷款；
- 当顾客得到所需的全部资金后，一定能在有限的时间里归还所有的资金.

操作系统按照银行家制定的规则为进程分配资源，当进程首次申请资源时，要测试该进程对资源的最大需求量，如果系统现存的资源可以满足它的最大需求量则按当前的申请量分配资源，否则就推迟分配。

当进程在执行中继续申请资源时，先测试该进程本次申请的资源数是否超过了该资源所剩余的总量。若超过则拒绝分配资源，若能满足则按当前的申请量分配资源，否则也要推迟分配。

## 算法详述

设 Request；是进程 Pi 的请求向量，如果 Requesti[j] = K，表示进程 Pi 需要 K 个 Rj 类型的资源。当 Pi 发出资源请求后，系统按下述步骤进行检査:

1. 如果 Requesti[j] ≤ Need[i,j]便转向步骤(2)；否则认为出错，因为它所需要的资源数已超过它所宣布的最大值。
2. 如果 Requesti[j] ≤ Available[j]，便转向步骤(3)；否则，表示尚无足够资源，Pi 须等待。
3. 系统试探着把资源分配给进程 Pi，并修改下面数据结构中的数值

   - Available[j] = Available[j] - Requesti[j];
   - Allocation[i,j] = Allocation[i,j] + Requesti[j];
   - Need[i,j] = Need[i,j] - Requesti[j];
4. 系统执行安全性算法，检查此次资源分配后系统是否处于安全状态。若安全，才正式将资源分配给进程 Pi，以完成本次分配；否则，将本次的试探分配作废，恢复原来的资源分配状态，让进程 Pi 等待。

## 安全性算法

系统所执行的安全性算法可描述如下:

1. 设置两个向量

   1. Work:它表示系统可提供给进程继续运行所需的各类资源数目，它含有 m 个元素，在执行安全算法开始时，Work = Available。
   2. Finish:它表示系统是否有足够的资源分配给进程，使之运行完成。开始时先做 Finish[i] = false；当有足够资源分配给进程时，再令 Finish[i] = true。
2. 从进程集合中找到一个能满足下述条件的进程，若找到执行步骤(3)，否则执行步骤(4)。

   - Finish[i] = false;
   - Need[i,j] ≤ Work[j];
3. 当进程 Pi 获得资源后，可顺利执行，直至完成，并释放出分配给它的资源，故应执行:

   - Work[j] = Work[j] + Allocation[i,j];
   - Finish[i] = true;
   - go to step 2;
4. 如果所有进程的 Finish[i] =true 都满足，则表示系统处于安全状态；否则，系统处于不安全状态。

## 代码示例

```c
#include <vector>
#include <iostream>
#include <algorithm>

using std::cin;
using std::cout;
using std::cerr;
using std::vector;
using std::endl;

const int m = 3;    //资源种类
const int n = 5;    //进程数量

//打印函数
void print_Vex(int avail[], int Max[][m], int Alloca[][m], int Need[][m]) {    
    cout << "===============================================" << endl;
    cout << "进程    MAX    ALLO    Need    avail" << endl;
    for (int i = 0; i < n; i++) {
        cout << "P" << i << "    ";
        for (int j = 0; j < m; j++) {
            cout << Max[i][j] << " ";
        }
        cout << "    ";
        for (int j = 0; j < m; j++) {
            cout << Alloca[i][j] << " ";
        }
        cout << "    ";
        for (int j = 0; j < m; j++) {
            cout << Need[i][j] << " ";
        }
        if (i == 0) {
            cout << "    ";
            for (int i = 0; i < m; i++) {
                cout << avail[i] << " ";
            }
        }
        cout << endl;
    }
    cout << "===============================================" << endl;
}
//安全性算法
bool Banker_safe(int avail[], int max[][m], int allo[][m], int need[][m]) {

    //====================参数设定及初始化操作=======================
    vector<int> safeNum;                                                    //安全序列
    int work[m]{ 0 };                                                        //表示系统可提供给进程继续运行所需的各类资源数目
    for (auto i = 0; i < m; i++) { work[i] = avail[i]; }                    //初始化work
    bool Finish[n] = { false };                                                //表示系统是否有足够资源分配给进程

    //已结束的进程不参与安全性检查
    for (auto i = 0,jishu = 0; i < n; i++) {
        for (auto j = 0; j < m; j++) {
            if (max[i][j] == 0) jishu++; else break;
            if (jishu == 3) Finish[i] = true;
        }
    }
    //==========================算法步骤=============================
    int i = 0;
    while (i < n) {
        int cal = 0;
        for (auto j = 0; j < m; j++) {
            if (Finish[i] == false && need[i][j] <= work[j]) {
                if (++cal == m) {
                    for (auto j = 0; j < m; j++) work[j] = work[j] + allo[i][j];
                    safeNum.push_back(i);
                    Finish[i] = true;
                    i = 0; break;
                }
            } else { i++; break; }
        }
    }
    //==========================判断是否安全=============================
    int sum = 0;
    while (Finish[sum++] == true) {
        if (sum == n - 1) {
            cout << "系统安全！安全序列为：";
            std::for_each(safeNum.begin(), safeNum.end(), [](int x) {cout << x << " "; });
            cout << endl;
            return true;
        }
    }
    return false;
}
int main() {

    int Available[m] = { 3,3,2 };                                            //可利用资源向量
    int Max[n][m] = { {7,5,3},{3,2,2},{9,0,2},{2,2,2},{4,3,3} };            //最大需求矩阵，Max[i][j] = K代表进程i需要j类型的资源最大数目为K个
    int Allocation[n][m] = { {0,1,0},{2,0,0},{3,0,2},{2,1,1},{0,0,2} };        //分配矩阵，Allocation[i][j] = K代表进程i当前分得j类资源为k个
    int Need[n][m] = { {7,4,3},{1,2,2},{6,0,0},{0,1,1},{4,3,1} };            //需求矩阵，Need[i][j] = K代表进程i还需要j类资源K个才能完成任务
    int Request[m] = { 0 };                                                    //请求向量，Request[j] = K代表进程需要j类资源K个
    bool safe = 0;                                                            //判断是否安全

    if (!Banker_safe(Available, Max, Allocation, Need)) {                    //判断预设资源是否足够分配，输出安全序列
        cerr << "安全性检查未通过！" << endl;
        return 0;
    }
    print_Vex(Available, Max, Allocation, Need);

    int i;                                                                    //进程号
    cout << "输入需要分配资源的进程号: ";
    while (cin >> i) {

        //=====================输入操作=========================
        cout << "输入分配的各类资源数目: ";
        for (auto i = 0; i < m; i++) {
            cin >> Request[i];
        }
        cout << endl;
        system("cls");
        //==============判断资源是否超过最大值==================
        int jishu{ 0 };
        for (auto j = 0; j < m; j++) {
            if (Request[j] <= Need[i][j]) jishu++;
            else {
                cerr << "所需资源已超过最大值" << endl; break;
            }
        }
        //=================判断是否有足够资源==================
        if (jishu == m) {
            jishu = 0;
            for (auto j = 0; j < m; j++) {
                if (Request[j] <= Available[j]) jishu++;
                else {
                    cerr << "尚无足够资源，进程需要等待" << endl; break;
                }
            }
        }
        //====================尝试分配资源=====================
        if (jishu == m) {
            for (auto j = 0; j < m; j++) {
                Available[j] = Available[j] - Request[j];
                Allocation[i][j] = Allocation[i][j] + Request[j];
                Need[i][j] = Need[i][j] - Request[j];
            }
            if (!Banker_safe(Available, Max, Allocation, Need)) {            //安全性检查未通过则恢复资源
                for (auto j = 0; j < m; j++) {
                    Available[j] = Available[j] + Request[j];
                    Allocation[i][j] = Allocation[i][j] - Request[j];
                    Need[i][j] = Need[i][j] + Request[j];
                } cerr << "未通过安全性检查，分配失败！" << endl;
            }
            //==========分配完成后，判断进程是否执行完毕===========
            else {
                cout <<"已分配成功" << endl;
                int jishu1{ 0 };
                for (auto j = 0; j < m; j++) {
                    if (Need[i][j] == 0) jishu1++; else break;
                    if (jishu1 == 3) {
                        for (auto k = 0; k < m; k++) {
                            Available[k] += Allocation[i][k];
                            Allocation[i][k] = 0;
                            Max[i][k] = 0;
                            Need[i][k] = 0;
                        }
                        cout << "进程" << i << "已执行完毕，" << "释放资源！" << endl;
                    }
                }
            } print_Vex(Available, Max, Allocation, Need);
        } cout << "输入需要分配资源的进程号: ";
    } cout << "程序结束" << endl;
    return 0;
}
```
