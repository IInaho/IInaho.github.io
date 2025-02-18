+++
authors = ["lzy"]
title = "线性表"
date = "2020-05-11"
description = ""
tags = [
    "数据结构"
]
categories = [
    "技术文档"
]
series = ["数据结构相关文章"]
+++

# 线性表

## 线性表的定义

线性结构的基本特点是除第一个元素无直接前驱，最后一个元素无直接后继之外，其他每个数据元素都有一个前驱和后继。

同一线性表中的元素必定具有相同的特性，即同属于同一数据对象，相邻数据元素之间存在着序偶关系。

由 n(n>=0)个数据特性相同的元素构成的有限序列称为线性表。

线性表中元素的个数 n(n>=0)定义为线性表的长度,n=0 时称为空表。

## 非空线性表的特点

1. 存在唯一的一个被称作”第一个 “的数据元素;
2. 存在唯一的一个被称作”最后一个”的数据元素;
3. 除第一个之外，结构中的每个数据元素均只有一个前驱;
4. 除最后一个之外,结构中的每个数据元素均只有一个后继。

## 线性表 ADT 定义

```c
InitList(&L)        //构造一个空的线性表L
DestroyList(&L)        //线性表存在状况下，销毁线性表
ClearList(&L)        //线性表存在状况下，将表置空
ListEmpty(L)        //线性表存在，空表返回true，否则返回false
ListLength(L)        //返回表中数据元素个数
GetElem(L,i,&e)        //线性表存在，用e返回L中第i个数据元素的值
LocateElem(L,e)        //线性表存在，返回表中第一个与e相同的元素位置，不存在返回0
PriorElem(L,cur_e,&pre_e)    //若cur_e不是第一个元素，返回其前驱;
NextElem(L,cur_e,&next_e)    //cur_e不是最后一个元素，返回其后继
ListInsert(&L,i,e)            //L中第i个位置之前插入新元素e，L长度+1
ListDelete(&L,i)            //删除第i个数据元素，L长度-1
TraverseList(L)                //遍历线性表
```

## 线性表的实现方法

### 顺序存储结构

用一组地址连续的存储单元依次存储线性表的数据元素。，称为顺序表。

逻辑上相邻的数据元素，其物理次序也是相邻的;

假设线性表每个元素占用 l 个存储单元，线性表中第 i+1 个数据元素的存储位置`$LOC(a_i+1)$`和第 i 个数据元素的存储位置`$LOC(a_i)$`之间满足下列关系：

`$$ LOC(a_i+1)=LOC(a_i)+l $$`

一般来说，线性表的第 i 个元素 ai 的存储位置为:

`$$ LOC(a_i)=LOC(a_i)+(i−1)∗l $$`

线性表的顺序存储结构是一种随机存取结构。

1. 初始化： 为线性表分配预定义大小的数组空间，将表长度设为 0
2. 取值： 判断 i 值是否在表内，若 i 合理，则将第 i 个元素赋值给 e，时间复杂度 O(1).
3. 查找： 从第一个元素起，循环比较第一个与 e 相等的值，查找成功返回位置,时间复杂度 O(n).
4. 插入： 判断插入位置是否合法，表是否已满，将后面的元素依次后移，空出的位置插入元素，表长 +1，ASL=O(n).
5. 删除： 判断删除是否合法，后面的元素依次前移，表长-1，ASL=O(n).

> ALS(Average Search Length): 平均查找长度

### 代码简单实现

```c
#define MAXSIZE 10
typedef struct List{
    int length;
    int *elem;    //基地址
}List;
void InitList(List *l) {
    l->elem = (int*)malloc(sizeof(int)*MAXSIZE);        //分配空间大小
    l->length = 0;        //长度初始化
}
int GetElem(List l,int i) {        //取值
    if (0 <= i <= l.length) {
        return l.elem[i];
    }
    return -1;
}
int LocateElem(List l,int e) {        //查找
    for (int i = 0; i < l.length; i++) {
        if (l.elem[i] == e) {
            return i;
        }
    }
    return -1;
}
int ListInsert(List *l, int i, int e) {    //插入
    if (i > l->length || i < 0) { return -1; }
    for (int j = l->length; j >= i; j--) {
        l->elem[j + 1] = l->elem[j];
    }
    l->elem[i] = e;
    l->length++;
    return 1;
}
int ListDelete(List l, int i) {        //删除
    if (i<0 || i>l.length) { return -1; }
    for (int j = i; j < l.length; j++) {
        l.elem[j] = l.elem[j + 1];
    }
    l.length--;
    return 1;
}
int main() {        //测试
    List l;
    InitList(&l);
    ListInsert(&l, 0, 3);
    ListInsert(&l, 1, 6);
    printf("%d,%d", l.elem[0],l.elem[1]);
    ListDelete(l, 1);
    printf("%d,%d", l.elem[0], l.elem[1]);
    getchar();
    return 0;
}
```

