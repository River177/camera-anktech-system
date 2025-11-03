export interface Alert {
  id: string;
  sequence: string | null;
  video_source: string | null;
  alert_type: string | null;
  content: string | null;
  time: string;
  status: string;
  operator: string | null;
  created_at: string;
}

export interface Camera {
  id: string;
  name: string;
  video_url: string;
  position_x: number | null;
  position_y: number | null;
  camera_type: string;
  is_active: boolean;
  created_at: string;
}

export interface Label {
  id: string;
  name: string;
  position_x: number | null;
  position_y: number | null;
  icon_type: string | null;
  is_visible: boolean;
  created_at: string;
}

export interface TrackingRecord {
  id: string;
  target_name: string;
  target_type: string | null;
  start_time: string;
  end_time: string | null;
  video_url: string | null;
  trajectory_data: any;
  status: string;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  timestamp: string;
  lng?: number;
  lat?: number;
}
