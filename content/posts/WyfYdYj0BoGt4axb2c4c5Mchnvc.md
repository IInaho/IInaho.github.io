+++
authors = ["lzy"]
title = "CppPrimer 阅读笔记"
date = "2023-07-07"
description = ""
tags = [
    "CPP"
]
categories = [
    "技术文档"
]
+++

## 简介

此笔记是本人阅读 CppPrimer 后总结的各章重点，此为第一篇，介绍了第一部分的基本语法内容。

## 第一章笔记

1. main 函数返回类型必须为 int。
2. 大多数系统中 main 的返回值被用来指示状态，如 0 代表成功，其他数字通常指出错误类型。
3. 一个流就是一个字符序列。
4. “<<” 运算符左侧运算对象为 ostream 对象，右侧为要打印的值，运算符将给定的值写给定的 ostream 对象中，返回其左侧运算对象。
5. “>>” 运算符接受一个 istream 作为左侧运算对象，接受一个对象作为右侧运算对象，从给定的 istream 读入数据，存入给定对象中，返回其左侧运算对象作为其计算的结果。
6. endl 是一个被称为“操纵符”的特殊值，写入 endl 结束该行，将与设备关联的缓冲区内容刷到设备中，可以保证目前为止程序产生的所有输出都写入到输出流中，而不是在内存中等待写入流。
7. 当使用一个 istream 对象作为条件时，其效果是检测流的状态，当遇到文件结束符或遇到无效输入，istream 对象状态会变为无效，无效的 istream 会使条件为假。
8. 默认情况 cin 会刷新 cout，程序非正常终止也会刷新 cout。

## 第二章笔记

1. 在 c++ 语言中，一个字节至少要能容纳机器基本字符集中的字符。
2. 为了赋予内存中某个地址明确的含义，必须首先知道存储在该地址的数据类型，类型决定了数据所占比特数以及如何解释这些比特的内容。
3. 类型 char 在一些机器上有符号，另一些机器又是无符号的。
4. 无符号数作为循环变量可能导致死循环。

```cpp
for (int i = 10; i >= 0 ; --i){
     std::cout << i<< std::endl;
 }
 for (unsigned u = 10; u >= 0; --u){        //可能死循环
     std::cout << i<< std::endl;
 }
```

5. 带符号数会自动转换为无符号数。
6. 十进制字面值默认是带符号数，但十进制字面值不会是负数，负号不在字面值之内。
7. 字符字面值为单引号括起来的值，字符串字面值为双引号括起来的值，字符串字面值实际长度要比它的内容多 1，因为编译器会在其末尾添加空字符’\0’。
8. 变量提供一个具名、可供程序操作的存储空间。
9. 通常情况下，对象是指一块能存储数据并具有某种类型的内存空间。
10. 在 c++ 语言中，初始化和赋值是两个完全不同的操作。
11. 初始化的方式：

```cpp
int value = 0;
int value = { 0 };
int value{ 0 };
int value(0);
```

12. 作为 c++11 的新标准，花括号初始化得到广泛应用，但当其用于内置类型变量时，如果使用列表初始化且初始值存在丢失信息的风险，编译器将报错：

```cpp
long double ld = 3.1415926;
int a{ld}, b = {ld};    //编译器报错
```

13. 定义于任何函数体之外的变量被初始化为 0，函数体内的内置类型对象如果没有初始化，则其值未定义，每个类各自决定其初始化对象的方式。
14. 声明规定了变量的类型和名字，而定义还为变量申请存储空间或赋初值。

```c
//如果想声明一个变量而非定义则：extern int i;
//而包含显示初始化的声明即成为定义。  
//函数体内无法初始化由extern标记的变量
```

15. 每个名字都会指向特定的实体，而同一个名字在不同的作用域中可能指向不同的实体，名字的有效区域始于名字的声明语句，以声明语句所在作用域末端为结束。
16. 使用作用域操作符来覆盖默认的作用域规则，当作用域操作符左侧为空，向全局作用域发出请求获取作用域操作符右侧名字对应的变量。

```cpp
int i = 100, sum = 0;
int main() {
for (int i = 0; i != 10; ++i) {
    sum += ::i;                    //调用全局变量i
}
cout << i << "  " << sum << endl;
return 0;
}
```

17. 引用并非对象，引用必须初始化，且不能定义引用的引用。

```cpp
int a = 5;
int &b = a, &c = b, &d = c, &e = d;
cout << e << endl;                //输出5
```

18. 引用与指针的类型要和与之绑定的对象严格匹配，引用只能绑定在对象上，不能与字面值或表达式的计算结果绑定，但有些特殊情况：

```cpp
初始化常量引用时允许用任意表达式作为初始值，只要其结果能转化成引用类型即可，允许常量引用绑定非常量对象。
允许令一个指向常量的指针指向一个非常量对象，指向常量的指针仅仅要求不能通过该指针改变对象的值。
```

19. 使用 nullptr 来得到空指针，nullptr 是一种特殊类型字面值，它可以被转化为任意其他指针类型。
20. 如果指针的值为 0，条件取 false，其他取 true，比较指针是比较它们所存地址值是否相等。
21. void* 是特殊指针类型，可用于存放任意对象的地址，但无法访问内存空间中的对象。
22. 为了理解类型，从右向左阅读其定义，距变量名最近的符号对变量类型有最直接的影响。

```cpp
int *&r;        //r是一个引用
int &*r;        //不存在指向引用的指针
```

23. const 对象一旦创建后其值无法更改，所以 const 对象必须初始化。
24. 以编译初始化的方式定义 const 对象时，编译器将在编译过程中将用到该变量的地方替换成对应的值。
25. 默认情况下，const 对象被设定为仅在文件内有效。
26. 只在一个文件中定义 const，而在多个其他文件中声明并使用它，对于其声明还是定义都添加 extern 关键字。

```cpp
extern const int value = 10/2;        //file.cc文件
extern const int value;                //file.h文件
```

27. 引用绑定到 const 对象上，称为对常量的引用，不能修改它所绑定的对象。
28. 对于下列代码是非法的。

```cpp
double dval = 3.14;
const int &ri = dval;                //非法
编译器将其转化为：
const int temp = dval;
const int &ri = dval;
// ri实际上绑定了一个临时量，而程序员一般会想用ri去改变dval对象，不会将引用绑定到临时量上，因此c++规定其非法。
```

29. 对 const 的引用可能引用一个非 const 的对象，常量引用仅对引用可参与的操作做出限定：

```cpp
int i = 42;
int &r1 = i;
const int &r2 = i;
r1 = 0;      // 允许
r2 = 0;      // 错误
```

30. 指向常量的指针不能用于改变其所指对象的值，只能使用指向常量的指针存放常量对象的地址：

```cpp
const double pi = 3.14159;
const double *cptr = &pi;    // 正确
```

31. 为了把指针本身定义为常量，其必须初始化，初始化后其值(地址)无法改变：

```cpp
int errNumb = 0;
int *const curErr = &errNumb;        // curErr将一直指向errNumb
const double pi = 3.14159;
const double *const pip = &pi;       // pip是一个指向常量对象的常量指针
```

32. 顶层 const 表示指针本身是个常量或表示任意的对象是常量，底层 const 表示指针所指的对象是一个常量。底层 const 与指针和引用等复合类型的基本类型部分有关。用于声明引用的 const 都是底层 const，非常量可以转化为常量，反之不行。
33. 常量表达式指值不会改变并且编译过程中就能得到计算结果的表达式，由数据类型和初始值决定。
34. 允许将变量声明为 constexpr 类型，声明为 constexpr 的变量一定是一个常量，必须用常量表达式初始化。新标准允许定义特殊的 constexpr 函数，这种函数应该足够简单以便得到编译时就可计算结果，这样能用 constexpr 函数初始化其他值。
35. 算术类型、引用、指针都属于字面值类型，自定义的类则不是：

