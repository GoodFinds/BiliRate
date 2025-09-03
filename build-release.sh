#!/bin/bash

# BiliRate 发布构建脚本
echo "🚀 开始构建 BiliRate 发布包..."

# 设置版本号
VERSION="v1.0.0"
BUILD_DIR="build"
RELEASE_DIR="releases"

# 清理旧的构建目录
rm -rf $BUILD_DIR $RELEASE_DIR
mkdir -p $BUILD_DIR $RELEASE_DIR

# 复制核心文件到构建目录
echo "📦 复制核心文件..."
cp manifest.json $BUILD_DIR/
cp content.js $BUILD_DIR/
cp popup.html $BUILD_DIR/
cp LICENSE $BUILD_DIR/
cp README.md $BUILD_DIR/
cp USAGE_GUIDE.md $BUILD_DIR/
cp -r icons $BUILD_DIR/

# 创建发布包
echo "🗜️  创建压缩包..."
cd $BUILD_DIR
zip -r "../$RELEASE_DIR/BiliRate-$VERSION.zip" .
cd ..

# 创建发布说明
cat > $RELEASE_DIR/RELEASE_NOTES_$VERSION.md << 'RELEASE_EOF'
# 🎉 BiliRate v1.0.0 正式发布！

## 🎯 功能特色

### ✨ 核心功能
- **实时数据展示** - 自动获取B站视频的播放量、点赞、投币、收藏、评论数
- **智能评级系统** - 根据三连率自动评定视频质量等级
- **优雅界面设计** - B站粉色主题，浮动面板可收起展开
- **自动更新数据** - 每3秒刷新，支持B站单页应用
- **状态记忆** - 自动保存面板展开/收起状态

### 🏆 评级标准
- 🔥 **爆款** (>30%) - 现象级传播
- 🚀 **破圈** (>20%) - 优质内容  
- ✨ **很好** (>15%) - 高质量视频
- 👍 **还不错** (>10%) - 不错的内容
- 😐 **一般** (5-10%) - 普通视频
- 😞 **较差** (<5%) - 需要改进

## 📦 安装方式

### 方法一：下载Release包（推荐）
1. 下载 `BiliRate-v1.0.0.zip`
2. 解压到本地文件夹
3. 打开 `chrome://extensions/`
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的文件夹

### 方法二：克隆源码
```bash
git clone https://github.com/GoodFinds/BiliRate.git
```

## 🎬 使用方法
1. 安装扩展后访问任意B站视频页面
2. 页面右侧会自动显示数据面板
3. 点击"-"/"+"按钮可收起/展开面板
4. 数据每3秒自动更新

## 🛠️ 技术实现
- **Manifest V3** - 最新Chrome扩展标准
- **原生JavaScript** - 无外部依赖，纯净轻量
- **智能解析** - 支持万、亿等中文数字单位
- **兼容性强** - 支持ShadowDOM和多种页面结构

## 🐛 已知问题
- 部分评论数据可能因页面结构变化无法获取（显示"加载中"）
- 在网络较慢时数据加载可能有延迟

## 📞 反馈渠道
- GitHub Issues: https://github.com/GoodFinds/BiliRate/issues
- 使用问题请查看 `USAGE_GUIDE.md` 详细教程

---

⭐ **感谢使用 BiliRate！如果对你有帮助，请给项目一个Star支持！**

**项目地址**: https://github.com/GoodFinds/BiliRate
RELEASE_EOF

# 显示构建结果
echo "✅ 构建完成！"
echo "📁 发布文件:"
ls -la $RELEASE_DIR/
echo ""
echo "🎯 下一步："
echo "1. 检查构建包内容"
echo "2. 在Chrome中测试安装"
echo "3. 创建GitHub Release"
