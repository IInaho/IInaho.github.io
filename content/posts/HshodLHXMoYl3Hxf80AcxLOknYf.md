+++
authors = ["lzy"]
title = "栈与队列"
date = "2020-05-12"
description = ""
tags = [
    "数据结构"
]
categories = [
    "计算机基础知识"
]
series = ["数据结构相关文章"]
+++

# 栈与队列

## 栈的定义和特点

栈(stack)是限定仅在表尾进行插入或删除的操作的线性表，表尾端称为栈顶，表头端称为栈底，不含元素的空表称为空栈，栈因为其特性又被称为后进先出(Last In First Out)的线性表。

## 栈的 ADT 类型定义

```c
InitStack(&s) //构造一个空栈
DestroyStack(&s) //栈s存在，销毁栈
ClearStack(&s)        //栈s存在，清除栈
StackEmpty(s)        //栈s存在，若栈为空返回true，否则返回false
StackLength(s)        //栈s存在，返回栈的长度
GetTop(s)            //返回s的栈顶元素
Push(&s,e)            //插入元素e为新的栈顶元素
Pop(&s,&e)            //栈s存在且非空，删除栈顶元素，返回其值
StackTraverse(s)    //栈s存在且非空，遍历栈
```

### 顺序栈的表示和实现

- 顺序栈的初始化

  - 为顺序栈分配地址空间，并让基地址指向这个空间
  - 栈顶指针初始化，栈容量初始化
- 顺序栈的入栈

  - 判断栈是否满，若满则返回 ERROR
  - 将新元素压入栈顶，栈顶指针+1
- 顺序栈的出栈

  - 判断栈是否空，若空返回 ERROR
  - 栈顶指针-1，栈顶元素出栈
- 取顺序栈的栈顶元素

  - 栈非空时，取栈顶元素的值

#### 顺序栈的代码实现(C++)

```c
template <class T>
class Stack
{
public:
    Stack(unsigned int size);        //在构造器中初始化栈的大小
    ~Stack();                        //析构器（释放内存）
    void push(T value);
    T pop();
private:
    unsigned int size;
    unsigned int sp;
    T *pointer;                        //栈指针
};
template <class T>
Stack<T>::Stack(unsigned int size)        //隐含this指针指向这个方法
{
    this->size = size;
    pointer = new T[size];            //分配这个栈的空间
    sp = 0;                            //表示第0个元素
}
template <class T>
Stack<T>::~Stack()            //析构器
{
    delete []pointer;                //释放构造器中开辟的空间（释放数组，需要加[]）
}
template <class T>
void Stack<T>::push(T value)
{
    pointer[sp++] = value;            //将数据压入栈中，然后栈指针指向下一个地址
}
template <class T>
T Stack<T>::pop()
{
    return pointer[--sp];            //返回栈指针指向前一个地址的值
}
int main()
{
    const int size = 100;
    Stack<double> mystack(size);
    int n, a = 1;
    int i;
    char ch;
    std::cout << "How many numbers (1-n) do you need to push?" << "\n";
    std::cin >> n;
    try
    {
        for (i = 0; i < n; i++)        //压栈(1-n)
        {
            if (i >= 100)
            {
                throw "崩溃！，栈溢出！！...";
            }
            mystack.push(a);
            a++;
        }
        std::cout << "All pushed!" << "\n";
        getchar();
        std::cout << "if you want to pop the stack of all numbers?(Y/N)" << "\n";
        if ((ch = getchar()) == 'Y')
            for (int i = 0; i < n; i++)                //弹栈
                std::cout << mystack.pop() << "\t";
    }
    catch (const char *a)        //catch(...)捕获任何异常
    {
        std::cout << a;
    }
    return 0;
}
```

### 链栈的表示和实现

- 链栈的初始化

  - 不需要设置头节点，直接将栈顶指针置空
- 链栈的入栈

  - 为入栈结点分配空间
  - 设置入栈结点的值
  - 将新结点插入栈顶
  - 修改栈顶指针为新节点的地址
- 链栈的出栈

  - 判断栈是否为空
  - 临时保存栈顶元素空间
  - 修改栈指针指向新的栈顶元素
  - 释放原栈顶元素空间
