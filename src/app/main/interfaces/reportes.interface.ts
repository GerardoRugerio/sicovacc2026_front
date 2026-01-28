export interface Reporte {
  success: boolean;
  msg: string;
  contentType: string;
  reporte: string;
  buffer: Buffer;
}

export interface Buffer {
  type: string;
  data: number[];
}
