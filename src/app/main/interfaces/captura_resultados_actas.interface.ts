export interface Datos {
  actas:    Acta[];
  actasCapturadas:  number;
  actasPorCapturar: number;
  UTValidadas:      number;
  UTPorValidar:     number;
}

export interface  Acta {
  id_acta:            number;
  nombre_colonia:     string;
  clave_colonia:      string;
  num_mro:            string;
  mro:                string;
  nombre_delegacion:  string;
  coordinador_sino:   boolean;
  num_integrantes:    string;
  finalizar_captura?: boolean;
  levantada_distrito: boolean;
  razon_distrital:    string;
  bol_recibidas:      string;
  bol_adicionales:    string;
  total_ciudadanos:   string;
  bol_sobrantes:      string;
  bol_total_emitidas: number;
  opi_total_sei:      number;
  bol_nulas:          string;
  bol_nulas_sei:      number;
  tipo:               number;
  tipo_mro:           number;
  integraciones:          Integraciones[];
}

export interface Integraciones {
  secuencial: string;
  votos:        string;
  votos_sei:    string;
  nom_p: string;
  rubro_general?:string;
}

export interface Votos {
  bol_nulas_sei: number;
  opi_total_sei:  number;
  integraciones: Integraciones[];
}

export interface VotosArray {
  id:number,
  votos:number,
}
