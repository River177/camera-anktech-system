import { AnktechHttpClient } from "../utils/http/anktechApi";
import { Options } from "../types/shared.types";
/**
 * HTTP 请求管理器，用于处理 SDK 的网络请求。
 * @public
 * @example
 * const response = await Anktech.http.get('/api/data');
 */
export declare class HttpManager {
    private readonly options;
    private httpClient;
    private httpKeepaliveTimer;
    constructor(options: Options, httpClient: AnktechHttpClient);
    /**
     * ## 获取服务信息
     */
    info(): Promise<void>;
    /**
     * ## 登录
     */
    onLogin(): Promise<any>;
    /**
     * ## 登出
     */
    onLogout(): Promise<any>;
    /**
     * ## 设置服务端Websocket端口
     */
    getCenterAddress(): Promise<void>;
    /**
     * ## 获取摄像机录像列表
     *
     * @param cameraId string 摄像机ID
     *
     * @returns
     * ```json
     * [
     {
            "id": 90,
            "cameraId": 4,
            "sign": "41743560899387",
            "name": "2025-04-02 10:28:19",
            "state": 1,
            "isRecord": 0,
            "isPlay": 0,
            "path": "/media/data/aqrs/m110/20250402-102819",
            "serverId": "aqrs_89",
            "startDate": "2025-04-02 14:06:00",
            "endDate": "2025-04-02 16:31:51",
            "createDate": "2025-04-02 10:28:19",
            "updateDate": "2025-04-02 17:05:20"
        },
     {
            "id": 91,
            "cameraId": 4,
            "sign": "41743582730493",
            "name": "2025-04-02 16:32:10",
            "state": 1,
            "isRecord": 0,
            "isPlay": 0,
            "path": "/media/data/aqrs/m110/20250402-163210",
            "serverId": "aqrs_89",
            "startDate": "2025-04-02 16:32:10",
            "endDate": "2025-04-02 17:05:45",
            "createDate": "2025-04-02 16:32:10",
            "updateDate": "2025-04-02 17:05:45"
        }
     ]
     * ```
     *
     * @example
     * ```typescript
     * anktech.http.getRecordList('cameraId');
     * ```
     */
    getRecordList(cameraId: string, params: any): Promise<any>;
    /**
     * ## http keepalive 定时器
     *
     * @private
     */
    startHttpKeepaliveTimer: () => void;
}
