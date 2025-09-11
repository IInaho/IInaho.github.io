#!/bin/bash

# 设置脚本在出错时继续执行，记录错误信息
# 使用-e选项会导致脚本在任何命令出错时退出，与我们的需求不符
# 因此不使用set -e，而是让脚本继续执行以便记录所有错误

# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTS_DIR="$SCRIPT_DIR/content/posts"

# 检查posts目录是否存在
if [ ! -d "$POSTS_DIR" ]; then
    echo "错误: $POSTS_DIR 目录不存在"
    exit 1
fi

# 创建日志文件
LOG_FILE="$SCRIPT_DIR/rename_log.txt"
echo "重命名日志 - $(date)" > "$LOG_FILE"

# 遍历posts目录下的所有md文件
find "$POSTS_DIR" -type f -name "*.md" | while read -r file; do
    # 提取文件名（不含路径和扩展名）
    filename=$(basename "$file")
    filepath=$(dirname "$file")
    
    # 读取文件内容，提取front matter中的date和title
    # 使用awk提取front matter中的date，并确保只保留日期部分（YYYY-MM-DD），去除所有前导和尾随空格
date=$(awk -F '=' '/^date = "[^"]*"/ {gsub(/"/, "", $2); split($2, parts, " "); gsub(/^[ 	]+|[ 	]+$/, "", parts[1]); print parts[1]; exit}' "$file")
    
    # 使用awk提取front matter中的title
    title=$(awk -F '=' '/^title = "[^"]*"/ {gsub(/"/, "", $2); print $2; exit}' "$file")
    
    # 如果没有找到date或title，则跳过此文件
    if [ -z "$date" ]; then
        echo "警告: 在文件 $filename 中未找到date属性，跳过" >> "$LOG_FILE"
        continue
    fi
    
    if [ -z "$title" ]; then
        echo "警告: 在文件 $filename 中未找到title属性，跳过" >> "$LOG_FILE"
        continue
    fi
    
    # 处理title，去除空格和特殊字符
    # 移除所有空格
    processed_title=$(echo "$title" | tr -d '[:space:]')
    # 替换文件名中不允许的特殊字符为下划线
    processed_title=$(echo "$processed_title" | sed 's/[\/\\:*?"<>|]/_/g')
    
    # 新的文件名 - date-title格式，确保没有前导空格
new_filename="$date-$processed_title.md"
    new_filepath="$filepath/$new_filename"
    
    # 检查新文件名是否与原文件名相同
    if [ "$filename" = "$new_filename" ]; then
        echo "信息: 文件 $filename 已经是正确的名称，无需重命名" >> "$LOG_FILE"
        continue
    fi
    
    # 检查新文件名是否已存在
    if [ -f "$new_filepath" ]; then
        echo "错误: 文件 $new_filename 已存在，无法重命名 $filename" >> "$LOG_FILE"
        continue
    fi
    
    # 执行重命名操作
    mv "$file" "$new_filepath"
    echo "成功: 将 $filename 重命名为 $new_filename" >> "$LOG_FILE"
done

# 显示重命名结果统计
success_count=$(grep -c "成功" "$LOG_FILE")
skip_count=$(grep -c "无需重命名" "$LOG_FILE")
error_count=$(grep -c "错误" "$LOG_FILE")
warning_count=$(grep -c "警告" "$LOG_FILE")

echo "重命名完成！"
echo "成功重命名: $success_count 个文件"
echo "无需重命名: $skip_count 个文件"
echo "警告: $warning_count 个文件"
echo "错误: $error_count 个文件"
echo "详细日志请查看: $LOG_FILE"