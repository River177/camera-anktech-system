/**
 * AnkTech SDK 服务层
 * 封装 AnkTech SDK 的调用，提供统一的接口
 */

// @ts-ignore
import { AnkTech, SDK_VERSION } from '@/assets/anktech/AnkTechSDK.esm.js';
import type { OnMessageListener, Options } from '@/types/anktech';

export class AnkTechService {
  private anktech: any = null;
  private isConnected: boolean = false;
  private messageListeners: Set<OnMessageListener> = new Set();

  constructor(private options: Options) {
    console.log('[AnkTech] SDK版本:', SDK_VERSION);
  }

  /**
   * 登录并初始化 SDK
   */
  async login(): Promise<void> {
    try {
      console.log('[AnkTech] 开始登录流程...');
      console.log('[AnkTech] 配置信息:', {
        server: this.options.server,
        wsPort: this.options.wsPort,
        userId: this.options.userId,
        debug: this.options.debug,
      });
      
      this.anktech = new AnkTech(this.options);
      console.log('[AnkTech] SDK 实例已创建');
      
      const response = await this.anktech.login();
      console.log('[AnkTech] 登录 API 响应:', response);
      
      if (response.code === 'SUCCESS') {
        const sdkInstance = this.anktech as any;
        
        console.log('[AnkTech] 原始 wsPort:', sdkInstance.options.wsPort);
        
        // 强制设置为 7788（不要手动初始化，让 SDK 自动处理）
        sdkInstance.options.wsPort = 7788;
        console.log('[AnkTech] 强制设置 wsPort 为:', 7788);
        
        this.isConnected = true;
        this.setupMessageListener();
        console.log('[AnkTech] ✅ 登录成功');
        
        // 延迟 3 秒后检查并请求数据（给 WebSocket 足够时间自动连接）
        setTimeout(() => {
          const ws = sdkInstance.options?.messageWs?.instances;
          console.log('[AnkTech] WebSocket 状态检查:', {
            url: sdkInstance.options?.messageWs?.url,
            port: sdkInstance.options?.wsPort,
            readyState: ws?.readyState,
            wsExists: !!ws,
          });
          
          if (ws && ws.readyState === 1) {
            console.log('[AnkTech] ✅ WebSocket 已连接，开始请求数据...');
            this.getDeviceList();
            this.getChannelList();
            this.getStitchList();
          } else if (ws && ws.readyState === 0) {
            console.log('[AnkTech] ⏳ WebSocket 正在连接，再等待 2 秒...');
            setTimeout(() => {
              if (ws.readyState === 1) {
                console.log('[AnkTech] ✅ WebSocket 连接成功！请求数据...');
                this.getDeviceList();
                this.getChannelList();
                this.getStitchList();
              } else {
                console.error('[AnkTech] ❌ WebSocket 连接超时，readyState:', ws.readyState);
              }
            }, 2000);
          } else {
            console.error('[AnkTech] ❌ WebSocket 未正确初始化，readyState:', ws?.readyState);
          }
        }, 3000);
      } else {
        throw new Error(`登录失败: ${response.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('[AnkTech] ❌ 登录错误:', error);
      console.error('[AnkTech] 错误详情:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    if (this.anktech) {
      try {
        await this.anktech.logout();
        this.isConnected = false;
        this.messageListeners.clear();
        console.log('[AnkTech] 登出成功');
      } catch (error) {
        console.error('[AnkTech] 登出错误:', error);
        throw error;
      }
    }
  }

  /**
   * 设置消息监听器
   */
  private setupMessageListener(): void {
    if (!this.anktech) {
      console.warn('[AnkTech] ⚠️ SDK 未初始化，无法设置消息监听器');
      return;
    }

    console.log('[AnkTech] 设置消息监听器...');
    this.anktech.setOnMessageListener((event: string) => {
      try {
        const message = JSON.parse(event);
        console.log('[AnkTech] 📨 收到消息 CMD:', message.CMD, '完整消息:', message);
        
        // 通知所有监听器
        this.messageListeners.forEach(listener => {
          listener(message);
        });
      } catch (error) {
        console.error('[AnkTech] ❌ 消息解析错误:', error);
        console.error('[AnkTech] 原始消息:', event);
      }
    });
    console.log('[AnkTech] ✅ 消息监听器已设置');
  }

  /**
   * 添加消息监听器
   */
  addMessageListener(listener: OnMessageListener): void {
    this.messageListeners.add(listener);
  }

  /**
   * 移除消息监听器
   */
  removeMessageListener(listener: OnMessageListener): void {
    this.messageListeners.delete(listener);
  }

  /**
   * 创建视频流
   */
  createStream(mts: string, options: {
    elementId: string;
    mediaId: number;
    StitchID?: string;
    StitchIndex?: number;
    StitchChnID?: string;
    CamID?: string;
    ChnID?: string;
  }): void {
    if (!this.anktech || !this.isConnected) {
      console.error('[AnkTech] SDK 未初始化或未连接');
      return;
    }

    try {
      this.anktech.stream.createStream(mts, options);
      console.log('[AnkTech] 创建视频流:', options.elementId);
    } catch (error) {
      console.error('[AnkTech] 创建视频流错误:', error);
      throw error;
    }
  }

  /**
   * 关闭视频流
   */
  closeStream(elementId: string): void {
    if (!this.anktech) return;

    try {
      this.anktech.stream.closeStream(elementId);
      console.log('[AnkTech] 关闭视频流:', elementId);
    } catch (error) {
      console.error('[AnkTech] 关闭视频流错误:', error);
    }
  }

  /**
   * 截图
   */
  screenshot(elementId: string): void {
    if (!this.anktech) return;

    try {
      this.anktech.stream.screenshot(elementId);
      console.log('[AnkTech] 截图:', elementId);
    } catch (error) {
      console.error('[AnkTech] 截图错误:', error);
    }
  }

  /**
   * 开始录像
   */
  startRecord(elementId: string): void {
    if (!this.anktech) return;

    try {
      this.anktech.stream.startRecord(elementId);
      console.log('[AnkTech] 开始录像:', elementId);
    } catch (error) {
      console.error('[AnkTech] 开始录像错误:', error);
    }
  }

  /**
   * 停止录像
   */
  stopRecord(elementId: string): void {
    if (!this.anktech) return;

    try {
      this.anktech.stream.stopRecord(elementId);
      console.log('[AnkTech] 停止录像:', elementId);
    } catch (error) {
      console.error('[AnkTech] 停止录像错误:', error);
    }
  }

  /**
   * 获取设备列表
   */
  async getDeviceList(): Promise<void> {
    if (!this.anktech) return;

    try {
      await this.anktech.message.getDeviceList();
    } catch (error) {
      console.error('[AnkTech] 获取设备列表错误:', error);
    }
  }

  /**
   * 获取通道列表
   */
  async getChannelList(): Promise<void> {
    if (!this.anktech) return;

    try {
      await this.anktech.message.getChannelList();
    } catch (error) {
      console.error('[AnkTech] 获取通道列表错误:', error);
    }
  }

  /**
   * 获取拼接列表
   */
  async getStitchList(): Promise<void> {
    if (!this.anktech) return;

    try {
      await this.anktech.message.getStitchList();
    } catch (error) {
      console.error('[AnkTech] 获取拼接列表错误:', error);
    }
  }

  /**
   * PTZ 控制
   */
  ptz(toId: string, msg: any): void {
    if (!this.anktech) return;

    try {
      this.anktech.message.ptz(toId, msg);
    } catch (error) {
      console.error('[AnkTech] PTZ控制错误:', error);
    }
  }

  /**
   * 设置 ROI
   */
  setRoi(toId: string, msg: any): void {
    if (!this.anktech) return;

    try {
      this.anktech.message.setRoi(toId, msg);
    } catch (error) {
      console.error('[AnkTech] 设置ROI错误:', error);
    }
  }

  /**
   * ROI 缩放
   */
  scaleRoi(toId: string, msg: any): void {
    if (!this.anktech) return;

    try {
      this.anktech.message.scaleRoi(toId, msg);
    } catch (error) {
      console.error('[AnkTech] ROI缩放错误:', error);
    }
  }

  /**
   * ROI 移动
   */
  moveRoi(toId: string, msg: any): void {
    if (!this.anktech) return;

    try {
      this.anktech.message.moveRoi(toId, msg);
    } catch (error) {
      console.error('[AnkTech] ROI移动错误:', error);
    }
  }

  /**
   * 检查连接状态
   */
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * 获取 SDK 实例（仅在需要直接访问时使用）
   */
  getSDKInstance(): any {
    return this.anktech;
  }
  
  /**
   * 强制设置 WebSocket 端口（用于覆盖 API 返回的错误配置）
   */
  forceSetWsPort(port: number): void {
    if (this.anktech) {
      const sdkInstance = this.anktech as any;
      if (sdkInstance.options) {
        console.log('[AnkTech] 强制设置 wsPort:', port);
        sdkInstance.options.wsPort = port;
      }
    }
  }
}

// 创建单例
let anktechServiceInstance: AnkTechService | null = null;

export function getAnkTechService(options?: Options): AnkTechService {
  if (!anktechServiceInstance && options) {
    anktechServiceInstance = new AnkTechService(options);
  }
  
  if (!anktechServiceInstance) {
    throw new Error('AnkTech 服务未初始化，请先提供配置选项');
  }
  
  return anktechServiceInstance;
}

export function resetAnkTechService(): void {
  anktechServiceInstance = null;
}

