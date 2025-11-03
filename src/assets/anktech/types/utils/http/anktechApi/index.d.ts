import { HttpClient } from '../HttpClient';
import { AnkTechApi } from "./apis";
export declare class AnktechHttpClient {
    readonly apis: AnkTechApi;
    constructor(http: HttpClient);
}
