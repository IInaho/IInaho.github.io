+++
authors = ["lzy"]
title = "mongo 快速入门"
date = "2025-02-28"
description = ""
tags = [
    "mongo"
]
categories = [
    "技术文档"
]
+++

# mongo 快速入门

## mongoDB 基础命令

### 前置概念

**IOPS** 是指单位时间内系统能处理的 I/O 请求数量，一般以每秒处理的 I/O 请求数量为单位，
I/O 请求通常为读或写数据操作请求。随机读写频繁的应用，如 OLTP，IOPS 是关键衡量指标。

**QPS**(Query Per Second,既每秒请求、查询次数)

**TPS**(Transcantion Per Second,既每秒事务数)

MongoDB 是一个开源、高性能、无模式的文档型数据库

### Bson

BSON 是一种类 json 的一种二进制形式的存储格式，简称 Binary JSON，它和 JSON 一样，支持内嵌的文档对象和数组对象，但是 BSON 有 JSON 没有的一些数据类型，如 Date 和 BinData 类型。

BSON 可以做为网络数据交换的一种存储形式，这个有点类似于 Google 的 Protocol Buffer，但是 BSON 是一种 schema-less 的存储形式，它的优点是灵活性高，但它的缺点是空间利用率不是很理想， BSON 有三个特点：**轻量性、可遍历性、高效性**。

BSON 主要会实现以下三点目标：

- 更快的遍历速度，对 JSON 格式来说，太大的 JSON 结构会导致数据遍历非常慢。在 JSON 中，要跳过一个文档进行数据读取，需要对此文档进行扫描才行，需要进行麻烦的数据结构匹配，比如括号的匹配，而 BSON 对 JSON 的一大改进就是，它会将 JSON 的每一个元素的长度存在元素的头部，这样你只需要读取到元素长度就能直接 seek 到指定的点上进行读取了
- 操作更简易，对 JSON 来说，数据存储是无类型的，比如你要修改基本一个值，从 9 到 10，由于从一个字符变成了两个，所以可能其后面的所有内容都需要往后移一位才可以。而使用 BSON，你可以指定这个列为数字列，那么无论数字从 9 长到 10 还是 100，我们都只是在存储数字的那一位上进行修改，不会导致数据总长变大。当然，在 MongoDB 中，如果数字从整形增大到长整型，还是会导致数据总长变大的。
- 增加了额外的数据类型，JSON 是一个很方便的数据交换格式，但是其类型比较有限。BSON 在其基础上增加了“byte array”数据类型。这使得二进制的存储不再需要先 base64 转换后再存成 JSON。大大减少了计算开销和数据大小。

## 数据库操作

### 登录

```bash
mongo
mongo --host=127.0.0.1 --port=27017
```

### 查看已有数据库

```bash
show databases
show dbs
db        // 查看已有数据库
```

### 选择和创建数据库

```bash
// 如果不存在articledb数据库，则自动创建
use articledb
```

### 数据库删除

```bash
db.dropDatabase()
```

## 集合操作

### 集合的创建

```bash
db.createCollection("test")        //显式
```

### 查看当前库中的集合

```bash
show collections
show tables
```

### 集合的删除

```bash
db.collection.drop()
db.{集合}.drop()
```

## 文档操作

### 单条插入

```bash
// comment集合如果不存在，则会隐式创建
db.comment.insert({
    "articleid":"100000",
    "content":"今天天气真好，阳光明媚",
    "userid":"1001",
    "nickname":"Rose",
    "createdatetime":new Date(),        // 插入当前日期
    "likenum":NumberInt(10),
    "state":null
})
```

### 批量插入

```bash
// 插入时指定了_id ，则主键就是该值。
// 用try catch进行异常捕捉处理
try{
db.comment.insertMany([
    {
        "_id":"1",
        "articleid":"100001",
        "content":"我们不应该把清晨浪费在手机上，健康很重要，一杯温水幸福你我他。",
        "userid":"1002",
        "nickname":"相忘于江湖",
        "createdatetime":new Date("2019-0805T22:08:15.522Z"),
        "likenum":NumberInt(1000),
        "state":"1"
    },

    {
        "_id":"2",
        "articleid":"100001",
        "content":"我夏天空腹喝凉开水，冬天喝温开水",
        "userid":"1005",
        "nickname":"伊人憔悴",
        "createdatetime":new Date("2019-08-05T23:58:51.485Z"),
        "likenum":NumberInt(888),
        "state":"1"
    },

    {
        "_id":"3",
        "articleid":"100001",
        "content":"我一直喝凉开水，冬天夏天都喝。",
        "userid":"1004",
        "nickname":"杰克船长",
        "createdatetime":new Date("2019-08-06T01:05:06.321Z"),
        "likenum":NumberInt(666),"state":"1"},

    {
        "_id":"4",
        "articleid":"100001",
        "content":"专家说不能空腹吃饭，影响健康。",
        "userid":"1003",
        "nickname":"凯撒",
        "createdatetime":new Date("2019-08-06T08:18:35.288Z"),
        "likenum":NumberInt(2000),
        "state":"1"
    },

    {
        "_id":"5",
        "articleid":"100001",
        "content":"研究表明，刚烧开的水千万不能喝，因为烫 嘴。",
        "userid":"1003",
        "nickname":"凯撒",
        "createdatetime":new Date("2019-0806T11:01:02.521Z"),
        "likenum":NumberInt(3000),
        "state":"1"
    }

]);
} catch(e) {
    print(e);
}
```

### 文档查询

#### 简单查询

