+++
authors = ["lzy"]
title = "串、数组和广义表"
date = "2020-05-14"
description = ""
tags = [
    "数据结构"
]
categories = [
    "计算机基础知识"
]
series = ["数据结构相关文章"]
+++

# 字符串

## 串的定义

串(String)(或字符串)是由零个或多个字符组成的有限序列,一般记为

$$ s=a_1a_2 \cdots a_n \quad(n \geq 0) $$

- 串中字符的数目 n 称为串的长度，零个字符的串称为空串，长度为零。
- 串中任意个连续的字符组成的子序列称为该串的子串，包含子串的串相应地称为主串。
- 两个串长度相等，并且各个对应位置的字符都相等时才相等。
- 一个或多个空格组成的串称为空格串

## 串的抽象类型定义

```c
StrAssign(&T,Chars)        //chars是字符串常量，生成一个其值等于chars的串T
StrCopy(&T,S)            //串存在，由串S复制得串T
StrEmpty(S)                //串存在，判断S是否为空串
StrCompare(S,T)            //串S与T存在，若S>T返回值>0,S=T,返回值=0，S<T,返回值<0
StrLength(S)            //串存在，返回S的元素个数，称为串的长度
ClearString(&S)            //串存在，将S清为空串
Concat(&T,S1,S2)        //串S1与S2存在，用T返回S1与S2拼接的新串
SubString(&Sub,S,pos,len)    //串存在，1<=pos<=StrLength(S)且0<=len<=Strlength(S)-pos+1，用Sub返回串S的第pos个字串起长度为len的字串
Index(S,T,pos)            //串S和T存在，T是非空串，1<=pos<=StrLength(S)，若主串S中存在和串T值相同的字串，则返回它在主串S中第pos个字符之后第一次出现的位置，否则函数值为0
Replace(&S,T,V)            //S,T,V存在，T是非空串，用V替换主串S中出现的所有与T相等的不重叠的字串
StrInsert(&S,pos,T)        //串S与T存在，T是非空串，用V替换主串S中出现的所有与T相等的不重叠的子串
StrDelete(&S,pos,len)    //串S存在，1<=pos<=StrLength(S)-len+1，从串S中删除第pos个字符起长度为len的字串
DestroyString(&S)        //串存在，销魂串
```

## 串的存储结构

### 串的顺序存储

#### 串的定长顺序存储结构

```c
#define MAXLEN 255
typedef struct{
    char ch[MAXLEN+1];        //储存串的一维数组
    int length;                //串的长度
}SString;
```

#### 串的堆式顺序存储结构

```c
typedef struct{
    char *ch;                //若是非空串，则按串长分配存储区，否则ch为NULL
    int length;                //串的当前长度
}HString;
```

### 串的顺序存储简易代码

用一组地址连续的存储单元存储串的字符序列，为了根据实际需要，在程序执行过程中动态分配和释放字符数组空间，使用堆式顺序存储结构。

**堆式顺序存储结构举例**：