## 链式存储结构

### 特点

用一组任意的存储单元存储线性表的数据元素，存储单元可以不连续，为了表示数据元素与其后继元素之间的逻辑关系，除了存储数据本身信息之外，还需要存储一个指示其直接后继的信息。

这两部分信息组成数据元素的存储映像，称为结点，包括两个域：数据域(存储信息),指针域(存储后继结点的地址)。此链表每个结点只包含一个指针域，称为单链表。

单链表是非随机存取的存储结构，取得第 i 个数据元素必须从头指针开始顺链进行查找，也成为顺序存取的存取结构。

### 头节点的作用

一般情况下，为了处理方便，在单链表第一个结点前附加一个头节点，优点如下：

- 便于首元结点的处理
- 便于空表和非空表的统一处理

### 单链表基本操作的实现

- 单链表初始化

  - 生成新结点作为头节点
  - 头结点指针指向空
- 单链表取值，O(n)

  - 指针 p 指向首节点
  - 从首节点开始依次顺链查找，当前 p 不为空，且没有达到 i 结点，循环向下查找，j 计数达到 i 时，结束查找。
  - 如果循环结束后，j 大于 i，或者取值为空，说明 i 不合法，否则取值成功。
- 单链表按值查找，O(n)

  - 指针 p 指向首元。
  - 从首元依次向下查找，p 所指向的数据不为 e，则继续 p 指针 +1，循环操作。
  - 若查找成功，返回相应地址，否则返回 NULL;
- 单链表插入,O(n)

  - 判断插入的位置，如果在首元前插入，需要将当前首元地址赋值给插入结点的 next，并且将新插入结点设置为首元。
  - 如果在链表结尾插入，直接将最后结点的 next 赋值为新插入节点的地址，并且将新节点 next 置为空。
  - 如果在链表中间插入，需要查找插入结点之后的节点地址，将其赋值给新节点的 next，并查找插入节点之前节点的地址将其的 next 赋值为新节点地址。
- 单链表删除,O(n)

  - 同插入操作一样，需要判断删除节点的位置的三种情况，并分别进行操作。

> 单链表插入操作分为：前插法，后插法

### 链表简单实现

```c
struct Node {
    int data;
    Node* next;
};
struct List {
    Node* Head;
    Node* Last;
    Node* p;
    int num;        //结点数量
};
List* CreatList(List* list) {
    list->Head = (Node*)malloc(sizeof(Node));  //头节点分配空间
    list->Last = list->Head;
    list->Head->next = NULL;
    list->p = list->Head;
    list->num = 1;
    return list;
}
Node* NodeInsert(List* list) {            //尾插法
    Node* temp = (Node*)malloc(sizeof(Node));
    list->Last->next = temp;
    temp->next = NULL;
    list->Last = list->Last->next;
    list->num++;
    return temp;
}
Node* NodeInsert(List* list, int num, int date) {    //指定位置插入结点
    Node* temp = (Node*)malloc(sizeof(Node));
    temp->data = date;
    Node* find = list->p;
    while (find->data != num) {        //找到指定位置的结点
        find = find->next;
    }
    //头节点前插入
    if (find == list->Head) {
        temp->next = list->Head;
        list->Head = temp;
        list->p = list->Head;
    }
    //尾结点后插入
    else if (find == list->Last) {
        list->Last->next = temp;
        temp->next = NULL;
        list->Last = temp;
    }
    else {
        Node* temp1 = find->next->next;
        find->next = temp;
        temp->next = temp1;
    }
    list->num++;
    return temp;
}
void ListTraversal(List* list) {    //遍历
    Node* temp = list->p;
    int i = 1;
    while (temp != NULL) {
        temp->data = i;
        temp = temp->next;
        i++;
    };
}
void ListPrint(List* list) {        //遍历打印
    Node* temp = list->p;
    while (temp != NULL) {
        cout << (temp->data) << endl;
        temp = temp->next;
    }
}
int NodeDelete(List* list, int num) {
    Node* temp = list->p;
    while (temp->data != num) {
        temp = temp->next;
    }
    //删除头节点
    if (temp == list->Head) {
        Node* temp1 = list->Head;
        list->Head = list->Head->next;
        list->p = list->Head;
        delete(temp1);
    }
    //删除其他结点
    else {
        Node* temp1 = temp->next;
        temp->next = temp->next->next;
        delete(temp1);
    }
    list->num--;
    return 1;
}
//测试
int main() {
    List list1;
    CreatList(&list1);
    //循环生成结点
    int i = 0;
    while (i < 6) {
        NodeInsert(&list1);
        i++;
    }
    //遍历赋值链表
    ListTraversal(&list1);
    //特定位置插入赋值的结点(链表地址，结点位置前插入，插入结点的数据值)
    NodeInsert(&list1, 2, 8);
    //删除结点
    NodeDelete(&list1, 1);
    ListPrint(&list1);
    cout << "----------------" << endl;
    cout << "结点数量为" << list1.num << endl;
    cin.get();
    return 0;
}
```