- 取链栈的栈顶元素

  - 返回栈顶元素的值

#### 链栈的简单实现

```c
struct Stack_l {
    int data;
    Stack_l *next;
};
struct Stack {
    Stack_l * top;
};
int InitStack(Stack *s) {
    s->top = NULL;
    return 1;
}
int DestroyStack(Stack *s) {
    free(s);
    return 1;
}
int ClearStack(Stack *s) {
    while (s != NULL) {
        Stack *temp = s;
        s->top = s->top->next;
        free(temp);
    }
    s = NULL;
    return 1;
}
int StackEmpty(Stack *s) {
    if (s == NULL)
        return 1;
    else return 0;
}
int StackLength(Stack *s) {
    int length = 0;
    Stack_l *temp = s->top;
    while (temp != NULL) {
        temp  = temp->next;
        ++length;
    }
    return length;
}
int GetTop(Stack *s) {
    if(s != NULL) return s->top->data;
    return 0;
}
int Push(Stack *s,int e) {
    Stack_l *temp = (Stack_l*)malloc(sizeof(Stack_l));
    temp->data = e;
    temp->next = s->top;
    s->top = temp;
    return 1;
}
int Pop(Stack *s) {
    if (s == NULL) return 0;
    Stack_l *temp = s->top;
    s->top = s->top->next;
    int e = temp->data;
    free(temp);
    return e;
}
void StackTraverse(Stack *s) {
    Stack_l *temp = s->top;
    while (temp != NULL) {
        cout << temp->data << endl;
        temp = temp->next;
    }
}
int main() {
    Stack s;
    InitStack(&s);
    Push(&s, 1);Push(&s, 2);
    Push(&s, 3);Push(&s, 4);
    StackTraverse(&s);
    Pop(&s);
    StackTraverse(&s);
    cout << GetTop(&s) << StackLength(&s);
    getchar();
    return 0;
}
```

### 栈与递归

递归是指，若在一个函数、过程或者数据结构定义的内部又直接或间接出现定义本身的应用，则称它们是递归的(函数自己调用自己)。

以下三种情况，经常使用递归：

1. 定义是递归的，如斐波那契数列
2. 数据结构是递归的，如链表结点由数据和指针组成，指针又由数据和指针组成，示例代码:

```c
void TraverseList(LinkList p){
     if(p){
         cout<<p->data<<endl;
         TraverseList(p->next);
     }
 }
```

3. 问题的解法是递归的，比如汉诺塔(Hanoi)问题

#### 递归过程与递归工作栈

当在一个函数的运行期间调用另一个函数时，在运行被调用函数之前，系统需先完成3件事：

1. 将所有实参、返回地址等信息传递给被调用函数保存
2. 为被调用函数的局部变量分配存储区
3. 将控制转移到被调用函数的入口

而从被调用函数返回调用函数之前，系统也应该完成3件事：

1. 保存被调函数的计算结果
2. 释放被调函数的数据区
3. 依照被调函数保存的返回地址将控制转移到调用函数

当有多个函数构成嵌套调用时，按照“后调用先返回”原则，上述函数之间的信息传递和控制需要通过“栈”来实现。

#### 递归算法的效率分析

1. 当一个算法中包含递归调用，时间复杂度可以转化成一个递归方程求解，在数学上是求渐近阶的问题，递归方程多样，求解也多样，迭代法是求解递归方程的主要方法，基本步骤为迭代展开递归方程右端，变为一个非递归的和式，通过对和式的估计求解。
   以阶乘的递归函数`$Fact(n)$`为例：

```c
long Fact(long n){
     long temp;
     if(n==0) return 1;
     else temp=n*Fact(n-1);
     return temp;
 }
```

设`$Fact(n)$`执行时间为`$T(n)$`,此递归函数中语句`if(n==0) return 1;`的执行时间是`$O(1)$`,递归调用`$Fact(n-1)$`的执行时间为`$T(n-1)$`，所以`else return n*Fact(n-1)`的执行时间为`$O(1)+T(n-1)$`,其中设两数相乘和赋值操作均为`$O(1)$`，有如下递归方程：

