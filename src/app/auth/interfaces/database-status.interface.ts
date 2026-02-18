export interface Status {
  datosSEI:         boolean;
  inicioValidacion: boolean;
  cierreValidacion: boolean;
  mesasNI:          number;
  incidentes:       Incidentes;
  conteo:           Conteo;
}

export interface Conteo {
  conteo_C:   ConteoC;
  conteo_CC1: ConteoC;
  conteo_CC2: ConteoC;
}

export interface ConteoC {
  id_distrito:      number;
  actasCapturadas:  number;
  actasPorCapturar: number;
  UTValidadas:      number;
  UTPorValidar:     number;
}

export interface Incidentes {
  incidentes_C:   number;
  incidentes_CC1: number;
  incidentes_CC2: number;
}