```c
typedef struct {
    char *ch;
    int length;
}HString;
int StrAssign(HString *s,const char chars[]) {
    int i = 0;
    while (chars[i] != NULL) {
        i++;
    }
    s->ch = (char*)malloc(sizeof(char)*i);
    if (s->ch == NULL) return -1;
    s->length = i;
    for (int j = 0; j < i; j++) {
        s->ch[j] = chars[j];
    }
    return 1;
}
int StrCopy(HString *t,HString s) {
    t->ch = (char*)malloc(sizeof(char)*s.length);
    t->length = s.length;
    for (int i = 0; i < s.length; i++) {
        t->ch[i] = s.ch[i];
    }
    return 1;
}
int StrEmpty(HString s) {
    if (s.length == 0) return true;
    return false;
}
int StrCompare(HString s,HString t) {
    int i = 0;
    int Min_length = (s.length < t.length) ? s.length : t.length;
    while (s.ch[i] == t.ch[i]) {
        if (i = Min_length) return 0;
        i++;
    }
    if (s.ch[i] > t.ch[i])return 1;
    if (s.ch[i] < t.ch[i])return -1;
}
int StrLength(HString s) {
    return s.length;
}
void ClearString(HString *s) {
    char  *temp = s->ch;
    s->ch = NULL;
    free(temp);
    s->length = 0;
}
void Concat(HString *t,HString s1, HString s2) {
    t->length = s1.length + s2.length;
    t->ch = (char*)malloc(sizeof(char)*(t->length));
    int i = 0, j = 0;
    while (i < s1.length) {
        t->ch[i] = s1.ch[i];
        i++;
    }
    while (j < s2.length) {
        t->ch[i] = s2.ch[j];
        j++;
        i++;
    }
}
void SubString(HString *sub,HString s,int pos,int len) {
    sub->length = len;
    sub->ch = (char*)malloc(sizeof(char)*len);
    int i = pos+1; int j = 0;
    while (i < s.length) {
        sub->ch[j] = s.ch[i];
        i++;
        j++;
    }
}
void DestroyString(HString *s) {
    char *temp = s->ch;
    free(s->ch);
    free(s);
}
void StrPrint(HString s) {
    int i = 0;
    while (i < s.length) {
        cout << s.ch[i];
        i++;
    }
    cout << endl;
}
//测试
int main() {
    HString s;
    StrAssign(&s, "abcdefg");        //根据字符串常量生成字符串
    HString t;
    StrCopy(&t, s);        //复制串s
    HString a;
    StrAssign(&a, "xcvbad");
    cout << StrCompare(s, t) << endl;        //比较字符串
    cout << StrLength(a) << endl;            //返回字符串长度
    HString  b;
    Concat(&b, s, a);                        //拼凑字符串
    HString c;
    SubString(&c, s, 1, 3);                    //返回s串从1位置起长度为3的子串
    StrPrint(c);
    StrPrint(b);
    StrPrint(t);
    //StrPrint(s);
    getchar();
    return 0;
}
```

### 串的链式存储结构

顺序串插入与删除并不方便，需要移动大量字符，因此使用单链表方式存储串。

如果所存的串元素数量很大，串链中的结点数据域可以采用数组的结构对串进行遍历时间上的优化.

如果串的元素比较少，那么使用普通的字符类型作为结点的数据域更加节省空间。

**数组加链表，代码举例**