`$T(n)=\begin{cases} D & \text{n=0} \\C+T(n-1) & \text{n}>0 \end{cases}$`

设`$n>2$`,利用上式对`$T(n−1)$`展开，即在上式中用`$n-1$`代替n得到

`$$ T(n−1)=C+T(n−2) $$`

再代入`$T(n)=C+T(n−1)$`中，有

`$$ T(n)=2C+T(n−2) $$`

同理，当`$n>3$`时有

`$$ T(n)=3C+T(n−3) $$`

依此类推,当`$n>i$`时有

`$$ T(n)=iC+T(n−i) $$`

最后当`$i=n$`时有

`$$ T(n)=nC+T(0)=nC+D $$`

求得递归方程的解为: `$ T(n)=O(n)$`，这种方法计算斐波那契数列和汉诺塔递归算法时间复杂度均为 `$O(2^n)$`

2. 空间复杂度分析

执行递归函数时，系统设立一个”递归工作栈”存储每一层递归所需信息，递归算法空间复杂度需要分析工作栈的大小。

对于递归算法，空间复杂度 `$S(n)=O(f(n))$`

其中 f(n)为"递归空间栈"中工作记录的个数和问题规模n的函数关系。

### 经典案例

1. 数制的转换
2. 括号匹配
3. 表达式求值

#### 括号匹配代码示例

```c
#define MAX 100
bool isMatch(char left,char right){
    if (left == ']')
        return (right == '[');
    if (left == ')')
        return (right == '(');
    if (left == '}')
        return (right == '{');
    cout << "错误";
}
bool left_y(char c){
    if (c == '[' || c == '(' || c == '{')
    {
        return true;
    }
    else return false;
}
bool right_y(char c){
    if (c == ']' || c == ')' || c == '}')
    {
        return true;
    }
    else return false;
}
int main()
{
    stack<char> mystack;
    int lenth = 0;
    char str[MAX]{ 0 }; 
    cin >> str;
    while (str[lenth]){    //计算长度
        lenth++;
    }
    while (lenth){
        if (right_y(str[lenth-1])){
            mystack.push(str[lenth-1]);        //如果是右括号入栈
            lenth--;                        //下标减1
        }
        else if (left_y(str[lenth-1])){        //判断是否为左括号
            if (mystack.empty()){            //如果栈为空，说明第括号不合法，push后退出循环
                mystack.push(str[lenth - 1]);
                break;
            }
            if (isMatch(mystack.top(), str[lenth-1])){
                mystack.pop();
                lenth--;
                if (!mystack.empty())
                { continue; }
            }
            else { break; }
        }
    }
    if (mystack.empty()){cout << "匹配成功";}
    else {cout << "匹配失败";}
    cin.get();
    return 0;
}
```

#### 表达式求值代码示例

```c
stack<int> num;
stack<char> ch;
int Compare(char c) {        //优先级比较
    if (c == '(' || c == ')') {
        return 0;
    }
    if (c == '+' || c == '-') {
        return 1;
    }
    if (c == '*' || c == '/') {
        return 2;
    }
    return -1;
}
int Cal(int a, int b, int c) {    //计算
    if (c == '+') {
        return a + b;
    }
    if (c == '-') {
        return b - a;
    }
    if (c == '*') {
        return a * b;
    }
    if (c == '/') {
        return b / a;
    }
    return 0;
}
int main() {
    string str;
    cin >> str;
    for (int i = 0; i <= str.length(); i++) {
        if (str[i] >= '0'&& str[i] <= '9') {    //如果是数字直接压入数字栈
            int a = (int)(str[i] - 48);
            num.push(a); continue;
        }
        if (str[i] == '(') {        //左括弧直接压入字符栈
            ch.push(str[i]); continue;
        }
        if (str[i] == '+' || str[i] == '-' || str[i] == '*' || str[i] == '/' || str[i] == ')' || str[i] == '#') {
            if (!ch.empty()) {
                if ((Compare(str[i]) > Compare(ch.top()))) {    //比较当前运算符与栈顶运算符的优先级，如果优先级大直接压栈
                    ch.push(str[i]);
                }
                else if (ch.top() != '(' && num.size() >= 2) {    //栈顶是左括弧不继续计算，并且计算要求为数字栈至少两个元素
                    int a, b;
                    a = num.top(); num.pop();
                    b = num.top(); num.pop();
                    num.push(Cal(a, b, ch.top()));
                    ch.pop(); i--; continue;  //栈中优先级小的符号出栈后，重置当前未入栈的符号。
                }
            }
            else ch.push(str[i]);
        }
        if (str[i] == ')' && !ch.empty()) {      //判断括号匹配(一定在计算数值后进行括号匹配)
            if (ch.top() == '(') ch.pop();
        }
    }
    cout << num.top();
    cin.get();
    cin.get();
    return 0;
}
```

