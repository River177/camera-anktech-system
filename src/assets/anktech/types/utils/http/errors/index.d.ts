import { IApiErrorData } from "../../utils.type";
export declare class SDKError extends Error {
    constructor(message: string);
}
export declare class ApiError extends SDKError {
    message: string;
    statusCode: number;
    data?: IApiErrorData;
    constructor(message: string, statusCode: number, data?: IApiErrorData);
}
export declare class NetworkError extends SDKError {
    constructor(message: string);
}
export declare class RequestError extends SDKError {
    constructor(message: string);
}
export declare class UserNotFoundError extends SDKError {
    constructor(userId: string);
}
