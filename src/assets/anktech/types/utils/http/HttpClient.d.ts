import { AxiosRequestConfig } from 'axios';
import { IHttpClientConfig } from "../utils.type";
export declare class HttpClient {
    private readonly client;
    private readonly maxRetries;
    private readonly retryDelay;
    private readonly isTransformResponse;
    constructor(baseURL: string, config?: IHttpClientConfig);
    private _setupInterceptors;
    request<T>(config: AxiosRequestConfig): Promise<T>;
    private _retryRequest;
    private _isRetryable;
    /**
     * 签名方法
     * @param timestamp
     * @param url
     * @param params
     * @param body
     * @param nonce
     * @returns {*}
     */
    private signature;
    /**
     * 随机数
     * @returns {string}
     */
    private getRandom;
    /**
     * 获取毫秒数
     * @returns {number}
     */
    private getTimestamp;
    /**
     * 密码加密
     * @param publicKey
     * @param password
     * @returns {string | false}
     */
    encrypt(publicKey: any, password: any): string | false;
}