```c
#define CHUNKSIZE 3
typedef struct Chunk {
    char ch[CHUNKSIZE];
    struct Chunk *next;
}Chunk;
typedef  struct {
    Chunk *head, *tail;
    int Chunk_num;
    int length;                                                //字符串字符数量
}LString;
void StrAssign(LString *s, const char chars[]) {
    int chars_len = 0;                                        //常量字符长度
    int nowChunk_num = 0;                                    //当前已有块数
    s->Chunk_num = 0;
    while (chars[chars_len] != NULL) {
        chars_len++;
    }
    s->Chunk_num = (chars_len / CHUNKSIZE)+1;                    //串链块数
    s->length = chars_len;
    //串申请
    if (chars_len != 0) {
        s->head = (Chunk*)malloc(sizeof(Chunk));
        s->tail = s->head;
        nowChunk_num++;
    }
    while (nowChunk_num < s->Chunk_num) {                        //申请块
        Chunk* temp = (Chunk*)malloc(sizeof(Chunk));
        s->tail->next = temp;
        s->tail = s->tail->next;
        s->tail->next = NULL;
        nowChunk_num++;
    }
    // 串赋值
    int chars_p = 0;                                        //chars字符当前位置
    Chunk* p = NULL;
    if(s->head != NULL) p = s->head;                        //串当前指针
    while (p != NULL) {
        for (int i = 0; (i < CHUNKSIZE && chars_p < chars_len); i++, chars_p++) {
            p->ch[i] = chars[chars_p];
        }
        p = p->next;
    }
}
void StrPrint(LString s) {
    Chunk *p = s.head;
    while (p != NULL) {
        for (int i = 0; i < CHUNKSIZE; i++) {
            if(p->ch[i] >=0 && p->ch[i] <= 127)
            cout << p->ch[i];
            else continue;
        }p = p->next;
    }
    cout << endl;
}
int StrCopy(LString *t, LString s) {
    t->length = s.length;
    t->Chunk_num = 0;
    Chunk *s_p = NULL;                //s块指针
    Chunk *t_p = NULL;                //t块指针
    if (s.head != NULL) {
        t->head = (Chunk*)malloc(sizeof(Chunk));
        t->tail = t->head;
        t->Chunk_num++;
    }
    while (t->Chunk_num <s.Chunk_num) {        //t.申请块
        Chunk *temp = (Chunk*)malloc(sizeof(Chunk));
        t->tail->next = temp;
        t->tail = t->tail->next;
        t->tail->next = NULL;
        t->Chunk_num++;
    }
    t_p = t->head;
    s_p = s.head;
    while (s_p != NULL && t_p != NULL) {
        int j = 0;
        for (int i = 0; i < CHUNKSIZE && j < s.length; i++, j++) {
            t_p->ch[i] = s_p->ch[i];
        }
        s_p = s_p->next;
        t_p = t_p->next;
    }
    return 1;
}
int StrEmpty(LString s) {
    if(s.head == NULL) return 1;
    return 0;
}
int StrCompare(LString s, LString t) {
    Chunk *sp = s.head;
    Chunk *tp = t.head;
    int nowl = 0;
    while (sp != NULL && tp != NULL) {
        if (sp == NULL && tp == NULL)return 0;
        for (int i = 0; i < CHUNKSIZE; i++) {
            if (sp->ch[i] == tp->ch[i]) {
                nowl++;
                if (nowl > 3) {
                    nowl = 0;
                    break;
                }continue;
            }
            if (sp->ch[i] > tp->ch[i]) return 1;
            if (sp->ch[i] < tp->ch[i]) return -1;
        }
        sp = sp->next; tp = tp->next;
    }
    return 1;
}
int StrLength(LString s) {
    return s.length;
}
int ClearString(LString *s) {
    while (s->head != NULL) {
        Chunk* temp = s->head;
        s->head = s->head->next;
        free(temp);
    }
    s->Chunk_num = 0;
    s->length = 0;
    s->head = NULL;
    s->tail = NULL;
    return 1;
}
int Concat(LString *t, LString s1, LString s2) {
    //不浪费空间的连接法，直接连接两个字符串的空间地址
    /*t->length = s1.length + s2.length;
    t->Chunk_num = s1.Chunk_num + s2.Chunk_num;
    t->head = s1.head;
    t->tail = s1.tail;
    t->tail->next = s2.head;
    t->tail = s2.tail;*/

    //重新分配空间
    t->length = s1.length + s2.length;
    t->Chunk_num = t->length / CHUNKSIZE +1;
    LString s1temp;
    LString s2temp;
    StrCopy(&s1temp, s1);
    StrCopy(&s2temp, s2);
    t->head = s1temp.head;
    s1temp.tail->next = s2temp.head;
    t->tail = s2temp.tail;
    return 1;

}
int DestroyString(LString *s) {
    while (s->head != NULL) {
        Chunk* temp = s->head;
        s->head = s->head->next;
        free(temp);
    }
    free(s);
    return 1;
}

//需要模式匹配算法，后面介绍
void Index() {}
void Replace() {}
//与链表增删同理
void StrInsert() {}
void StrDelete() {}

//测试
int main() {
    LString s,t,d,a;
    StrAssign(&s, "assfaasfasjkfkhqhnkqwjnfjkhqnjkfbjakbnfjkanfkjqwbjkfndMMMM");
    StrAssign(&d, "asdfghsaesadsadasdadsafsaffdgdj");
    StrCopy(&t, s);
    //cout << StrCompare(s, d)<<endl;
    Concat(&a, s, t);
    StrPrint(a);
    getchar();
    return 0;
}
```

