+++
authors = ["lzy"]
title = "MySQL 入门"
date = "2023-07-07"
description = ""
tags = [
    "mysql"
]
categories = [
    "技术文档"
]
+++

# MySQL 入门

# MYSQL 入门知识

此文是阅读 MYSQL 必知必会后整理的所有样例代码，仅供自用。

## 一、MySQL 基础命令

```bash
use database;               -- 打开数据库
show databases;           -- 列出所有数据库
show tables;                -- 列出数据库所有表
show columns from orders; -- 列出表内所有的列
describe orders;           -- 列出表内所有的列
show status;               -- 显示广泛的服务器状态信息
```

---

## 二、检索数据

```bash
USE sqltest;                                        -- 使用数据库
SELECT prod_name FROM products;
SELECT prod_id,prod_name,prod_price FROM products;    -- 返回多列
SELECT * FROM products;                                -- 返回所有列
SELECT DISTINCT vend_id FROM products;                -- 只返回不同的值，DISTINCT不能部分使用，其应用于所有列
SELECT prod_name FROM products LIMIT 5;                -- 返回不多于5行
SELECT prod_name FROM products LIMIT 5,5;            -- 返回从行5开始的5行，检索出的第一行为行0
SELECT prod_name FROM products LIMIT 4 OFFSET 3;    -- 从行3开始取4行
SELECT products.prod_name FROM products;            -- 使用完全限定的表名
```

---

## 三、排序检索数据

```bash
SELECT prod_name FROM products ORDER BY prod_name;    -- 对prod_name以字母顺序排序
-- 多个行具有相同prod_price时，才对产品按prod_name进行排序，如果prod_price所有值唯一，则不会按prod_name排序。
SELECT prod_id,prod_price,prod_name FROM products ORDER BY prod_price,prod_name;    -- 首先对价格排序，在按名称排序
-- 默认进行升序排序，也可以指定ASC进行升序排序，但没必要
SElECT prod_id,prod_price,prod_name FROM products ORDER BY prod_price DESC;        -- 对价格降序排序
-- 如果要对每个列进行降序排序，要对每个列指定DESC
SELECT prod_id,prod_price,prod_name FROM products ORDER BY prod_price DESC, prod_name;    -- 先对价格降序排序，在对名称排序
-- ORDER BY必须在FROM子句之后，LIMIT必须在ORDER BY子句之后
SELECT prod_price FROM products ORDER BY prod_price DESC LIMIT 1;        -- 找出最贵的价格
```

---

## 四、过滤数据

ORDER BY 子句位于 WHERE 之后

```bash
SELECT prod_name,prod_price FROM products WHERE prod_price = 2.50;    
SELECT prod_name,prod_price FROM products WHERE prod_name = 'fuses';      -- 执行匹配时默认不区分大小写
SELECT prod_name,prod_price FROM products WHERE prod_price < 10;        -- 列出价格小于10美元的所有产品
SELECT prod_name,prod_price FROM products WHERE prod_price <= 10;        -- 列出价格小于等于10美元的所有产品
SELECT vend_id,prod_name FROM products WHERE vend_id <> 1003;            -- 列出不是由供应商1003制造的所有产品
SELECT vend_id,prod_name FROM products WHERE vend_id != 1003;            -- 与上式相同
SELECT prod_name,prod_price FROM products WHERE prod_price BETWEEN 5 AND 10;    -- 检索价格在5-10美元之间的所有产品
SELECT prod_name FROM products WHERE prod_price IS NULL;                -- 返回没有价格的产品
SELECT cust_id FROM customers WHERE cust_email IS NULL;
```

---

## 五、数据过滤

```bash
SELECT prod_id,prod_price,prod_name FROM products WHERE vend_id = 1003 AND prod_price <= 10;
SELECT prod_name,prod_price FROM products WHERE vend_id = 1002 OR vend_id = 1003;
-- SQL处理OR操作符前，优先处理AND操作符，应该使用圆括号分组处理
SELECT prod_name,prod_price FROM products WHERE (vend_id = 1002 OR vend_id = 1003) AND prod_price >= 10;
-- IN操作符指定条件范围，检索1002和1003制造的所有产品
SELECT prod_name,prod_price FROM products WHERE vend_id IN (1002,1003) ORDER BY prod_name;
-- IN操作符完成与OR相同的功能,IN操作符一般比OR执行更快
SELECT prod_name,prod_price FROM products WHERE vend_id = 1002 OR vend_id = 1003 ORDER BY prod_name;
-- MYSQL支持使用NOT对IN、BETWEEN和EXISTS子句取反
SELECT prod_name,prod_price FROM products WHERE vend_id NOT IN (1002,1003) ORDER BY prod_name;
```

---

## 六、使用通配符进行过滤

% 表示任何字符出现任意次数，根据 MySQL 的配置方式，搜索可以是区分大小写的！

% 无法匹配 NULL

```bash
SELECT prod_id,prod_name FROM products WHERE prod_name LIKE 'jet%';            -- 找出以jet开头的产品
SELECT prod_id,prod_name FROM products WHERE prod_name LIKE '%anvil%';        -- 匹配包含文本anvil的值
SELECT prod_name FROM products WHERE prod_name LIKE 's%e';                    -- 找出以s开头e结尾的产品
SELECT prod_id,prod_name FROM products WHERE prod_name LIKE '_ ton anvil';    -- 下划线只匹配单个字符
SELECT prod_id,prod_name FROM products WHERE prod_name LIKE '% ton anvil';    -- %匹配所有字符
```

---

## 七、使用正则表达式搜索

```bash
SELECT prod_name FROM products WHERE prod_name REGEXP '1000' ORDER BY prod_name;        -- 使用正则表达式
SELECT prod_name FROM products WHERE prod_name REGEXP '.000' ORDER BY prod_name;        -- .在正则表达式能匹配任意内容
SELECT prod_name FROM products WHERE prod_name REGEXP BINARY 'JetPack .000';            -- 默认不区分大小写，加BINARY可以区分大小写
SELECT prod_name FROM products WHERE prod_name REGEXP '1000|2000' ORDER BY prod_name;    -- | 是正则表达式的OR操作
SELECT prod_name FROM products WHERE prod_name REGEXP '[123] Ton' ORDER BY prod_name;    -- []匹配特定字符，匹配1或2或3
SELECT prod_name FROM products WHERE prod_name REGEXP '[^123] Ton' ORDER BY prod_name;    -- 匹配123以外的东西
SELECT prod_name FROM products WHERE prod_name REGEXP '1|2|3 Ton' ORDER BY prod_name;    -- | 应用于整个串
SELECT prod_name FROM products WHERE prod_name REGEXP '[1-5] Ton' ORDER BY prod_name;
SELECT vend_name FROM vendors WHERE vend_name REGEXP '\\.' ORDER BY vend_name;            -- \\代表转义
```

