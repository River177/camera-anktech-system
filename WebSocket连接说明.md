# WebSocket 连接说明

## ❗ 重要问题

### SDK WebSocket URL 构建方式

AnkTech SDK 内部会自动构建 WebSocket URL：

```javascript
// SDK 源码（第 17280 行）
this.options.messageWs.url = `ws://${this.options.server}:${this.options.wsPort}`;
```

这意味着：
- ✅ SDK 会自动获取 `wsPort` 从 API 返回数据
- ❌ 无法通过 Vite 代理转发（因为 SDK 直接构建完整 URL）
- ❌ 代理配置对 WebSocket 无效

## 🔍 当前状态

### API 请求
```
✅ http://localhost:3000/aqueti-api/* 
   → 通过代理转发到 
   → http://10.10.18.242:8081/aqueti-api/*
```

### WebSocket 连接
```
❌ SDK 尝试连接: ws://localhost:7777/
   (因为 server: 'localhost', wsPort: 7777)

❌ 浏览器报错: ERR_CONNECTION_REFUSED
   (无法连接到 localhost:7777)
```

## ✅ 正确配置

### 方案：直接连接服务器

由于 SDK 限制，只能让浏览器直接连接到服务器的 WebSocket 端口。

**配置示例**：

```typescript
const LOGIN_CONFIG = {
  server: '10.10.18.242',  // 服务器 IP
  wsPort: 7777,            // WebSocket 端口（会自动从 API 获取）
  userId: 'admin',
  password: '123456',
  debug: true,
};
```

### 前提条件

1. **网络可达**: 浏览器能访问 `ws://10.10.18.242:7777`
2. **防火墙开放**: 7777 端口对外开放
3. **CORS 配置**: 服务器允许跨域 WebSocket 连接

### 检查连通性

```bash
# Windows PowerShell
Test-NetConnection -ComputerName 10.10.18.242 -Port 7777

# Linux/Mac
telnet 10.10.18.242 7777
```

## 🔄 工作流程

### 1. HTTP API 登录
```
浏览器 → http://localhost:3000/aqueti-api/login
       → Vite 代理转发
       → http://10.10.18.242:8081/aqueti-api/login
       ← 返回 token 和配置（包含 wsPort）
```

### 2. WebSocket 连接
```
SDK 获取 wsPort: 7777
SDK 构建 URL: ws://10.10.18.242:7777/
浏览器直接连接到服务器 ← 这里不经过代理
```

### 3. 消息通信
```
浏览器 ←→ ws://10.10.18.242:7777 ←→ 服务器
（双向通信，实时推送设备状态、视频流信息等）
```

## 🛠️ 生产环境部署

### 方案 1: Nginx 反向代理（推荐）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/camera-anktech-system/dist;
        try_files $uri $uri/ /index.html;
    }

    # HTTP API 代理
    location /aqueti-api/ {
        proxy_pass http://10.10.18.242:8081/aqueti-api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket 代理
    location /ws/ {
        proxy_pass http://10.10.18.242:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**但是**：由于 SDK 固定构建 URL 的方式，这个方案也无法生效！

### 方案 2: 修改 SDK（不推荐）

需要修改 SDK 源码，允许自定义 WebSocket URL：

```javascript
// 修改 SDK 的 createMessageWs 方法
createMessageWs() {
    this.options.messageWs = new messageWs();
    // 支持自定义 WebSocket URL
    if (this.options.wsUrl) {
        this.options.messageWs.url = this.options.wsUrl;
    } else {
        this.options.messageWs.url = `ws://${this.options.server}:${this.options.wsPort}`;
    }
    // ...
}
```

### 方案 3: 服务器配置 CORS（推荐）✅

**最简单的方案**：在服务器端配置 CORS，允许跨域 WebSocket 连接。

**服务器端配置**（假设使用 Node.js）：
```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 7777,
    // 允许跨域
    verifyClient: (info) => {
        // 允许所有来源（生产环境应该限制具体域名）
        return true;
    }
});
```

## 📊 网络拓扑

```
开发环境:
浏览器 (localhost:3000)
  │
  ├─ HTTP API ──→ Vite Proxy ──→ 10.10.18.242:8081 ✅
  │
  └─ WebSocket ──────────────→ 10.10.18.242:7777 ✅
     (直接连接，不经过代理)
```

```
生产环境:
浏览器
  │
  ├─ HTTP/HTTPS ──→ Nginx ──→ 后端服务器
  │
  └─ WebSocket ────→ Nginx ──→ WebSocket 服务器
     (需要 Nginx 配置 WebSocket 升级)
```

## 🎯 总结

### 当前配置（开发环境）

```typescript
// vite.config.ts
proxy: {
  '/aqueti-api': {
    target: 'http://10.10.18.242:8081',
    ws: false,
    changeOrigin: true,
  },
  // WebSocket 不需要代理（SDK 直接连接）
}

// MonitoringPage.tsx
const LOGIN_CONFIG = {
  server: '10.10.18.242',  // 直接使用服务器 IP
  wsPort: 7777,            // 会从 API 自动获取
  userId: 'admin',
  password: '123456',
  debug: true,
};
```

### 检查清单

- [ ] 确认 `10.10.18.242:7777` 可以从浏览器访问
- [ ] 检查防火墙是否开放 7777 端口
- [ ] 确认服务器 WebSocket 服务正常运行
- [ ] 查看浏览器控制台 WebSocket 连接状态
- [ ] 检查 `[AnkTech]` 日志输出

### 预期日志

```javascript
[AnkTech] SDK版本: xxx
this.options.messageWs.url -> ws://10.10.18.242:7777
message ws onopen, readyState -> 1
[AnkTech] 登录成功
[AnkTech] 收到消息: 900001
[AnkTech] 收到消息: 30006
```

## ⚠️ 注意事项

1. **开发环境**: 直接连接到服务器 WebSocket 端口
2. **生产环境**: 需要配置 Nginx 或其他反向代理
3. **SDK 限制**: 无法通过 Vite 代理转发 WebSocket
4. **网络要求**: 浏览器必须能直接访问 WebSocket 端口

## 🔗 相关文档

- `配置说明.md` - 完整配置说明
- `故障排查.md` - 问题排查指南
- `快速开始.md` - 快速上手指南

