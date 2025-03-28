
+++
authors = ["lzy"]
title = "课程实训"
date = "2020-06-29"
description = ""
tags = [
    "算法练习"
]
categories = [
    "技术文档"
]
+++

# 课程实训

## 简介

放一些学校数据结构课程实训的代码，一个为链表和文件操作实现的简易图书管理系统，另一个使用文件操作和最短路径算法实现计算最短路径。

## 简易图书管理系统

```cpp
struct Book {                //图书结点
    string ISBN;
    string bookName;
    int price;
};
class BookCol {
private:
    Book *books;            //图书表基地址
    int MAXSIZEBOOKS;        //最大容量
    string FilePath;        //文件路径
    int num;                //当前数量
public:
    BookCol(string filePath) {
        //初始化
        FilePath = filePath;
        fstream file(FilePath);
        num = 0;
        books = NULL;
        file >> MAXSIZEBOOKS;                //读取当前容量

        //生成图书表
        books = new Book[MAXSIZEBOOKS];
        char temp[256];                        //字符缓存区
        int priceTemp = 0;                    //数字缓存区
        if (file.is_open()) {
            file.getline(temp, 100);
        }
        else{
            cout << "文件路径错误,回车键结束程序！" << endl;
            cin.get();
            exit(1);
        }
        file.getline(temp, 100);
        file >> temp;
        while (temp[0] != '\0') {
            setISBN(num, temp);
            file >> temp;
            setBookName(num, temp);
            file >> priceTemp;
            setPrice(num, priceTemp);
            file >> temp;
            num++;
        }
        file.close();
    }
    ~BookCol() {
        delete books;
    }
    //获取图书信息
    string getISBN(int i) {
        return books[i].ISBN;
    }
    string getBookName(int i) {
        return books[i].bookName;
    }
    int getPrice(int i) {
        return books[i].price;
    }

    //设置图书信息
    void setISBN(int i,string ISBN) {
        books[i].ISBN = ISBN;
    }
    void setBookName(int i,string bookName) {
        books[i].bookName = bookName;
    }
    void setPrice(int i, int price) {
        books[i].price = price;
    }

    void Increase() {                //扩容操作
        fstream file(FilePath);
        MAXSIZEBOOKS *= 2;
        file.clear();
        file << MAXSIZEBOOKS;

        //原数据移动到新空间
        Book *temp = new Book[MAXSIZEBOOKS];
        for (int i = 0; i < num; i++) {
            temp[i].bookName = getBookName(i);
            temp[i].ISBN = getISBN(i);
            temp[i].price = getPrice(i);
        }
        this->books = temp;
        file.close();
    }

    void delBook(string ISBN);        //图书删除
    int InsertBook();                //图书插入
    void revealBook(string ISBN);    //修改价格
    int findBook(string ISBN);        //图书查找
    void bookSort();                //图书排序
    int bookCount();                //图书数量
    void printBook();                //遍历图书信息
    void updataBook();                //文件更新
    void bookMenu();                //菜单显示
};
//显示菜单
void BookCol::bookMenu() {
    cout << "\t\t|--------0. 显示所有图书--------|" << endl;
    cout << "\t\t|--------1. 查找图书------------|" << endl;
    cout << "\t\t|--------2. 插入图书------------|" << endl;
    cout << "\t\t|--------3. 删除图书------------|" << endl;
    cout << "\t\t|--------4. 修改图书价格--------|" << endl;
    cout << "\t\t|--------5. 图书价格排序--------|" << endl;
    cout << "\t\t|--------6. 统计图书数量--------|" << endl;
    cout << "\t\t|--------q. 退出----------------|" << endl;
}
//更新数据
void BookCol::updataBook() {
    fstream file(FilePath, ios::out);
    file << MAXSIZEBOOKS << endl;
    file << "ISBN" << "            " << "图书名称" << "                " << "价格" << endl;
    for (int i = 0; i < num - 1; i++) {
        file << getISBN(i) << "\t\t" << getBookName(i) << "\t\t\t" << getPrice(i) << endl;
    }
    file.close();
}
//删除操作
void BookCol::delBook(string ISBN) {
    int i = findBook(ISBN);
    while (i < num-1) {
        setISBN(i, getISBN(i + 1));
        setBookName(i, getBookName(i + 1));
        setPrice(i, getPrice(i + 1));
        i++;
    }
    updataBook();    //更新文件
    num--;
}
//排序操作
void BookCol::bookSort() {
    Book temp;
    for (int i = 0; i < num; ++i) {
        temp = books[i];        //将待插入的数据存放入监视哨中
        int low = 0;
        int high = i - 1;
        while (low <= high) {
            int m = (low + high) / 2;
            if (temp.price < books[m].price) {
                high = m - 1;
            }
            else {
                low = m + 1;
            }
        }
        for (int j = i - 1; j >= high + 1; --j) {    //记录后移
            books[j + 1] = books[j];
        }
        books[high + 1] = temp;
    }
    updataBook();    //更新文件
    cout << "排序完成！" << endl;
}
//修改图书价格
void BookCol::revealBook(string ISBN) {
    int i = findBook(ISBN);
    cout << "输入修改的价格" << endl;
    int price;
    cin >> price;
    setPrice(i, price);
    updataBook();            //文件更新
    cout << "修改完成！" << endl;
}
//打印图书
void BookCol::printBook() {
    for (int i = 0; i < num; i++) {
        cout << "图书号:" << getISBN(i) <<" "<< "图书名称:" << getBookName(i) <<" "<< "图书价格:" << getPrice(i) <<endl;
    }
}
//插入图书
int BookCol::InsertBook(){
    string bookname; 
    int price; 
    string ISBN;
    if (num >= MAXSIZEBOOKS) {        //如果空间不足则扩容
        Increase();
    }
    cout << "请输入图书名称" << endl;
    cin >> bookname;
    setBookName(num, bookname);

    cout << "请输入图书价格" << endl;
    cin >> price;
    setPrice(num, price);

    cout << "请输入图书ISBN" << endl;
    cin >> ISBN;
    setISBN(num, ISBN);
    fstream file;
    file.open(FilePath, ios::app);
    file << ISBN << "        "<< bookname <<"            " << price << endl;
    file.close();
    num++;
    return 1;
}
//查找图书
int BookCol::findBook(string ISBN) {
    int i;
    int flog = 0;
    for (i = 0; i < MAXSIZEBOOKS; i++) {
        string isbn = getISBN(i);
        if (ISBN == isbn) { 
            flog = 1;
            break; 
        }
    }
    if(flog) return i;
    else return -1;
}
//统计图书
int BookCol::bookCount() {
    return num;
}
int main() {
    BookCol *b = new BookCol("F:\\program\\Test_project\\C-C++\\test'\\test'\\book.txt");
    int flag = 1;
    char ch;

    b->bookMenu();
    while (flag) {
        cin >> ch;
        switch (ch)
        {
        case '0': {
            b->printBook();
        }break;
        case '1': {
            string isbn;
            cout << "请输入ISBN号" << endl;
            cin >> isbn;
            int i = b->findBook(isbn);
            cout << "图书编号:" << b->getISBN(i) << " 图书名称:" << b->getBookName(i) << " 图书价格:" << b->getPrice(i) << endl;
        }break;
        case '2': {
            b->InsertBook();
        }break;
        case '3': {
            cout << "请输入ISBN号" << endl;
            string isbn;
            cin >> isbn;
            b->delBook(isbn);
        }break;
        case '4': {
            string isbn;
            cout << "请输入ISBN号" << endl;
            cin >> isbn;
            b->revealBook(isbn);
        }break;
        case '5': {
            b->bookSort();
        }break;
        case '6': {
            cout << "图书数量为:" << b->bookCount() << endl;
        }break;
        case 'q': {
            flag = 0;
        }break;
        default:
            break;
        }
    }
    cin.get();
    return 0;
}
```