---

### 匹配字符类

```bash
SELECT vend_name FROM vendors WHERE vend_name REGEXP '[:alnum:]' ORDER BY vend_name;
```

---

### 匹配多个实例

```bash
SELECT prod_name FROM products WHERE prod_name REGEXP '\\([0-9] sticks?\\)' ORDER BY prod_name;    -- s后的？使s可选
SELECT prod_name FROM products WHERE prod_name REGEXP '[[:digit:]]{4}' ORDER BY prod_name;    -- 匹配连在一起的任意4个数字
-- ^匹配串的开始，只在.或任意数组为开头时才会匹配
SELECT prod_name FROM products WHERE prod_name REGEXP '^[0-9\\.]' ORDER BY prod_name;
SELECT 'hello' REGEXP '[0-9]';    -- 测试,不使用表
```

---

## 八、创建计算字段

```bash
SELECT Concat(vend_name,' (',vend_country,')') FROM vendors ORDER BY vend_name;    -- 拼接名称与国家
SELECT Concat(RTrim(vend_name),'(',RTrim(vend_country),')') FROM vendors ORDER BY vend_name;    -- RTrim删除值右边所有空格,还有LTrim和Trim函数
-- 使用AS赋予列别名
SELECT Concat(RTrim(vend_name),'(',RTrim(vend_country),')') AS vend_title FROM vendors ORDER BY vend_name;
SELECT prod_id,quantity,item_price FROM orderitems WHERE order_num = 20005;    -- 检索订单号20005中所有物品
-- 算术运算(+,-,*,/)
SELECT prod_id,quantity,item_price,quantity*item_price AS expanded_price FROM orderitems WHERE order_num = 20005;
-- 测试计算
SELECT 3*2;
SELECT now();
```

---

## 九、使用数据处理函数

### 数据处理函数
| 函数名 | 功能描述 |
|:------:|:--------|
| `Abs()` | 返回一个数的绝对值 |
| `Mod()` | 返回除操作的余数 |
| `Sin()` | 返回角度的正弦 |
| `Cos()` | 返回一个角度的余弦 |
| `Pi()` | 返回圆周率 |
| `Sqrt()` | 返回一个数的平方根 |
| `Exp()` | 返回一个数的指数值 |
| `Rand()` | 返回一个随机数 |
| `Tan()` | 返回一个角度的正切 |

### 文本处理函数
| 函数名 | 功能描述 |
|:------:|:--------|
| `Left()` | 返回串左边的字符 |
| `Lower()/Upper()` | 将串转换为小/大写 |
| `Right()` | 返回串右边字符 |
| `Length()` | 返回串的长度 |
| `LTrim()` | 去掉左边空格 |
| `Soundex()` | 返回串的类似发音的其他串 |
| `locate()` | 找出串的一个字串 |
| `RTrim()` | 去掉右边空格 |
| `SubString()` | 返回子串的字符 |

### 日期时间处理函数
| 函数名 | 功能描述 |
|:------:|:--------|
| `AddDate()` | 增加一个日期(天、周等) |
| `CurTime()` | 返回当前时间 |
| `Date_Add()` | 高度灵活的日期运算函数 |
| `DayOfWeek()` | 返回星期几 |
| `Month()` | 返回日期的月份部分 |
| `Time()` | 返回日期时间的时间部分 |
| `AddTime()` | 增加一个时间 |
| `Date()` | 返回日期时间的日期部分 |
| `Date_Format()` | 返回格式化日期或时间串 |
| `Hour()` | 返回时间的小时部分 |
| `Now()` | 返回当前日期和时间 |
| `Year()` | 返回日期的年份部分 |
| `CurDate()` | 返回当前日期 |
| `DateDiff()` | 计算两个日期之差 |
| `Day()` | 返回日期的天数部分 |
| `Minute()` | 返回时间的分钟部分 |
| `Second()` | 返回时间的秒部分 |

```bash
SELECT vend_name, Upper(vend_name) AS vend_name_upcase FROM vendors ORDER BY vend_name;
SELECT cust_name ,cust_contact FROM customers WHERE cust_contact = 'Y .Lie';
SELECT cust_name,cust_contact FROM customers WHERE Soundex(cust_contact) = Soundex('Y Lie');    -- 对串进行发音比较
SELECT cust_id,order_num FROM orders WHERE order_date = '2005-09-01'; -- 日期必须为yyyy-mm-dd格式 
SELECT cust_id,order_num FROM orders WHERE Date(order_date) = '2005-09-01';    -- 使用Date函数仅提取日期部分进行比较 
-- 列出九月下所有的订单
SELECT cust_id,order_num FROM orders WHERE Date(order_date) BETWEEN '2005-09-01' AND '2005-09-30';
SELECT cust_id,order_num FROM orders WHERE Year(order_date) = 2005 AND Month(order_date) = 9;
```

---

## 十、汇总数据

```bash
SELECT AVG(prod_price) AS avg_price FROM products;        -- 使用聚集函数，返回平均值
SELECT AVG(prod_price) AS avg_price FROM products WHERE vend_id = 1003;    -- AVG只用于单个列，忽略NULL的行
SELECT COUNT(*) AS num_cust FROM customers;        -- 计算行数
SELECT COUNT(cust_email) AS num_cust FROM customers;    -- 只对具有电子邮件地址的客户计数
SELECT MAX(prod_price) AS max_price FROM products;
SELECT MIN(prod_price) AS min_price FROM products;
SELECT SUM(quantity) AS items_ordered FROM orderitems WHERE order_num = 20005;    -- 订购物品的总数
SELECT SUM(item_price * quantity) AS total_price FROM orderitems WHERE order_num = 20005;    -- 总的订单金额
SELECT AVG(DISTINCT prod_price) AS avg_price FROM products WHERE vend_id = 1003;    -- 使用DISTINCT参数，只考虑各个不同的价格
SELECT COUNT(*) AS num_items, MIN(prod_price) AS price_min,        -- 组合聚集函数
        MAX(prod_price) AS price_max,
        AVG(prod_price) AS price_avg FROM products;
```

---

## 十一、分组数据

