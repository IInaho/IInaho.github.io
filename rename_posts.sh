#!/bin/bash

# 增强版文章重命名脚本
# 功能: 自动将content/posts目录下的markdown文件重命名为date-title格式
# 支持包含时间的日期格式，增加预览模式和文件备份功能

# 初始化变量
PREVIEW_MODE=false
BACKUP_MODE=false
DRY_RUN=false
VERBOSE=false

# 设置脚本在出错时继续执行，记录错误信息
# 使用-e选项会导致脚本在任何命令出错时退出，与我们的需求不符
# 因此不使用set -e，而是让脚本继续执行以便记录所有错误

# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTS_DIR="$SCRIPT_DIR/content/posts"

# 帮助信息函数
display_help() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -p, --preview     预览模式，只显示要执行的重命名操作，不实际执行"
    echo "  -b, --backup      备份模式，在重命名前备份原始文件"
    echo "  -v, --verbose     详细模式，显示更多执行信息"
    echo "  -h, --help        显示帮助信息"
    exit 0
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--preview)
            PREVIEW_MODE=true
            DRY_RUN=true
            shift
            ;;
        -b|--backup)
            BACKUP_MODE=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            display_help
            ;;
        *)
            echo "未知选项: $1"
            display_help
            ;;
    esac
done

# 检查posts目录是否存在
if [ ! -d "$POSTS_DIR" ]; then
    echo "错误: $POSTS_DIR 目录不存在"
    exit 1
fi

# 创建日志文件
LOG_FILE="$SCRIPT_DIR/rename_log.txt"
echo "重命名日志 - $(date)" > "$LOG_FILE"

# 创建备份目录（如果启用备份模式）
if [ "$BACKUP_MODE" = true ] && [ "$DRY_RUN" = false ]; then
    BACKUP_DIR="$SCRIPT_DIR/posts_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    echo "创建备份目录: $BACKUP_DIR" >> "$LOG_FILE"
    [ "$VERBOSE" = true ] && echo "创建备份目录: $BACKUP_DIR"
fi

# 遍历posts目录下的所有md文件
find "$POSTS_DIR" -type f -name "*.md" | while read -r file; do
    # 提取文件名（不含路径和扩展名）
    filename=$(basename "$file")
    filepath=$(dirname "$file")
    
    # 读取文件内容，提取front matter中的date和title
    # 支持两种日期格式: "YYYY-MM-DD" 和 "YYYY-MM-DD HH:MM:SS"
date=$(awk -F '=' '/^date = "[^"]*"/ {gsub(/"/, "", $2); split($2, parts, " "); gsub(/^[ 	]+|[ 	]+$/, "", parts[1]); print parts[1]; exit}' "$file")
    
    # 使用awk提取front matter中的title
    title=$(awk -F '=' '/^title = "[^"]*"/ {gsub(/"/, "", $2); print $2; exit}' "$file")
    
    # 如果没有找到date或title，则跳过此文件
    if [ -z "$date" ]; then
        error_msg="警告: 在文件 $filename 中未找到date属性，跳过"
        echo "$error_msg" >> "$LOG_FILE"
        [ "$VERBOSE" = true ] && echo "$error_msg"
        continue
    fi
    
    if [ -z "$title" ]; then
        error_msg="警告: 在文件 $filename 中未找到title属性，跳过"
        echo "$error_msg" >> "$LOG_FILE"
        [ "$VERBOSE" = true ] && echo "$error_msg"
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
        info_msg="信息: 文件 $filename 已经是正确的名称，无需重命名"
        echo "$info_msg" >> "$LOG_FILE"
        [ "$VERBOSE" = true ] && echo "$info_msg"
        continue
    fi
    
    # 检查新文件名是否已存在
    if [ -f "$new_filepath" ]; then
        error_msg="错误: 文件 $new_filename 已存在，无法重命名 $filename"
        echo "$error_msg" >> "$LOG_FILE"
        [ "$VERBOSE" = true ] && echo "$error_msg"
        continue
    fi
    
    # 如果是预览模式，只显示操作不执行
    if [ "$PREVIEW_MODE" = true ]; then
        preview_msg="预览: 将 $filename 重命名为 $new_filename"
        echo "$preview_msg" >> "$LOG_FILE"
        echo "$preview_msg"
        continue
    fi
    
    # 如果启用备份模式，先备份文件
    if [ "$BACKUP_MODE" = true ]; then
        # 确保备份子目录存在
        backup_subdir="$BACKUP_DIR/$(dirname "${file#$POSTS_DIR/}")"
        mkdir -p "$backup_subdir"
        # 备份文件
        cp "$file" "$backup_subdir/"
        echo "备份: $file -> $backup_subdir/" >> "$LOG_FILE"
    fi
    
    # 执行重命名操作
    mv "$file" "$new_filepath"
    success_msg="成功: 将 $filename 重命名为 $new_filename"
    echo "$success_msg" >> "$LOG_FILE"
    [ "$VERBOSE" = true ] && echo "$success_msg"
done

# 显示重命名结果统计
success_count=$(grep -c "成功" "$LOG_FILE")
skip_count=$(grep -c "无需重命名" "$LOG_FILE")
error_count=$(grep -c "错误" "$LOG_FILE")
warning_count=$(grep -c "警告" "$LOG_FILE")
preview_count=$(grep -c "预览" "$LOG_FILE")

# 输出总结信息
if [ "$PREVIEW_MODE" = true ]; then
    echo "预览完成！"
    echo "将执行: $preview_count 个重命名操作"
    echo "无需重命名: $skip_count 个文件"
    echo "警告: $warning_count 个文件"
    echo "错误: $error_count 个文件"
    echo "没有实际执行重命名操作"
else
    echo "重命名完成！"
    echo "成功重命名: $success_count 个文件"
    [ "$BACKUP_MODE" = true ] && echo "已备份: $success_count 个文件到 $BACKUP_DIR"
    echo "无需重命名: $skip_count 个文件"
    echo "警告: $warning_count 个文件"
    echo "错误: $error_count 个文件"
fi

echo "详细日志请查看: $LOG_FILE"