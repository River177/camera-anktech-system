import { HttpClient } from '../../HttpClient';
export declare class AnkTechApi {
    private http;
    private readonly client;
    constructor(http: HttpClient);
    getInfo(): Promise<any>;
    login(data: any): Promise<any>;
    logout(): Promise<any>;
    getCenter(params: any): Promise<any>;
    getRecordList(cameraId: any, params: any): Promise<any>;
    keepalive(): Promise<any>;
}
