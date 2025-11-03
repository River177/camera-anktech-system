/**
 * 服务消息监听
 */
export type OnMessageListener = (event: string) => void;
/**
 * SDK 全局配置选项
 * @remarks
 * 用于初始化 Anktech SDK 时的参数配置，包含连接、调试、认证等设置。
 *
 * @example
 * ```typescript
 * const options: Options = {
 *   server: '192.168.12.88',
 *   debug: true,
 *   heartbeatInterval: 5000
 * };
 * ```
 */
export interface Options {
    /**
     * WebSocket 连接超时时间（毫秒）
     * @defaultValue `10000` (10秒)
     */
    connectTimeout?: number;
    /**
     * 是否启用调试模式（输出详细日志）
     * @defaultValue `false`
     */
    debug?: boolean;
    /**
     * 心跳间隔时间（毫秒）
     * @defaultValue `5000` (5秒)
     */
    heartbeatInterval?: number;
    /**
     * 心跳响应超时时间（毫秒）
     * @defaultValue `10000` (10秒)
     */
    heartbeatTimeout?: number;
    /**
     * HTTP Keep-Alive 连接保活间隔（毫秒）
     * @defaultValue `60000` (1分钟)
     */
    httpKeepaliveInterval?: number;
    /**
     * 消息服务的 WebSocket 实例
     */
    messageWs?: messageWs;
    /**
     * 账户密码
     */
    password?: string;
    /**
     * WebSocket 断开后重连间隔（毫秒）
     * @defaultValue `5000` (5秒)
     */
    reconnectInterval?: number;
    /**
     * 服务器地址（不含协议）
     * @example `'192.168.12.88'`
     */
    server?: string;
    /**
     * 视频流 WebSocket 示例列表
     */
    streamsWs?: streamWs[];
    /**
     * JWT 认证令牌
     */
    token?: string;
    /**
     * 账户
     */
    userId?: string;
    /**
     * WebSocket 服务端口号
     */
    wsPort?: number;
}
/**
 * 消息实例
 * @private
 */
export declare class messageWs {
    url: string;
    instances?: any;
    heartbeatTimer?: NodeJS.Timeout;
    timeoutTimer?: NodeJS.Timeout;
    reconnectTimer?: NodeJS.Timeout;
    connectTimer?: NodeJS.Timeout;
}
/**
 * 视频流实例
 * @private
 */
export declare class streamWs {
    elementId: undefined;
    mediaId: number;
    url?: string;
    jmuxer?: any;
    instances?: any;
    heartbeatTimer?: NodeJS.Timeout;
    timeoutTimer?: NodeJS.Timeout;
    reconnectTimer?: NodeJS.Timeout;
    connectTimer?: NodeJS.Timeout;
    width?: number;
    height?: number;
    StitchID?: undefined;
    StitchIndex?: undefined;
    StitchChnID?: undefined;
    CamID?: undefined;
    ChnID?: undefined;
    isRecording?: undefined;
    mediaRecorder?: MediaRecorder;
    recordedChunks?: Array<any>;
}
/**
 * 视频DOM信息
 * @private
 */
export declare class videoParam {
    elementId: undefined;
    mediaId: number;
    StitchID?: undefined;
    StitchIndex?: undefined;
    StitchChnID?: undefined;
    CamID?: undefined;
    ChnID?: undefined;
}
/**
 * 视频帧数据
 * @private
 */
export interface VideoFrameData {
    codecId: number;
    isKeyFrame: boolean;
    width: number;
    height: number;
    virtualWidth: number;
    virtualHeight: number;
    frameType: number;
    sequence: number;
    timestamp: number;
    data: Uint8Array;
}
/**
 * 连接类型
 * @private
 */
export declare const AKConnType: {
    kAKConnType_Msg: number;
    kAKConnType_Media_Source: number;
    kAKConnType_Media_Sink: number;
};
/**
 * 消息类型
 * @private
 */
export declare const AKNetDataType: {
    readonly kAKNetDataType_ConnInit: 100;
    readonly kAKNetDataType_Heartbeat: 101;
    readonly kAKNetDataType_N2N: 201;
    readonly kAKNetDataType_N2S: 202;
    readonly kAKNetDataType_S2N: 203;
    readonly kAKNetDataType_N2N_IMG: 204;
    readonly kAKNetDataType_VideoFrame: 300;
    readonly kAKNetDataType_StartVideo: 301;
    readonly kAKNetDataType_StopVideo: 302;
    readonly kAKNetDataType_RequestIDR: 306;
};
/**
 * 消息类型
 * @private
 */
export type AKNetDataType = typeof AKNetDataType[keyof typeof AKNetDataType];
/**
 * cameraType
 */
export declare const CameraType: {
    UnknownCameraType: number;
    Mantis_18: number;
    PathFinder_18: number;
    BumbleBee_40: number;
    PathFinder_11: number;
    Mantis_18_169: number;
    PathFinder_4: number;
    Mantis_18_329x2: number;
    PathFinder_2_50s: number;
    PathFinder_2_25s: number;
    QIUJI_DAHUA: number;
    QIUJI_HAIKANG: number;
    CAMERA_ONVIF: number;
    Mantis_7: number;
    Mantis_2: number;
    ArrayCam_1x5: number;
    ArrayCam_1x10: number;
    Mantis_16_2x8: number;
    Mantis_8_2x4: number;
    Mantis_2_1x2: number;
    RCX_1x4: number;
    Mantis_10_6_4: number;
    Mantis_7_4_2: number;
    Camera_SZWL: number;
    Mantis_17_12_4: number;
    Mantis_52_1x4: number;
    QIUJI_UNIVISION_NO_VERTICAL: number;
    QIUJI_UNIVISION: number;
    Mantis_5_1x5: number;
    RCX_1x5: number;
    CameraTypeCount: number;
};
export declare const CameraTypeNames: {};
export declare const eCamProductTypeToCameraType: {
    ANK_MT200_19U090P: number;
    ANK_MT200_19U070P: number;
    ANK_MT200_19U045P: number;
    ANK_MT300_19U090P: number;
    ANK_MT300_19U070P: number;
    ANK_MT300_19U045P: number;
    MANTIS_18_test: number;
    MANTIS_7_test: number;
    MANTIS_7_test2: number;
    MANTIS_2_test: number;
    ANK_MT200_19M050S: number;
    ANK_MT300_19M050S: number;
    ANK_MT200_19M023P: number;
    ANK_MT200_38U180P: number;
    ANK_PF200_02M050S: number;
    ANK_PF200_02M025S: number;
    ANK_PF200_04M050F: number;
    ANK_PF200_04M050S: number;
    ANK_PF200_12M023S: number;
    ANK_BM200_41U105P: number;
    ANK_BM200_41U075P: number;
    ANK_QIUJI_DH: number;
    ANK_QIUJI_HK: number;
    ANK_SZWL: number;
    ANK_ZNH4240_NO_VERTICAL: number;
    ANK_ZNH4240: number;
};
