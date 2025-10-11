#!/bin/bash

# 批量将PNG和JPG文件转换为WebP格式
# 作者: 自动化脚本
# 日期: $(date +%Y-%m-%d)

# 设置目标目录
TARGET_DIR="/home/inaho/work/ms_service/middleware/IInaho.github.io/content/posts/static"

# 检查是否安装了cwebp工具
if ! command -v cwebp &> /dev/null; then
    echo "错误: 未找到cwebp工具。请先安装webp工具包。"
    echo "安装方法:"
    echo "  Ubuntu/Debian: sudo apt-get install webp"
    echo "  CentOS/RHEL: sudo yum install libwebp-tools"
    echo "  macOS: brew install webp"
    exit 1
fi

# 进入目标目录
cd "$TARGET_DIR" || exit 1

# 统计转换前的文件数量
echo "开始批量转换图片格式..."
echo "目标目录: $TARGET_DIR"

# 转换PNG文件
echo "正在转换PNG文件..."
for file in *.png; do
    if [ -f "$file" ]; then
        # 生成输出文件名（移除.png后缀，添加.webp）
        output_file="${file%.png}.webp"
        
        # 使用cwebp进行转换，质量设置为85
        if cwebp -q 85 "$file" -o "$output_file"; then
            echo "✓ 转换成功: $file -> $output_file"
        else
            echo "✗ 转换失败: $file"
        fi
    fi
done

# 转换JPG文件
echo "正在转换JPG文件..."
for file in *.jpg *.jpeg; do
    if [ -f "$file" ]; then
        # 生成输出文件名（移除.jpg后缀，添加.webp）
        output_file="${file%.jpg}.webp"
        # 如果是jpeg文件
        if [[ "$file" == *.jpeg ]]; then
            output_file="${file%.jpeg}.webp"
        fi
        
        # 使用cwebp进行转换，质量设置为85
        if cwebp -q 85 "$file" -o "$output_file"; then
            echo "✓ 转换成功: $file -> $output_file"
        else
            echo "✗ 转换失败: $file"
        fi
    fi
done

echo "转换完成！"

# 统计转换后的文件数量
echo "统计信息:"
echo "WebP文件数量: $(ls -1 *.webp 2>/dev/null | wc -l)"
echo "原始PNG文件数量: $(ls -1 *.png 2>/dev/null | wc -l)"
echo "原始JPG文件数量: $(ls -1 *.jpg *.jpeg 2>/dev/null | wc -l)"

# 显示文件大小对比
echo ""
echo "文件大小对比:"
if command -v du &> /dev/null; then
    echo "原始图片总大小: $(du -ch *.png *.jpg *.jpeg 2>/dev/null | tail -1 | cut -f1)"
    echo "WebP图片总大小: $(du -ch *.webp 2>/dev/null | tail -1 | cut -f1)"
fi

find "$TARGET_DIR" -type f -name "*.png" -delete
find "$TARGET_DIR" -type f -name "*.jpg" -delete
find "$TARGET_DIR" -type f -name "*.jpeg" -delete