## 图的最短路径

```cpp
typedef struct VertexType {                //顶点信息
    char name[256];
    char intruction[256];
}VertexType;

typedef int EdgeType;                    //边上的权值
#define MAXVEX 100                        //最大顶点数
#define MAXINTS 65535                    //代表无穷大

typedef struct {
    VertexType vexs[MAXVEX];            //顶点表
    EdgeType arc[MAXVEX][MAXVEX];        //边矩阵
    int numVertexes, numEdges;            //图中当前节点数和边数
}MGraph;

/*
 *    返回顶点名称所在顶点表的位置
 */
int FindIndex(MGraph G, string name) {
    int i;
    for (i = 0; i < G.numVertexes; ++i) {
        if (G.vexs[i].name == name) {
            return i;
        }
    }
    return -1;
}
/*
 *    邻接矩阵的创建
 */
void CreateMgraph(MGraph *G,string ptr) {
    string start, end;        //起点，终点
    int w;                    //边上的权值

    //读取顶点数、边数
    fstream file(ptr);
    file >> G->numVertexes >> G->numEdges;

    //读取顶点信息
    for (int i = 0; i < G->numVertexes; i++) {
        file >> G->vexs[i].name;
        file >> G->vexs[i].intruction;
    }
    //初始化边权值
    for (int i = 0; i < G->numVertexes; i++) {
        for (int j = 0; j < G->numVertexes; j++) {
            G->arc[i][j] = MAXINTS;
        }
    }
    //读取边权值
    for (int k = 0; k < G->numEdges; k++) {
        file >> start >> end >> w;
        int i = FindIndex(*G, start);
        int j = FindIndex(*G, end);
        G->arc[i][j] = w;
        G->arc[j][i] = G->arc[i][j];        //矩阵对称
    }
    file.close();
}
/*
 *    更新文件信息
 */
void updataGrapg(MGraph G) {
    fstream file("F:\\program\\Test_project\\C-C++\\test'\\test'\\graph.txt");
    file << G.numVertexes << "\t" << G.numEdges << "\t" << endl;
    file << endl;
    for (int i = 0; i < G.numVertexes; i++) {
        file << G.vexs[i].name << "\t" << G.vexs[i].intruction << "\t" << endl;
    }
    file << endl;
    for (int i = 0; i < G.numVertexes; i++) {
        for (int j = i; j < G.numVertexes; j++) {
            if (G.arc[i][j] != MAXINTS) {
                file << G.vexs[i].name << "\t" << G.vexs[j].name << "\t" << G.arc[i][j] << endl;
            }
        }
    }
    file.close();
}
/* 
 *    若顶点存在，则修改此顶点的介绍信息，否则返回-1
 */
int ModifyInfo(MGraph *G,char name[],char newInfo[]) {
    int i = FindIndex(*G, name);
    if (i != -1) {
        G->vexs[i].intruction;
        strcpy_s(G->vexs[i].intruction, newInfo);
        updataGrapg(*G);
        return 1;
    }
    return -1;
}
/*
 *    若该顶点存在，则输出介绍信息，若顶点不存在则返回-1
 */
int Instruction(MGraph G,string name) {
    int i = FindIndex(G,name);
    if (i != -1) {
        cout << G.vexs[i].intruction << endl;
        return 1;
    }
    return -1;
}
/*
 * 顶点数小于最大顶点数，则添加成功
 */
int addVex(MGraph *G,char name[],char Info[]) {
    if (G->numVertexes < MAXVEX) {
        strcpy_s(G->vexs[G->numVertexes].name, name);
        strcpy_s(G->vexs[G->numVertexes].intruction, Info);
        for (int i = 0; i < G->numVertexes; i++) {
            G->arc[G->numVertexes][i] = MAXINTS;
            G->arc[i][G->numVertexes] = MAXINTS;
        }
        G->arc[G->numVertexes][G->numVertexes] = MAXINTS;
        G->numVertexes++;
        updataGrapg(*G);
        return 1;
    }
    return -1;
}
/*
 *    若该顶点存在，则删除该顶点，若该顶点不存在，则返回-1
 */
int delVex(MGraph *G, char name[]) {
    int i = FindIndex(*G,name);
    if (i != -1) {
        for (int j = i; j < G->numVertexes; ++j) {    //记录前移
            G->vexs[j] = G->vexs[j + 1];
        }
        G->numVertexes--;
        updataGrapg(*G);
        return 1;
    }
    return -1;
}
/*
 * 添加一条边，如果不存在此边，则添加成功，如果存在此边或者不存在相关顶点，添加失败返回-1
 */
int addArc(MGraph *G, char start[], char end[], EdgeType num) {
    int i = FindIndex(*G,start);
    int j = FindIndex(*G, end);
    if (i != -1 && j != -1) {
        if (G->arc[i][j] == MAXINTS){
            G->arc[i][j] = num;
            G->numEdges++;
            updataGrapg(*G);
        }
        else 
            return -1;
    }
    return 1;
}
/*
 *    若该边存在，则删除该边，该边不存在则返回-1
 */
int delArc(MGraph *G, char start[], char end[]) {
    int i = FindIndex(*G,start);
    int j = FindIndex(*G,end);
    if (i != -1 && j != -1) {
        if(G->arc[i][j] != MAXINTS)
        G->arc[i][j] = MAXINTS;            //将此边信息更新为无穷大
        G->numEdges--;
        updataGrapg(*G);
        return 1;
    }
    return -1;
}
/*
 *    打印所有边集信息，用于测试
 */
void PrintMg(MGraph G) {
    for (int i = 0; i < G.numVertexes; i++) {
        for (int j = 0; j < G.numVertexes; j++) {
            cout << G.vexs[i].name << "--" << G.vexs[j].name << "--" << G.arc[i][j] << " |";
        }
        cout << endl;
    }
}
/*
 *    打印所有顶点信息
 */
void PrintVex(MGraph G) {
    cout << "该学校的景点有:" << endl;
    for (int i = 0; i < G.numVertexes; ++i) {
        cout << "\t" << i + 1 << ". " << G.vexs[i].name << endl;
    }
    cout << "----------------------------------" << endl;
}
/*
 *    最短路径，迪杰斯特拉算法，若未找到顶点则返回-1
 */
int ShortesPath_DIJ(MGraph G, char start[], char end[]) {
    int n = G.numVertexes;
    int *S = (int*)malloc(sizeof(int) * n);
    int *D = (int*)malloc(sizeof(int) * n);
    int *Path = (int*)malloc(sizeof(int) * n);

    int v0 = FindIndex(G, start);
    int vt = FindIndex(G, end);
    if (v0 == -1 || vt == -1) {
        cout << "顶点未找到 " << end;
        return -1;
    }
    for (int v = 0; v < n; ++v) {            //初始化
        S[v] = false;
        D[v] = G.arc[v0][v];                //记录v0到v的最短路径长度
        if (D[v] < MAXINTS) {                //如果有弧，更新Path为v0，否则置为-1
            Path[v] = v0;
        }
        else {
            Path[v] = -1;
        }
    }
    S[v0] = true;       //将v0加入S
    D[v0] = 0;            //源点到源点的距离为0

    //遍历其余顶点，每次求得v0到某个顶点v的最短路径，将v并入S
    for (int i = 1; i < n; ++i) {
        int min = MAXINTS;
        int v;
        for (int w = 0; w < n; ++w) {
            if (!S[w] && D[w] < min) {
                v = w;                    //保存顶点位置
                min = D[w];
            }
        }
        S[v] = true;
        for (int w = 0; w < n; ++w) {
            if (!S[w] && (D[v] + G.arc[v][w] < D[w])) {
                D[w] = D[v] + G.arc[v][w];
                Path[w] = v;
            }
        }
    }    return D[vt];
}
void menu() {
    cout << "\t\t\t|---------------------------------|" << endl;
    cout << "\t\t\t|---1. 查询景点信息---------------|" << endl;
    cout << "\t\t\t|---2. 问路查询-------------------|" << endl;
    cout << "\t\t\t|---3. 增加一个景点及其相关信息---|" << endl;
    cout << "\t\t\t|---4. 修改一个景点的相关信息-----|" << endl;
    cout << "\t\t\t|---5. 增加一条新的路径-----------|" << endl;
    cout << "\t\t\t|---6. 删除一条路径---------------|" << endl;
    cout << "\t\t\t|---7. 删除一个景点---------------|" << endl;
    cout << "\t\t\t|---0. 退出系统-------------------|" << endl;
    cout << "\t\t\t|---------------------------------|" << endl;
    cout << endl;
}
int main() {
    MGraph G;
    string ptr = "F:\\program\\Test_project\\C-C++\\test'\\test'\\graph.txt";
    CreateMgraph(&G,ptr);
    int flag = 1;
    char c;
    menu();
    PrintVex(G);
    while (flag) {
        cout << "请选择功能" << endl;
        cout << "----------------------------------" << endl;
        cin >> c;
        switch (c)
        {
        case '1': {
            char name[256];
            cout << "请输入景点名称" << endl;
            cin >> name;
            Instruction(G, name);
        }break;
        case '2': {
            char start[256];
            char end[256];
            cout << "请输入起点名称" << endl;
            cin >> start;
            cout << "请输入终点名称" << endl;
            cin >> end;
            int l = ShortesPath_DIJ(G, start, end);
            if(l != MAXINTS){
                cout << "路径长度为:" << l << endl;
            }
            else {
                cout << "不存在此路径" << endl;
            }
        }break;
        case '3': {
            char name[256];
            char Info[256];
            cout << "请输入景点名称" << endl;
            cin >> name;
            cout << "请输入景点介绍" << endl;
            cin >> Info;
            if(addVex(&G, name, Info)){
                cout << "添加景点成功" << endl;
            }
            else {
                cout << "添加景点失败" << endl;
            }
        }break;
        case '4': {
            char name[256];
            char Info[256];
            cout << "请输入景点名称" << endl;
            cin >> name;
            cout << "请输入此景点新的介绍" << endl;
            cin >> Info;
            if(ModifyInfo(&G, name, Info)){
                cout << "修改成功" << endl;
            }
            else {
                cout << "修改失败" << endl;
            }
        }break;
        case '5': {
            char start[256];
            char end[256];
            int length;
            cout << "请输入路径起点" << endl;
            cin >> start;
            cout << "请输入路径终点" << endl;
            cin >> end;
            cout << "请输入路径距离" << endl;
            cin >> length;
            if (addArc(&G, start, end, length)) {
                cout << "添加路径成功" << endl;
            }
            else {
                cout << "添加路径失败" << endl;
            }
        }break;
        case '6': {
            char start[256];
            char end [256];
            cout << "请输入起点位置" << endl;
            cin >> start;
            cout << "请输入终点位置" << endl;
            cin >> end;
            if (delArc(&G, start, end) != -1) {
                cout << "路径删除成功" << endl;
            }
            else{
                cout << "路径删除失败" << endl;
            }
        }break;
        case '7': {
            char name[256];
            cout << "请输入景点名称" << endl;
            cin >> name;
            if (delVex(&G, name)) {
                cout << "删除景点成功" << endl;
            }
            else{
                cout << "删除景点失败" << endl;
            }
        }break;
        case '0': {
            exit(1);
        }break;
        default:
            cout << "操作有误" << endl;
            break;
        }
    }return 0;
}
```