## 队列的定义和特点

队列(Queue)是一种是一种先进先出(First In First Out, FIFO)的线性表，它只允许在表的一端进行插入，而在另一端删除元素。
在队列中，允许插入的一端称为队尾，允许删除的一端则称为队头。

### 队列的 ADT 类型定义

```c
InitQueue(&Q)        //构造一个空栈
DestroyQueue(&Q)    //队列存在，销毁队列
ClearQueue(&Q)        //队列存在，清空队列
QueueEmpty(&Q)        //队列存在，判断队列为空
QueueLength(&Q)        //队列存在，返回队列长度
GetHead(&Q)            //队列不为空，返回队列队头元素
EnQueue(&Q,e)        //队列存在，插入新的队尾元素e
DeQueue(&Q，&e)        //队列非空，删除队头元素，返回其值
QueueTraverse(Q)    //队列存在且非空，遍历队列
```

### 队列的顺序表示和实现(循环队列)

- 循环队列的初始化

  - 为队列分配数组空间，基地址指向数组首地址
  - 头尾指针置0
- 求队列长度

  - 头尾指针的差值加队列最大长度
- 循环队列入队操作

  - 判断队列是否满
  - 将新元素插入队尾
  - 队尾指针+1
- 循环队列出队操作

  - 判断队列是否为空
  - 保存队头元素
  - 队头指针+1
- 取队头元素

  - 判断队列是否为空
  - 返回当前队头元素的值

#### 循环队列顺序存储的简易代码实现

```c
#define MAXSIZE 10
typedef struct Queue {
    int *base;
    int front;
    int rear;
    int length;
}Queue;

int InitQueue(Queue *q) {
    q->base = new int[MAXSIZE];
    q->front = 0;
    q->rear = 0;
    q->length = 0;
    return 1;
}
void DestroyQueue(Queue *q) {
    free(q);
}
void ClearQueue(Queue *q) {
    q->front = 0;
    q->rear = 0;
}
int QueueEmpty(Queue q) {
    if (q.length == 0){
        return 1;
    }
    return 0;
}
int QueueLength(Queue q) {
    return q.length - 1;        //第十位空出，用来判断队列是否满，所以实际长度只有9位
}
int GetHead(Queue q) {
    if (q.base != NULL) return q.base[q.front];
    return 1;
}
int EnQueue(Queue *q,int e) {
    if ((q->rear+1)%MAXSIZE != q->front) {    //队列未满且
        q->base[q->rear] = e;
        q->rear++;
        q->rear = q->rear % MAXSIZE;
        q->length++;
        return 1;
    }
    return -1;
}
int DeQueue(Queue *q) {
    if (q->length > 0) {
        q->front++;
        q->front = q->front % MAXSIZE;
        q->length--;
    }
    return 1;
}
void QueueTraverse(Queue q) {
    int num = 0;
    for (int i = q.front; num < q.length; num++,i++) {
        i = i % MAXSIZE;
        cout<<q.base[i]<<endl;
    }
}
int main() {
    Queue q;
    InitQueue(&q);
    EnQueue(&q, 1);EnQueue(&q, 2);EnQueue(&q, 3);
    EnQueue(&q, 4);EnQueue(&q, 5);EnQueue(&q, 6);
    EnQueue(&q, 7);EnQueue(&q, 8);EnQueue(&q, 9);
    cout << "插入失败" << EnQueue(&q, 10) << endl;;
    DeQueue(&q);DeQueue(&q);DeQueue(&q);
    DeQueue(&q);DeQueue(&q);
    EnQueue(&q, 1);EnQueue(&q, 2);EnQueue(&q, 3);
    QueueTraverse(q);
    cout<<"队头"<<GetHead(q)<<endl;
    getchar();
    return 0;
}
```

