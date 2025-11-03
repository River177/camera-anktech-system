# 智能监控平台 - AnkTech SDK 版本

基于 AnkTech JS SDK 的智能监控平台，替代原有的 ffmpeg 转流方式，提供更高效、更稳定的视频流传输。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **视频SDK**: AnkTech JS SDK
- **构建工具**: Vite 7
- **UI框架**: Tailwind CSS + Radix UI
- **路由**: React Router v6
- **状态管理**: React Hooks

## 主要特性

- ✅ 使用 AnkTech SDK 进行视频流管理
- ✅ 支持多路视频同时播放
- ✅ 实时设备状态监控
- ✅ 设备树形结构展示
- ✅ 视频截图功能
- ✅ 视频录制功能
- ✅ PTZ 云台控制
- ✅ ROI 区域选择
- ✅ 拼接视频支持

## 目录结构

```
camera-anktech-system/
├── src/
│   ├── assets/
│   │   └── anktech/          # AnkTech SDK 文件
│   ├── components/
│   │   ├── common/           # 通用组件
│   │   ├── monitoring/       # 监控相关组件
│   │   │   └── AnkTechPlayer.tsx  # AnkTech 视频播放器
│   │   └── ui/               # UI 组件库
│   ├── hooks/
│   │   └── useAnkTech.ts     # AnkTech SDK Hook
│   ├── pages/
│   │   └── MonitoringPage.tsx # 监控页面
│   ├── services/
│   │   └── AnkTechService.ts # AnkTech 服务层
│   ├── types/
│   │   └── anktech.ts        # AnkTech 类型定义
│   ├── App.tsx               # 应用主组件
│   └── main.tsx              # 应用入口
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 配置说明

### 登录配置

在 `src/pages/MonitoringPage.tsx` 中修改登录配置：

```typescript
const LOGIN_CONFIG = {
  userId: 'your_username',
  password: 'your_password',
  debug: true, // 是否开启调试模式
};
```

## 核心功能说明

### 1. AnkTech SDK 服务层

`AnkTechService` 类封装了所有 SDK 调用，提供统一的接口：

- `login()` - 登录
- `logout()` - 登出
- `createStream()` - 创建视频流
- `closeStream()` - 关闭视频流
- `screenshot()` - 截图
- `startRecord()` / `stopRecord()` - 录制控制
- `getDeviceList()` - 获取设备列表
- `ptz()` - PTZ 控制
- `setRoi()` - ROI 设置

### 2. useAnkTech Hook

React Hook 封装，提供：

- 自动登录管理
- 设备状态同步
- 消息监听和处理
- 树形数据结构

### 3. AnkTechPlayer 组件

视频播放器组件，特点：

- 自动创建和销毁视频流
- 支持拼接视频
- 错误处理
- 响应式设计

## WebSocket 消息处理

系统自动处理以下消息类型：

- `30006` - 设备列表
- `30007` - 通道列表
- `30010` - 设备状态变更
- `30011` - 拼接服务上线
- `30013` - 拼接列表
- `30022` - 拼接服务下线
- `30031` - 通道状态变更
- `900001` - WebSocket 连接成功

## 与原系统的主要区别

| 特性 | 原系统 (ffmpeg) | 新系统 (AnkTech SDK) |
|------|----------------|---------------------|
| 视频传输 | ffmpeg 转流 + HLS | AnkTech SDK 直接传输 |
| 延迟 | 较高 | 低延迟 |
| 服务器负载 | 需要 ffmpeg 服务器 | 无需额外服务器 |
| 功能支持 | 基础播放 | 完整功能 (PTZ, ROI, 录制等) |
| 部署复杂度 | 高 | 低 |

## 常见问题

### 1. 视频无法播放？

- 检查 AnkTech SDK 是否正确加载
- 确认登录配置正确
- 查看浏览器控制台错误信息
- 确认设备在线状态

### 2. 如何添加新设备？

设备由 AnkTech 服务端管理，前端自动获取设备列表。

### 3. 如何自定义 UI？

所有 UI 组件位于 `src/components` 目录，可以根据需要修改。

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

私有项目

## 联系方式

如有问题请联系技术支持团队。