```cpp
// 例如constexpr指针和constexpr引用
constexpr int *q = nullptr;    // constexpr限定符仅对指针本身有效，也就是说将其声明为顶层const
```

36. 类型别名声明方式：

```cpp
// 使用using (C++11新特性)
using bookptr = string;

// 使用typedef
typedef int NUM;
```

37. typedef 的理解：

```cpp
typedef char* pstring;
const pstring cstr = 0;        // pstring是char*的别名，指向char的指针，所以const修饰pstring，cstr是指向char的常量指针
const pstring *ps;             // ps是指向char常量指针的指针
```

38. auto 相关规则：

- auto 通过变量初始值推断变量类型
- auto 定义的变量必须有初始值
- 当 auto 初始值为引用时，auto 会忽略顶层 const，保留底层 const：

```cpp
const auto f = ci;             // 根据初始值推断类型为顶层const
```

39. decltype，选择并返回操作数的数据类型，编译器仅分析其类型，不计算表达式的值。

```cpp
decltype(f()) sum = x;
decltype处理顶层const与auto不同，它会返回变量的类型，包括顶层const和引用在内。
const int ci = 0, &cj = ci;
decltype(ci) x = 0;    x的类型是const int
decltype(cj) y = x;    y的类型是const int&
如果decltype使用的表达式不是一个变量，decltype返回表达式结果对应的类型。
如果表达式内容是解引用操作，则decltype将得到引用类型。
如果给变量加了一层或多层括号，编译器会将其当成一个表达式。
decltype ((i)) d;        //d是int&类型    ！！
```

40. 赋值是产生引用的一类典型表达式。
41. 头文件一般包含只能被定义一次的实体，例如类、const、constexpr 等。
42. “#define”指令将一个名字设定为预处理变量，#ifdef 当且仅当变量已定义时为真，#ifndef 当且仅当变量未定义时为真，检查结果为真时，执行后续操作知道遇到#endif 指令为止。
43. 为避免与程序中其他实体发生名字冲突，一般将预处理变量名字全部大写。
44. c++11 允许在声明类的数据成员时同时提供初始值，必须在等号右侧或花括号内。

## 第三章笔记

1. 头文件不应包含 using 声明。
2. string 的初始化方式。

```cpp
string s4(n,'c');        //把s4初始化为连续n个字符c组成的串
```

3. string.size()返回的是一个 string::size_type 类型的值(无符号整数类型)。
4. string 对象与字符字面值混在一条语句使用时，必须确保 + 两侧至少有一个是 string 对象。

```cpp
string s2 = (s1 + ",") + "word"
```

5. string 下标运算符[]接收的参数是 string::size_type 类型的值。
6. 模板本身不是类或函数，编译器根据模板创建类或函数的过程称为实例化。

```cpp
vector<string> svec(10,"hi");    //10个string类型的元素都被初始化为hi
 vector<int> ivec(10);            //10个重复执行值初始化的对象
```

7. 列表初始化会尽可能把花括号内的值当成元素初始值的列表处理
8. 如果初始化使用花括号的形式但提供的值不能用来列表初始化，就要考虑用这样的值来构造 vector 对象。

```cpp
vector<string> vstr{10,"hi"};    //10个string类型的元素都被初始化为hi
```

9. 如果循环内包含有向 vector 对象添加元素的语句，则不能使用范围 for 循环，范围 for 语句体内不应改变其所遍历序列的大小。
10. cbegin 和 cend 返回 const_iterator 类型的迭代器，it->mem 与(*it).mem 表达的意思相同。
11. 循环体内任何一种可能改变 vector 对象容量的操作，都会使该对象的迭代器失效。
12. 两个迭代器之差的类型为 difference_type 的带符号整型数。
13. const 迭代器指允许读，不允许写

```cpp
vector<int>::const_iterator it3;    //只能读元素，不能写元素
string::const_iterator it2;            //只能读字符，不能写字符
```

14. 数组的维度必须是常量表达式，不允许用 auto 由初始值推断类型。
15. 用字符串字面值初始化 char 数组，末尾由空字符。

```cpp
int (*parray)[10] = &arr;    //parray指向一个含有10个整数的数组
int (&arrRef)[10] = arr;    //arrRef引用一个含有10个整数的数组
```

16. 使用 auto 推断数组类型时，得到的是指针，而用 decltype 时，其返回的就是数组类型。
17. 指针也是迭代器。

```cpp
int ia[] = {0,1,2,3,4,5,6};
int *beg = begin(ia);
int *last = end(ia);
```

18. 两指针相减是 ptrdiff_t 类型和 size_t 一样是定义在 cstddef 头文件中的机器相关类型。
19. 标准库类型限定下标必须是无符号类型，而内置下标运算无此要求。

```cpp
int *p = &ia[2];
int j = p[1];
int k = p[-2];
```

20. 允许使用空字符结束的字符数组来初始化 string 对象或为其赋值，允许使用空字符结束的字符数组作为其中一个运算对象。

```cpp
char *str = s;                //s是string对象，尝试用string对象初始化字符指针是错误的
const char *str = s.c_str();//正确，string提供c_str()函数返回c风格的字符串,也就是一个指针。
```

21. 可以用数组初始化 vector 对象：

```cpp
int int_arr[] = {0,1,2,3,4,5};
vector<int> ivec(begin(int_arr),end(int_arr));
vector<int> subVec(int_arr + 1,int_arr + 4);
```

22. 范围 for 语句处理数组。

```cpp
size_t cnt = 0;
for (auto &row : ia)
    for (auto &col : row){
        col = cnt;
        ++cnt;
    }
```

23. 使用范围 for 时，除了最内层循环外，其他所有循环的控制变量都应该是引用类型。

```cpp
for (auto row : ia)
    for (auto col : row)        //错误
由于row不是引用类型，而ia的每个元素是数组，因此row会将数组元素转换成指向数组首元素的指针
在内循环中，for试图遍历一个指针，这是错误的。
```

24. c++11 标准使用 auto 或 declyype 能尽可能避免在数组前面加指针类型。

```cpp
int ia[3][4] = {0};
for (auto p = ia; p != ia + 3; ++p) {
    for (auto q = begin(*p); q != end(*p); ++q) {
        cout << *q << ' ';
    }
    cout << endl;
}
```

25. size_t 是一种与机器实现有关的无符号类型，空间足够大，能够表示任意数组的大小。

## 第四章笔记

1. 优先级规定了运算对象组合方式，但没有说明运算对象的求值顺序，对于没有指定执行顺序的运算符来说，如果表达式指向并修改了同一个对象，将会引发错误并产生未定义的行为。

```cpp
int i = 0;
 cout << i << " " << i++ << endl;    //不知道先求++i的值还是先求i的值
 //****************************************************************************
 int num = 5;
 int f1() {
     return num;
 }
 int f2() {
     num = 6;
     return num;
 }
 void test9() {
     int i = f1() * f2();            //不清楚先求f1()还是f2()的值。
     cout << i << endl;
 }
```

2. 如果 m_n 是整数且 n 非 0，则表达式(m/n)_n+m%n 的求值结果与 m 相等。

