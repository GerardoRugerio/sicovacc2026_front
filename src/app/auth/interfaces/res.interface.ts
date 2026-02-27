import { Actualiza } from "../../main/interfaces/actualiza-datos.interface";
import { Acta, Datos, Votos } from "../../main/interfaces/captura_resultados_actas.interface";
import { Catalogo } from "../../main/interfaces/catalogo.inteface";
import { Formulas } from "../../main/interfaces/formulas.interface";
import { Incidencia } from "../../main/interfaces/incidentes.interface";
import { Computo, Mesa } from "../../main/interfaces/inicio-computo.interface";
import { Proyects } from "../../shared/interfaces/content.interface";
import { Status } from "./database-status.interface";

type Data = Catalogo[] | Proyects[] | Incidencia[] | Catalogo[] | Mesa[] | Acta | Acta[] | Datos | Computo | Actualiza | Votos | Status | string[] | Formulas[];

export interface Res {
  success: boolean;
  msg?:     string;
  token?:   string;
  inicioValidacion:boolean;
  cierreValidacion:boolean;
  opcion: number;
  delegacion: string;
  datos:Data;
  usuarios:string[];
  id_acta?:string;
}



