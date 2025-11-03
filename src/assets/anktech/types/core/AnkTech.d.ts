import { HttpManager } from "./HttpManager";
import { MessageManager } from "./MessageManager";
import { StreamManager } from "./StreamManager";
import { Options, OnMessageListener } from "../types/shared.types";
export default class AnkTech {
    private readonly options;
    private readonly transcoder;
    message: MessageManager;
    http: HttpManager;
    stream: StreamManager;
    private messageListener?;
    constructor(options?: Options);
    /**
     * ## webscoket onMessage监听器
     *
     * ### 消息种类
     *
     * #### 30006 获取摄像机列表
     * ```json
     * response {"CMD":30006,"CameraArray":[]}
     *
     * ```
     *
     * #### 30007 获取通道列表
     * ```json
     * response {"CMD":30007,"ChannelArray":[]}
     *
     * ```
     *
     * #### 30010 设备状态变更
     * ```json
     * response {"CMD":30010,"CamID":"m110","DevServerID":"","Status":1}
     * ```
     *
     * #### 30011 拼接服务上线
     * ```json
     * response {"CMD":30011,"StitchID":"aqss_89","StitchName":"aqss_89","StitcherArr":[{"CamID":"m110","ChnArr":[{"ChnID":0,"VideoID":0},{"ChnID":1,"VideoID":0},{"ChnID":2,"VideoID":0},{"ChnID":3,"VideoID":0},{"ChnID":4,"VideoID":0}],"Index":0,"MainChn":0,"MtsID":"aqcenter","MtsIP":"192.168.12.89","MtsPort":8899,"StitcherName":"拼接89通道","StitcherType":0}]}
     *
     * ```
     *
     * #### 30013 获取拼接列表
     * ```json
     * response {"CMD":30013,"StitchServerArr":[]}
     *
     * ```
     *
     * #### 30020 拼接相机变更通知
     * ```json
     * response {"CMD":30020,"CamID":"m110","Index":0,"StitchID":"aqss_89"}
     * ```
     *
     * #### 30022 拼接服务下线
     * ```json
     * response {"CMD":30022,"StitchID":"aqss_89"}
     * ```
     *
     * #### 30024 摄像机参数设置
     * ```json
     * response {"CMD":30024,"CamID":"qiuji_67","Param":{"Bitrate":4096,"BitrateType":0,"Framerate":25,"Height":1080,"ImgQuality":0,"ParamID":301,"RequestClientID":"web001","StatusCode":0,"StreamId":0,"Width":1920},"RequestClientID":"web001","STR_ChnID":"qiuji_67_0","status":0}
     * ```
     *
     * #### 30025 设备建模通知
     * ```json
     * response
     * {"CMD":30025,"ImageID":1745478932134,"Index":0,"Result":400,"StitchID":"aqss_89"} 是否建模成功表示 200 为建模成功
     * {"CMD":30025,"imageID":1745490195706,"picture":"data:image/jpeg;base64,**"} 返回建模图片 base64格式
     * ```
     *
     * #### 30031 设备通道状态变更通知
     * ```json
     * response {"CMD":30031,"ChnID":"id","CamID":"id","StreamType":0,"Status":1,"VideoID":88888888,"MtsID":"id","MtsIP":"ip","MtsPort":8899,"DevServerID":"id"}
     * ```
     *
     * #### 30038 拼接通道变更通知
     * ```json
     * response {"CMD":30038,"Index":0,"StitchID":"aqss_89","StitcherChannelName":"拼接89通道1"}
     * ```
     *
     * #### 30049 ROI信息通知
     * ```json
     * response {"CMD":30049,"Index":0,"RoiArray":[{"Height":0.0,"IsOpen":false,"RoiID":4,"Width":0.0,"X":0.0,"Y":0.0},{"Height":0.0,"IsOpen":false,"RoiID":3,"Width":0.0,"X":0.0,"Y":0.0},{"Height":0.3748047947883606,"IsOpen":true,"RoiID":1,"Width":0.08107423037290573,"X":0.18399369716644287,"Y":0.38677340745925903},{"Height":0.3748047947883606,"IsOpen":true,"RoiID":2,"Width":0.08107423037290573,"X":0.4691813886165619,"Y":0.48292726278305054}],"StitchID":"aqss_89"}
     * ```
     *
     * #### 30057 录像更新通知
     * ```json
     * response {"CMD":30057,"CamID":"qiuji_67","EndTime":"2025-04-14 16:32:59","RecordId":"aqrs_89","StartTime":"2025-04-14 16:31:59"}
     * ```
     *
     * #### 30058 录像回放结束通知
     * ```json
     * response {"CMD":30058,"CamID":"qiuji_67","VodID":"aqrs_89","VodWorkID":"web002_0"}
     * ```
     *
     * #### 30061 相机回放回调信息
     * ```json
     * response {"CMD":30061,"CamID":"qiuji_67","ChannelArray":[{"CamID":"qiuji_67","ChnID":"qiuji_67_0","ChnIndex":0,"MainVideoID":0,"MtsID":"aqcenter","MtsIP":"192.168.12.89","MtsPort":8899,"SubVideoID":0}],"Error":0,"Index":0,"VodID":"aqrs_89","VodWorkID":"web002_0"}
     * ```
     *
     * #### 30107 获取球机PTZ信息
     * ```json
     * response {"CMD":30107,"CamID":"qiuji_67","Index":0,"Pan":0.019999999552965164,"Ret":true,"Tilt":0.0,"Zoom":100.0}
     * ```
     *
     * #### 30114 获取球机标定
     * ```json
     * response {"CMD":30114,"Index":0,"dome":[{"H":0.3771950304508209,"Pan":101.52999877929688,"Tilt":0.0,"W":0.08159129321575165,"X":0.053840216249227524,"Y":0.06350859254598618,"Zoom":338.0,"id":0},{"H":0.3748443126678467,"Pan":51.040000915527344,"Tilt":0.0,"W":0.0810827910900116,"X":0.2594585716724396,"Y":0.31257790327072144,"Zoom":338.0,"id":1},{"H":0.8750000596046448,"Pan":16.780000686645508,"Tilt":0.0,"W":0.1892717480659485,"X":0.33325690031051636,"Y":0.04899788647890091,"Zoom":128.0,"id":2},{"H":0.3805798292160034,"Pan":315.3699951171875,"Tilt":0.0,"W":0.08232343196868896,"X":0.6365090608596802,"Y":0.22676391899585724,"Zoom":375.0,"id":3},{"H":0.8750000596046448,"Pan":277.8800048828125,"Tilt":0.0,"W":0.1892717480659485,"X":0.7412843108177185,"Y":0.0,"Zoom":124.0,"id":4}]}
     * ```
     *
     * #### 30119 拼接通道更新
     * ```json
     * response {"CMD":30119,"ChnID":2,"Index":0,"MtsID":"aqcenter","MtsIP":"192.168.12.89","MtsPort":8899,"StitchID":"aqss_89","VideoID":91}
     * ```
     *
     * #### 30120 相机回放通道更新
     * ##StreamType = 0 为主流; StreamType = 1 为辅流
     *
     * ```json
     * response {"CMD":30120,"ChnID":"qiuji_67_0","MtsID":"aqcenter","MtsIP":"192.168.12.89","MtsPort":8899,"StreamType":0,"VideoID":50,"VodWorkID":"web002_0"}
     * ```
     *
     * #### 30121 获取拼接通道编码参数
     *
     * ```javascript
     * ## 分辨率枚举
     * const resolutionOptions = [
     * {key: 1, resolution: '3840x2160'},
     * {key: 2, resolution: '1920x1080'},
     * {key: 3, resolution: '1280x720'},
     * {key: 4, resolution: '960x540'},
     * {key: 5, resolution: '640x360'},
     * ]
     * ```
     *
     * ```json
     * response {"Bitrate":4096,"CMD":30121,"ChnID":0,"Index":0,"Resolution":2}
     * ```
     *
     * #### 30123 获取拼接通道OSD参数
     * ```json
     * response {"CMD":30123,"ChnID":0,"Index":0,"Osd1_Text":"全景channel","ShowTime":true}
     * ```
     *
     *  ##未完待续
     */
    setOnMessageListener(listener: OnMessageListener): void;
    /**
     * ##用户登录认证
     *
     * #### 登录流程;
     * 1. 通过API接口获取TOKEN, 登录成功后; 等待websocket连接成功 做二次校验 (SDK内部实现)
     * 2. 获取websocket连接地址进行连接 (SDK内部实现)
     * 3. 登录完成后需要监听setOnMessageListener, 其实event为服务推送的消息(需要上层代码实现)
     *
     * @example
     * ```typescript
     * await anktech.login();
     * anktech.setOnMessageListener((event) => {
     *    console.log("Received message:", event);
     * }
     * ```
     */
    login(): Promise<any>;
    /**
     * ##用户登出
     *
     * #### 用户登出流程;
     * 1. API接口登出
     * 2. 断开websocket连接
     *
     * @example
     * ```typescript
     * await anktech.logout();
     * ```
     */
    logout(): Promise<any>;
    private initMessageWs;
    private createMessageWs;
    /**
     * 根据CamType获取CamTypeName值
     * @param cameraType
     * @private
     */
    private getCameraTypeString;
    private closeMessageWs;
    private startConnectTimer;
    private startHeartbeatTimer;
    private startTimeoutTimer;
}
