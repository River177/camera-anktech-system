/**
 * 监控页面 - 使用 AnkTech SDK
 */

import { useEffect, useState } from 'react';
import { useAnkTech } from '@/hooks/useAnkTech';
import { AnkTechPlayer } from '@/components/monitoring/AnkTechPlayer';
import { Button } from '@/components/ui/button';
import { Settings, Maximize2, Camera as CameraIcon, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TreeNode, Video } from '@/types/anktech';

// 登录配置
const LOGIN_CONFIG = {
  server: window.location.hostname || 'localhost',  // 使用当前域名，通过代理转发
  wsPort: Number(window.location.port) || 3000,     // 使用当前端口
  userId: 'admin',
  password: '123456',
  debug: true,
};

export default function MonitoringPage() {
  const {
    isLoggedIn,
    isLoading,
    error: loginError,
    treeData,
    login,
    logout,
    service,
  } = useAnkTech(LOGIN_CONFIG);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [videos, setVideos] = useState<Video[]>([
    { index: 0 },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
  ]);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 自动登录
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      login();
    }
  }, [isLoggedIn, isLoading, login]);

  // 打开视频
  const openVideo = (node: TreeNode) => {
    if (!['stitcher', 'channel'].includes(node.type) || node.status !== 1) {
      alert('通道不在线!');
      return;
    }

    if (videos.find(v => v.mediaId === node.mediaId)) {
      alert('视频已打开');
      return;
    }

    const newVideo: Video = {
      index: node.ChnIndex || 0,
      elementId: `video_${node.mediaId}`,
      mediaId: node.mediaId,
      isPseudoFullscreen: false,
      StitchID: node.StitchID,
      StitchIndex: node.StitchIndex,
      DevServerID: node.DevServerID,
      CamID: node.CamID,
      CamType: node.CamType,
      CamTypeName: node.CamTypeName,
      ChnID: node.ChnID,
      ChnIndex: node.ChnIndex,
      type: node.type as 'channel' | 'stitcher',
    };

    // 拼接视频放在第一个位置
    if (node.type === 'stitcher') {
      setVideos(prev => {
        const newVideos = [...prev];
        newVideos[0] = newVideo;
        return newVideos;
      });
    } else {
      // 普通视频添加到列表
      setVideos(prev => {
        const emptyIndex = prev.findIndex(v => !v.mediaId);
        if (emptyIndex > 0) {
          const newVideos = [...prev];
          newVideos[emptyIndex] = newVideo;
          return newVideos;
        }
        return prev;
      });
    }
  };

  // 关闭视频
  const closeVideo = (index: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      newVideos[index] = { index };
      return newVideos;
    });
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    }
  };

  // 截图
  const handleScreenshot = () => {
    if (selectedIndex < 0 || !videos[selectedIndex].mediaId) {
      alert('请选择视频窗口');
      return;
    }
    service?.screenshot(videos[selectedIndex].elementId!);
  };

  // 登录界面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-width-md p-8 bg-slate-900/90 border-slate-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              智能监控平台
            </h1>
            <p className="text-slate-400 mt-2">AnkTech SDK 版本</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 mt-4">正在连接...</p>
            </div>
          ) : loginError ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{loginError}</p>
              <Button onClick={login} variant="outline" className="bg-slate-800 border-slate-700">
                重试
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    );
  }

  // 主界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="min-h-screen flex flex-col gap-4 p-4">
        {/* 顶部栏 */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                智能监控平台
              </h1>
              <p className="text-sm text-slate-400">AnkTech SDK</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="text-sm text-slate-400">当前时间</div>
              <div className="text-lg font-mono text-slate-200">
                {currentTime.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <LogOut className="w-5 h-5 text-slate-200" />
            </Button>
          </div>
        </header>

        {/* 主要内容区域 */}
        <div className="flex flex-1 gap-4">
          {/* 左侧设备树 */}
          <Card className="w-80 bg-slate-900/80 border-slate-700 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-slate-100">设备列表</h2>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {treeData.map(node => (
                  <div key={node.id} className="space-y-1">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                      <CameraIcon className="w-4 h-4" style={{ color: node.status === 1 ? '#10b981' : '#ef4444' }} />
                      <span className="flex-1 text-sm">{node.name}</span>
                      <Badge variant={node.status === 1 ? 'default' : 'secondary'} className="text-xs">
                        {node.status === 1 ? '在线' : '离线'}
                      </Badge>
                    </div>
                    
                    {node.channels && node.channels.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {node.channels.map(channel => (
                          <button
                            key={channel.id}
                            onClick={() => openVideo(channel)}
                            className="w-full flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-blue-500/20 transition-colors text-left"
                            disabled={channel.status !== 1}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channel.status === 1 ? '#10b981' : '#6b7280' }} />
                            <span className="flex-1 text-sm text-slate-300">{channel.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* 右侧视频区域 */}
          <div className="flex-1 flex flex-col gap-4">
            {/* 视频控制栏 */}
            <Card className="bg-slate-900/80 border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">视频监控</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleScreenshot}
                    disabled={selectedIndex < 0}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                  >
                    截图
                  </Button>
                </div>
              </div>
            </Card>

            {/* 视频网格 */}
            <div className="flex-1 grid grid-cols-1 gap-4">
              {/* 主视频 */}
              {videos[0].mediaId ? (
                <Card 
                  className={`relative bg-slate-950 border-slate-700 overflow-hidden cursor-pointer transition-all ${
                    selectedIndex === 0 ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedIndex(0)}
                >
                  <div className="aspect-video">
                    <AnkTechPlayer
                      mediaId={videos[0].mediaId!}
                      mts={treeData.find(n => 
                        n.channels?.some(c => c.mediaId === videos[0].mediaId)
                      )?.channels?.find(c => c.mediaId === videos[0].mediaId)?.mts || ''}
                      StitchID={videos[0].StitchID}
                      StitchIndex={videos[0].StitchIndex}
                      CamID={videos[0].CamID}
                      ChnID={videos[0].ChnID}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeVideo(0);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                  >
                    ×
                  </button>
                </Card>
              ) : (
                <Card className="bg-slate-950 border-slate-700 flex items-center justify-center aspect-video">
                  <p className="text-slate-500">点击左侧设备列表打开视频</p>
                </Card>
              )}

              {/* 子视频 */}
              <div className="grid grid-cols-4 gap-4">
                {videos.slice(1).map((video, idx) => {
                  const index = idx + 1;
                  return video.mediaId ? (
                    <Card
                      key={index}
                      className={`relative bg-slate-950 border-slate-700 overflow-hidden cursor-pointer transition-all ${
                        selectedIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <div className="aspect-video">
                        <AnkTechPlayer
                          mediaId={video.mediaId!}
                          mts={treeData.find(n => 
                            n.channels?.some(c => c.mediaId === video.mediaId)
                          )?.channels?.find(c => c.mediaId === video.mediaId)?.mts || ''}
                          StitchID={video.StitchID}
                          StitchIndex={video.StitchIndex}
                          CamID={video.CamID}
                          ChnID={video.ChnID}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeVideo(index);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ×
                      </button>
                    </Card>
                  ) : (
                    <Card key={index} className="bg-slate-950 border-slate-700 aspect-video" />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

