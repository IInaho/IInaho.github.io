#!/bin/bash

# 清理public目录下除.git及其内容外的所有文件和目录
# 确保脚本在出错时立即退出
set -e

# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/public"

# 检查public目录是否存在
if [ ! -d "$PUBLIC_DIR" ]; then
    echo "错误: public目录不存在"
    exit 1
fi

# 检查.git目录是否存在于public目录下
if [ ! -d "$PUBLIC_DIR/.git" ]; then
    echo "警告: public目录下未找到.git目录，但仍将继续清理"
fi

# 优化的删除命令，使用绝对路径并确保不会误删.git目录
# 使用 -depth 先处理子目录，更安全
find "$PUBLIC_DIR" -mindepth 1 -depth ! -name ".git" ! -path "$PUBLIC_DIR/.git/*" -exec rm -rf {} +

# 验证.git目录是否仍然存在
if [ -d "$PUBLIC_DIR/.git" ]; then
    echo "已成功清理public目录，.git目录已保留"
else
    echo "错误: 清理后未找到.git目录，可能已被误删"
    exit 1
fi

# 显示清理结果统计
FILE_COUNT=$(find "$PUBLIC_DIR" -type f | wc -l)
DIR_COUNT=$(find "$PUBLIC_DIR" -type d | wc -l)
echo "当前public目录下有 $FILE_COUNT 个文件和 $DIR_COUNT 个目录"