// import Webcam from "react-webcam";

// function CameraList({ devices }: { devices: MediaDeviceInfo[] }) {
//   return (
//     <ul>
//       {devices.length === 0 ? (
//         <p className="text-xl text-danger-400 ml-3">No se encontraron camaras disponibles</p>
//       ) : (
//         devices.map((device: MediaDeviceInfo, key: number) => {
//           return (
//             <li key={key}>
//               <div className="flex flex-col gap-4">
//                 <Webcam
//                   style={{ borderRadius: "12px", border: "2px solid white" }}
//                   audio={true}
//                   height={720}
//                   width={500}
//                   videoConstraints={{ deviceId: device.deviceId }}
//                 />
//                 <div className="text-white">
//                   <h2 className="font-semibold">Descripcion de camara:</h2>
//                   <p className="py-1 underline">
//                     {device.label || `Device ${(key + 1).toString()}`}
//                   </p>{" "}
//                 </div>
//               </div>
//             </li>
//           );
//         })
//       )}
//     </ul>
//   );
// }

// export default CameraList;
