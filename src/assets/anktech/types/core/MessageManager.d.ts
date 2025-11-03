import AnkTechMessageTranscoder from "../utils/AnkTechMessageTranscoder";
import { messageWs, Options } from "../types/shared.types";
/**
 * 信令接口，用于处理 SDK 和 AQ_CENTER 交互。
 * @public
 */
export declare class MessageManager {
    private readonly options;
    private ws;
    private transcoder;
    constructor(options: Options, ws: messageWs, transcoder: AnkTechMessageTranscoder);
    private clientOffline;
    /**
     * ## 获取设备列表
     * 获取后消息会从回调方法setOnMessageListener返回
     * CameraArray 为设备数组 具体数据格式参数参考 名词解释[摄像机]
     *
     * ### 消息格式
     * ```json
     * {"CMD":30006,"CameraArray":[]}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.getDeviceList();
     * ```
     */
    getDeviceList(): void;
    /**
     * ## 获取通道列表
     * 获取后消息会从回调方法setOnMessageListener返回
     * CameraArray 为设备数组 具体数据格式参数参考 名词解释[通道]
     *
     * ### 消息格式
     * ```json
     * {"CMD":30007,"ChannelArray":[]}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.getChannelList();
     * ```
     */
    getChannelList(): void;
    /**
     * ## 获取拼接列表
     * 获取后消息会从回调方法setOnMessageListener返回
     * CameraArray 为设备数组 具体数据格式参数参考 名词解释[拼接服务]
     *
     * ### 消息格式
     * ```json
     * {"CMD":30013,"StitchServerArr":[]}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.getStitchList();
     * ```
     */
    getStitchList(): void;
    /**
     * ## 打开拼接
     * 1. 实时 切换为实时画面
     * 2. 回放 根据time回放录像 通过接口 apiGetRecordList 获取录像列表; 列表中含有字段 time(startDate-endDate), vodID(serverId)
     * 3. 当前 打开拼接视频需要发送当前信息
     *
     * ### 消息格式
     * ```json
     * 实时 {stitchIndex: 0, mode: 0, cameraId: 'm110' }
     * 回放 {stitchIndex: 0, mode: 1, time: '2025-03-31 17:35:43', vodID: 'aqrs_89', cameraId: 'm110' }
     * 当前 {stitchIndex: 0, mode: 99, cameraId: 'm110' }
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     **
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.StitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.mode | number | 是 | 模式; 0 = 实时; 1 = 回放; 99 = 当前 |
     * | message.time | datatime | 否 | 录像回到时间(回放时需要) |
     * | message.vodID | string | 否 | 录播服务器ID(回放时间需要) |
     * | message.cameraId | string | 是 | 摄像机ID |
     *
     * @example
     * ```typescript
     * anktech.message.openStitch(StitchID, message);
     * ```
     */
    openStitch(StitchID: any, message: any): void;
    /**
     * ## 关闭拼接
     *
     * ### 消息格式
     * ```json
     * 实时 {StitchIndex: 0}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     **
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     *
     * @example
     * ```typescript
     * anktech.message.closeStitch(StitchID, message);
     * ```
     */
    closeStitch(StitchID: any, message: any): void;
    private getStitchParam;
    private setStitchParam;
    /**
     * ## 设置拼接通道名称
     *
     * ### 消息格式
     * ```json
     * {stitchIndex: 0, channelName: '新的通道名称' }
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.channelName | string | 是 | 需要修改通道名称 |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {"CMD":30038,"Index":0,"StitchID":"aqss_89","StitcherChannelName":"拼接89通道1"}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.setStitchChannelName(StitchID, message);
     * ```
     */
    setStitchChannelName(StitchID: any, message: any): void;
    /**
     * ## 拼接通道建模
     *
     * ### 消息格式
     * ```json
     * {StitchIndex: 0, channelName: '新的通道名称' }
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.type | number | 是 | 0=拼接建模; 1=全景建模 |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {"CMD":30038,"Index":0,"StitchID":"aqss_89","StitcherChannelName":"拼接89通道1"}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.startModeling(StitchID, message);
     * ```
     */
    private startModeling;
    /**
     * ## 拼接通道停止建模
     *
     * ### 消息格式
     * ```json
     * {StitchIndex: 0, channelName: '新的通道名称' }
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {"CMD":30038,"Index":0,"StitchID":"aqss_89","StitcherChannelName":"拼接89通道1"}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.stopModeling(StitchID, message);
     * ```
     */
    private stopModeling;
    /**
     * ## 视频框选
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0,"stChannelId":1,"x":0.1447721179624665,"y":0.7060439560439561,"width":0.0596514745308311,"height":0.23076923076923078,"linkDome":false}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.stChannelId | number | 是 | 范围[1-4] 显示在哪个拼接通道(对应拼接服务中StitcherArr[0].ChnArr[0].Index) |
     * | message.x | double | 是 | 范围[0-1] 框选视频左上角坐标x (坐标x/实际视频宽度) |
     * | message.y | double | 是 | 范围[0-1] 框选视频左上角坐标y (坐标y/实际视频宽度) |
     * | message.width | double | 是 | 范围[0-1] 框选视频宽度/实际视频宽度 |
     * | message.height | double | 是 | 范围[0-1] 框选视频高度/实际视频高度 |
     * | message.linkDome | boolean | 是 | 是否联动球机 |
     *
     * @example
     * ```typescript
     * anktech.message.setRoi(StitchID, message);
     * ```
     */
    setRoi(StitchID: any, message: any): void;
    /**
     * ## 视频框选移动
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0,"stChannelId":1,"x":50,"y":50}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.stChannelId | number | 是 | 范围[1-4] 显示在哪个拼接通道(对应拼接服务中StitcherArr[0].ChnArr[0].Index) |
     * | message.x | number | 是 | 位移像素x(x正值 往右; 负值 往左) |
     * | message.y | number | 是 | 位移像素y(y正值 往上; 负值 往下) |
     *
     * @example
     * ```typescript
     * anktech.message.moveRoi(StitchID, message);
     * ```
     */
    moveRoi(StitchID: any, message: any): void;
    /**
     * ## 视频框选缩放
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0,"stChannelId":1,"ratio":1.25}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.stChannelId | number | 是 | 范围[1-4] 显示在哪个拼接通道(对应拼接服务中StitcherArr[0].ChnArr[0].Index) |
     * | message.ratio | double | 是 | 缩放比列(ratio > 1 放大; ratio < 1 缩小) |
     *
     * @example
     * ```typescript
     * anktech.message.scaleRoi(StitchID, message);
     * ```
     */
    scaleRoi(StitchID: any, message: any): void;
    /**
     * ## 球机PTZ控制
     * 注意PTZ云台操作方式: 鼠标按下的时候开始移动 鼠标放开的时候停止移动;
     *
     * ### 消息格式
     * ```json
     * onmouseDown {"cameraId":"ank_qiu","channelIndex":0,"ptzCmd":2,"speed":50,"stop":0}
     * onmouseUp {"cameraId":"ank_qiu","channelIndex":0,"ptzCmd":2,"speed":50,"stop":1}
     * ```
     * @param tmsId string TMS服务ID(DevServerID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.cameraId | string | 是 | 摄像机ID |
     * | message.ptzCmd | number | 是 | 动作命令; 1=左; 2=右; 3=上; 4=下; 9=拉近; 10=拉远 |
     * | message.speed | number | 是 | 范围[0-100] 速度 |
     * | message.stop | number | 是 | 1 = 停止; 0 = 开始 |
     *
     * @example
     * ```typescript
     * anktech.message.ptz(toId, message);
     * ```
     */
    ptz(tmsId: any, message: any): void;
    /**
     * ## 拼接服务切换摄像机
     *
     * ### 消息格式
     * ```json
     * {"cameraId":"m110","stitchIndex":0}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.cameraId | string | 是 | 摄像机ID 只有Stitchable = 1的设备才可以拼接 |
     *
     * @example
     * ```typescript
     * anktech.message.switchCamera(StitchID, message);
     * ```
     */
    switchCamera(StitchID: any, message: any): void;
    /**
     * ## 获取拼接通道编码参数
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0, "ChnID":1}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.ChnID | number | 是 | 拼接通道ID |
     *
     * @example
     * ```typescript
     * anktech.message.getStitchChannelParam(StitchID, message);
     * ```
     */
    getStitchChannelParam(StitchID: any, message: any): void;
    /**
     * ## 设置拼接通道编码参数
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0, "ChnID":1, "Resolution": 2, "Bitrate": 4096}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.ChnID | number | 是 | 拼接通道ID |
     * | message.Resolution | number | 是 | 分辨率, 枚举ID |
     * | message.Bitrate | number | 是 | 码率 |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {"Bitrate":4096,"CMD":30121,"ChnID":0,"Index":0,"Resolution":2}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.setStitchChannelParam(StitchID, message);
     * ```
     */
    setStitchChannelParam(StitchID: any, message: any): void;
    /**
     * ## 获取拼接通道OSD参数
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0, "ChnID":1}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.ChnID | number | 是 | 拼接通道ID |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {"CMD":30123,"ChnID":0,"Index":0,"Osd1_Text":"全景channel","ShowTime":true}
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.getStitchChannelOsdParam(StitchID, message);
     * ```
     */
    getStitchChannelOsdParam(StitchID: any, message: any): void;
    /**
     * ## 设置拼接通道OSD参数
     *
     * ### 消息格式
     * ```json
     * {"stitchIndex":0, "ChnID":1, "ShowTime": true, "Text": "OSD显示内容"}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.ChnID | number | 是 | 拼接通道ID |
     * | message.ShowTime | boolean | 是 | 是否显示时间 |
     * | message.Text | string | 是 | osd显示内容 |
     *
     * @example
     * ```typescript
     * anktech.message.setStitchChannelOsdParam(StitchID, message);
     * ```
     */
    setStitchChannelOsdParam(StitchID: any, message: any): void;
    /**
     * ## 打开录像回放(直接回放相机录像)
     *
     * ### 消息格式
     * ```json
     * {"cameraId":0, "Index":0, "Time": '2025-03-28 10:00:00', "Jump": 1}
     * ```
     * @param RecordID string 录像服务ID(RecordID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.cameraId | string | 是 | 摄像机ID |
     * | message.Index | number | 是 | 如果同时开启多个录像回放，要保证Index不重复 |
     * | message.Time | dateTime | 是 | 录像回放开始时间 |
     * | message.Jump | number | 是 | 是否自动播放下一段录像，1: 是, 0: 否 |
     *
     * @example
     * ```typescript
     * anktech.message.openCameraRecord(StitchID, message);
     * ```
     */
    openCameraRecord(RecordID: any, message: any): void;
    /**
     * ## 打开录像回放(直接回放相机录像)
     *
     * ### 消息格式
     * ```json
     * {"cameraId":"摄像ID", "Index":0, "Time": '2025-03-28 10:00:00', "Jump": 1}
     * ```
     * @param RecordID string 录像服务ID(RecordID, 录像列表中的serverId)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.cameraId | string | 是 | 摄像机ID |
     * | message.Index | number | 是 | 如果同时开启多个录像回放，要保证Index不重复 |
     * | message.Time | dateTime | 是 | 录像回放开始时间 |
     * | message.Jump | number | 是 | 是否自动播放下一段录像，1: 是, 0: 否 |
     *
     * ### onMessageListener消息回复数据结构
     * ```json
     * {
     *       "CMD": 30061,
     *       "VodID": "aqrsid",
     *       "VodWorkID": "id", // 点播ID
     *       "CamID": "id",
     *       "Index": 0,
     *       "Error": 0, //0: 正常, 3001: 错误
     *       "ChannelArray": [
     *           {
     *               "ChnID": "id",
     *               "ChnIndex": 0,
     *               "CamID": "id",
     *               "MtsID": "id",
     *               "MtsIP": "x.x.x.x",
     *               "MtsPort": 8899,
     *               "MainVideoID": 888888,
     *               "SubVideoID": 888888
     *           }
     *       ]
     * }
     * ```
     *
     * @example
     * ```typescript
     * anktech.message.openCameraVod(StitchID, message);
     * ```
     */
    openCameraVod(RecordID: any, message: any): void;
    /**
     * ## 跳转录像回放时间(直接回放相机录像)
     *
     * ### 消息格式
     * ```json
     * {"VodWorkID":0, "Time": '2025-03-28 10:00:00'}
     * ```
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.VodWorkID | string | 是 | 点播ID, msgOpenCameraVod后 在消息中返回 |
     * | message.Time | dateTime | 是 | 录像回放开始时间 |
     *
     * @example
     * ```typescript
     * anktech.message.jumpCameraVod(StitchID, message);
     * ```
     */
    jumpCameraVod(message: any): void;
    /**
     * ## 关闭录像回放(直接回放相机录像)
     *
     * ### 消息格式
     * ```json
     * {"VodWorkID":0}
     * ```
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.VodWorkID | string | 是 | 点播ID, msgOpenCameraVod后 在消息中返回 |
     *
     * @example
     * ```typescript
     * anktech.message.closeCameraVod(StitchID, message);
     * ```
     */
    closeCameraVod(message: any): void;
    /**
     * ## 摄像机参数
     *
     * ### 消息格式
     * ```json
     * {"ChnID":"qiuji_0", "DevServerID": "DevServerID", "Param": {}}
     * ```
     * @param DevServerId string MTSID(DevServerID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.ChnID | string | 是 | 通道ID |
     * | message.MtsID | string | 是 | MTS_ID |
     * | message.Param | Object | 是 | 参数对象 |
     * | message.Param.ParamID | number | 是 | 参数号, 301-获取参数信息; 312-设置分辨率; 326-设置码率; 238-设置帧率 |
     * | message.Param.StreamId | number | 是 | 0=主流; 1=子流 |
     * | message.Param.Width | number | 否 | 分辨率宽; ParamID=312 |
     * | message.Param.Height | number | 否 | 分辨率高; ParamID=312 |
     * | message.Param.Bitrate | number | 否 | 视频码率; ParamID=326 |
     * | message.Param.Framerate | number | 否 | 视频帧率; ParamID=328 |
     *
     * @example
     * ```typescript
     * anktech.message.cameraParam(DevServerID, message);
     * ```
     */
    cameraParam(DevServerId: any, message: any): void;
    /**
     * ## 球机标定
     *
     * ### 消息格式
     * ```json
     * {"ChnID":"qiuji_0", "DevServerID": "DevServerID", "Param": {}}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.dome | Array | 是 | 标定数组(一共有5个点位的标定) |
     * | message.dome[index].id | number | 是 | 参数号, 301-获取参数信息; 312-设置分辨率; 326-设置码率; 238-设置帧率 |
     * | message.dome[index].X | double | 是 | 框选视频左上角坐标x (坐标x/实际视频宽度) |
     * | message.dome[index].Y | double | 否 | 框选视频左上角坐标y (坐标y/实际视频宽度) |
     * | message.dome[index].W | double | 否 | 范围[0-1] 框选视频宽度/实际视频宽度 |
     * | message.dome[index].H | double | 否 | 范围[0-1] 框选视频高度/实际视频高度 |
     * | message.dome[index].Pan | double | 否 | 球机水平旋转 |
     * | message.dome[index].Tilt | double | 否 | 球机垂直倾斜 |
     * | message.dome[index].Zoom | double | 否 | 球机镜头缩放 |
     *
     * @example
     * ```typescript
     * anktech.message.setDomeCalibrate(StitchID, message);
     * ```
     */
    setDomeCalibrate(StitchID: any, message: any): void;
    /**
     * ## 获取球机标定
     *
     * ### 消息格式
     * ```json
     * {"StitchIndex": 0}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     *
     * @example
     * ```typescript
     * anktech.message.getDomeCalibrate(StitchID, message);
     * ```
     */
    getDomeCalibrate(StitchID: any, message: any): void;
    /**
     * ## 获取PTZ信息
     *
     * ### 消息格式
     * ```json
     * {"StitchIndex": 0, "CamID":"CamID", "ChnID", 0}
     * ```
     * @param DevServerId string MTSID(DevServerID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.StitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.CamID | string | 是 | 摄像机ID |
     * | message.ChnID | number | 是 | 摄像机通道顺序 |
     *
     * @example
     * ```typescript
     * anktech.message.getDomePtz(StitchID, message);
     * ```
     */
    getDomePtz(DevServerId: any, message: any): void;
    /**
     * ## 球机PTZ定位
     *
     * ### 消息格式
     * ```json
     * {"CamID":"CamID", "ChnIndex", 0, Pan: 2.1, Tilt: 3.1, Zoom: 1.1}
     * ```
     * @param DevServerId string MTSID(DevServerID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.CamID | string | 是 | 摄像机ID |
     * | message.ChnIndex | number | 是 | 摄像机通道顺序 |
     * | message.Pan | double | 否 | 球机水平旋转 |
     * | message.Tilt | double | 否 | 球机垂直倾斜 |
     * | message.Zoom | double | 否 | 球机镜头缩放 |
     *
     * @example
     * ```typescript
     * anktech.message.domePositioningPtz(StitchID, message);
     * ```
     */
    domePositioningPtz(DevServerId: any, message: any): void;
    /**
     * ## 获取AI设置
     *
     * ### 消息格式
     * ```json
     * {"StitchIndex": 0}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     *
     * @example
     * ```typescript
     * anktech.getAiConfig(StitchID, message);
     * ```
     */
    getAiConfig(StitchID: any, message: any): void;
    /**
     * ## 设置AI参数
     *
     * ### 消息格式
     * ```json
     * {"StitchIndex": 0}
     * ```
     * @param StitchID string 拼接服务ID(StitchID)
     * @param message 消息对象
     *
     * ### message 数据结构
     * | 参数 | 类型 | 必填 | 描述 |
     * |------|------|------|------|
     * | message.stitchIndex | number | 是 | 拼接列表索引(对应拼接服务中 StitcherArr[0].Index) |
     * | message.Enable | boolean | 是 | 是否启用 |
     *
     * @example
     * ```typescript
     * anktech.setAiConfig(StitchID, message);
     * ```
     */
    setAiConfig(StitchID: any, message: any): void;
}