### 串的模式匹配算法

字串的定位运算通常称为串的模式匹配或串匹配。

串的模式匹配设有两个字符串 S 和 T，设 S 为主串，也称为正文串，设 T 为子串，也称为模式。在主串 S 中查找与模式 T 相匹配的子串，如果匹配成功，确定相匹配的子串中的第一个字符在主串 S 中出现的位置，著名的算法为：

- BF 算法
- KMP 算法

#### BF 算法

模式匹算法配不一定是从主串的第一个位置开始，可以指定主串中查找的起始位置 pos，如果采用字符串顺序存储结构，可以写出不依赖于其他串操作的匹配算法。

最好情况下匹配成功的平均比较次数为：

$$ \sum_{i=1}^{n-m+1} p_i(i-1+m) = \frac{1}{n-m+1}\sum_{i=1}^{n-m+1}(i-1+m) = \frac{1}{2}(n+m) $$

最坏情况下匹配成功的平均比较次数为：

$$ \sum_{i=1}^{n-m+1} p_i(i \times m) = \frac{1}{n-m+1}\sum_{i=1}^{n-m+1}(i \times m) = \frac{1}{2}m \times (n-m+2) $$

算法步骤：

- 分别利用计数指针 i 和 j 指示主串 S 和模式 T 中当前正待比较的字符位置，i 初值为 pos,j 初值为 1.
- 如果两个串均为比较到串尾，即 i 和 j 均分别小于等于 S 和 T 的长度时，则循环执行以下操作

  - S.ch[i]和 T.ch[j]比较，若相等，则 i 与 j 分别指示串中下一个位置，继续比较后续字符
  - 若不等，指针后退重新开始匹配，从主串的下一个字符(i=i-j+2)起再重新和模式的第一个字符 j=1 比较。
- 如果 j>T.length，说明模式 T 中的每个字符依次和主串 S 中的一个连续的字符序列相等，则匹配成功，返回和模式 T 中第一个字符相等的字符在主串 S 中的序号。

简易代码示例：

```c
int  Cal_length(char s[]) {        //求数组长度
    int len = 0;
    while (s[len]) {
        len++;
    }
    return len;
}
int Index_BF(char s[], char t[], int pos) {
    int i = pos; int j = 0;
    int i_length = Cal_length(s);
    int t_length = Cal_length(t);
    while (i < i_length && j < t_length) {
        if (s[i] == t[j]) { i++; j++; }
        else { i = i - j + 1; j = 0; }
    }
    if (j >= t_length) { return i - t_length; }
    else return 0;
}
int main() {
    char ch[] = "asdfabcgfdsh";
    char ch1[] = "abc";
    cout << Index_BF(ch, ch1, 2);
    getchar();
    return 0;
}
```

#### KMP 算法

- KMP 算法其实是针对 BF 算法的优化，因为 BF 算法依次逐位进行匹配，如果出现匹配失败，主串 i 的值需要回溯到起始的下一个位置，j 的值回溯到 0，重新开始匹配。
- KMP 算法需要计算 next 数组，并根据 next 数组的对应值回溯 j，next[i]指的是前 i 位子串的最大相同的前缀后缀的长度，子串计算 next 数组的值实际上是利用子串自己匹配自己，将对应的值存入 next 数组。
- KMP 算法只需要利用已匹配的信息，根据 next 数组的值回溯 j 的值，而主串 i 的值不需要回溯，因此提高了匹配的效率。
- KMP 算法的核心是当失配后，j 的值应该如何回溯，因此 k=next[k]是 KMP 算法的精髓，网上有大量博客讲述 KMP 算法，因此由于本人理解有限，并不在此详细叙述算法过程，给出下例代码仅供参考。

**KMP 算法代码如下**：