```cpp
21 % -5 = 1；        21 / -5 = -4；
 -21 % 5 = -1；
```

3. if(val == true)，这种写法的问题是如果 val 不是 bool 值，这种比较就失去原来的意义，if(val)更推荐这种写法。
4. 赋值运算符满足右结合律。
5. 初始值列表为空，编译器创建一个值初始化的临时量并将其赋给左侧运算对象。
6. 多重赋值语句每个对象，它的类型或者与右边对象类型相同、或者可以类型转换为右边对象的类型。

```cpp
int ival，*pval；
 ival = pval = 0；        //错误，但可以单独赋值为0
```

7. 赋值运算优先级较低，通常需要加括号使其符合我们的意愿。

```cpp
int i = get_value();
 while(i != 42){i = get_value();}
 //可以改为
 int i;
 while((i = get_value()) != 42){}
```

8. 复合运算符只求值一次，普通运算符则需要求值两次。
9. 递增、递减运算符，前置版本将对象本身作为左值返回，后置版本将对象原始值的副本作为右值返回。

```cpp
//后置版本需要将原始值存储下来以便返回这个未修改的内容。
 //如果一条子表达式改变了某个运算对象的值，另一条子表达式又要使用该值，运算对象的求值顺序就很重要了
 while(beg != s.end() && !isspace(*beg))
     *beg = toupper(*it);        //错误
 //编译器可能解释为
 *beg = toupper(*beg)         //先求左值
 *(beg + 1) = toupper(*beg);    //先求右值
```

10. 条件运算符满足右结合律，靠右边的条件运算构成了靠左边条件运算的分支。

```cpp
//优先级非常低，注意加括号
int grade = 85;
cout << ((grade > 90) ? "high pass" : ((grade < 60) ? "fail" : "pass")) << endl;
```

11. 如果运算对象是带符号的且值为负，此时左移操作可能会改变符号位的值，在符号位如何处理没有明确规定时，应仅将位运算符用于处理无符号类型。
12. sizeof 满足右结合律，返回常量表达式。

```cpp
sizeof(Sales_data);            //存储该类型对象所占空间大小
sizeof data;                //data类型大小
sizeof p;                    //p指针大小
sizeof *p;                    //p所指类型的空间大小
sizeof data.revenue;        //成员对应类型的大小
sizeof Sales_data::revenue;    //新标准允许使用域运算符获取类成员的大小。
//对数组执行sizeof运算得到整个数组所占空间的大小
//对容器执行sizeof运算返回该类型固定部分的大小
```

13. 逗号运算符规定了运算对象求值的顺序，从左向右。
14. 使用命名的强制类型转换。

```cpp
int j = 10, i = 5;
 double slope = static_cast<double>(j) / i;
 //使用static_cast找回存在于void*指针
 void* p=&d;    
 double *dp = static_cast<double*>(p)
 //static_cast、dynamic_cast、const_cast、reinterpret_cast指定执行的是哪一种转换。
```

15. 类类型能定义由编译器自动执行的转换，比如 IO 库定义了从 istream 向布尔值转换的规则。

## 第五章笔记

1. for 语句的修改发生在每次循环迭代之后。
2. for 的新写法。

```cpp
vector<int> v;
 for(int i;cin >> i;)
     v.push_back(i);
```

3. 在范围 for 语句中，预存了 end()的值，一旦在序列中修改元素，end 函数的值可能变得无效。
4. 异常类型只定义了 what 的成员函数，返回一个指向 c 风格字符串的 const char*提供本文信息。
5. 异常没有被捕捉到时调用 terminate 函数，终止当前程序的执行。

## 第六章笔记

1. 函数是一个命名了的代码块。
2. static 使局部变量生命周期贯穿调用及之后，在第一次执行时初始化，到程序终止才被销毁。

```cpp
//没有显示初始化，将执行值初始化。
 size_t count_calls() {
     static size_t ctr(0);
     return ++ctr;
 }
 int main() {
     for (size_t i = 0; i != 10; ++i) {
         cout << count_calls() << endl;
     } return 0;
 }
```

3. 当函数无需修改引用形参的值，最好使用常量引用。
4. 用实参初始化形参时会忽略掉顶层 const，当形参有顶层 const 时，传常量对象或非常量对象都可以。
5. 关于主函数的参数，第二个形参是一个数组，指向 c 风格字符串，第一个形参 argc 表示数组中字符串数量。

```cpp
//可选实参从argv[1]开始，argc[0]保存程序的名字。
  int main(int argc,char *argv[])
```

6. 如果函数实参数量未知，但全部实参类型相同，可以使用 initializer_list 类型的形参。

```cpp
void print(std::initializer_list<string> str) {
     for (auto i = str.begin(); i != str.end(); ++i) {
         cout << *i << " ";
     }
 }
 int main() {
     print({ "ddsada", "dsadsadsa", "dsaadsda", "dasdsadasdas" });    //必须带大括号
     return 0;
 }
 //initializer_list对象中的元素永远是常量值。
```

7. 返回类型是 void 的函数会隐式执行 return;
8. 此函数返回类型与形参都是 const string 的引用，因此不论调用还是返回结果都不会拷贝 string 对象。

```cpp
const string &shorterString(const string &s1, const string &s2) {
     return s1.size() <= s2.size() ? s1 : s2;
 }
 //无法返回局部对象的引用
```

9. c++11 规定，函数可以返回花括号包围的值的列表，如果列表为空，临时量执行值初始化。
10. 允许 main 函数没有 return 语句直接结束，cstdlib 定义了两个预处理变量，使用这两个变量表示成功或失败。

```cpp
return EXIT_FAILURE;
 return EXIT_SUCCESS;
```

11. 定义返回数组指针的函数，数组维度必须跟在函数名字之后。

```cpp
int(*func(int i))[10];
//使用类型别名：
using arrT = int[10];
arrT* func(int i);
```

12. 使用尾置返回类型。

```cpp
auto func(int i) -> int(*)[10];
```

13. 使用 decltype 声明返回类型，arrPtr 返回指向含有 5 个整数的数组的指针，decltype 的结果是个数组，其不负责将数组类型转换成对应的指针，所以需要加*。

```cpp
int odd[] = { 1,3,5,7,9 };
int even[] = { 0,2,4,6,8 };
decltype(odd) *arrPtr(int i) {
    return (i % 2) ? &odd : &even;
}
```

14. int 数组的引用。

```cpp
auto printNum(int(&num)[6]) -> int(&)[6] {
    for (auto i = begin(num); i != end(num); ++i) {
        *i += 1;
    }
    return num;
}
int main() {
    int num1[] = { 1,2,3,4,5,6 };
    printNum(num1);
    for (auto i : num1) {
        cout << i;
    }
    return 0;
}
```

15. 顶层 const 不影响传入函数的对象，底层 const 影响。

```cpp
Record lookup(Phone);
Record lookup(const Phone);        //重复声明，顶层const
Record lookup(Phone*)
Record lookup(phone* const);    //重复声明，顶层const
//***************************************************
Record lookup(Account&);
Record lookup(const Account&);    //新函数，底层const
```

16. 当传递非常量对象或者指向非常量对象的指针，编译器优先选用非常量版本的函数。
17. 在内层作用域声明名字，它将隐藏外层作用域中声明的同名实体。
18. 默认实参作为形参的初始值出现在形参列表中，一旦某个形参被赋予了默认值，后面的所有形参都必须有默认值。

