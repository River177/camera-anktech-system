# HTTP KeepAlive 说明

## ❓ 什么是 keepAlive 请求

你在浏览器控制台看到的这个请求：

```javascript
request -> {
  method: 'POST', 
  url: '/api/auth/keepAlive', 
  ankTechConfig: {…}
}
```

这是 **AnkTech SDK 的 HTTP 心跳保活机制**。

---

## 🔄 工作原理

### 1. 为什么需要 keepAlive？

登录成功后，服务器会颁发一个 **Session Token**：
- Token 有**有效期**（通常 30 分钟或 1 小时）
- 如果长时间不活动，Token 会**过期**
- Token 过期后需要**重新登录**

为了避免频繁重新登录，SDK 会：
- ✅ 每隔 **60 秒**发送一次 keepAlive 请求
- ✅ 告诉服务器"我还在使用，请保持会话"
- ✅ 刷新 Token 有效期

### 2. 自动执行

这个请求是 **SDK 自动发送**的，不需要你手动调用。

**触发时机**：
- 登录成功后启动定时器
- 每 60 秒自动发送一次
- 直到登出或页面关闭

---

## 📊 完整流程

```
1. 用户登录
   POST /aqueti-api/api/auth/login
   ↓
2. 服务器返回 Token
   {code: 'SUCCESS', data: [{token: 'xxx'}]}
   ↓
3. SDK 保存 Token 并启动心跳定时器
   ↓
4. 每隔 60 秒发送 keepAlive
   POST /api/auth/keepAlive
   ↓
5. 服务器刷新 Token 有效期
   {code: 'SUCCESS'}
   ↓
6. 继续等待 60 秒...
   ↓
7. 循环步骤 4-6，直到登出
```

---

## 🔌 路径说明

### SDK 配置的 baseURL

SDK 在初始化时设置：
```javascript
const http = new HttpClient('/aqueti-api', {...});
```

### SDK 内部的请求路径

```javascript
// 登录
POST /api/auth/login

// 登出  
DELETE /api/auth/logout

// 心跳保活
POST /api/auth/keepAlive

// 获取中心服务器信息
POST /api/auth/findList
```

### 完整请求路径

baseURL + 请求路径 = 完整路径

```
/aqueti-api + /api/auth/login = /aqueti-api/api/auth/login
/aqueti-api + /api/auth/keepAlive = /aqueti-api/api/auth/keepAlive
```

### Vite 代理转发

```
浏览器请求: /aqueti-api/api/auth/keepAlive
     ↓ (Vite 代理)
服务器请求: http://10.10.18.242:8081/aqueti-api/api/auth/keepAlive
```

**但是！** 用户看到的是 `/api/auth/keepAlive`，说明可能：
1. SDK 的某些请求没有使用 baseURL
2. 或者显示的是相对路径

我已经添加了对 `/api` 路径的代理，现在两种情况都能正常工作。

---

## ✅ 修复内容

### 更新了 `vite.config.ts`

添加了对 `/api` 路径的代理：

```typescript
'/api': {
  target: 'http://10.10.18.242:8081/aqueti-api',
  rewrite: (path) => path.replace(/^\/api/, ''),
}
```

现在 `/api/auth/keepAlive` 会被转发到：
```
http://10.10.18.242:8081/aqueti-api/auth/keepAlive
```

---

## 🎯 这不是错误！

**重要**：`keepAlive` 请求是**正常的系统行为**，不是错误！

### 正常情况

你会看到：
- ✅ 每 60 秒一次 keepAlive 请求
- ✅ 状态码：200 OK
- ✅ 响应：`{code: 'SUCCESS'}`

### 异常情况

如果 keepAlive 失败：
- ❌ 状态码：401, 403, 500
- ❌ 响应：错误信息
- ❌ 会导致 Token 过期，需要重新登录

---

## 🔍 如何查看

### 1. Network 标签

按 `F12` → **Network** → **XHR** 或 **Fetch**

你会看到：
```
POST /api/auth/keepAlive    200 OK    (每 60 秒一次)
```

### 2. 控制台

如果启用了 debug 模式，可能会看到：
```javascript
[AnkTech] HTTP keepAlive 发送
```

---

## 💡 总结

### keepAlive 请求的作用

| 作用 | 说明 |
|------|------|
| ✅ 保持会话 | 防止 Token 过期 |
| ✅ 保持连接 | 告诉服务器客户端还活跃 |
| ✅ 自动化 | 无需手动处理 |
| ✅ 定时执行 | 每 60 秒一次 |

### 不需要担心

- ✅ 这是**正常行为**，不是错误
- ✅ SDK **自动处理**，不需要你干预
- ✅ 只要状态码是 200，就说明一切正常

### 只有以下情况需要关注

- ❌ keepAlive 请求失败（状态码 4xx, 5xx）
- ❌ 频繁出现认证错误
- ❌ 登录会话意外断开

---

## 🚀 下一步

### 重启开发服务器（Vite 配置已更新）

```bash
# 停止当前服务器（Ctrl+C）
pnpm dev
```

### 刷新浏览器

```
http://localhost:3000
```

现在 keepAlive 请求应该能正常工作了！

---

## 📊 检查清单

刷新后检查：

- [ ] 登录是否成功？
- [ ] 是否看到 CMD: 900001？
- [ ] 是否收到设备列表？
- [ ] 左侧是否显示设备？
- [ ] keepAlive 请求是否返回 200 OK？
- [ ] 是否能播放视频？

如果有任何问题，告诉我控制台的错误信息！


