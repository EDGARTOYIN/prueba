import invokeFromRust from "@/lib/invokeData";
import type { IProcess } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useReducer, useState } from "react";

// Define the actions
type messageActions =
  | { type: "addMessage"; payload: string }
  | { type: "clearMessages" };

// Define the reducer
function messagesReducer(state: string[], action: messageActions): string[] {
  switch (action.type) {
    case "addMessage":
      return [...state, action.payload];
    case "clearMessages":
      return [];
    default:
      return state;
  }
}

/**
 * `useTauriProcess` es un hook personalizado que gestiona la interacción con un proceso de Tauri.
 *
 * @returns Un objeto con las siguientes propiedades:
 * - `startProcess`: Una función que inicia un proceso de Tauri. Acepta un objeto de tipo `TauriProcess` que tiene dos propiedades:
 *   - `eventName`: Un string opcional que especifica el nombre del evento de Tauri que el proceso puede escuchar si es que tiene uno.
 *   - `process`: Un objeto de tipo `IProcess` que describe el proceso a iniciar, este objeto define el proceso y los parametros.
 * - `error`: Cualquier error que ocurra durante la mutación | error devuelto por `tauri::command`.
 * - `data`: Los datos devueltos por la mutación | datos devueltos por `tauri::command`.
 * - `status`: El estado de la mutación | estatus de la peticion al `tauri::command`.
 * - `messages`: Un array de mensajes que se actualiza cuando se recibe un evento del proceso de iniciado de Tauri.
 */
function useTauriProcess() {
  const defaultMessage = "Esperando por un proceso";
  const [messages, messagesDispatch] = useReducer(messagesReducer, [
    defaultMessage,
  ]);
  const [tauriProcess, setTauriProcess] = useState<IProcess | null>();
  const [unlisten, setUnlisten] = useState<UnlistenFn | null>(null);

  const { mutate, error, data, status } = useMutation({
    mutationFn: invokeFromRust,
    retry: false,
  });

  const startProcess = async (tauriProcess: IProcess) => {
    // Si se ejecuta la funcion por segunda vez limpia los mensajes
    messagesDispatch({ type: "clearMessages" });
    // Si la primera vez se suscribio a un evento, limpialo en caso de que se coloque un nuevo evento
    if (typeof unlisten === "function") {
      unlisten();
    }
    await createTauriEventListener(tauriProcess);
    setTauriProcess(tauriProcess);
  };

  // Se encarga ejecutar la mutacion si el estado de de processStart cambia, la funcion startProcess permite inicializar estos estados
  useEffect(() => {
    if (tauriProcess) {
      mutate(tauriProcess);
    }
  }, [tauriProcess, mutate]);

  useEffect(() => {
    // Si se ejecuto una mutación y esta ha terminado (ya sea con éxito o con error), se elimina el tauriProcess creado.
    if (data ?? error) {
      setTauriProcess(null);
    }
  }, [data, error]); // Dependencias

  // Si se recibe un evento, se suscribe a el, y guarda cada mensaje generado en un estado.
  // Tambien inicializa un estado de `Unlisten` para cortar la escucha del evento cuando sea necesario.
  // Tambien desmontar el componente se elimina el la escucha del evento.
  const createTauriEventListener = async (tauriProcess: IProcess) => {
    if (tauriProcess.eventName) {
      const tauriEventUnlisten: UnlistenFn = await listen<string>(
        tauriProcess.eventName,
        (event) => {
          messagesDispatch({ type: "addMessage", payload: event.payload });
        }
      );
      setUnlisten(() => tauriEventUnlisten);
    }
  };

  useEffect(() => {
    // Esta función se ejecuta cuando el componente se desmonta
    return () => {
      // Si existe una función de desuscripción, la ejecuta
      if (unlisten) {
        unlisten();
      }
    };
  }, [unlisten]);

  return { startProcess, error, data, status, messages };
}

export default useTauriProcess;