## 链表扩展

- 循环链表，链表尾节点连接首节点，成环
- 双向链表，链表分为两个指针域，一个指向前驱，一个指向后继

### 双向链表举例

```c
struct Node {
    int data;
    Node* pre;
    Node* next;
};
struct List {
    Node* Head;
    Node* Last;
    Node* p;
    int num;        //结点数量
};
List* CreatList(List* list) {
    list->Head = (Node*)malloc(sizeof(Node));
    list->Last = list->Head;
    list->Head->pre = NULL;
    list->Head->next = NULL;
    list->p = list->Head;
    list->num = 1;
    return list;
}
Node* NodeInsert(List* list) {
    Node* temp = (Node*)malloc(sizeof(Node));
    list->Last->next = temp;
    temp->next = NULL;
    temp->pre = list->Last;
    list->Last = list->Last->next;
    list->num++;
    return temp;
}
Node* NodeInsert(List* list, int num,int date) {
    Node* temp = (Node*)malloc(sizeof(Node));
    temp->data = date;
    Node* find = list->p;
    while (find->data != num) {
        find = find->next;
    }
    //头节点前插入
    if (find == list->Head) {
        list->Head->pre = temp;
        temp->pre = NULL;
        temp->next = list->Head;
        list->Head = temp;
        list->p = list->Head;
    }
    //尾结点后插入
    else if (find == list->Last) {
        list->Last->next = temp;
        temp->pre = list->Last;
        list->Last = temp;
    }
    else {
        find->pre->next = temp;
        temp->next = find;
        temp->pre = find->pre;
        find->pre = temp;
    }
    list->num++;
    return temp;
}
void ListTraversal(List* list) {
    Node* temp = list->p;
    int i = 1;
    while (temp != NULL){
        temp->data = i;
        temp = temp->next;
        i++;
    };
}
void ListPrint(List* list) {
    Node* temp = list->p;
    while (temp != NULL){
        cout<<(temp->data)<<endl;
        temp = temp->next;
    }
}
Node* NodeDelete(List* list,int num) {
    Node* temp = list->p;
    while (temp->data != num) {
        temp = temp->next;
    }
    //删除头节点
    if (temp == list->Head) {
        list->Head = list->Head->next;
        list->Head->pre = NULL;
        list->p = list->Head;
    }
    //删除尾结点
    else if (temp == list->Last) {
        list->Last = temp->pre;
        temp->pre->next = NULL;
        temp->pre = NULL;
    }
    else{
        temp->pre->next = temp->next;
        temp->next->pre = temp->pre;
    }
    list->num--;
    return temp;
}
//测试
int main() {
    List list1;
    CreatList(&list1);
    //循环生成结点
    int i = 0;
    while (i < 6) {
        NodeInsert(&list1);
        i++;
    }
    //遍历赋值链表
    ListTraversal(&list1);
    //特定位置插入赋值的结点(链表地址，结点位置前插入，插入结点的数据值)
    NodeInsert(&list1, 1, 8);
    //删除结点
    //Node* temp = NodeDelete(&list1, 1);
    //cout << temp->data << endl;
    ListPrint(&list1);
    cout << "----------------" << endl;
    cout << "结点数量为" << list1.num << endl;
    cin.get();
    return 0;
}
```