### HAVING 和 WHERE 的区别

- HAVING 过滤分组，而 WHERE 过滤行
- WHERE 在数据分组前进行过滤，HAVING 在数据分组后进行过滤。

```bash
SELECT COUNT(*) AS num_prods FROM products WHERE vend_id = 1003;        -- 返回1003提供的产品数目
SELECT vend_id,COUNT(*) AS num_prods FROM products GROUP BY vend_id;    -- 对vend_id排序并分组数据，每个vend_id只计算num_prods一次。
SELECT vend_id, COUNT(*) AS num_prods FROM products GROUP BY vend_id WITH ROLLUP;         -- 每个分组及其汇总级别的值
SELECT cust_id,COUNT(*) AS orders FROM orders GROUP BY cust_id HAVING COUNT(*) >= 2;    -- 过滤两个以上订单的分组
SELECT vend_id,COUNT(*) AS num_prods FROM products WHERE prod_price >=10 GROUP BY vend_id HAVING COUNT(*) >= 2;
SELECT order_num,SUM(quantity*item_price) AS ordertotal FROM orderitems GROUP BY order_num
HAVING SUM(quantity * item_price) >= 50 ORDER BY ordertotal;
```

---

## 十二、子查询

```bash
SELECT cust_id FROM orders WHERE order_num IN (SELECT order_num FROM orderitems WHERE prod_id = 'TNT2');
SELECT cust_name, cust_contact FROM customers WHERE cust_id IN (SELECT cust_id FROM orders WHERE order_num IN
    (SELECT order_num FROM orderitems WHERE prod_id = 'TNT2'));
SELECT cust_name,cust_state,(SELECT COUNT(*) FROM orders WHERE orders.cust_id = customers.cust_id) AS orders
FROM customers ORDER BY cust_name;
```

---

## 十三、联结表,内部联结

```bash
SELECT vend_name,prod_name,prod_price FROM vendors,products 
WHERE vendors.vend_id = products.vend_id ORDER BY vend_name,prod_name;
SELECT vend_name,prod_name,prod_price FROM vendors,products ORDER BY vend_name,prod_name;    -- 没有联结条件，返回笛卡尔积
SELECT vend_name,prod_name,prod_price FROM vendors INNER JOIN products ON vendors.vend_id = products.vend_id;
SElECT prod_name,vend_name,prod_price,quantity FROM orderitems,products,vendors
WHERE products.vend_id = vendors.vend_id AND orderitems.prod_id = products.prod_id
AND order_num = 20005;
-- 子查询并不总是执行复杂SELECT操作的有效方法
SELECT cust_name,cust_contact FROM customers WHERE cust_id IN (SELECT cust_id FROM orders WHERE order_num IN
(SELECT order_num FROM orderitems WHERE prod_id = 'TNT2'));        -- 可以用下列方法等效
SELECT cust_name,cust_contact FROM customers,orders,orderitems WHERE customers.cust_id = orders.cust_id
AND orderitems.order_num = orders.order_num AND prod_id = 'TNT2';
```

---

## 十四、创建高级联结

```bash
SELECT cust_name,cust_contact FROM customers AS c, orders AS o, orderitems AS oi    -- 使用表别名
WHERE c.cust_id = o.cust_id AND oi.order_num = o.order_num AND prod_id = 'TNT2';
SELECT prod_id,prod_name FROM products WHERE
vend_id = (SELECT vend_id FROM products WHERE prod_id = 'DTNTR');    -- 子查询
```

---

### 自联结

```bash
-- 自然联结排除多次出现，使每个列只返回一次
SELECT p1.prod_id,p1.prod_name FROM products AS p1,products AS p2 WHERE p1.vend_id = p2.vend_id
AND p2.prod_id = 'DTNTR';    -- 自联结处理远比子查询快的多
-- 通配符只对第一个表使用。
SELECT c.*,o.order_num,o.order_date,oi.prod_id,oi.quantity,oi.item_price FROM
customers AS c,orders AS o,orderitems AS oi WHERE
c.cust_id = o.cust_id AND oi.order_num = o.order_num AND prod_id = 'FB';
```

---

### 外部联结

- 联结包含了那些在相关表中没有关联行的行，这种称为外部联结
- **RIGHT** 指出是 **OUTER JOIN** 右边的表，**LEFT** 指出是 **OUTER JOIN** 左边的表

```bash
SELECT customers.cust_id,orders.order_num FROM customers         -- 左边表选择所有行 
LEFT OUTER JOIN orders ON customers.cust_id = orders.cust_id;
SELECT customers.cust_id,orders.order_num FROM customers        -- 右边表选择所有行
RIGHT OUTER JOIN orders ON customers.cust_id = orders.cust_id;
```

---

### 带聚集函数的联结

检索所有客户及每个客户所下的订单数

```bash
SELECT customers.cust_name,customers.cust_id,COUNT(orders.order_num) AS num_ord
FROM customers INNER JOIN orders ON customers.cust_id = orders.cust_id GROUP BY customers.cust_id;
SELECT customers.cust_name,customers.cust_id,COUNT(orders.order_num) AS num_ord    -- 使用左外部联结包含所有客户
FROM customers LEFT OUTER JOIN orders ON customers.cust_id = orders.cust_id GROUP BY customers.cust_id;
```

---

## 十五、组合查询

```bash
SELECT vend_id,prod_id,prod_price FROM products WHERE prod_price <= 5
UNION        -- 两条SELECT语句之间使用UNION组合
SELECT vend_id,prod_id,prod_price FROM products WHERE vend_id IN(1001,1002);
-- 相同的使用where的查询,UNION更使用于从多个表检索数据的情形
-- UNION从查询结果集自动去除了重复的行，这是默认行为，但也可以令其返回所有匹配的行，使用UNION ALL
SELECT vend_id,prod_id,prod_price FROM products WHERE prod_price <=5
UNION ALL
SELECT vend_id,prod_id,prod_price FROM products WHERE vend_id IN (1001,1002);
-- 使用UNION查询时，只能使用一条ORDER BY子句
SELECT vend_id,prod_id,prod_price FROM products WHERE prod_price <=5
UNION
SELECT vend_id,prod_id,prod_price FROM products WHERE vend_id IN (1001,1002)
ORDER BY vend_id,prod_price;    -- 排序UNION返回的结果集
```

---

## 十六、全文本搜索

MySQL 常用的引擎为 MyISAM 和 InnoDB，前者支持全文本搜索，后者不支持.

