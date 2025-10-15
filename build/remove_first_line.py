#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

def remove_first_line_title(file_path):
    """
    删除Markdown文件的第一行标题（以#开头的行）
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    # 查找第一行标题（以#开头的行）
    new_lines = []
    first_title_removed = False
    
    for line in lines:
        # 如果是第一行标题且尚未删除
        if line.startswith('#') and not first_title_removed:
            first_title_removed = True
            continue  # 跳过这一行
        new_lines.append(line)
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(new_lines)
    
    return first_title_removed

def process_all_md_files(directory):
    """
    处理目录下所有.md文件
    """
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            file_path = os.path.join(directory, filename)
            if remove_first_line_title(file_path):
                print(f"已处理文件: {filename}")
                count += 1
            else:
                print(f"未找到第一行标题，跳过文件: {filename}")
    
    print(f"总共处理了 {count} 个文件")

if __name__ == "__main__":
    # 指定目录
    posts_directory = "/home/inaho/work/ms_service/middleware/IInaho.github.io/content/posts"
    
    # 检查目录是否存在
    if os.path.exists(posts_directory):
        print(f"开始处理目录: {posts_directory}")
        process_all_md_files(posts_directory)
        print("处理完成!")
    else:
        print(f"目录不存在: {posts_directory}")