```c
void getNext(char t[], int next[]) {
    int t_length = strlen(t);
    next[0] = -1;
    int k = -1;
    for (int j = 0; j < t_length - 1;) {        //最后一位不比
        if (k == -1 || t[j] == t[k]) {
            ++k; ++j;
            next[j] = k;
        }
        else  k = next[k];                //KMP算法的精髓
    }
        //00012123001120000,00012000001000000
}
int KMP(char s[], char t[], int pos) {
    int i = pos; 
    int j = -1;
    int i_length = strlen(s);
    int t_length = strlen(t);
    //得到next数组
    int* next = (int*)malloc(sizeof(int)*t_length);        //根据子串的长度动态分配
    getNext(t, next);

    //优化之后主串的i不需要回溯，只需要回溯子串j的位置
    while (i < i_length && j < t_length) {
        if (j == -1 || s[i] == t[j]) { i++; j++; }
        else { j = next[j]; }         //s[i] != t[j]并且j != -1的情况下，根据next的值回溯j
    }
    if (j >= t_length) { return i - j; }    //总长 - 匹配成功的子串长
    else return 0;
}
//测试
int main() {
    char s[] = "dsadsadsafsaf abcababccbaabc gqegqwdsad";
    char t[] = "abcababccbaabc";
    cout<<KMP(s, t, 1);
    getchar();
    return 0;
}
```

# 数组

## 数组类型的定义

- 数组是由类型相同的数据元素构成的有序集合，每个元素称为数组元素。
- 每个元素受 n(n≥1)个线性关系的约束
- 每个元素在 n 个线性关系中的序号 $i_1$,$i_2$…称为该元素的下表
- 数组可以看成线性表的推广，特点是结构中的元素本身可以是具有某种结构的数据，但属于同一数据类型。
- 二维数组可以看成数据元素是线性表的线性表
- 数组一旦被定义，它的维数和维界就不再改变，除了结构的初始化和销毁之外，数组只有存取元素和修改元素值的操作

### 抽象数据类型 ADT 定义

```c
InitArray(&A,n,boundi,...,boundn)    //若维数n与各维长度合法，构造相应的数组A
DestroyArray(&A)                    //销毁数组A
Value(A,&e,index1,...,indexn)        //若各下标不超界，则e赋值为所指定的A的元素值
Assign(&A,e,index1,...,indexn)        //若下标不超界，则按e的值赋给所指定的A的元素
```

## 数组的顺序存储

假设每个数据元素占 L 个存储单元，则二维数组 A[0..m-1,0..n-1] (即从下标开始一共 m 行 n 列)中任一元素$a_{ij}$的存储位置可由下式确定

$$ LOC(i,j)=LOC(0,0)+(n×i+j)L $$

式中，$LOC(i,j)$是$a_{ij}$的存储位置

数组的存储方式分为：

- 以列序为主序
- 以行序为主序

## **特殊矩阵的压缩处理**

### **对称矩阵**

- 若 n 阶矩阵 A 中的元素满足$a_{ij} = a_{ji}$则称为 n 阶对称矩阵
- 对称矩阵可以为每一对对称元分配一个存储空间，则可以将 $2^n$个元压缩到$n(n+1)/2$ 个元空间中
- 对称矩阵与压缩矩阵的对应关系为：

$$ A_{ij} = b_{((i(i-1)/2)+j-1)}, (i \geq j) $$

$$ A_{ij} = b_{((j(j-1)/2)+i-1)}, (i < j) $$

### **三角矩阵**

n 阶上三角矩阵，压缩矩阵与原矩阵的对应关系为

$$ A_{ij} = b_{((i-1)(2n-i+2)/2)+(j-i)}, (i \leq j) $$

$$ A_{ij} = b_{(n(n+1)/2)}, (i > j) $$

n 阶下三角矩阵，压缩矩阵与原矩阵的对应关系为

$$ A_{ij} = b_{((i(i-1)/2)+j-1)}, (i \geq j) $$

$$ A_{ij} = b_{(n(n+1)/2)}, (i < j) $$

