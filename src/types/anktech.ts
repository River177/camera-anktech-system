/**
 * AnkTech SDK 类型定义
 */

export interface Options {
  server?: string;        // 服务器地址
  userId: string;         // 用户ID
  password: string;       // 密码
  debug?: boolean;        // 调试模式
  connectTimeout?: number;      // 连接超时时间
  heartbeatInterval?: number;   // 心跳间隔
  heartbeatTimeout?: number;    // 心跳超时
  reconnectInterval?: number;   // 重连间隔
  wsPort?: number;             // WebSocket 端口
  token?: string;              // JWT 令牌
}

export interface OnMessageListener {
  (message: any): void;
}

export interface Camera {
  CamID: string;
  CamName: string;
  CamType: number;
  CamTypeName: string;
  Status: number;
  Group?: string;
  isAutoRecord?: number;
  isForbidden?: number;
  longID?: number;
  Stitchable?: number;
}

export interface Channel {
  CamID: string;
  ChnID: string;
  ChnIndex: number;
  ChnName: string;
  DevServerID: string;
  MainVideoID: number;
  SubVideoID: number;
  MtsID: string;
  MtsIP: string;
  MtsPort: number;
  MtsWsPort: number;
  Pano: number;
  Status: number;
}

export interface Stitcher {
  Index: number;
  CamID: string;
  StitcherName: string;
  StitcherType: number;
  MainChn: number;
  MtsID: string;
  MtsIP: string;
  MtsPort: number;
  MtsWsPort: number;
  ChnArr: Array<{
    ChnID: number;
    VideoID: number;
  }>;
}

export interface Stitch {
  StitchID: string;
  StitchName: string;
  Status: number;
  StitcherArr: Stitcher[];
}

export interface Video {
  index: number;
  elementId?: string;
  mediaId?: number;
  isPseudoFullscreen?: boolean;
  StitchID?: string;
  StitchIndex?: number;
  DevServerID?: string;
  CamID?: string;
  CamType?: number;
  CamTypeName?: string;
  ChnID?: string;
  ChnIndex?: number;
  type?: 'channel' | 'stitcher' | 'vod';
  VodWorkID?: string;
  VodID?: string;
}

export interface TreeNode {
  id: string;
  name: string;
  status: number;
  type: 'camera' | 'channel' | 'stitch' | 'stitcher';
  group?: string;
  CamID?: string;
  CamType?: number;
  CamTypeName?: string;
  ChnID?: string;
  ChnIndex?: number;
  StitchID?: string;
  StitchIndex?: number;
  mediaId?: number;
  mts?: string;
  DevServerID?: string;
  isLeaf?: boolean;
  channels?: TreeNode[];
  data?: any;
  isAutoRecord?: number;
  isForbidden?: number;
  longID?: number;
}

// WebSocket 消息类型
export enum MessageCommand {
  // 设备相关
  GET_DEVICE_LIST = 30006,
  GET_CHANNEL_LIST = 30007,
  DEVICE_STATUS_CHANGE = 30010,
  
  // 拼接相关
  GET_STITCH_LIST = 30013,
  STITCH_SERVER_ONLINE = 30011,
  STITCH_SERVER_OFFLINE = 30022,
  STITCH_CAMERA_CHANGE = 30020,
  STITCH_CHANNEL_UPDATE = 30119,
  STITCH_CHANNEL_NAME_UPDATE = 30038,
  
  // 通道相关
  CHANNEL_STATUS_CHANGE = 30031,
  CAMERA_PARAM = 30024,
  STITCH_CHANNEL_PARAM = 30121,
  STITCH_CHANNEL_OSD = 30123,
  
  // ROI 和建模
  ROI_INFO = 30049,
  MODELING_RESULT = 30025,
  
  // 录像相关
  RECORD_UPDATE = 30057,
  RECORD_PLAYBACK_END = 30058,
  CAMERA_PLAYBACK_INFO = 30061,
  CAMERA_PLAYBACK_CHANNEL_UPDATE = 30120,
  
  // PTZ 和标定
  GET_DOME_PTZ = 30107,
  GET_DOME_CALIBRATE = 30114,
  
  // AI 相关
  AI_CONFIG = 30125,
  AI_DATA = 30127,
  
  // 连接确认
  WS_CONNECTED = 900001,
}

