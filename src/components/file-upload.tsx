'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { PresignedURLManagerService } from '@/lib/services/lambda';
import { BUCKET_NAME } from '@/lib/constants/services';

export function FileUpload() {
   const [files, setFiles] = useState<File[]>([]);
   const [loadingSendButton, setLoadingSendButton] = useState(false);
   const [documentNumber, setDocumentNumber] = useState<string>(''); // Estado para el número de documento

   const onDrop = useCallback(async (acceptedFiles: File[]) => {
      console.log({ acceptedFiles });
      if (acceptedFiles.length > 0) {
         setFiles(acceptedFiles);
      }
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'application/xlsx': ['.xlsx'],
      },
      maxFiles: 1,
      multiple: false,
   });

   const handleSend = async () => {
      if (files.length === 0 || !documentNumber) {
         console.log(
            'No hay archivos para enviar o el número de documento no está rellenado'
         );
         return;
      }

      const file = files[0];
      const newFileName = `${documentNumber}-BASE.xlsx`; // Nuevo nombre del archivo

      try {
         setLoadingSendButton(true);
         const presignedURLResponse = await PresignedURLManagerService({
            event_name: 'post-presigned-url',
            object_key: `BASE/${newFileName}`,
         });
         if (!presignedURLResponse) {
            throw new Error('Error al obtener la URL prefirmada');
         }

         const { url, fields } = presignedURLResponse; // Asegúrate de que la respuesta incluya "url" y "fields"

         // Crea un objeto FormData y agrega los campos adicionales
         const formData = new FormData();
         Object.keys(fields).forEach(key => {
            formData.append(key, fields[key]);
         });

         // Agrega el archivo al FormData con la clave "file"
         formData.append('file', file, newFileName); // Usar el nuevo nombre del archivo

         // Sube el archivo a S3 usando la URL prefirmada y el FormData
         const uploadResponse = await fetch(url, {
            method: 'POST', // Usa POST si la URL prefirmada lo requiere
            body: formData,
         });

         if (!uploadResponse.ok) {
            throw new Error(
               `Error al subir el archivo: ${uploadResponse.statusText}`
            );
         }

         setFiles([]);
         setDocumentNumber(''); // Limpiar el campo del número de documento
         console.log('Archivo subido con éxito a S3');
      } catch (error) {
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
                        // Solo permite números
                        setDocumentNumber(value);
                     }
                  }}
                  placeholder="Número de documento (Para identificar el archivo)"
                  className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
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
         </div>
      </div>
   );
}
