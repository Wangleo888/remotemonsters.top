# 1024 游戏

这是一个基于Web的1024数字方块合并游戏，使用HTML、CSS和JavaScript实现。

## 游戏规则

- 使用方向键或滑动操作移动方块
- 相同数字的方块相撞时会合并成为它们的和
- 每次移动后会随机生成一个新的数字方块（2或4）
- 当无法继续移动时游戏结束
- 目标是获得1024或更高数值的方块

## 特性

- 响应式设计，支持移动设备和桌面设备
- 支持键盘和触摸操作
- 本地保存最高分记录
- 简洁美观的界面

## 技术栈

- HTML5
- CSS3
- 原生JavaScript

## 在线体验

你可以通过以下链接体验游戏：[1024游戏](#)

## 本地部署

1. 克隆仓库
```
git clone https://github.com/yourusername/1024-game.git
```

2. 打开项目文件夹
```
cd 1024-game
```

3. 使用本地服务器运行
```
# 使用Python创建简单服务器（Python 3）
python -m http.server 8000
```

4. 在浏览器中访问 `http://localhost:8000`

## 项目结构

```
1024-game/
├── index.html        # 主HTML文件
├── css/              # 样式文件
│   └── style.css
├── js/               # JavaScript文件
│   └── game.js
└── assets/           # 资源文件
    └── favicon.ico
```

## 许可

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多信息。 