三角矩阵以主对角线划分，存储三角矩阵只需要存储矩阵的上三角或下三角中的元素，再加一个存储常数 c 的存储空间即可。

### **对角矩阵**

- 对角矩阵所有的非零元都集中在以主对角线为中心的带状区域
- 除了集中在对角线区域之外，其他元素都为0

#### 对称矩阵压缩代码示例

```c
/* 假设矩阵需要压缩存储
2 1 2 3 4 5
1 2 8 9 5 6
2 8 2 3 7 6
3 9 3 2 9 4
4 5 7 9 2 1
5 6 6 4 1 2
*/
#define N 6                            //矩阵行列数
#define N_y N*(N+1)/2                //压缩后的大小
int* GetCompreM(int a[][N]) {        //压缩矩阵
    int k = 0;
    int *b = (int*)malloc(sizeof(int)*N_y);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j <= i; j++) {
            b[k++] = a[i][j];
        }
    }
    return b;
}
int GetValue(int *b,int i,int j) {    //根据压缩矩阵计算原矩阵的值
    if (i >= j) return b[(i*(i - 1) / 2) + j - 1];
    if (i < j) return b[(j*(j - 1) / 2) + i - 1];
    return 0;
}
//测试
int main() {
    int a[N][N] = {{2,1,2,3,4,5},{1,2,8,9,5,6},{2,8,2,3,7,6},{3,9,3,2,9,4},{4,5,7,9,2,1},{5,6,6,4,1,2}};
    int *b = GetCompreM(a);
    cout << GetValue(b, 5, 4);
    getchar();
    return 0;
}
```

#### 三角矩阵定义示例

```c
#define N 6
typedef struct{
    int b[N*(N+1)/2];
    int c;    
};
```

## 稀疏矩阵

稀疏矩阵是指其非零元较零元少，且分布没有一定规律，称之为稀疏矩阵。

稀疏矩阵的一般的压缩存储分为两种方式：

- 三元组存储
- 十字链表存储

### 三元组压缩存储

由于稀疏矩阵零元较多，如果采取普通的矩阵存储，会浪费大量的存储空间，因此引出三元组存储方法，只需要存储非零元的值即可，因此需要存储非零元的横列下标以及对应的值。

三元组结构定义如下：

```c
#define MAXSIZE 10
typedef struct {
    int row,col;    //原矩阵的行列号
    int data;        //原矩阵对应的值
}node;
typedef struct {
    int i,j;        //原矩阵的行列数
    int NodeNum;    //原矩阵非零元个数
    node data[MAXSIZE];    //存放原矩阵非零元的三元组表
};
```

#### 三元组存稀疏矩阵代码示例

```c
/*以下稀疏矩阵为例
0 0 0 1 0 2
0 2 1 0 0 0
0 0 0 6 0 0
0 1 0 0 0 7
0 0 0 0 0 0
*/
typedef struct {
    int row, col;    //原矩阵的行列号
    int data;        //原矩阵对应的值
}node;
typedef struct {
    int i, j;        //原矩阵的行列数
    int NodeNum;    //原矩阵非零元个数
    node *data;    //存放原矩阵非零元的三元组表
}ThrList;
int CreateThr(ThrList *s,int a[][6]) {        //压缩存储
    s->data = (node*)malloc(sizeof(node) * 7);
    s->NodeNum = 0;
    int k = 0;
    s->i = 5;
    s->j = 6;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 6; j++) {
            if (a[i][j] != 0) {
                s->data[k].col = i;
                s->data[k].row = j;
                s->data[k++].data = a[i][j];
                s->NodeNum++;
            }
        }
    }
    return 1;
}
void PrintThr(ThrList s) {                    //打印
    for (int i = 0; i < s.NodeNum; i++) {
        cout << s.data[i].data;
    }
}
int GetValue(ThrList s,int i,int j) {        //取值
    for (int k = 0; k < s.NodeNum; k++) {
        if (s.data[k].col == i && s.data[k].row == j) {
            return s.data[k].data;
        }
    }
    return 0;
}
//测试
int main() {
    int a[5][6] = { { 0, 0, 0, 1, 0, 2 }, { 0, 2, 1, 0, 0, 0 }, { 0, 0, 0, 6, 0, 0 }, { 0, 1, 0, 0, 0, 7 }, { 0, 0, 0, 0, 0, 0 } };
    ThrList s;
    CreateThr(&s,a);
    //PrintThr(s);
    cout << GetValue(s, 3, 5);
    getchar();
    return 0;
}
```

