import { AxiosRequestConfig } from 'axios';
export interface IHttpClientConfig extends AxiosRequestConfig {
    maxRetries?: number;
    retryDelay?: number;
    isTransformResponse?: boolean;
}
export interface ApiResponse<T = any> {
    v?: number;
    code?: string;
    exception?: string;
    data?: any;
    pageCount?: number;
    totalCount?: number;
    rowCount?: number;
    extras?: any;
    rid?: string;
    message?: string;
}
export interface IApiErrorData {
    code?: string;
    message: string;
    details?: any;
}
export interface IUser {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
export interface ICreateUserDTO {
    name: string;
    email: string;
    password: string;
}
export interface IUpdateUserDTO {
    name?: string;
    email?: string;
}