```cpp
string screen(string::size_type ht=24,string::size_type wid=80,char backgrnd = ' ');
//给定作用域中一个形参只能被赋予一次默认实参，后续声明中不能修改一个已存在的默认值，但可以给没有默认值的形参添加默认值。
//局部变量不能当作默认实参，表达式类型能转换成形参所需类型，该表达式就能作为默认实参。
```

19. 名字的求值过程发生在函数调用，用作默认实参的名字在函数声明所在的作用域内解析。

```cpp
using str = string;
str wd = "123";
char def = ' ';
str ht() { return "123"; }
string screen(str a = ht(), str b = wd, char c = def) {
    cout << a << b << c << endl;
    return "123";
}
void f5() {
    def = '*';                //改变了
    str wd = "456";            //没改变，该局部变量与传递给screen的默认实参没有关系。
    str window = screen();
}
```

20. inline 用于声明内联函数，编译过程中会进行内联的展开，避免了原函数调用需要保存寄存器以及后面的恢复等一系列开销。

```cpp
//内联机制用于优化规模小、流程直接、频繁调用的函数。
inline auto shorterString(const string &s1,const string &s2) -> const string &{
    return s1.size() <= s2.size() ? s1 : s2;
}
```

21. constexpr 函数指能用于常量表达式的函数，其返回类型及所有形参类型必须是字面值类型，函数体内必须有且只有一条 return 语句。

```cpp
constexpr int new_sz(){return 42;}
constexpr int foo = new_sz();
constexpr size_t scale(size_t cnt){ return new_sz() * cnt;}    //当实参是常量表达式，返回值也是常量表达式，反之不然！。
//constexpr函数不一定返回常量表达式！！
//内联函数和constexpr函数可以在程序中多次定义，其多个定义必须完全一致，因此这两个函数 通常定义在头文件中。
```

22. 含有多个形参的函数匹配。

```cpp
f(int,int);
 f(double,double);
 //调用函数f(42,2.56);如果按第一个实参来说，f(int,int)是最优匹配，如果按第二个实参来说f(double,double)是最优匹配。
 //编译器最终将因为这个调用具有二义性而拒绝其请求。
```

23. 所有算术类型转换的级别一样。

```cpp
void manip(long);
 void manip(float);
 manip(3.14);        //错误，因为3.14是double类型，其既可转换成long也可转换成float。
```

24. 函数指针指向的是函数。

```cpp
bool lengthCompare(const string &,const string &);
 //该函数类型: bool(const string&,const string&);
 //指向该函数的指针: bool (*pf)(const string&,const string &);
```

25. 使用指向重载函数的指针时，指针类型必须与重载函数中的某一个精确匹配。

## 第七章笔记

1. 定义在类内部的函数是隐式的 inline 函数。
2. 当调用一个成员函数时，用请求该函数的对象地址初始化 this。

```cpp
total.isbn() == Sales_data::isbn(&total)    //伪代码
  //成员函数内部，this指针所指的正是本对象，this是一个常量指针。
```

3. 默认情况下 this 的类型是指向类类型非常量版本的常量指针，因此不能在常量上调用普通成员函数。

```cpp
//c++允许把const关键字放在成员函数的参数列表之后，紧跟在参数列表后面的const表示this是一个指向常量的指针。
  //这样使用const的成员函数被称为常量成员函数，其不能改变调用它的对象的内容。
```

4. IO 类不能被拷贝。
5. 拷贝类的对象其实拷贝的是对象的数据成员。
6. 构造函数不能被声明成 const，因此构造函数在 const 对象的构造过程中可以向其写值。
7. 编译器创建的构造函数又被称为合成的默认构造函数，如果存在类内初始值，用它初始化成员，否则，默认初始化，含有内置类型或复合类则成员的类应该在类的内部初始化这些成员，否则可能得到未定义的值。
8. 如果需要默认的行为，可以通过在参数列表后写上=default 来要求编译器生成构造函数。
9. 一个类可以包含 0 或多个访问说明符，对于某个访问说明符出现的次数也没有严格限定。
10. struct 和 class 的区别在于，使用 struct 关键字，其成员默认为 public 权限，对于 class，这些成员默认为 private。
11. 友元声明可以使非类的成员访问类的 private 成员，只能在类定义的内部声明。
12. 友元声明仅指定了了访问权限，并不代表函数声明。
13. 无须在声明和定义的地方同时说明 inline。
14. 关键字 mutable 声明可变数据成员，即使在 const 成员函数内也可以改变其值。
15. 基于 const 的函数重载，在某个对象调用该函数时，该对象是否是 const 决定应该调用哪个版本的函数。
16. 一旦一个类的名字出现，它就被认为声明过了。

```cpp
class Screen;        //声明，但未定义，可以定义指向这种类型的指针或引用。
```

17. 一旦遇到了类名，定义的剩余部分就在类的作用域之内了。
18. 如果没有在构造函数的初始值列表中显式初始化成员，则该成员将在构造函数体之前执行默认初始化。
19. 对于类成员是 const 或者引用，必须通过构造函数初始值进行初始化。
20. 成员初始化顺序与类定义中出现顺序一致。

```cpp
class X{
     int i;
     int j;
 public:
     X(int val):j(val),i(j){}        //未定义
 };
```

21. 委托构造函数使用它所属类的其它构造函数执行它自己的初始化过程。

```cpp
class Sales_data{
    public:
        //构造函数1
        Sales_data(std::string s,unsigned cnt,double price):bookNo(s),units_sold(cnt),revenue(cnt*price){}
        //委托构造函数

        //构造函数2
        Sales_data():Sales_data(" ",0,0){}                //委托给构造函数1
        //构造函数3
        Sales_data(std::string s):Sales_data(s,0,0){}    //委托给构造函数2
        Sales_data(std::istream &is):Sales_data(){read(is,*this);}        //委托给构造函数3
}
//当一个构造函数委托给另一个构造函数时，受委托的构造函数的初始值列表和函数体被依次执行。
```

22. 能通过一个实参调用的构造函数定义了一条从构造函数的参数类型向类类型隐式转换的规则。

```cpp
/*编译器只会自动执行一步类类型转换。
 使用explicit阻止构造函数隐式创建Sales_data对象，只对一个实参的构造函数有效。
 多个实参的构造函数不能用于隐式转换。*/
 explicit Sales_data::Sales_data(istream& is){
    read(is,*this);
 }
 //explicit构造函数只能用于直接初始化
```

23. 类的静态成员存在于任何对象之外，被所有对象共享，类静态成员函数也不与任何对象绑定，并且不含 this 指针，不能声明成 const，可以使用类的对象、引用或指针来访问静态成员。
24. 即使一个常量静态数据成员在类内部被初始化了，通常情况下也应该在类的外部定义该成员。

---

## 第八章笔记

1. 不能拷贝 IO 对象，也不能将形参或返回值设置为流对象，进行 IO 操作的函数通常以引用方式传递和返回流。

> 读写 IO 对象会改变其状态，因此传递和返回的引用不能是 const 的.

2. 只有当一个流处于无错状态时，才能读取数据和写入数据。
3. 使用 good 或 fail 是确定流的总体状态的方法。
4. 如果先输入了一些字符，没有回车换行重新输入 Ctrl+Z，那么输入缓冲区由于存在其他的可读数据，从而不会检测到 Ctrl+Z(因为有要读的数据，所以不能认为到了文字流的末尾),所以，若想在 windows 下正确执行 EOF，必须新的一行只输入 Ctrl+ Z 指令。
5. 对 cerr 是设置 unitbuf 的，因此写到 cerr 的内容都是立即刷新的。

