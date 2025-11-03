export interface CameraZoneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CameraZone {
  id: string;
  name: string;
  streamId: string;
  bounds: CameraZoneBounds;
  tags?: string[];
}

export interface CameraLayoutFile {
  cameras: CameraZone[];
}
