#!/bin/bash

echo "🔍 B站三连率计算器 - 项目验证脚本"
echo "======================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必需文件
echo -e "\n📁 检查必需文件..."
required_files=("manifest.json" "content.js" "popup.html" "README.md" "LICENSE")
missing_files=()

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "  ✅ ${GREEN}$file${NC}"
    else
        echo -e "  ❌ ${RED}$file (缺失)${NC}"
        missing_files+=("$file")
    fi
done

# 检查图标文件
echo -e "\n🎨 检查图标文件..."
icon_files=("icons/icon16.png" "icons/icon32.png" "icons/icon64.png" "icons/icon128.png" "icons/icon256.png")
missing_icons=()

for icon in "${icon_files[@]}"; do
    if [[ -f "$icon" ]]; then
        echo -e "  ✅ ${GREEN}$icon${NC}"
    else
        echo -e "  ❌ ${RED}$icon (缺失)${NC}"
        missing_icons+=("$icon")
    fi
done

# 检查manifest.json语法
echo -e "\n📋 检查manifest.json语法..."
if command -v python3 &> /dev/null; then
    if python3 -m json.tool manifest.json > /dev/null 2>&1; then
        echo -e "  ✅ ${GREEN}manifest.json 语法正确${NC}"
    else
        echo -e "  ❌ ${RED}manifest.json 语法错误${NC}"
    fi
else
    echo -e "  ⚠️  ${YELLOW}无法验证JSON语法 (python3未安装)${NC}"
fi

# 检查文件大小
echo -e "\n📊 检查文件大小..."
large_files=()
while IFS= read -r -d '' file; do
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [[ $size -gt 1048576 ]]; then # 1MB
        large_files+=("$file ($(($size/1024))KB)")
    fi
done < <(find . -type f -print0)

if [[ ${#large_files[@]} -eq 0 ]]; then
    echo -e "  ✅ ${GREEN}所有文件大小正常${NC}"
else
    echo -e "  ⚠️  ${YELLOW}发现较大文件:${NC}"
    for file in "${large_files[@]}"; do
        echo -e "    • $file"
    done
fi

# 统计项目信息
echo -e "\n📈 项目统计信息..."
total_files=$(find . -type f | wc -l | tr -d ' ')
total_size=$(du -sh . | cut -f1)
js_lines=$(find . -name "*.js" -exec cat {} \; | wc -l | tr -d ' ')
html_lines=$(find . -name "*.html" -exec cat {} \; | wc -l | tr -d ' ')

echo -e "  📁 总文件数: ${BLUE}$total_files${NC}"
echo -e "  💾 项目大小: ${BLUE}$total_size${NC}"
echo -e "  📝 JavaScript行数: ${BLUE}$js_lines${NC}"
echo -e "  🌐 HTML行数: ${BLUE}$html_lines${NC}"

# 总结
echo -e "\n🏁 验证结果总结"
echo "=================="

if [[ ${#missing_files[@]} -eq 0 && ${#missing_icons[@]} -eq 0 ]]; then
    echo -e "🎉 ${GREEN}项目验证通过！所有必需文件都存在。${NC}"
    echo -e "📦 ${BLUE}项目已准备好发布到GitHub和Chrome Web Store。${NC}"
else
    echo -e "⚠️  ${YELLOW}发现以下问题:${NC}"
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo -e "   缺失文件: ${RED}${missing_files[*]}${NC}"
    fi
    if [[ ${#missing_icons[@]} -gt 0 ]]; then
        echo -e "   缺失图标: ${RED}${missing_icons[*]}${NC}"
    fi
fi

echo -e "\n🚀 下一步建议:"
echo "1. 在Chrome浏览器中测试扩展功能"
echo "2. 创建GitHub仓库并上传代码"
echo "3. 准备Chrome Web Store提交材料"
echo "4. 制作演示截图和视频"

