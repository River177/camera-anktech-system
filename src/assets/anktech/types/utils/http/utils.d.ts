export declare function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;
export declare function setObjToUrlParams(baseUrl: string, obj: object): string;
export declare function isString(value: unknown): value is string;