一般在创建表时启用全文本搜索，接受 FULLTEXT 子句.

```bash
CREATE TABLE productnotes(
note_id        int            NOT NULL AUTO_INCREMENT,
prod_id     char(10)     NOT NULL,
note_date     datetime     NOT NULL,
note_text    text        NULL,
PRIMARY KEY(note_id),
FULLTEXT(note_text)        -- 为了进行全文本搜索，MySql根据这句的指示对它进行索引，这里索引单个列。
) ENGINE = MyISAM;        -- MySql会自动维护索引，不要在导入数据时启用FULLTEXT，应该在导入数据后修改表再启用
```

---

### 全文本搜索

```bash
-- Match指定被搜索的列，Against指定要使用的搜索表达式
SELECT note_text FROM productnotes WHERE Match(note_text) Against('rabbit');    -- 传递给Match的值必须于FULLTEXT定义中的相同
-- 也可以用like语句完成
SELECT note_text FROM productnotes WHERE note_text LIKE '%rabbit%';        -- 没有行排序，全文本搜索有行排序
-- 等级根据行中词的数目、唯一词的数目、整个索引中词的总数以及包含该词的行数计算出来。
SELECT note_text,Match(note_text) Against('rabbit') AS ranks FROM productnotes;     -- Match与Against返回等级
-- 查询扩展
SELECT note_text FROM productnotes WHERE Match(note_text) Against('anvils');    -- 未使用查询扩展
-- 使用查询扩展进行两次扫描，第一次扫描选择所有有用的词，第二次使用所有有用的词，返回可能相关的结果。
SELECT note_text FROM productnotes WHERE Match(note_text) Against('anvils' WITH QUERY EXPANSION);    -- 使用查询扩展
```

---

### 布尔文本搜索

索引全文本数据时，短词被忽略且从索引中排除，短词为具有 3 个或以下字符的词(这个数目可以改).

MySql 有一个非用词列表，列表的词也会被忽略.

如果一个词出现 50% 以上的行中，则将它作为一个非用词忽略，不用于 IN BOOLEAN MODE

如果表中行数少于 3 行，全文本搜索不返回结果（每个词或者不出现，或者出现在 50% 的行中）

忽略词中的单引号

不具有词分隔符的语言不能恰当返回全文本搜索结果

布尔方式中，不按等级值降序排序返回的行。

- + 包含，词必须存在
- -排除，词必须不出现
- > 包含，而且增加等级值
  >
- < 包含，且减少等级值
- ()把词组成子表达式，允许这些子表达式作为一个组，被包含、排除、排列等
- ~取消一个词的排序值
- *词尾的通配符
- “”定义一个短语，与单个词的列表不同，它匹配整个短语以便包含或排除这个短语

```bash
SELECT note_text FROM productnotes WHERE Match(note_text) Against('heavy' IN BOOLEAN MODE);-- 没有指定布尔操作符
-- 匹配包含heavy但不包含任意以rope开始的词的行,-rope*指定排除任何以rope开始的词的行。
SELECT note_text FROM productnotes WHERE Match(note_text) Against('heavy -rope*' IN BOOLEAN MODE);
SELECT note_text FROM productnotes WHERE Match(note_text) Against('+rabbit +bait' IN BOOLEAN MODE);
SELECT note_text FROM productnotes WHERE Match(note_text) Against('rabbit bait' IN BOOLEAN MODE);    -- 包含其中至少一个词
SELECT note_text FROM productnotes WHERE Match(note_text) Against('"rabbit bait"' IN BOOLEAN MODE);    -- 匹配短语
SELECT note_text FROM productnotes WHERE Match(note_text) Against('>rabbit <carrot' IN BOOLEAN MODE);    -- 增加前者等级，降低后者等级
SELECT note_text FROM productnotes WHERE Match(note_text) Against('+safe +(<combination)' IN BOOLEAN MODE);
```

---

## 十七、插入数据

- 如果表的定义允许，可以省略某些列
- 可以通过在 INSERT 和 INTO 之间 LOW_PRIORITY 降低 INSERT 语句的优先级。

```bash
INSERT INTO customers VALUES( NULL,        -- 对每一列必须提供一个值，按次序填充。id为自动填充，但不想给出这个值也不想省略，可以给NULL。
'Pep E. LaPew','100 Main Street','Los Angeles',    -- 这种语法不安全
'Ca',90046,'USA',NULL,NULL);
INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country,cust_contact,cust_email)
VALUES('Pep E. LaPew','100 Main Street','Los Angeles','CA','90046','USA',NULL,NULL); -- 给出列名，与值一一对应 
INSERT INTO customers(cust_name,cust_contact,cust_email,cust_address,cust_city,cust_state,cust_zip,cust_country)
VALUES('Pep E. LaPew',NULL,NULL,'100 Main Street','Los Angeles','CA','90046','USA');    -- 与上面的语句顺序不同
```

### 插入多条数据

```bash
INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country)
VALUE('Pep E. LaPew','100 Main Street','Los Angeles','CA','90046','USA'),
('M. Martian','42 Galaxy Way','New York','NY','11213','USA');    -- 使用单条INSERT语句比多条快
```

### 创建 custnew 表

```bash
CREATE TABLE custnew
(
  cust_id      int       NOT NULL AUTO_INCREMENT,
  cust_name    char(50)  NOT NULL ,
  cust_address char(50)  NULL ,
  cust_city    char(50)  NULL ,
  cust_state   char(5)   NULL ,
  cust_zip     char(10)  NULL ,
  cust_country char(50)  NULL ,
  cust_contact char(50)  NULL ,
  cust_email   char(255) NULL ,
  PRIMARY KEY (cust_id)
) ENGINE=InnoDB;
INSERT INTO custnew(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES(NULL, 'Coyote Inc.', '200 Maple Lane', 'Detroit', 'MI', '44444', 'USA', 'Y Lee', 'ylee@coyote.com');
INSERT INTO custnew(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact)
VALUES(NULL, 'Mouse House', '333 Fromage Lane', 'Columbus', 'OH', '43333', 'USA', 'Jerry Mouse');
INSERT INTO custnew(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES(NULL, 'Wascals', '1 Sunny Place', 'Muncie', 'IN', '42222', 'USA', 'Jim Jones', 'rabbit@wascally.com');
INSERT INTO custnew(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES(NULL, 'Yosemite Place', '829 Riverside Drive', 'Phoenix', 'AZ', '88888', 'USA', 'Y Sam', 'sam@yosemite.com');
INSERT INTO custnew(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact)
VALUES(NULL, 'E Fudd', '4545 53rd Street', 'Chicago', 'IL', '54545', 'USA', 'E Fudd');
```