> 当读写被关联的流时，关联到的流的缓冲区会被刷新。

6. 类似 endl 的操作符，flush 刷新缓冲区，但不输出任何额外字符，ends 向缓冲区插入一个空字符，然后刷新缓冲区。
7. unitbuf 操作符，告诉流接下来的每次写操作都进行一次 flush 操作。

> nounitbuf 操纵符则重置流，使其恢复使用正常的系统管理的缓冲区刷新机制。
> 如果程序异常终止，输出缓冲区是不会被刷新的。

8. 如果创建文件流对象时，提供文件名，则 open 函数会自动被调用。

```cpp
ifstream in(ifile);
 ofstream out;    //输出文件流未关联到任何文件。
 //当一个fstream对象离开其作用域时，与之关联的文件会自动关闭
```

9. 每个文件流类型定义一个默认的文件模式，ifstream 关联的文件默认以 in 模式打开，与 ofstream 关联的文件默认以 out 模式打开。
10. 对同一个 stringsteam 对象重复赋值时，就需要对流使用 clear()函数复位流的状态，不过此时并未清空之前的数值

## 第九章笔记

1. 与内置数组相比，array 是一种更安全、更容易使用的数组类型。
2. 反向迭代器就是反向遍历容器的迭代器，其各操作的含义也发生了颠倒。
3. 定义 array 时除了指定元素类型，还要指定容器大小。

```cpp
array<int,42>        //保存42个int的数组。
  array<int,42>::size_type i;
```

4. 内置数组类型不能进行拷贝和对象赋值操作，但 array 可以。但类型和大小必须一样，array 不支持花括号列表赋值。
5. 赋值相关运算会导致指向左边容器内部的迭代器、引用和指针失效，swap 操作将容器内容交换不会导致指向容器的迭代器、引用、指针失效。（string、array 除外）
6. assign 允许从一个不同但相容的类型赋值，或者从容器的一个子序列赋值。
7. 对 string 调用 swap 会导致迭代器、引用和指针失效，swap 两个 array 会真正交换它们的元素。
8. 比较两个容器实际上是进行元素的逐对比较。
9. 当用一个对象初始化容器或插入容器中，实际上放入容器中的对象值是一个拷贝，而不是对象本身，容器中的元素与提供值的对象之间无任何关联。
10. list 不支持 push_front 但可以用 insert 代替。

```cpp
list<string> slist;
 slist.insert(slist.begin(),"hello");    //等价于slist.push_front("hello");
```

11. list 使用 insert 操作

```cpp
list<string> lst;
 auto iter = lst.begin();
 while(cin >> word) iter= lst.insert(iter,word);    //反复调用push_front
```

12. c++11 新标准引入 emplace_front、emplace、emplace_back 对应 push_front、insert、push_back。

> 后者将元素类型的对象传递给它们，这些对象被拷贝到容器中。
> 前者则是将参数传递给元素类型的构造函数，emplace 成员使用参数在容器管理的内存空间中直接构造元素。

```cpp
Sales_data c;
 c.emplace_back("978-05321",25,15.6);        //构造元素
 c.push_back(Sales_data("978-05321",25,15.6));    //赋值元素
```

13. at 和下标操作只适用于 string、vector、deque、array

> c.at(n),返回下标为 n 的元素的引用，如果下标越界，则抛出 out_of_range 异常。

14. slist.clear();

```cpp
slist.erase(slist.begin(),slist.end());    //等价调用
```

15. resize 可以增大或缩小容器，多删少补。

```cpp
list.resize(25,-1);    //添加-1直至容器满25个元素,array不使用
```

16. 当删除元素时，尾后迭代器总会失效。
17. 申请空间操作。

```cpp
c.shrink_to_fit();        //适用于vector、string、deque，将capacity减少为和size相同大小
 c.capacity();            //当前c可以保存的元素个数
 c.reserve(n);            //分配至少能容纳n个元素的内存空间
```

> 只有需要的内存空间超过当前容量，reserve 调用才会改变 vector 的容量。
> 如果大于当前容量，至少分配与需求一样大的内存空间，可能更大
> 如果小于等于当前容量，reserve 什么也不做。

18. 可以调用 shrink_to_fit 来要求 deque、vector、string 退回不需要的内存空间，但调用 shrink_to_fit 也并不保证一定退回内存空间。
19. 对于 vecotr，size 是指它已经保存的元素的数目，而 capacity 则是在不分配新的内存空间的前提下它最多可以保存多少元素。
20. 只要没有操作需求超出 vector 的容量，vector 就不能重新分配内存空间。
21. advance() 函数用于将迭代器前进（或者后退）指定长度的距离
22. 注意 insert、erase、assign、append、replace、substr、find 等函数的用法。
23. compare 函数，数值转换 to_string，浮点数转换 stod
24. string 参数中第一个非空白符必须是符号(+ 或-)或数字。数字可以以 0x 或 0X 开头表示 16 进制。

```cpp
string s2 = "pi = 3.1419ssss";
 double d = stod(s2.substr(s2.find_first_of("+-.0123456789")));
```

25. 所有适配器都要求容器具有添加和删除元素的能力，适配器不能构造在 array 之上。

> 栈默认基于 deque 实现，stack 可以使用除 array、forward_list 之外的任何容器类型来构造 stack。
> queue 默认基于 deque 实现，queue 可以构造于 list 或 deque 之上，但不能基于 vector 构造。
> priority_queue 默认基于 vector 实现，priority_queue 可以构造于 vector、deque 之上，但不能基于 list 构造。

26. priority_queue 允许我们为队列的元素建立优先级，新加入的元素排在优先级比它低的已有元素之前。

## 第十章笔记

1. 泛型算法永远不会执行容器的操作，只会运行于迭代器之上，执行迭代器操作。
2. accumulate 求和函数第三个参数决定函数中使用哪个加法运算符以及返回值类型!!。

> 由于 string 定义了 + 运算符，所以可以用 accumulate 将其连接起来。
> string sum = accumulate(v.cbegin(),v.cend(),string(“”));
> 对于只读取而不改变元素的算法，最好使用 cbegin 和 cend。

3. equal 假定第二个序列至少于第一个序列一样长。

```cpp
equal(roster1.cbegin(),roster1.cend(),roster2.cbegin());
```

4. 插入迭代器 back_inserter 接受一个指向容器的引用，返回一个与该容器绑定的插入迭代器。

> 通过此迭代器赋值时，赋值运算会调用 push_back 将一个具有给定值的元素添加到容器中。

5. sort 利用元素 < 运算符实现排序，unique 重排 vector，使不重复的元素出现在 vector 的开始部分。

```cpp
void elimDups(vector<string> &words) {
         std::sort(words.begin(), words.end());
         auto end_unique = unique(words.begin(), words.end());        //并没有删除元素，只是将不重复元素排在开始部分
         words.erase(end_unique, words.end());                        //删除元素
     }
```

6. 谓词是一个可调用的表达式，返回结果是一个能用作条件的值。
7. 一元谓词意味着它们只接受单一参数，二元谓词表示它们有两个参数。
8. 调用一个二元谓词参数的 sort 版本用这个谓词代替 < 来比较元素。

```cpp
bool isShorter1(const string &s1,const string &s2) {
         return s1.size() < s2.size();
     }
     int main() {
         vector<string> txt{ "the","quick", "red", "fox", "jumps", "over", "the", "slow", "red", "turtle" };
         std::sort(txt.begin(), txt.end(), isShorter1);
         for (auto i : txt) { cout << i << " "; }
         return 0;
     }
```