### 十字链表

十字链表也可以对稀疏矩阵进行压缩存储，对于压缩存储稀疏矩阵，无论是使用三元组顺序表，还是使用行逻辑链接的顺序表，归根结底是使用数组存储稀疏矩阵。

介于数组 “不利于插入和删除数据” 的特点，以上两种压缩存储方式都不适合解决类似 “向矩阵中添加或删除非 0 元素” 的问题。

在图结构中，有向图可以用两个邻接矩阵进行表示，而有向图的存储需要使用对应矩阵的邻接表与逆邻接表，为了减少存储空间，使用十字链表结合了邻接表与逆邻接表。

本文暂不叙述十字链表的存储方式，会在学习图之后进行补充。

# 广义表

## 广义表的定义

广义表是线性表的推广，也称为列表，广义表一般记作

$$ LS=(a_1,a_2,...,a_n) $$

LS 是广义表的名称，n 是其长度，在广义表的定义中，$a_i$可以是单个元素也可以是广义表，分别称为广义表 LS 的原子或子表，一般小写字母表示原子，大写字母表示广义表，广义表的定义是一个递归的定义，下面为广义表举例

- A=(),A 为空表
- B=(e),B 只有一个原子 e
- C=(a,(b,c,d)),C 有两个元素，一个是原子 a，另一个是子表(b,c,d)
- D=(A,B,C),D 表含有三个子表
- E=(a,E),E 为一个递归表，每一层都有一个原子 e 与表 E

## 广义表的重要结论

1. 广义表的元素可以是广义表，即广义表可以多层次的结构
2. 广义表的深度定义为所含括弧的重数，其中原子的深度为 0，空表的深度为 1
3. 广义表的长度定义为最外层包含元素个数
4. 广义表可以为其他广义表共享，即称为其他广义表的子表，或者包含其他广义表
5. 任何一个非空广义表均可分解为表头和表尾两部分
6. 广义表可以是递归的表

## 广义表的运算及定义

```c
GetLength(&g) //求广义表的长度
GetDepth(&g)  //求广义表的深度
PrintGL(&g)      //打印广义表
CreateGL()      //建立广义表
//头尾链表存储结构
typedef enum { ATOM, LIST } ElemTag; /* ATOM=0，表示原子；LIST=1，表示子表*/
typedef struct GLNode{
    ElemTag tag; /*标志位tag用来区别原子结点和表结点*/
    union{
        AtomType atom; /*原子结点的值域atom*/
        struct { struct GLNode * hp, *tp; } htp; /*表结点的指针域htp， 包括表头指针域hp和表尾指针域tp*/
    } atom_htp; /* atom_htp 是原子结点的值域atom和表结点的指针域htp的联合体域*/
} *GList；

//扩展性链表存储结构
typedef enum { ATOM, LIST } ElemTag;
typedef struct GLNode{
    ELemTag tag;
    union{
        AtomType atom;
        struct GLNode *hp;
    }
    struct GLNode *ht;
}*GList;
```

## 广义表的存储结构

广义表的数据元素有不同的结构，因此一般使用链式存储结构，常用的链式存储结构有两种：

- 头尾链表的存储结构

  - 确定的表头和表尾可唯一确定广义表
  - 表结点由三个域组成：标志域，表头指针域，表尾指针域
  - 原子结点分为两个域：标志域和值域
  - 标志域用于判断元素是原子还是子表
- 扩展性链表的存储结构

  - 无论原子结点还是表表结点均由三个域组成