将 custnew 表中的数据导入 customers 表中,不一定要求列名匹配，SELECT 中第一列(不管其列名),填充 INSERT 指定的第一列，SELECT 还可以用 WHERE 过滤数据。

```bash
INSERT INTO customers(cust_id,cust_contact,cust_email,cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country)
SELECT cust_id,cust_contact,cust_email,cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country FROM custnew;
```

## 十八、更新和删除数据

### 更新数据

UPDATE 语句中可以使用子查询.

```bash
UPDATE customers SET cust_email = 'elmer@fudd.com' WHERE cust_id = 10005;    -- 如果没有WHERE语句，将会更新所有行
UPDATE customers SET cust_name = 'The Fudds',cust_email = 'elmer@fudd.com' WHERE cust_id = 10005;    -- 更新多个列
-- 如果用UPDATE更新多行，并且在更新这些行中的一行或多行出现一个错误，整个UPDATE操作被去取消，并恢复原值
-- 可以使用IGNORE使发生错误也继续更新 UPDATE IGNORE customers
UPDATE customers SET cust_email = NULL WHERE cust_id = 10005;     -- 删除某列的值，可以将其定为NULL(表定义必须允许为NULL)
```

### 删除数据

```bash
DELETE FROM customers WHERE cust_id = 10006;    -- 删除一行
TRUNCATE TABLE customers;        -- 从表中删除所有行，实质是删除原来的表 并重新创建一个表，更快。
```

## 十九、创建表和操纵表

### 创建表

- 如果仅想在一个表不存在时创建它，应该在表名后给出 IF NOT EXISTS。
- 这样不检查已有表的模式是否与创建的表模式相匹配，只查看表名是否存在，仅在表名不存在时创建它。
- 每个表列或者是 NULL 列，或者是 NOT NULL 列
- 主键必须唯一，如果使用多个列，这些列的组合值必须唯一。

```bash
CREATE TABLE customers(
    cust_id            int            NOT NULL AUTO_INCREMENT,    -- 自动增量
    cust_name        char(50)    NOT NULL,
    cust_address     char(50)    NULL,
    cust_city        char(50)    NULL,
    cust_state        char(5)        NULL,
    cust_zip        char(10)    NULL,
    cust_country    char(50)    NULL,
    cust_contact    char(50)    NULL,
    cust_email        char(255)    NULL,
    PRIMARY KEY(cust_id)
)ENGINE = InnoDB;
CREATE TABLE orderitems(
    order_num    int                NOT NULL,
    order_item    int                NOT NULL,
    prod_id        char(10)        NOT NULL,
    quantity    int                NOT NULL,
    item_price    decimal(8,2)    NOT NULL,
    PRIMARY KEY(order_num,order_item)    -- 创建由多个列组成的主键
)ENGINE=InnoDB;
SELECT last_insert_id();     -- 返回最后一个AUTO_INCREMENT值
```

- MySql 不允许函数作为默认值
- 许多数据库开发人员使用默认值而不是 NULL 列，特别是对用于计算或数据分组的列

```bash
CREATE TABLE orderitems(
    order_num    int                NOT NULL,
    order_item    int                NOT NULL,
    prod_id        char(10)        NOT NULL,
    quantity    int                NOT NULL DEFAULT 1,  -- 指定默认值
    item_price    decimal(8,2)    NOT NULL,
    PRIMARY KEY(order_num,order_item)
)ENGINE = InnoDB;
```

### 引擎介绍

- InnoDB 是一个可靠的事务处理引擎，不支持全文本搜索
- MEMORY 在功能等同于 MyISAM，但由于数据存储在内存中，速度很快，适合于临时表
- MyISAM 是一个性能极高的引擎，支持全文本搜索 ，不支持事务处理
- 混用引擎类型有一个大缺陷，外键不能跨引擎，即使用一个引擎的表不能引用具有使用不同引擎的表的外键。

### 更新表

理想状态下，当该表存了数据之后，就不应该被更新

```bash
ALTER TABLE vendors ADD vend_phone CHAR(20);    -- 给表添加一列
ALTER TABLE vendors DROP COLUMN vend_phone;        -- 删除刚刚添加的列
-- ALTER常用于定义外键
ALTER TABLE orderitems ADD CONSTRAINT fk_orderitems_orders
FOREIGN KEY (order_num) REFERENCES orders (order_num);
ALTER TABLE orderitems ADD CONSTRAINT fk_orderitems_products 
FOREIGN KEY (prod_id) REFERENCES orders (prod_id);
ALTER TABLE orders ADD CONSTRAINT fk_orderitems_customers 
FOREIGN KEY (cust_id) REFERENCES customers (cust_id);
ALTER TABLE products ADD CONSTRAINT fk_products_vendors
FOREIGN KEY (vend_id) REFERENCES vendors (vend_id);
```

### 删除表

```bash
DROP TABLE customers2;
```

### 重命名表

```bash
RENAME TABLE customer2 TO customers;
RENAME TABLE backup_customers TO customers,    -- 重命名多个表
             backup_vendors TO vendors,
             backup_products TO products;
```

## 二十、视图

- 视图是虚拟的表，只包含使用时动态检索数据的查询。
- 视图可以重用 SQL 语句，简化复杂 SQL 操作，使用表的组成部分，保护数据，更改数据格式和表示。
- 每次使用视图，都必须处理查询执行时所需的任一个检索，如果创建了复杂的视图，性能下降的厉害

### 视图的规则

- 视图必须唯一命名
- 创建视图必须有足够的访问权限
- 视图可以嵌套
- ORDER BY 可以用在视图中，如果从该视图检索数据的 SELECT 语句中也有 ORDER BY，那么该视图中的 ORDER BY 将被覆盖。
- 视图不能索引，也不能有关联的触发器或默认值。
- 视图可以和表一起使用
- 更新视图可以先 DROP 再用 CREATE 也可以 CREATE OR REPLACE VIEW。

```bash
SHOW CREATE VIEW vendorlocations;    -- 查看创建的视图
DROP VIEW viewname;        -- 删除视图
```

### 使用视图简化复杂联结

