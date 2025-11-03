/**
 * AnkTech SDK React Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAnkTechService, resetAnkTechService } from '@/services/AnkTechService';
import type { Options, OnMessageListener, Camera, Channel, Stitch, TreeNode } from '@/types/anktech';

export function useAnkTech(options?: Options) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stitches, setStitches] = useState<Stitch[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  
  const serviceRef = useRef<ReturnType<typeof getAnkTechService> | null>(null);

  // 消息处理函数
  const handleMessage = useCallback((message: any) => {
    const CMD = message.CMD;
    
    switch (CMD) {
      case 30006: // 获取设备列表
        setCameras(message.CameraArray || []);
        break;
      
      case 30007: // 获取通道列表
        setChannels(message.ChannelArray || []);
        break;
      
      case 30013: // 获取拼接列表
        setStitches(message.StitchServerArr || []);
        break;
      
      case 30010: // 设备状态变更
        setCameras(prev => 
          prev.map(cam => 
            cam.CamID === message.CamID 
              ? { ...cam, Status: message.Status }
              : cam
          )
        );
        break;
      
      case 30011: // 拼接服务上线
        setStitches(prev => {
          const index = prev.findIndex(s => s.StitchID === message.StitchID);
          if (index > -1) {
            const newStitches = [...prev];
            newStitches[index] = { ...message, Status: 1 };
            return newStitches;
          }
          return prev;
        });
        break;
      
      case 30022: // 拼接服务下线
        setStitches(prev =>
          prev.map(stitch =>
            stitch.StitchID === message.StitchID
              ? { ...stitch, Status: 0 }
              : stitch
          )
        );
        break;
      
      case 30031: // 通道状态变更
        setChannels(prev => {
          const index = prev.findIndex(ch => ch.ChnID === message.ChnID);
          if (index > -1) {
            const newChannels = [...prev];
            if (message.StreamType === 0) {
              newChannels[index] = { ...newChannels[index], MainVideoID: message.VideoID };
            } else {
              newChannels[index] = { ...newChannels[index], SubVideoID: message.VideoID };
            }
            return newChannels;
          }
          return prev;
        });
        break;
      
      case 900001: // WebSocket 连接成功
        console.log('[useAnkTech] WebSocket 已连接');
        // 获取设备信息
        if (serviceRef.current) {
          serviceRef.current.getDeviceList();
          serviceRef.current.getStitchList();
        }
        break;
      
      default:
        console.log('[useAnkTech] 未处理的消息:', CMD);
    }
  }, []);

  // 登录
  const login = useCallback(async () => {
    if (!options) {
      setError('缺少登录配置');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = getAnkTechService(options);
      serviceRef.current = service;
      
      // 添加消息监听器
      service.addMessageListener(handleMessage);
      
      await service.login();
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '登录失败';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [options, handleMessage]);

  // 登出
  const logout = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.logout();
      serviceRef.current = null;
      resetAnkTechService();
      setIsLoggedIn(false);
      setCameras([]);
      setChannels([]);
      setStitches([]);
      setTreeData([]);
    } catch (err) {
      console.error('[useAnkTech] 登出失败:', err);
    }
  }, []);

  // 构建树形数据
  useEffect(() => {
    const newTreeData: TreeNode[] = [];

    // 添加摄像机
    cameras.forEach(camera => {
      const cameraNode: TreeNode = {
        id: camera.CamID,
        name: camera.CamName,
        status: camera.Status,
        type: 'camera',
        CamID: camera.CamID,
        CamType: camera.CamType,
        CamTypeName: camera.CamTypeName,
        group: camera.Group,
        isLeaf: false,
        channels: [],
        data: camera,
        isAutoRecord: camera.isAutoRecord,
        isForbidden: camera.isForbidden,
        longID: camera.longID,
      };
      newTreeData.push(cameraNode);
    });

    // 添加通道到摄像机
    channels.forEach(channel => {
      const cameraNode = newTreeData.find(node => node.id === channel.CamID);
      if (cameraNode) {
        const channelNode: TreeNode = {
          id: channel.ChnID,
          name: channel.ChnName,
          status: channel.Status,
          type: 'channel',
          CamID: channel.CamID,
          ChnID: channel.ChnID,
          ChnIndex: channel.ChnIndex,
          mts: `${channel.MtsIP}:${channel.MtsWsPort}`,
          mediaId: channel.SubVideoID,
          DevServerID: channel.DevServerID,
          isLeaf: true,
          data: channel,
        };
        cameraNode.channels?.push(channelNode);
      }
    });

    // 添加拼接服务
    stitches.forEach(stitch => {
      const stitchNode: TreeNode = {
        id: stitch.StitchID,
        name: stitch.StitchName,
        status: stitch.Status,
        type: 'stitch',
        StitchID: stitch.StitchID,
        isLeaf: false,
        channels: stitch.StitcherArr.map(stitcher => ({
          id: `${stitch.StitchID}_${stitcher.Index}`,
          name: stitcher.StitcherName,
          status: stitch.Status,
          type: 'stitcher',
          CamID: stitcher.CamID,
          StitchID: stitch.StitchID,
          StitchIndex: stitcher.Index,
          ChnID: stitcher.ChnArr[0]?.ChnID,
          ChnIndex: stitcher.ChnArr[0]?.ChnID,
          mts: `${stitcher.MtsIP}:${stitcher.MtsWsPort}`,
          mediaId: stitcher.ChnArr[0]?.VideoID,
          isLeaf: true,
          data: stitcher,
        })),
        data: stitch,
      };
      newTreeData.push(stitchNode);
    });

    setTreeData(newTreeData);
  }, [cameras, channels, stitches]);

  return {
    isLoggedIn,
    isLoading,
    error,
    cameras,
    channels,
    stitches,
    treeData,
    login,
    logout,
    service: serviceRef.current,
  };
}

