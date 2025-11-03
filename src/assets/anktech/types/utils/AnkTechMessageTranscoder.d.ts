import { VideoFrameData } from "../types/shared.types";
/**
 * 消息信息处理工具
 */
export default class AnkTechMessageTranscoder {
    /**
     * Generates authorization message
     * @param userId - User identifier
     * @param token - Authentication token
     */
    createAuthMessage(userId: string, token: string): ArrayBuffer;
    /**
     * Encodes basic message
     */
    encodeMessage(content: string, isDebug: boolean): ArrayBuffer;
    /**
     * Encodes targeted message with receiver ID
     */
    encodeTargetedMessage(receiverId: string, content: string, isDebug: boolean): ArrayBuffer;
    /**
     * Creates heartbeat message
     */
    createHeartbeat(): ArrayBuffer;
    createStreamInit(): ArrayBuffer;
    createStreamOpen(mediaId: number): ArrayBuffer;
    createStreamClose(): ArrayBuffer;
    streamDecode(data: Blob): Promise<any>;
    private handleVideoFrame;
    decodeMessage(data: Blob): Promise<string | null>;
    decodeStreamData(data: Blob): Promise<VideoFrameData | null>;
    private _encodeBasicMessage;
    private _readBlobAsArrayBuffer;
    private _decodePeerToPeerMessage;
    private _decodeServerMessage;
    private _decodeImageMessage;
    private _arrayToBase64;
}
