import { Options, streamWs, videoParam } from "../types/shared.types";
import AnkTechMessageTranscoder from "../utils/AnkTechMessageTranscoder";
/**
 * 流管理接口，用于处理 SDK 视频流显示。
 * @public
 */
export declare class StreamManager {
    private readonly options;
    private streams;
    private message;
    private transcoder;
    constructor(options: Options, streams: Array<streamWs>, transcoder: AnkTechMessageTranscoder, message: any);
    private startHeartbeatTimer;
    private startConnectTimer;
    private startTimeoutTimer;
    private startReconnectTimer;
    /**
     * ## 打开视频流
     *
     * #### 打开视频画面流程;
     * 1. DOM创建video标签, ID格式为video_${video.mediaId}
     * 2. 媒体流websocket连接地址获取方式
     *  i)  摄像机通道地址获取 `ws://${channel:MtsIP}:${channel.MtsWsPort}`
     *  ii) 拼接服务地址获取 `ws://${stitcher:MtsIP}:${stitcher.MtsWsPort}`
     * 3. mediaId(视频ID)
     *  i)  通道会有主流ID(MainVideoID)和辅流ID(SubVideoID)
     *  ii) 拼接通道只会有一个(VideoID)
     * 4. createStream方法传入url(媒体流websocket连接地址)和mediaId(视频ID), SDK会将视频在对应的video标签中播放
     *
     * @param url string MTS连接地址
     * @param param videoParam 视频信息
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | param.elementId | string | 是 | video标签ID, 需要全局唯一 |
     * | param.mediaId | number | 是 | 摄像机ID |
     * | param.CamID | string | 是 | 摄像机ID |
     * | param.ChnID | string | 否 | 摄像机-通道ID, 接拼接的时候可以不传 |
     * | param.StitchID | string | 否 | 拼接服务ID, 接摄像机通道的时候可以不传 |
     * | param.StitchIndex | number | 否 | 拼接索引([CMD=30013]消息中的StitchServerArr.StitcherArr.Index), 接摄像机通道的时候可以不传 |
     * | param.StitchChnID | number | 否 | 拼接索引中的通道ID([CMD=30013]消息中的StitchServerArr.StitcherArr.ChnArr.ChnID), 接摄像机通道的时候可以不传 |
     *
     * @example
     * ```html
     * <video :id="`video_${video.mediaId}`" :ref="(el) => setVideoRef(el, video.mediaId)" autoplay></video>
     * ```
     *
     * ```typescript
     * anktech.stream.createStream(mtsUrl, mediaId);
     * ```
     */
    createStream(url: string, param: videoParam): void;
    /**
     * 建立websocket通道
     * @private
     * @param stream
     */
    createStreamWs(stream: streamWs): void;
    /**
     * ## 关闭视频流
     *
     * @param elementId string video标签ID, 需要全局唯一
     *
     * @example
     * ```typescript
     * anktech.stream.closeStream(mediaId);
     * ```
     */
    closeStream(elementId: string): void;
    /**
     * ## 关闭所有视频流
     *
     * @example
     * ```typescript
     * anktech.stream.closeAllStreams();
     * ```
     */
    closeAllStreams(): void;
    /**
     * ## 截图
     *
     * @param elementId string video标签ID, 需要全局唯一
     *
     * @example
     * ```typescript
     * anktech.stream.screenshot(mediaId);
     * ```
     */
    screenshot(elementId: string): void;
    /**
     * ## 开始录像
     *
     * @param elementId string video标签ID, 需要全局唯一
     *
     * @example
     * ```typescript
     * anktech.stream.startRecordStream(mediaId);
     * ```
     */
    startRecord(elementId: string): void;
    private getSupportedMp4MimeType;
    /**
     * ## 停止录像并下载
     *
     * @param elementId string video标签ID, 需要全局唯一
     *
     * @example
     * ```typescript
     * anktech.stream.stopRecord(mediaId);
     * ```
     */
    stopRecord(elementId: string): void;
    /**
     * ## 录像并下载
     *
     * @param elementId string video标签ID, 需要全局唯一
     *
     * @example
     * ```typescript
     * anktech.stream.downloadRecordStream(mediaId);
     * ```
     */
    private downloadRecord;
}
