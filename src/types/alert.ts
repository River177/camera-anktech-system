// 警告信息类型定义
export type AlertType = 'fire' | 'flood' | 'construction' | 'traffic';

export interface AlertInfo {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'resolved' | 'acknowledged';
  cameraId?: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

// 警告类型配置
export const ALERT_TYPE_CONFIG = {
  fire: {
    label: '火警监控报警',
    icon: '🔥',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  flood: {
    label: '积水监控报警',
    icon: '🌊',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  construction: {
    label: '施工安全报警',
    icon: '🚧',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  traffic: {
    label: '车辆拥堵报警',
    icon: '🚗',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  }
};

// 严重程度配置
export const SEVERITY_CONFIG = {
  low: {
    label: '低',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  medium: {
    label: '中',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  high: {
    label: '高',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  critical: {
    label: '紧急',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  }
};