```bash
CREATE VIEW productcustomers AS SELECT cust_name,cust_contact,prod_id    -- 联结三个表，以返回已订购了任意产品的所有客户的列表。
FROM customers,orders,orderitems WHERE customers.cust_id = orders.cust_id
AND orderitems.order_num = orders.order_num;
SELECT * FROM productcustomers;        -- 列出订购了任意产品的客户
SELECT cust_name,cust_contact FROM productcustomers WHERE prod_id = 'TNT2';
```

### 用视图格式化检索的数据

```bash
CREATE VIEW vendorlocations AS 
SELECT Concat(RTrim(vend_name),'(',RTrim(vend_country),')') 
AS vend_title FROM vendors ORDER BY vend_name;
SELECT * FROM vendorlocations;
```

### 用视图过滤不要的数据

```bash
CREATE VIEW customeremaillist AS SELECT cust_id,cust_name,cust_email
FROM customers WHERE cust_email IS NOT NULL;
SELECT * FROM customeremaillist;
```

### 使用视图与计算字段

```bash
CREATE VIEW orderitemsexpanded AS SELECT order_num,prod_id,quantity,item_price,quantity*item_price 
AS expanded_price FROM orderitems;
SELECT * FROM orderitemsexpanded WHERE order_num = 20005;
```

### 更新视图

- 可以对视图使用 INSERT、UPDATE 和 DELETE 进行更新，更新视图将更新其基表
- 一般应该将视图用于检索而不用于更新
- 如果 MySql 不能正确地确定被更新的基数据，则不允许更新，意味着如果视图定义有以下操作则不能更新：
- 分组，使用 GROUP BY 和 HAVING；
- 联结、子查询、并、聚集函数(Min()、Count()、Sum()等)、DISTINCT、导出(计算)列；

## 二十一、存储过程

- 存储过程简单来说，就是为以后的使用而保存的一条或多条 MySql 语句的集合。
- 简化复杂操作、保证数据完整性、简化对变动的管理、提高性能
- DELIMITER —告诉命令行实用程序使用—告诉命令行实用程序使用作为新的语句结束分隔符，除了\符号，其他字符都能当语句分隔符

```bash
delimiter $
CREATE PROCEDURE productpricing()        -- 创建存储过程
BEGIN
    SELECT Avg(prod_price) AS priceaverage 
    FROM products;
END $
CALL productpricing();
DROP PROCEDURE productpricing;            -- 删除存储过程
DROP PROCEDURE IF EXISTS productpricing;    -- 仅当存在才删除
delimiter $
CREATE PROCEDURE productpricing(
    OUT p1 DECIMAL(8,2),        -- OUT指出相应的参数用来从存储过程传出一个值，返回给调用者。
    OUT ph DECIMAL(8,2),        -- IN，传递给存储过程，INOUT，对存储过程传入和传出
    OUT pa DECIMAL(8,2)            -- INTO关键字，用于将检索的值存入变量中
)
BEGIN 
    SELECT Min(prod_price) INTO p1 FROM products;
    SELECT Max(prod_price) INTO ph FROM products;
    SELECT Avg(prod_price) INTO pa FROM products;
END $
CALL productpricing(@pricelow,@pricehigh,@priceaverage);    -- 所有MySql变量必须以@开头
SELECT @pricehigh,@pricelow,@priceaverage;
delimiter $
CREATE PROCEDURE ordertotal(
    IN onumber INT,
    OUT ototal DECIMAL(8,2)
)
BEGIN
    SELECT Sum(item_price*quantity) FROM orderitems
    WHERE order_num = onumber INTO ototal;
END $
CALL ordertotal(20005,@total);
CALL ordertotal(20009,@total1);
SELECT @total,@total1;
DROP PROCEDURE ordertotal;
-- 建立智能存储过程
delimiter $
CREATE PROCEDURE ordertotal(        -- 计算订单合计
    IN onumber INT,
    IN taxable BOOLEAN,        -- 增加税为真，否则为假
    OUT ototal DECIMAL(8,2)
) COMMENT 'Obtain order total, optionally adding tax'
BEGIN
    DECLARE total DECIMAL(8,2);        -- DECLARE要求指定变量名和数据类型
    -- Declare tax percentage
    DECLARE taxrate INT DEFAULT 6;    -- 默认设置为6
    -- Get the order total
    SELECT Sum(item_price*quantity) FROM orderitems
    WHERE order_num = onumber INTO total;
    IF taxable THEN                                    -- IF语句还支持ELSEIF和ELSE子句
        SELECT total+(total/100*taxrate) INTO total;    -- 增加营业税
    END IF;
    -- And finally, save to out variable
    SELECT total INTO ototal;
END $
CALL ordertotal(20005,0,@total);
SELECT @total;
CALL ordertotal(20005,1,@total);
SELECT @total;
SHOW CREATE PROCEDURE ordertotal;        -- 检查存储过程
SHOW PROCEDURE STATUS LIKE 'ordertotal';        -- 获得存储过程的创建时间和创建人等详细信息，可以使用LIKE限制其输出
```

---

## 二十二、游标

游标是一个存储在 MySql 服务器上的数据库查询，主要用于交互式应用，用户需要滚动屏幕上的数据。

MySql 游标只能用于存储过程和函数。

### 使用游标涉及的步骤

- 使用游标前，必须声明/定义它。
- 声明后，必须打开游标以供使用。这个过程用前面定义的 SELECT 语句把数据实际检索出来
- 对于填有数据的游标，根据需要取出各行。
- 在结束游标使用时，必须关闭游标