9. stable_sort 是一种稳定排序的算法，其维持相等元素的原有顺序。
10. 熟悉 sort、stable_sort、partition 算法，partition 返回的是最后一个使谓词为 true 的元素的后一个位置的迭代器
11. find_if 接受一元谓词，算法对输入序列中每个元素调用给定的谓词，返回第一个使谓词返回非 0 值的元素。
12. 对于一个对象或一个表达式，如果可以对其使用调用运算符，则称它为可调用的。
13. 可调用对象：函数、函数指针、重载了函数调用运算符的类、lambda 表达式。
14. 一个 lambda 表达式表示一个可调用的代码单元，可以理解为未命名的内联函数。
15. lambda 必须使用尾置返回来指定返回类型，可以忽略参数列表和返回类型，但必须永远包含捕获列表和函数体。

```cpp
[capture list](parameter list)->return type {function body}
    auto f =[]{return 42;}
    cout << f() << endl;
```

16. 如果忽略返回值类型，lambda 根据函数体中代码推断出返回类型。
17. lambda 不能有默认参数。

```cpp
auto it = std::partition(txt.begin(), txt.end(), [](string str) {return str.size() >= 5; });
```

18. 一个 lambda 只有在其捕获列表中捕获一个它所在函数中的局部变量，才能在函数体中使用该变量。
19. for_each 算法，接受一个可调用对象，并对输入序列中每个元素调用此对象。

```cpp
void elimDups(vector<string> &words) {
        std::sort(words.begin(), words.end());
        auto end_unique = unique(words.begin(), words.end());        //并没有删除元素，只是将不重复元素排在开始部分
        words.erase(end_unique, words.end());                        //删除元素
    }
    string make_plural(size_t ctr, const string &word, const string &ending) {
        return (ctr > 1) ? word + ending : word;
    }
    void biggies(vector<string> &words, vector<string>::size_type sz) {
        elimDups(words);                                            //字典排序，删除重复词。
        std::stable_sort(words.begin(), words.end(),                //从小到大排序
            [](const string &a, const string &b){return a.size() < b.size(); });
        auto wc = std::find_if(words.begin(), words.end(),            //wc迭代器指向第一个满足size()>=sz的元素。
            [sz](const string &a) {return a.size() >= sz; });
        auto count = words.end() - wc;                                //元素数目
        cout << count << " " << make_plural(count, "word", "s") << " of length " << sz << " or longer" << endl;
        std::for_each(wc, words.end(),
            [](const string &s) {cout << s << " "; });
        cout << endl;
    }
    int main() {
        vector<string> txt{ "the","quick", "red", "fox", "jumps", "over", "the", "slow", "red", "turtle" };
        biggies(txt, 4);
        return 0;
    }
```

20. 当向一个函数传递一个 lambda 时，同时定义了一个新类型和该类型的一个对象：传递的参数是此编译器生成的类类型的未命名对象。

> 1. 当使用 auto 定义一个用 lambda 初始化的变量时，定义了一个从 lambda 生成的类型的对象。

21. 采用值捕获的前提是变量可以拷贝，被捕获的变量的值在 lamdba 创建时拷贝，而不是调用时拷贝。

```cpp
void fcn(){
     size_t v1 = 42;
     auto f = [v1]{return v1;};        //创建时拷贝。
     v1 = 0;
     auto j = f();        //j为42
 }
```

22. 如果我们采用引用方式捕获一个变量，就必须确保被引用的对象在 lambda 执行的时候是存在的。
23. 显示捕获的变量必须使用与隐式捕获不同的方式。

```cpp
[=](const string &s){return s.size() >= sz;};        //隐式值捕获
 [&](const string &s){return s.size() >= sz;};        //隐式引用捕获
 [&,c](const string &s){os << s << c};                //混合捕获
 [=,&os](const string &s){os << s << c};            //混合捕获
```

24. 如果希望改变一个被捕获的变量的值，就必须在参数列表首加上关键字 mutable。

```cpp
[v1]()mutable{return ++v1;};
```

25. 一个引用捕获的变量是否可以修改，依赖于此引用指向的是 const 类型还是非 const 类型。
26. transform 算法将输入序列中每个元素替换为可调用对象操作该元素得到的结果。

```cpp
transform(vi.begin(),vi.end(),vi.begin(),[](int i){return i < 0?-i:i;});    //该表达式返回int
 transform(vi.begin(),vi.end(),vi.begin(),[](int i)->int {if(i<0) return -i; else return i;});        //必须指定返回值
```

27. bind 函数接受一个可调用对象，生成一个新的可调用对象来“适应”原对象的参数列表。

```cpp
//std::placeholders::_1代表此参数对应check_size的第一个参数，const string&，调用此函数必须传入const string类型
 //check_size的第二个参数绑定到sz的值。
 std::bind(check_size, std::placeholders::_1, sz);        //生成新的可调用对象，将其第一个参数传递给check_size
 //f的1、2、4参数分别绑定到a、b、c上。
 auto g = bind(f,a,b,_2,c,_1);                //g是一个有两个参数的可调用对象
 //调用g(_1,_2)映射成f(a,b,_2,c,_1)
```

28. 使用 bind 颠倒参数。

```cpp
sort(words.begin(),words.end(),isShorter);        //比较两个元素A、B时，调用isShorter(A,B)
 //比较两个元素A、B时，将A、B传入bind返回的可调用对象，此对象第一个参数绑定到isShorter的第二个参数，第二个参数绑定到isShorter的第一个参数。
 sort(words.begin(),words.end(),bind(isShorter,_2,_1));
```

29. 默认情况，bind 那些不是占位符的参数被拷贝到 bind 返回的可调用对象中，但例如流对象无法被拷贝，可以绑定引用。

```cpp
ostream &print(ostream &os,const string &s,char c){
     return os << s << c;
 }
 for_each(words.begin(),words.end(),bind(print,os,_1,' '));        //错误，不能拷贝os，因为bind拷贝其参数
 //如果希望传递给bind一个对象而又不拷贝它，必须使用ref函数。
 for_each(words.begin(),words.end(),bind(print,ref(os),_1,' '));
//ref返回一个对象，包含给定的引用，此对象是可拷贝的。
//cref函数 ，生成一个保存const引用的类。
```

30. 插入迭代器：迭代器被绑定到一个容器上，可用来向容器插入元素。

> 流迭代器：迭代器被绑定到输入或输出流上，可用来遍历所关联的 IO 流。
> 反向迭代器：这些迭代器向后而不是向前移动，除 forward_list 之外的标准库容器都有反向迭代器。
> 移动迭代器：这些专用的迭代器不是拷贝其中的元素，而是移动它们。

31. 插入器是一种迭代器适配器，接受一个容器，生成一个迭代器，当通过插入迭代器进行赋值，该迭代器调用容器操作向给定容器的指定位置插入元素。
32. back_inserter 创建一个使用 push_back 的迭代器,front_inserter 创建一个使用 push_front 的迭代器,inserter 创建一个使用 insert 的迭代器。
33. istream_iterator 读取输入流，ostream_iterator 向一个输出流写数据。

```cpp
istream_iterator<int> int_it(cin);    //从cin读取int
 istream_iterator<int> eof;        //默认初始化，创建一个尾后迭代器。
 istream_iterator<int> in_iter(cin),eof;
 vector<int> vec(in_iter,eof);        //从迭代器范围构造vec
```

