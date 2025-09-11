#!/bin/bash
# 清理public目录下除.git及其内容外的所有文件和目录
find ./public -mindepth 1 ! -name .git ! -path ./public/.git/* -exec rm -rf {} +
echo "已清理public目录, 保留.git"