```bash
delimiter $
CREATE PROCEDURE processorders()
BEGIN
    DECLARE ordernumbers CURSOR            -- 定义和命名游标
    FOR SELECT order_num FROM orders;
    OPEN ordernumbers;                    -- 打开游标
    CLOSE ordernumbers;                    -- 关闭游标，释放所有内部内存和资源
END $                                    -- 存储过程处理完成后，游标就消失(它局限于存储过程)
-- MySql将会在到达END语句时自动关闭游标
delimiter $
CREATE PROCEDURE processorders1()        -- 检索单行数据
BEGIN
    DECLARE o INT;
    DECLARE ordernumbers CURSOR
    FOR SELECT order_num FROM orders;    
    OPEN ordernumbers;
    FETCH ordernumbers INTO o;            -- FETCH检索单个行
    CLOSE ordernumbers;
END $
-- MySQl支持循环语句，直到使用LEAVE语句手动退出为止。
-- REPEAT语句的语法使它更适合于对游标进行循环。
delimiter $
CREATE PROCEDURE processorders2()        -- 循环检索数据
BEGIN
    DECLARE done BOOLEAN DEFAULT 0;        -- done默认值为0，局部变量必须在定义任意游标或句柄之前定义。
    DECLARE o INT;
    DECLARE ordernumbers CURSOR FOR        -- 定义游标
    SELECT order_num FROM orders;
    DECLARE CONTINUE HANDLER            -- 条件出现时被执行的代码，句柄必须在游标之后定义
    FOR SQLSTATE '02000' SET done=1;    -- 当SQLSTATE '02000'出现时，SET done = 10，SQLSTATE '02000'是一个未找到条件
    OPEN ordernumbers;
    REPEAT
        FETCH ordernumbers INTO o;        -- 检索当前order_num到o变量中
    UNTIL done END REPEAT;                -- 反复执行，直到done为真，REPEAT由于没有更多行供循环而不能继续时，出现SQLSTATE '02000'
    CLOSE ordernumbers;
END $
delimiter $
CREATE PROCEDURE processorders3()
BEGIN
    DECLARE done BOOLEAN DEFAULT 0;            -- 作为REPEAT循环的条件
    DECLARE o INT;                            -- 存取每次检索一行的数据
    DECLARE t DECIMAL(8,2);                    -- 存储每个订单的合计
    DECLARE ordernumbers CURSOR FOR            -- 定义游标
    SELECT order_num FROM orders;
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;        -- 句柄，出现SQLSTATE ‘02000’ 条件时，置done为1
    CREATE TABLE IF NOT EXISTS ordertotals(order_num INT,total DECIMAL(8,2));    -- 创建表，存储合计结果
    OPEN ordernumbers;                        -- 打开游标
    REPEAT
        FETCH ordernumbers INTO o;
        CALL ordertotal(o,1,t);                -- 计算每个订单的带税合计，存储到t中
        INSERT INTO ordertotals(order_num,total)        -- 保存每个订单的订单号和合计
        VALUES(o,t);
    UNTIL done END REPEAT;
    CLOSE ordernumbers;                        -- 关闭游标
END;
CALL processorders3();
SELECT * FROM ordertotals;
```

---

## 二十三、触发器

如果需要某些语句在事件发生时自动执行，就需要使用触发器。

触发器是 MySql 响应以下任意语句而自动执行的一条 Mysql 语句或位于 BEGIN 和 END 之间的一组语句：DELETE；INSERT；UPDATE，其他语句不支持触发器

创建触发器，需要给出触发器名，触发器关联的表，触发器响应的活动(DELETE 等)，触发器何时执行(之前或之后)。

MySql 中触发器名必须在每个表中唯一，不是在每个数据库中唯一。但最好在数据库范围内使用唯一触发器名

触发器仅支持表，每个表每个事件每次只允许一个触发器，因此每个表最多支持 6 个触发器

一个触发器只能关联一个事件或一个表。

MYSQL5 以后，不允许触发器返回任何结果，因此使用 into @ 变量名

```bash
CREATE TRIGGER newproduct AFTER INSERT ON products
FOR EACH ROW SELECT 'Product added' INTO @temp;    -- AFTER INSERT表示在INSERT语句成功执行后执行
-- FOR EACH ROW说明代码对每个插入行执行，Product added将对每个插入的行显示一次
INSERT INTO products VALUES('TNT3', '1003', 'TNT (6 sticks)', '11.00', 'TNT, red, pack of 11 sticks');
SELECT @temp;
DROP TRIGGER newproduct;        -- 删除触发器
```

---

### INSERT 触发器

- 在 INSERT 触发器内，可引用一个名为 NEW 的虚拟表，访问被插入的行
- BEFORE INSERT 中，NEW 的值可以被更新
- AUTO_INCREMENT 列，NEW 在 INSERT 执行之前包含 0，在 INSERT 执行之后包含新的自动生成值
- 通常 BEFORE 用于数据验证和净化。
- CREATE TRIGGER neworder AFTER INSERT ON orders
  FOR EACH ROW SELECT NEW.order_num INTO @temp1; — 插入数据到 orders 表后，MySql 生成新订单号并保存到 order_num 中
- 触发器从 NEW.order_num 取得这个值并返回，此触发器必须按照 AFTER INSERT 执行，否则新的 order_num 还没生成。

```bash
INSERT INTO orders(order_date,cust_id) VALUES(Now(),10001);
SELECT @temp1;
```

---

### DELETE 触发器

- 在 DELETE 触发器代码内，可以引用一个名为 OLD 的虚拟表，访问被删除的行
- OLD 中的值全都是只读的，不能更新

```bash
CREATE TABLE archive_orders
(
  order_num  int      NOT NULL AUTO_INCREMENT,
  order_date datetime NOT NULL ,
  cust_id    int      NOT NULL ,
  PRIMARY KEY (order_num)
) ENGINE=InnoDB;
delimiter $
CREATE TRIGGER deleteorder BEFORE DELETE ON orders        -- 使用OLD保存将要删除的行到一个存档表中
FOR EACH ROW                                -- 使用BEFORE的优点，如果某种原因，订单不能存档，DELETE本身将被放弃
BEGIN
    INSERT INTO archive_orders(order_num,order_date,cust_id)
    VALUE(OLD.order_num,OLD.order_date,OLD.cust_id);
END;
DELETE FROM orders where order_num = 20010;
SELECT * FROM archive_orders;
```

---

### UPDATE 触发器

- 可以引用 OLD 虚拟表访问以前的值，引用 NEW 虚拟表访问新更新的值
- 在 BEFORE UPDATE 触发器中，NEW 中的值可能也被更新
- OLD 中的值全是只读的
- 触发器中不能调用存储过程
- 应该用触发器来保证数据的一致性

```bash
CREATE TRIGGER updatevendor BEFORE UPDATE ON vendors
FOR EACH ROW SET NEW.vend_state = Upper(NEW.vend_state);
```

---

## 二十四、事务

事务处理可以用来维护数据库的完整性，它保证成批的 MySql 操作要么完全执行，要么完全不执行。

### 概念解释

- 事务，指一组 SQL 语句
- 回退，指撤销指定 SQL 语句的过程
- 提交，指将未存储的 SQL 语句结果写入数据库表
- 保留点，指事务处理中设置的临时占位符，你可以对它发布回退。

```bash
SET SQL_SAFE_UPDATES = 0;
SELECT * FROM ordertotals;
START TRANSACTION;            -- 开始事务处理
DELETE FROM ordertotals;    -- 删除所有行
SELECT * FROM ordertotals;    -- 验证为空
ROLLBACK;                    -- 回退事务开始后的所有语句
SELECT * FROM ordertotals;
```