```bash
// 查询所有
db.comment.find()
db.comment.find({})
// 按条件查询
db.comment.find({userid:'1003'})
// 返回符合条件的第一条数据
db.comment.findOne({userid:'1003'})
// 查询结果返回部分字段,_id默认显示
db.comment.find(
    {userid:"1003"},
    {userid:1,nickname:1})
// 查询结果只显示userid、nickname，不显示_id
db.comment.find({userid:"1003"},{userid:1,nickname:1,_id:0})
```

#### 统计查询

```bash
db.collection.count(query, options)
// 统计comment集合的所有的记录数
db.comment.count()
// 按条件统计记录数
db.comment.count({userid:"1003"})
```

#### 分页列表查询

```bash
// 使用limit()方法来读取指定数量的数据，使用skip()方法来跳过指定数量的数据
db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
// 在ﬁnd方法后调用limit来返回结果(TopN)，默认值20
db.comment.find().limit(3)
// skip方法同样接受一个数字参数作为跳过的记录条数,默认值是0
db.comment.find().skip(3)
```

#### 排序查询

```bash
// sort()方法对数据进行排序，sort()方法可以通过参数指定排序的字段，并使用1和-1来指定排序的方式，其中1为升序排列，而-1是用于降序排列。
db.COLLECTION_NAME.find().sort({KEY:1})
db.集合名称.find().sort(排序方式)
// 对userid降序排列，并对访问量进行升序排列
db.comment.find().sort({userid:-1,likenum:1})
```

skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，后是显示的 limit()，和命令编写顺序无关

#### 正则查询

```bash
db.collection.find({field:/正则表达式/})
db.集合.find({字段:/正则表达式/})
// 查询评论内容包含“开水”的所有文档
db.comment.find({content:/开水/})
// 查询评论的内容中以“专家”开头
db.comment.find({content:/^专家/})
```

#### 比较查询

```bash
db.集合名称.find({ "field" : { $gt: value }})        // 大于: field > value
db.集合名称.find({ "field" : { $lt: value }})        // 小于: field < value
db.集合名称.find({ "field" : { $gte: value }})        // 大于等于: field >= value 
db.集合名称.find({ "field" : { $lte: value }})        // 小于等于: field <= value
db.集合名称.find({ "field" : { $ne: value }})        // 不等于: field != value
// 查询评论点赞数量大于700的记录
db.comment.find({likenum:{$gt:NumberInt(700)}})
```

#### 包含查询

```bash
// 查询评论的集合中userid字段包含1003或1004的文档
db.comment.find({userid:{$in:["1003","1004"]}})
// 查询评论集合中userid字段不包含1003和1004的文档
db.comment.find({userid:{$nin:["1003","1004"]}})
```

#### 条件连接查询

```bash
// 查询评论集合中likenum大于等于700并且小于2000的文档
db.comment.find({$and:[{likenum:{$gte:NumberInt(700)}},{likenum:{$lt:NumberInt(2000)}}]})
// 查询评论集合中userid为1003，或者点赞数小于1000的文档记录
db.comment.find({$or:[ {userid:"1003"} ,{likenum:{$lt:1000}}]})
```

### 文档的更新

```bash
//基本格式
db.collection.update(query, update, options)
db.collection.update(
    <query>,
    <update>,

 {

    upsert: <boolean>,
    multi: <boolean>,
    writeConcern: <document>,
    collation: <document>,
    arrayFilters: [ <filterdocument1>, ... ],
    hint:<document|string>

 })
// 覆盖修改，想修改_id为1的记录，点赞量为1001，但其他字段没有了
db.comment.update({_id:"1"},{likenum:NumberInt(1001)})
// 局部修改，修改_id为2的记录，浏览量为889，其他字段还在
db.comment.update({_id:"2"},{
$set:{likenum:NumberInt(889)}})
// 批量修改
//默认只修改第一条数据 
db.comment.update({userid:"1003"},{$
set:{nickname:"凯撒2"}})
//修改所有符合条件的数据
db.comment.update({userid:"1003"},{$set:{nickname:"凯撒大帝"}},{multi:true})
// 列值增长的修改，对3号数据的点赞数，每次递增1
db.comment.update({_id:"3"},{$inc:{likenum:NumberInt(1)}})
```

### 删除文档

```bash
db.集合名称.remove(条件)
db.comment.remove({})            // 将数据全部删除
db.comment.remove({_id:"1"})    // 删除_id=1的记录
```

## 索引

### 索引的查看

```bash
// 返回一个集合中的所有索引的数组
db.collection.getIndexes()
// 查看comment集合中所有的索引情况
db.comment.getIndexes()
```

MongoDB 在创建集合的过程中，在 _id 字段上创建一个唯一的索引，默认名字为 _id ，该索引可防止客户端插入两个具有相同值的文档，您不能在_id 字段上删除此索引.

### 索引的创建

```bash
// 在集合上创建索引。
db.collection.createIndex(keys, options)
// 单字段索引,对userid字段建立索引
db.comment.createIndex({userid:1})
// 对userid和nickname同时建立复合（Compound）索引
db.comment.createIndex({userid:1,nickname:-1})
```

### 索引的移除

```bash
// 指定索引的移除
db.collection.dropIndex(index)
// 删除comment集合中userid字段上的升序索引
db.comment.dropIndex({userid:1})
// 所有索引的移除
db.collection.dropIndexes()
```

### 索引的使用

分析查询性能，通常使用执行计划来查看查询的情况，如查询耗费的时间、是否基于索引查询等。

```bash
db.collection.find(query,options).explain(options)
// 查看根据userid查询数据的情况
db.comment.find({userid:"1003"}).explain()
```

当查询条件和查询的投影仅包含索引字段时，MongoDB 直接从索引返回结果，而不扫描任何文档或将文档带入内存，这些覆盖的查询可以非常有效。

```bash
db.comment.find({userid:"1003"},{userid:1,_id:0})
db.comment.find({userid:"1003"},{userid:1,_id:0}).explain()
```
