export interface Computo {
  MSPEN:                string;
  COPACO:               string;
  personasCandidatas:   string;
  personasObservadoras: string;
  presentaronProyecto:  string;
  mediosComunicacion:   string;
  otros:                string;
  total:                string;
  fecha:                string;
  hora:                 string;
  observaciones:        string;
}

export interface Mesa {
  nombre_colonia: string;
  clave_colonia:  string;
  num_mro:        number;
  tipo_mro:       number;
  noInstalada:    boolean | null;
}
