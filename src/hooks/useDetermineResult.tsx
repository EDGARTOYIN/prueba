// import { useGetTest } from "@/hooks/index";
// import { useStoreTest } from "@/store/store";

// // useDetermineResult

// // Utilizamos este hook para guardar un resultado en nuestro estado global de resultados de cada test
// // Cuando se determina un resultado tambien se avanza de test.

// function useDetermineResult() {
//   // Obtenemos la funcion que actualiza el estado global
//   const updateResults = useStoreTest((state) => state.updateResults);

//   // utilizamos el hook de getTest para obtener el contenido estatico del test actual
//   const { static_content } = useGetTest();

//   // Creamos una funcion que ofrecera como api generar un resultado y guardarlo.
//   const determineResult = (status: "pass" | "fail", message?: string) => {
//     const result = status === "pass";
//     updateResults({ testName: static_content.testName, result, message });
//     //TODO Aumentar el index global para avanzar a la siguiente prueba.
//     // TODO Regresar al menu 'test selector' para seleccionar el ir a la siguiente prueba.
//   };

//   return { determineResult };
// }

// export default useDetermineResult;
