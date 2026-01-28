export interface Incidencia {
  id_incidente:      number;
  id_distrito:       number;
  id_delegacion:     number;
  id_colonia:        number;
  clave_colonia:     string;
  num_mro:           string;
  mro:               string;
  nombre_delegacion: string;
  tipo_mro:          number;
  incidente_1:       boolean;
  incidente_2:       boolean;
  incidente_3:       boolean;
  incidente_4:       boolean;
  incidente_5:       boolean;
  incidente_6:       boolean;
  incidente_7:       boolean;
  incidente_8:       boolean;
  fecha:             string;
  hora:              string;
  participantes:     string;
  hechos:            string;
  acciones:          string;
  nombre_colonia:    string;
}

