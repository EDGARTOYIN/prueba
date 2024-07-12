// InvokeData.ts
// Creamos una funcion apartir de invoke de tauri para pasar un objeto que definia los parametros de la funcion
// retornamos la promesa en la funcion.
import { invoke } from "@tauri-apps/api";
import type { IProcess } from "@/types";
// interface IProcess {
//   action: string;
//   params?: Record<string, string | number>;
// }

async function invokeFromRust(process: IProcess): Promise<string | Error> {
  return invoke<string>(process.action, { ...process.args })
    .then((res) => res)
    .catch((err: unknown) => {
      // El error retornano es un string, que convertimos a una instancia de error en TS
      return Error(err as string);
    });
}

export default invokeFromRust;
