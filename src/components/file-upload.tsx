'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FileUpload() {
   const [files, setFiles] = useState<File[]>([]);
   const [loadingSendButton, setLoadingSendButton] = useState(false);
   const [documentNumber, setDocumentNumber] = useState<string>('');
   const [backendError, setBackendError] = useState<string | null>(null);
   const [perfil, setPerfil] = useState<string>('balanceado'); // Nuevo estado

   const router = useRouter();

   const onDrop = useCallback(async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
         setFiles(acceptedFiles);
      }
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      },
      maxFiles: 1,
      multiple: false,
   });

   const handleSend = async () => {
      console.log('CLICK ENVIAR');
      setBackendError(null);

      if (files.length === 0 || !documentNumber) {
         setBackendError('No hay archivos para enviar o el número de documento no está rellenado');
         return;
      }

      const file = files[0];
      const newFileName = `${documentNumber}-BASE.xlsx`;

      try {
         setLoadingSendButton(true);

         const formData = new FormData();
         formData.append('file', file, newFileName);
         formData.append('documentNumber', documentNumber);
         formData.append('perfil', perfil); // Enviar el perfil al backend

         const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
         });

         let data = null;
         try {
            data = await response.json();
            console.log('Respuesta del backend:', data);
         } catch (e) {
            setBackendError('El backend no devolvió una respuesta válida.');
            return;
         }

         if (!response.ok || !data || !data.document_number) {
            setBackendError(data?.error || `Error al subir el archivo: ${response.statusText}`);
            return;
         }

         setFiles([]);
         setDocumentNumber('');

         // Guarda los datos en localStorage
         localStorage.setItem('resultados', JSON.stringify(data.resultados));
         localStorage.setItem('metricas', JSON.stringify(data.metricas));
         localStorage.setItem('columnas', JSON.stringify(data.columns));
         localStorage.setItem('cartilla', JSON.stringify(data.cartilla));

         // Redirige solo con el document_number
         router.push(`/resultados?document_number=${data.document_number}`);
      } catch (error: any) {
         setBackendError('Error manejando el archivo: ' + (error?.message || error));
         console.error('Error manejando el archivo:', error);
      } finally {
         setLoadingSendButton(false);
      }
   };

   return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-black">
               Análisis Geométrico de aceros
            </h1>
            <p className="text-gray-600 text-lg">
               Optimiza los patrones de corte aplicando el método Búfalo para
               reducir el desperdicio de material. ¡Rápido y fácil!
            </p>
         </div>

         <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors ${
               isDragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-500'
            }`}
         >
            <input {...getInputProps()} />

            <Button
               size="lg"
               className="bg-green-700 hover:bg-green-900 mb-4 text-lg px-8 py-6 h-auto rounded-2xl"
            >
               <Upload className="mr-2 h-5 w-5" />
               Seleccionar archivo XLSX
            </Button>

            <p className="text-gray-500">o arrastra y suelta el archivo aquí</p>

            {files.length > 0 && (
               <div className="mt-6 w-full">
                  <h3 className="font-medium mb-2 text-gray-400">
                     Archivo seleccionado:
                  </h3>
                  <ul className="space-y-2">
                     {files.map((file, index) => (
                        <li
                           key={index}
                           className="bg-gray-200 text-gray-400 p-3 rounded-lg text-sm flex items-center"
                        >
                           {file.name}
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>

         <div className="mt-8 text-center">
            <div className="mb-4">
               <input
                  type="text"
                  value={documentNumber}
                  onChange={e => {
                     const value = e.target.value;
                     if (/^\d*$/.test(value)) {
                        setDocumentNumber(value);
                     }
                  }}
                  placeholder="Número de documento (Para identificar el archivo)"
                  className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>

            {/* Selector de método de optimización */}
            <div className="mb-4">
               <label className="block mb-2 font-semibold text-gray-700">
                  Método de optimización
               </label>
               <select
                  value={perfil}
                  onChange={e => setPerfil(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
               >
                  <option value="balanceado">Balanceado (recomendado)</option>
                  <option value="rapido">Rápido</option>
                  <option value="intensivo">Intensivo</option>
               </select>
            </div>

            <Button
               size="lg"
               onClick={handleSend}
               className="bg-blue-600 hover:bg-blue-800 text-lg px-8 py-4 rounded-lg"
               disabled={
                  files.length === 0 || !documentNumber || loadingSendButton
               }
               loading={loadingSendButton}
            >
               Enviar
            </Button>

            {backendError && (
               <div className="mt-4 text-red-600 font-semibold">
                  {backendError}
               </div>
            )}
         </div>
      </div>
   );
}