/**
 * AnkTech 视频播放器组件
 * 使用 AnkTech SDK 进行视频播放
 */

import { useEffect, useRef } from 'react';
import { getAnkTechService } from '@/services/AnkTechService';

interface AnkTechPlayerProps {
  mediaId: number;
  mts: string;
  StitchID?: string;
  StitchIndex?: number;
  StitchChnID?: string;
  CamID?: string;
  ChnID?: string;
  autoPlay?: boolean;
  className?: string;
  onError?: (error: string) => void;
}

export function AnkTechPlayer({
  mediaId,
  mts,
  StitchID,
  StitchIndex,
  StitchChnID,
  CamID,
  ChnID,
  autoPlay = true,
  className = '',
  onError,
}: AnkTechPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const elementId = `anktech_video_${mediaId}`;

  useEffect(() => {
    if (!mediaId || !mts) {
      return;
    }

    const ankTechService = getAnkTechService();
    
    if (!ankTechService.isConnectedToServer()) {
      onError?.('AnkTech SDK 未连接');
      return;
    }

    try {
      // 创建视频流
      ankTechService.createStream(mts, {
        elementId,
        mediaId,
        StitchID,
        StitchIndex,
        StitchChnID,
        CamID,
        ChnID,
      });

      console.log('[AnkTechPlayer] 视频流创建成功:', elementId);
    } catch (error) {
      console.error('[AnkTechPlayer] 创建视频流失败:', error);
      onError?.('创建视频流失败');
    }

    // 清理函数
    return () => {
      try {
        ankTechService.closeStream(elementId);
        console.log('[AnkTechPlayer] 视频流已关闭:', elementId);
      } catch (error) {
        console.error('[AnkTechPlayer] 关闭视频流失败:', error);
      }
    };
  }, [mediaId, mts, StitchID, StitchIndex, StitchChnID, CamID, ChnID, elementId, onError]);

  return (
    <video
      ref={videoRef}
      id={elementId}
      autoPlay={autoPlay}
      className={`w-full h-full object-cover bg-slate-950 ${className}`}
      playsInline
      muted
    />
  );
}