34. istream_iterator 允许使用懒惰求值。
35. 不允许空的或表示尾后的 ostream_iterator，创建 ostream_iterator 可以提供第二个 C 风格字符串的参数，在输出每个元素后都会打印此字符串。

```cpp
ostream_iterator<int> out_iter(cout," ");
 copy(vec.begin(),vec.end(),out_iter);        //调用copy打印vec的元素
```

36. 除 forward_list 外，其他容器可以通过 rbegin、rend、crbegin、crend 来获取反向迭代器。

```cpp
sort(vec.rbegin(),vec.rend());        //同给给sort传递反向迭代器，获取递减序列。
```

37. 流迭代器不支持递减运算，因为不可能在一个流中反向移动。
38. 通过使用 reverse_iterator 的 base 成员函数，能够将反向迭代器转换为普通迭代器，但两者指向的元素不同！！
39. 普通迭代器和反向迭代器的关系反映了左闭合区间，因此两者必须生成相邻位置，而不是相同位置。
40. 输入迭代器：可以读取序列中的元素。输出迭代器，看作是输入迭代器的补集，可写。

> 前向迭代器：单向，支持输入输出。
> 双向迭代器：双向，支持读写，还支持递增递减运算符。
> 随机访问迭代器：基本支持所有功能。

41. 对于 list 和 forward_list 应该优先使用成员函数版本的算法而不是通用算法。
42. 链表版本的算法会改变底层的容器。

## 第十一章笔记

1. 当从 map 中提取一个元素，会得到一个 pair 类型的对象，pair 是一个模板类型，保存两个名为 first 和 second 的数据成员，分别保存关键字和对应的值
2. 对 map 对象进行下标操作，如若关键字不在 map 中，下标运算符会在 map 中创建一个新元素(关键词)，对应值为默认初始化值。
3. 关联容器不支持顺序容器的位置相关操作，不支持构造函数或插入操作等接受一个元素值和一个数量值的操作，关联容器迭代器都是双向的。
4. 关键字类型必须定义元素比较的方法，默认情况，标准库使用 < 运算符来比较两个关键字。如果是一个类类型，且没有包含比较方法，则不合法，可以自行定义比较类型。
5. 向算法提供自定义的比较操作，必须在关键字类型上定义一个严格弱序。
6. 当创建容器时，才会以构造函数参数的形式提供真正的比较操作。

```cpp
//当我们使用decltype作用于某个函数时，它返回函数类型而非指针类型
  std::multiset<Sales_item, decltype(compareIsbn)*> bookstore(compareIsbn);
```

7. pair 默认构造函数对数据成员进行值初始化，构造 pair 需要提供两个参数类型。pair 的数据成员是 public 的。

```cpp
make_pair(v1,v2);    //返回一个用v1、v2初始化的pair，其类型由参数推断而来。
```

8. 返回 pair 的函数，其返回值可以使用列表初始化。

```cpp
pair<string,int> process(vector<string> &v){
      if(!v.empty()){
          return {v.back(),v.back().size()};        //列表初始化
          //return make_pair(v.bakc(),v.back().size());        //使用make_pair
      }else{
          return pair<string,int>();        //隐式构造返回值。
      }
  }
```

9. 当使用一个迭代器遍历一个 map、multimap、set 或 multiset 时，迭代器按关键字升序遍历元素。
10. 对一个 map 进行 insert 操作时，必须记住元素类型是 pair。

```cpp
word_count.insert({word,1});
 word_count.insert(make_pair(word,1));
 word_count.insert(pair<string,size_t>(word,1));
 word_count.insert(map<string,size_t>::value_type(word,1));
```

11. insert 返回值依赖于容器类型和参数，添加单一元素的 insert 和 emplace 版本返回一个 pair，pair 的 first 成员是个迭代器，指向具有给定关键字的元素，second 成员是个 bool 值，插入成功返回 true，元素已存在返回 false。

```cpp
//统计单词
int main() {
    std::map<string, size_t> word_count;
    string word;
    while (cin >> word)
        ++word_count.insert({ word,0 }).first->second;
    for (auto i : word_count)
        cout << i.first << ": " << i.second << endl;
    return 0;
}
```

12. map 进行下标操作，如果关键字不在 map 中会插入 map，然后进行值初始化。

> 由于可能有插入操作，只能对非 const 的 map 和 unordered_map 类型使用下标操作。

13. at 函数访问关键字，带参数检查。若其不在 map 中，则抛出异常。
14. 通常情况，解引用一个迭代器返回的类型与下标运算符返回的类型是一样的。
15. 对 map 进行下标操作，会获得一个 mapped_type 对象，当解引用一个 map 迭代器时，会得到一个 value_type(pair)对象。
16. 查找一个特定元素是否在容器中，find 是最好的操作，对于允许重复的容器，使用 count 会统计相同关键字的个数。
17. lower_bound(k) 返回指向第一个关键字不小于 k 的元素的迭代器

> upper_bound(k) 返回指向第一个关键字大于 k 的元素的迭代器
> equal_range(k) 返回一个迭代器 pair，表示关键字为 k 的元素的范围，若 k 不存在 pair 两个元素均为 c.end()。

18. 对于重复关联容器，可以使用 upper_bound 和 lower_bound 确定相同关键字范围，如果其返回相同迭代器，则给定关键字不在容器中。
19. 可以直接使用 equal_range 确定范围，返回一个迭代器 pair，第一个迭代器相当于 lower_bound，第二个相当于 upper_bound。
20. 无序关联容器使用哈希函数和关键字类型的==运算符来组织元素。无序容器提供了与有序容器相同的操作。
21. 无序容器使用关键字类型的==运算符比较元素，用 hash 类型的对象来生成每个元素的哈希值。
22. 标准库为内置类型，包括指针 提供了 hash 模板，还为一些标准库类型，包括 string 和智能指针定义了 hash，

> 因此可以直接定义关键字是内置类型、string、智能指针类型的无序容器。
> 不能直接定义关键字类型为自定义类型的无序容器，不能直接使用哈希模板，必须提供我们自己的 hash 模板版本。

23. 哈希函数使用标准库 hash 类型的对象来计算哈希值。
24. 相同关键字的元素是相邻存储的！

## 第十二章笔记

1. 静态内存保存局部 static 对象，类 static 数据成员，以及定义在任何函数之外的变量。
2. 栈内存用来保存定义在函数内的非 static 对象，分配在静态或栈内存中的对象由编译器自动创建和销毁。
3. 栈对象，仅在其定义的程序块运行时才存在，static 对象在使用之前分配，在程序结束时销毁。
4. 每个程序还拥有一个内存池，这部分内存被称为自由空间或堆(heap)，程序用堆来存储动态分配的对象。
5. shared_ptr 允许多个指针指向同一个对象；

> 1. unique_ptr 则独占所指向的对象；
>    weak_ptr 伴随类，它是一种弱引用，指向 shared_ptr 所管理的对象。
> 2. 解引用智能指针返回其对象，默认初始化的智能指针保存一个空指针。其可以作为条件判断，若 ptr 指向一个对象，则为 true。

```cpp
shared_ptr<string> ptr;        //shared_ptr，可以指向string
 shared_ptr<vector<int>> ptr;    //可以指向int的list
```

6. make_shared 用其参数来构造给定类型的对象，如果不传递任何参数，对象会进行值初始化。
7. 当进行拷贝或赋值操作，每个 shared_ptr 都会记录有多少其他 shared_ptr 指向相同对象。