### 队列的链式表示和实现

- 链队的初始化

  - 生成新节点作为头节点，队头和队尾指针指向此结点
  - 头结点的指针域置空
- 链队的入队

  - 为入队元素分配空间
  - 设置新结点数据域
  - 将新结点插入队尾
  - 修改队尾指针
- 链队的出队

  - 判断队列是否为空
  - 临时保存队头元素地址空间
  - 修改头结点指向
  - 修改队尾指针
  - 释放原队头元素空间
- 取链队的队头元素

  - 判断队列是否非空
  - 返回队头元素的值

#### 链队的代码简易实现

```c
#define MAX 10
struct Point
{
    int num;
    Point *next;
};
struct List
{
    int num = 0;    //记录节点数量
    Point * rear;    //队尾元素
    Point * front;    //队首元素
};

Point* cs_list(List *list);            //初始化队列
bool full_list(List *front);        //确认队列是否已满
bool empty_list(List *front);        //确认队列是否为空
Point* add_list(List *list);        //在队列末尾添加元素
void del_list(List *list);            //删除队列首元素
void find_list(List *list);            //查找队列的元素
void input_list(List *list);        //输出队列的元素

Point* cs_list(List *list)        //队列初始化
{
    list->rear = (Point*)malloc(sizeof(Point));    //分配空间，将地址赋给point的首节点
    list->num++;                    //使队列节点数加一
    list->front = list->rear;        //使队列的尾节点等于队列首节点的指针
    scanf_s("%d", &list->rear->num);
    list->rear->next = NULL;        //使结点的下一个链接点为空
    return list->rear;                //返回该地址
}

bool full_list(List *list)        //确认队列是否已满，已满返回true，否则返回false
{    
        if (list->num >= MAX)    //观察num（节点数）是否为最大值
            return true;
        else
            return false;
}
bool empty_list(List *list)        //确认队列是否为空，为空返回true，不为空返回false
{
    if (list->num == 0)
        return true;
    else 
        return false;
}
Point* add_list(List *list)            //入队列
{
    Point *temp = (Point*)malloc(sizeof(Point));    //分配空间
    list->rear->next = temp;
    list->rear = list->rear->next;
    list->num++;                    //如果分配成功，使结点数+1
    scanf_s("%d", &list->rear->num);
    list->rear->next = NULL;
    return list->rear;                //返回该地址
}
int del_list(List *list)                    //出队列
{
    Point *temp = list->front;                //temp储存队首元素
    list->front = list->front->next;        //队首元素向后移一位
    list->num--;
    int temp_num = temp->num;
    free(temp);                
    return temp_num;                
}
void input_list(List *list)
{
    List *list1 = list;
    printf("%d", list->num);
    while (list1->front != NULL)
    {
        printf("%d", list->front->num);
        list1->front = list->front->next;
    }
}
Point* find_list(List *list,int n)
{
    Point *temp = list->front;
    while (temp->num != NULL)
    {
        if (temp->num == n)
            return temp;
        else
            temp = temp->next;
    }
    return NULL;
}
int main()
{
    List list;
    if (cs_list(&list))
    {
        printf("初始化队列成功！\n");
    }
    if (full_list(&list))
    {
        printf("队列已满\n");
    }
    else
    {
        printf("队列未满\n");
    }
    add_list(&list);
    printf("\n");
    add_list(&list);
    printf("\n");
    del_list(&list);
    printf("\n");
    Point * temp = find_list(&list, 368);
    if (temp)
    {
        printf("%d", temp->num);
        printf("\n");
    }
    input_list(&list);
    getchar();
    getchar();
    return 0;
}
```
