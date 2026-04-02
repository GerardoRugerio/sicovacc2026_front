export interface Reporte {
  success: boolean;
  msg: string;
  contentType: string;
  reporte?: string;
  archivo?: string;
  buffer: Buffer;
}

export interface Buffer {
  type: string;
  data: number[];
}
