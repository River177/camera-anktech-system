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
      this.anktech = new AnkTech(this.options);
      const response = await this.anktech.login();
      
      if (response.code === 'SUCCESS') {
        this.isConnected = true;
        this.setupMessageListener();
        console.log('[AnkTech] 登录成功');
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      console.error('[AnkTech] 登录错误:', error);
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
    if (!this.anktech) return;

    this.anktech.setOnMessageListener((event: string) => {
      try {
        const message = JSON.parse(event);
        console.log('[AnkTech] 收到消息:', message.CMD);
        
        // 通知所有监听器
        this.messageListeners.forEach(listener => {
          listener(message);
        });
      } catch (error) {
        console.error('[AnkTech] 消息解析错误:', error);
      }
    });
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