- **ROLLBACK** 只能在一个事务处理内使用
- 事务处理用来管理 **INSERT、UPDATE** 和 **DELETE** 语句，不能回退 **SELECT** 语句，因为没有意义，也不能回退 **CREATE** 或 **DROP** 操作，事务处理可以使用这两条语句，但执行回退，它们不会被撤销
- 一般的 SQL 是隐含提交的，事务处理块中，需要明确使用 **COMMIT** 语句进行提交

```bash
START TRANSACTION;
DELETE FROM orderitems WHERE order_num = 20010;
DELETE FROM orders WHERE order_num = 20010;
COMMIT;        -- 当COMMIT或ROLLBACK语句执行后，事务会自动关闭
```

- 为了支持部分事务回退，需要在合适位置设置保留点，保留点在事务处理完成后自动释放，也可以使用 **RELEASE SAVEPOINT** 明确释放保留点

```bash
SAVEPOINT delete1;        -- 设置回退点，并取名
ROLLBACK TO delete1;    -- 进行回退
-- 更改默认提交行为
SET autocommit = 0;        -- 指示MySql不自动提交更改
```

## 二十五、全球化和本地化

不同语言和字符集需要以不同的方式存储和检索。

### 概念解释

- 字符集，字母和符号的集合
- 编码，为某个字符集成员的内部表示
- 校对，为规定字符如何比较的指令

```bash
SHOW CHARACTER SET;        -- 显示所有可用的字符集以及每个字符集的描述和默认校对
SHOW VARIABLES LIKE 'character%';    -- 确定所用字符集和校对
SHOW VARIABLES LIKE 'collation%';
CREATE TABLE mytable(    -- 对表指定字符集和校对顺序
    columnn1 INT,
    columnn2 VARCHAR(10)
)DEFAULT CHARACTER hebrew
COLLATE hebrew_general_ci;
CREATE TABLE mytable(
    columnn1 INT,
    columnn2 VARCHAR(10),
    columnn3 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci    -- 对列指定字符集和校对
) DEFAULT CHARACTER SET hebrew
COLLATE hebrew_general_ci;
SELECT * FROM customers
ORDER BY lastname,firstname COLLATE latin1_general_cs;        -- 指定一个备用校对顺序
```

---

## 二十六、安全管理

MYSQL 用户账号和信息存储在名为 mysql 的 MYSQL 数据库中。

```bash
USE mysql;
SELECT user FROM user;        -- 获得所有用户账号列表
```

创建新用户账号
**IDENTIFIED BY** 指定的口令为纯文本，MYSQL 将其保存到 user 表之前对其进行加密，为了作为散列值指定口令，使用 **IDENTIFIED BY PASSWORD**

```bash
CREATE USER ben IDENTIFIED BY 'p@$$w0rd';        -- 创建新账号并给出口令
```

GRANT 语句也可以创建用户账号，也可以通过直接插入行到 USER 表来增加用户，但一般不这么做

```bash
RENAME USER ben TO bforta;    -- 重新命名一个用户账号
DROP USER bforta;            -- 删除用户账号以及相关权限
SHOW GRANTS FOR bforta;        -- 查看赋予用户账号的权限，USAGE表示没有权限，用户定义为user%host
```

添加用户权限

```bash
GRANT SELECT,INSERT ON crashcourse.* TO bforta    -- 允许用户在crashcourse数据库的所有表使用SELECT
```

撤销用户权限

```bash
REVOKE SELECT ON crashcourse.* FROM bforta;
```

更改用户口令

```bash
SET PASSWORD FOR bforta = Password('n3w p@$$w0rd');    -- 新口令必须传递到Password函数进行加密
SET PASSWORD = Password('368752');                    -- 设置自己的口令
```

---

## 二十七、数据库维护

- 使用 **mysqldump** 转储所有数据库内容到某个外部文件
- 使用 **mysqlhotcopy** 从一个数据库复制所有数据
- **BACKUP TABLE** 或 **SELECT INTO OUTFILE** 转储所有数据到某个外部文件，使用 **RESTORE TABLE** 复原
- 为保证所有数据被写到磁盘，在备份前使用 **FLUSH TABLE** 刷新未写数据

```bash
ANALYZE TABLE orders;            -- 检查表键是否正确
CHECK TABLE    orders,orderitems;    -- 针对许多问题对表进行检查
```

如果从一个表删除大量数据，应该使用 **OPTIMIZE TABLE** 来收回所用空间，从而优化表的性能

```bash
mysqld --help;            -- 帮助
mysqld --safe-mode;        -- 装载减去某些最佳配置的服务器
mysqld --verbose;        -- 显示全文本信息
mysqld --version;        -- 显示版本信息
```

- 错误日志，记录错误，名为 hostname.err，位于 data 目录，日志名可用—log-error 命令行选项更改
- 查询日志，记录所有 MYsql 活动，名为 hostname.log，位于 data 目录，可用—log 命令行选项更改
- 二进制日志，记录更新过数据的所有语句，名为 hostname-bin，位于 data 目录，可用—log-bin 命令行选项更改
- 缓慢查询日志，记录执行缓慢的任何查询，名为 hostname-slow.log，位于 data 目录，可以—log-slow-queries 命令行选项更改。

> FLUSH LOG 刷新和重新开始所有日志文件

## 三十、改善性能

- MySql 是一个多用户多线程的 DBMS，可使用 SHOW PROCESSLIST 显示所有活动进程，使用 KILL 命令终结某个进程。
- 使用 EXPLAIN 语句让 MySql 解释它将如何执行一条 SELECT 语句。
- 一般来说，存储过程执行比一条一条执行 SQL 语句快。
- 应该总是使用正确的数据类型。
- 决不要检索比需求还多的数据，也就是不要用 SELECT * FROM TABLE。
- 有的操作支持可选的 DELAYED 关键字，如果使用它，将把控制立即返回给调用程序，并且一旦有可能就实际执行该操作。
- 导入数据时，应该关闭自动提交。
- 必须索引数据库表以改善数据检索性能。
- 如果 SELETE 语句有很多复杂的 OR 条件，可以使用多条 SELETE 语句和连接它们的 UNION 语句，得以改善。
- 索引改善数据检索性能，但损害数据插入、删除和更新的性能。
- LIKE 很慢，最好使用 FULLTEXT。