## 顺序表和链表比较

### 空间性能比较

1. 存储空间的分配,顺序表需要预先分配空间，无法扩充大小。
2. 存储密度的大小，链表需要设置指针域，从存储密度上是不经济的。

> 存储密度=数据元素本身占用的存储量/结点结构占用的存储量

### 时间性能比较

1. 存取元素效率，顺序表随机存储 O(1)O(1),链表顺序存储 O(n)O(n).
2. 插入和删除操作效率,顺序表需要移动元素空出空间 O(n)O(n)，链表直接修改指针实现增删 O(1)O(1);

## 线性表的应用

1. 线性表合并，求解一般集合的并集问题
2. 有序表合并，求解有序表并集问题，例如一元多项式与稀疏多项式的运算问题。

### 稀疏多项式代码示例

```c
struct Node {
    int xishu;
    int zhishu;
    Node* next;
};
struct List {
    Node* Head;
    Node* Last;
    Node* p;
    int num;        //结点数量
};
List* CreatList(List* list) {
    list->Head = (Node*)malloc(sizeof(Node));
    list->Last = list->Head;
    list->Head->xishu = 0;
    list->Head->zhishu = 0;
    list->Head->next = NULL;
    list->p = list->Head;
    list->num = 1;
    return list;
}
Node* NodeInsert(List* list, int xishu,int zhishu) {
    Node* temp = (Node*)malloc(sizeof(Node));
    list->Last->next = temp;
    temp->next = NULL;
    temp->xishu = xishu;
    temp->zhishu = zhishu;
    list->Last = list->Last->next;
    list->num++;
    return temp;
}
void ListPrint(List* list) {
    Node* temp = list->Head->next;
    while (temp != NULL) {
        cout <<"系数：" <<temp->xishu <<"指数："<< temp->zhishu << endl;
        temp = temp->next;
    }
}
List* addList(List* list1, List* list2) {
    List listSum;
    List* newp = CreatList(&listSum);
    Node* p1,* p2;
    p1 = list1->Head->next;
    p2 = list2->Head->next;
    while (p1 != NULL && p2 !=NULL) {
        if (p1->zhishu < p2->zhishu && p1 != NULL && p2 != NULL) {
            NodeInsert(&listSum, p1->xishu, p1->zhishu);
            p1 = p1->next;
        }
        if (p1 != NULL && p2 != NULL) {
            if (p1->zhishu == p2->zhishu) {
                NodeInsert(&listSum, p1->xishu + p2->xishu, p1->zhishu);
                p1 = p1->next;
                p2 = p2->next;
            }
        }
        if (p1 != NULL && p2 != NULL) {
            if (p1->zhishu > p2->zhishu) {
                NodeInsert(&listSum, p2->xishu, p2->zhishu);
                p2 = p2->next;
            }
        }
    }
    while (p1 != NULL) {
        NodeInsert(&listSum, p1->xishu, p1->zhishu);
        p1 = p1->next;
    }
    while (p2 != NULL) {
        NodeInsert(&listSum, p2->xishu, p2->zhishu);
        p2 = p2->next;
    }
    ListPrint(newp);
    return newp;
}
int main() {
    List list1, list2;
    //初始化
    CreatList(&list1);
    CreatList(&list2);
    //构造多项式1
    int i = 1;
    while (i) {
        cout << "list1是否添加项1:是，0：不是" << endl;
        cin >> i;
        if (i == 0)break;
        cout << "请输入系数和指数" << endl;
        int xishu, zhishu;
        cin >> xishu >> zhishu;
        NodeInsert(&list1, xishu, zhishu);
    }
    i = 1;
    while (i) {
        cout << "list2是否添加项1:是，0：不是" << endl;
        cin >> i;
        if (i == 0)break;
        cout << "请输入系数和指数" << endl;
        int xishu, zhishu;
        cin >> xishu >> zhishu;
        NodeInsert(&list2, xishu, zhishu);
    }
    cout << "list1:"<<endl; ListPrint(&list1);
    cout << "-------------------" << endl;
    cout << "list2:"<<endl; ListPrint(&list2);
    cout << "-------结果--------" << endl;
    addList(&list1, &list2);
    while (1) { cin.get(); }
    return 0;
}
```
