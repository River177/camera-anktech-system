/**
 * 诊断页面 - 用于调试 WebSocket 连接问题
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DiagnosticPage() {
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [wsError, setWsError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const SERVER = '10.10.18.242';
  const WS_PORT = 7777;  // 中心服务 WebSocket 端口
  const WS_URL = `ws://${SERVER}:${WS_PORT}`;

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setLogs(prev => [`[${timestamp}] ${prefix} ${message}`, ...prev].slice(0, 50));
  };

  const testWebSocket = () => {
    addLog(`尝试连接到: ${WS_URL}`);
    setWsStatus('connecting');
    setWsError('');

    try {
      const websocket = new WebSocket(WS_URL);
      
      websocket.onopen = () => {
        addLog('WebSocket 连接成功!', 'success');
        setWsStatus('connected');
        setWs(websocket);
      };

      websocket.onclose = (event) => {
        addLog(`WebSocket 关闭: code=${event.code}, reason=${event.reason || '无'}`, 'error');
        setWsStatus('disconnected');
        setWs(null);
      };

      websocket.onerror = (error) => {
        addLog(`WebSocket 错误: ${error}`, 'error');
        setWsStatus('error');
        setWsError('连接失败 - 请检查服务器是否可达');
      };

      websocket.onmessage = (event) => {
        addLog(`收到消息: ${event.data.substring(0, 100)}...`, 'success');
      };
    } catch (error) {
      addLog(`创建 WebSocket 失败: ${error}`, 'error');
      setWsStatus('error');
      setWsError(String(error));
    }
  };

  const closeWebSocket = () => {
    if (ws) {
      addLog('手动关闭 WebSocket');
      ws.close();
      setWs(null);
      setWsStatus('disconnected');
    }
  };

  const testNetworkConnectivity = async () => {
    addLog('测试网络连通性...');
    
    // 测试 HTTP 端口
    try {
      addLog('测试 HTTP API 端口 (8081)...');
      const response = await fetch(`http://${SERVER}:8081/aqueti-api/auth/findList`, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        addLog('HTTP API 端口可访问 ✓', 'success');
      } else {
        addLog(`HTTP API 返回状态: ${response.status}`, 'error');
      }
    } catch (error) {
      addLog(`HTTP API 不可访问: ${error}`, 'error');
    }

    // 测试通过代理
    try {
      addLog('测试通过 Vite 代理访问...');
      const response = await fetch('/aqueti-api/auth/findList');
      if (response.ok) {
        const data = await response.json();
        addLog(`代理访问成功 ✓ 返回 ${data.rowCount || 0} 条数据`, 'success');
      } else {
        addLog(`代理返回状态: ${response.status}`, 'error');
      }
    } catch (error) {
      addLog(`代理访问失败: ${error}`, 'error');
    }
  };

  useEffect(() => {
    addLog('诊断页面已加载');
    addLog(`目标服务器: ${SERVER}`);
    addLog(`WebSocket 端口: ${WS_PORT}`);
    addLog(`完整 URL: ${WS_URL}`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-bold mb-2">WebSocket 连接诊断</h1>
          <p className="text-slate-400">用于调试 AnkTech SDK WebSocket 连接问题</p>
        </div>

        {/* 连接信息 */}
        <Card className="bg-slate-900/80 border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">连接信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">服务器地址</div>
              <div className="font-mono text-lg">{SERVER}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">WebSocket 端口</div>
              <div className="font-mono text-lg">{WS_PORT}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">完整 URL</div>
              <div className="font-mono text-sm">{WS_URL}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">连接状态</div>
              <div className="mt-1">
                {wsStatus === 'connected' && <Badge className="bg-green-500">已连接</Badge>}
                {wsStatus === 'connecting' && <Badge className="bg-yellow-500">连接中...</Badge>}
                {wsStatus === 'disconnected' && <Badge className="bg-gray-500">未连接</Badge>}
                {wsStatus === 'error' && <Badge className="bg-red-500">连接失败</Badge>}
              </div>
            </div>
          </div>
          {wsError && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
              {wsError}
            </div>
          )}
        </Card>

        {/* 操作按钮 */}
        <Card className="bg-slate-900/80 border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={testWebSocket}
              disabled={wsStatus === 'connected'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              测试 WebSocket 连接
            </Button>
            <Button
              onClick={closeWebSocket}
              disabled={wsStatus !== 'connected'}
              variant="outline"
              className="bg-slate-800 border-slate-700"
            >
              关闭连接
            </Button>
            <Button
              onClick={testNetworkConnectivity}
              variant="outline"
              className="bg-slate-800 border-slate-700"
            >
              测试网络连通性
            </Button>
            <Button
              onClick={() => setLogs([])}
              variant="outline"
              className="bg-slate-800 border-slate-700"
            >
              清空日志
            </Button>
          </div>
        </Card>

        {/* 日志输出 */}
        <Card className="bg-slate-900/80 border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">实时日志</h2>
          <div className="bg-slate-950 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-slate-500">暂无日志...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 text-slate-300">
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* 检查清单 */}
        <Card className="bg-slate-900/80 border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">问题检查清单</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">□</span>
              <span>服务器 {SERVER} 是否可以从您的网络访问？</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">□</span>
              <span>防火墙是否开放了 {WS_PORT} 端口？</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">□</span>
              <span>WebSocket 服务是否正在运行？</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">□</span>
              <span>服务器是否配置了 CORS 允许跨域 WebSocket 连接？</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">□</span>
              <span>是否有网络代理或 VPN 阻止连接？</span>
            </div>
          </div>
        </Card>

        {/* PowerShell 命令 */}
        <Card className="bg-slate-900/80 border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">命令行测试</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-400 mb-1">测试端口连通性 (PowerShell)</div>
              <code className="block bg-slate-950 p-3 rounded text-xs text-green-400">
                Test-NetConnection -ComputerName {SERVER} -Port {WS_PORT}
              </code>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">测试端口连通性 (CMD/Telnet)</div>
              <code className="block bg-slate-950 p-3 rounded text-xs text-green-400">
                telnet {SERVER} {WS_PORT}
              </code>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">测试 HTTP API</div>
              <code className="block bg-slate-950 p-3 rounded text-xs text-green-400">
                curl http://{SERVER}:8081/aqueti-api/auth/findList
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