> 每个 shared_ptr 都有一个关联的计数器，称为引用计数，拷贝一个 shared_ptr，计数器会递增。
> 当给 shared_ptr 赋予一个新值或 shared_ptr 被销毁，计数器就会递减。
> 一个 shared_ptr 计数器变为 0，它就会自动释放自己所管理的对象。

8. 默认情况，动态分配的对象是默认初始化的，意味着内置类型或组合类型的对象的值将是未定义的，类类型将用默认构造函数。

```cpp
int *p0 = new int;    //默认初始化，未定义
 int *p1 = new int();    //值初始化，与上者差别很大
 int *p = new int{ 1024 };
 string *str = new string{ "456" };
 string *str1 = new string();    //值初始化，空串，其实无意义，因为对象都会通过默认构造函数来初始化
 vector<int> *pv = new vector<int>{ 0,1,2,3,4,5,6,7,8,9 };
 //编译器用初始化器的类型来推断要分配的类型
 auto p1 = new auto(1);                //p1为int*
 //auto p2 = new auto{1, 2, 3};        //错误，只能有单个初始化器
```

9. 动态分配的 const 对象必须初始化。

```cpp
const int *pci = new const int(1024);    //分配并初始化一个const int
  const string *pcs = new const string;    //分配一个string，隐式执行默认初始化。
```

10. 如果 new 不能分配所要求的内存，会抛出一个类型为 bad_alloc 的异常，可以改变使用 new 的方式来阻止它抛出异常。

```cpp
int *p1 = new int;                //分配失败，抛出异常
 int *p2 = new (nothrow) int;    //分配失败，会返回一个空指针(定位new)，定位new允许向new传递额外的参数。
```

11. 传递给 delete 的指针必须指向动态分配的内存，或一个空指针，释放一个空指针总是没有错误的。
12. 由内置指针管理的动态对象，直到被显式释放之前它都是存在的。如果指针是局部变量，那么直到指针被销毁，其指向的动态分配的空间也不会销毁。
13. delete 一个指针后，其值就已经无效了，指针变为空悬指针。
14. 接受智能指针构造函数是 explicit 的，因此不能将一个内置指针隐式转换为智能指针，必须使用直接初始化。

```cpp
shared_ptr<int> p2(new int(1024));        //直接初始化
 shared_ptr<int> p3 = new int(1024);    //错误
```

15. 我们可以将智能指针绑定到一个指向其他类型资源的指针上，但必须提供自己的操作代替 delete。
16. 使用内置指针去访问智能指针所负责的对象是危险的，因为无法知道对象何时会被销毁。
17. 只有在确定代码不会 delete 指针的情况下，才能使用 get，使用 get 返回的指针的代码不能 delete 此指针！！

> 永远不要用 get 初始化另一个智能指针或者为另一个智能指针赋值。

```cpp
shared_ptr<int> p(new int(42));    //引用计数1
int *q = p.get();            //引用计数不会增加
{
    shared_ptr<int>(q);    //引用计数为1，相互独立！
}
int foo = *p;    //未定义
```

18. 用 reset 来将一个新的指针赋予一个 shared_ptr。

```cpp
p = new int(1024);            //错误
 p.reset(new int (1024));    //reset会更新引用计数，经常与unique一起使用。
 if(!p.unique()){
     p.reset(new string(*p));    //如果不是唯一用户，分配新的拷贝
 }
 *p += newVal;        //唯一的用户，可以改变对象的值。
```

19. 当发生异常时，我们直接管理的内存是不会自动释放的！
20. 默认 shared_ptr 假定它们指向的是动态内存，当一个 shared_ptr 被销毁时，它默认对它管理的指针进行 delete 操作。

   1. 不使用相同的内置指针值初始化或 reset 多个智能指针。
   2. 不 delete get()返回的指针
   3. 不使用 get 初始化或 reset 另一个指针。
   4. 如果使用 get 返回的指针，当最后一个对应的智能指针销毁后，此指针失效
   5. 如果使用智能指针管理的资源不是 new 分配的内存，记住传递给它一个删除器。
21. 某个时刻只能有一个 unique_ptr 指向一个给定对象，定义 unique_ptr 需要将其绑定到 new 返回的指针上，必须采用直接初始化。
22. unique_ptr 不支持普通的赋值和拷贝操作。
23. u.release 函数放弃 u 对指针的控制权，返回指针。u.reset 释放 u 指向的对象。
24. weak_ptr 是一种不控制所指向对象生存期的智能指针，指向由一个 shared_ptr 管理的对象。

```cpp
//将一个weak_ptr绑定到shared_ptr不会改变shared_ptr的引用计数，当shared_ptr被销毁，对象也被销毁。
 auto p =make_shared<int>(42);
 weak_ptr<int> wp(p);    //wp弱共享p，p的引用计数未改变。
 //由于对象可能不存在，必须调用lock来获取指向共享对象的shared_ptr，使用时必须判断对象是否存在！
```

25. 标准库包含一个名为 allocator 的类，允许我们将分配和初始化分离，使用 allocator 通常会提供更好的性能和更灵活的内存管理能力。
26. 通常称 new T[]分配的内存为动态数组，但动态数组并不是数组类型！不能对其使用 begin、and、for 范围语句等。

```cpp
int *p = new int[get_size()];    //pia指向第一个int
 typedef int arrT[42];
 int *p = new arrT;    //相当于 int *p = new arrT[42];
```

27. new 分配的对象，都是默认初始化，可以对数组中的元素进行值初始化。

```cpp
int *pia = new int[10]();            //10个值初始化为0的int
 string *psa = new string[10]();    //10个空string
 int *pia 2 = new int[10]{0,1,2,3,4,5,6,7,8,9};    //可以提供初始化列表进行初始化。
```

28. 当我们用 new 分配一个大小为 0 的数组时，new 返回一个合法的非空指针，类似尾后指针，不能解引用。
29. 销毁数组时，数组中的元素按逆序销毁。

```cpp
delete [] p;        //方括号指示编译器此指针指向第一个对象数组的第一个元素。
```

30. 标准库提供了管理 new 分配的数组的 unique_ptr 版本。

```cpp
unique_ptr<int []> up(new int[10]);
 up.release();        //自动使用delete[]销毁其指针。
```

31. 指向数组的 unique_ptr 不支持成员访问运算符，因为其指向数组。其他 unique_ptr 操作不变，可以使用下标运算符。
32. shared_ptr 不直接支持管理动态数组，必须为其提供自定义的删除器。

```cpp
shared_ptr<int> sp(new int[10],[](int *p){delete[] p;});
 sp.reset();    //使用提供的lambda释放数组。
 //未定义下标运算和指针运算
 for(size_t i =0; i != 10; ++i){
    *(sp.get()+i) = i;        //使用get获取一个内置指针
 }
```

33. new 的局限性：将内存分配和对象构造组合在一起。

```txt
delete的局限性：
将对象析构和内存释放组合在一起。
因此对于没有默认构造函数的类不能动态分配数组，因为new表达式分配时会进行初始化(构造对象)。
```

34. allocator 可以将内存分配和对象构造分离，它提供一种类型感知的内存分配方法，分配的内存是原始的、未构造的。

```cpp
allocator<string> alloc;                //可以分配string的allocator对象
 auto const p = alloc.allocator(n);        //分配n个未初始化的string，返回指向string*的指针。
 //allocator分配内存时，内存是未构造的，必须使用construct构造对象，其第一个参数必须是一个指针
 //指向调用allocate所分配的未构造的内存空间，剩余参数确定用哪个构造函数来构造对象。
```

---

**笔记仅供自己参考**
