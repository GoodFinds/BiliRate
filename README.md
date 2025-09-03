<div align="center">

# BiliRate <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/bilibili.svg" alt="Bilibili" width="32" height="32" style="vertical-align: middle;">

> 🎯 简洁优雅的B站视频数据分析工具

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/GoodFinds/BiliRate)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/GoodFinds/BiliRate/blob/main/LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-88%2B-green.svg)](https://www.google.com/chrome/)
[![Stars](https://img.shields.io/github/stars/GoodFinds/BiliRate.svg)](https://github.com/GoodFinds/BiliRate)

一个轻量级的浏览器扩展，智能计算B站视频的三连率（点赞、投币、收藏），提供可视化数据分析和评级系统。

[📦 安装使用](#-安装方式) · [✨ 功能介绍](#-功能特色) · [🐛 问题反馈](https://github.com/GoodFinds/BiliRate/issues) · [🤝 参与贡献](#-贡献指南)

</div>

## ✨ 功能特色

- 🎭 **实时数据展示** - 自动获取视频的播放量、点赞、投币、收藏、评论数
- 📊 **智能评级系统** - 根据三连率自动评定视频质量等级（爆款/破圈/很好/还不错/一般/较差）
- 🎨 **优雅界面设计** - 采用B站粉色主题，浮动面板可收起展开
- ⚡ **轻量高效** - 仅在B站视频页面运行，资源占用极少
- 🔄 **自动更新** - 每3秒自动刷新数据，支持B站单页应用
- 💾 **记住设置** - 自动保存面板展开/收起状态

## 🖼️ 效果预览

<div align="center">
<img src="https://via.placeholder.com/600x300/fb7299/ffffff?text=BiliRate+效果截图" alt="BiliRate 效果预览" />

*在B站视频页面右侧显示数据面板*
</div>

> 📸 **待补充**: 请在实际测试后添加真实的使用截图

## 📦 安装方式

### 🎯 方式一：Chrome扩展商店（推荐）
🚧 **即将上线** - 正在准备提交审核

### 💻 方式二：手动安装开发版

**第一步：下载源码**
```bash
# 方法1: 使用Git克隆
git clone https://github.com/GoodFinds/BiliRate.git

# 方法2: 直接下载ZIP
# 点击页面右上角 "Code" -> "Download ZIP"
```

**第二步：安装扩展**
1. 打开Chrome浏览器
2. 在地址栏输入：`chrome://extensions/`
3. 开启右上角的 **"开发者模式"** 开关
4. 点击 **"加载已解压的扩展程序"**
5. 选择下载的 `BiliRate` 文件夹

**第三步：验证安装**
- 前往任意B站视频页面（如：https://www.bilibili.com/video/BV1xx411c7XD）
- 页面右侧应该会出现数据面板

## 🎯 使用说明

<table>
<tr>
<td width="50%">

### 📝 基础操作
1. **自动显示** - 打开B站视频页面后自动出现数据面板
2. **面板控制** - 点击右上角 "-" / "+" 按钮收起/展开面板  
3. **数据更新** - 每3秒自动刷新，无需手动操作
4. **状态记忆** - 面板展开/收起状态会自动保存

</td>
<td width="50%">

### 📊 数据说明
- **👍 点赞数** - 视频获得的点赞总数
- **🪙 投币数** - 视频获得的投币总数  
- **⭐ 收藏数** - 视频被收藏的总数
- **📺 播放量** - 视频的总播放次数
- **💬 评论数** - 视频的评论总数

</td>
</tr>
</table>

## 📊 评级标准

<div align="center">

| 三连率范围 | 评级等级 | 显示颜色 | 评价说明 |
|:--------:|:-------:|:-------:|:-------:|
| **>30%** | 🔥 **爆款** | <span style="color:red">**红色**</span> | 现象级视频，传播力极强 |
| **>20%** | 🚀 **破圈** | <span style="color:orange">**橙色**</span> | 非常优质内容，破圈传播 |  
| **>15%** | ✨ **很好** | <span style="color:purple">**紫色**</span> | 高质量视频，互动良好 |
| **>10%** | 👍 **还不错** | <span style="color:blue">**蓝色**</span> | 不错的内容，值得关注 |
| **5-10%** | 😐 **一般** | **黑色** | 普通视频，中规中矩 |
| **<5%** | 😞 **较差** | <span style="color:gray">**灰色**</span> | 互动率偏低，需要改进 |

</div>

> 💡 **三连率** = (点赞数 + 投币数 + 收藏数) / 播放量 × 100%

## 🛠️ 技术实现

<table>
<tr>
<td width="50%">

### 🏗️ 架构设计
- **Manifest V3** - 最新Chrome扩展标准
- **原生JavaScript** - 零依赖，轻量化设计
- **模块化结构** - 清晰的代码组织
- **错误处理** - 完善的异常捕获机制

</td>
<td width="50%">

### ⚙️ 核心功能
- **DOM解析** - 智能识别B站页面元素
- **ShadowDOM支持** - 兼容现代Web组件
- **数字解析** - 支持万、亿等中文单位
- **响应式设计** - 适配不同屏幕尺寸

</td>
</tr>
</table>

## 🔧 故障排除

<details>
<summary><strong>🚫 扩展没有显示面板</strong></summary>

- ✅ 确认扩展已启用且图标显示正常
- ✅ 检查是否在B站视频页面（非首页或其他页面）  
- ✅ 尝试刷新页面或重新加载扩展
- ✅ 查看浏览器控制台是否有错误信息

</details>

<details>
<summary><strong>📊 数据显示不正确</strong></summary>

- ⏳ 等待几秒钟，数据会自动更新
- 🔄 某些数据需要页面完全加载后才能获取
- 💬 评论数可能由于页面结构变化无法获取（显示"加载中"）
- 📝 如问题持续，请提交Issue反馈

</details>

## 🤝 贡献指南

我们欢迎各种形式的贡献！🎉

### 🐛 报告问题
在 [Issues](https://github.com/GoodFinds/BiliRate/issues) 中报告遇到的问题

### 💡 功能建议  
提出新功能想法和改进建议

### 🛠️ 代码贡献
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发计划

### 🚀 即将发布
- [ ] Chrome Web Store 上架
- [ ] 添加使用教程视频
- [ ] 完善错误处理机制

### 🔮 未来功能
- [ ] 历史数据对比功能
- [ ] 数据导出功能（JSON/CSV）
- [ ] 多个视频数据对比
- [ ] 主题切换功能
- [ ] 更多数据指标（弹幕密度等）
- [ ] 支持更多视频平台

## 📈 项目数据

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/GoodFinds/BiliRate?style=social)
![GitHub forks](https://img.shields.io/github/forks/GoodFinds/BiliRate?style=social)
![GitHub issues](https://img.shields.io/github/issues/GoodFinds/BiliRate)
![GitHub last commit](https://img.shields.io/github/last-commit/GoodFinds/BiliRate)

</div>

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议发布。

## 🙏 致谢

- 感谢 [Bilibili](https://www.bilibili.com) 提供优质的视频平台
- 感谢所有贡献者和使用者的支持
- 感谢开源社区的技术分享

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**

[🌟 Star项目](https://github.com/GoodFinds/BiliRate) · [🐛 反馈问题](https://github.com/GoodFinds/BiliRate/issues) · [📖 查看文档](https://github.com/GoodFinds/BiliRate/blob/main/README.md)

</div>
