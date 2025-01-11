'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function FileUpload() {
   const [files, setFiles] = useState<File[]>([]);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'application/pdf': ['.pdf'],
      },
   });

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
            className={`
               border-2 border-dashed rounded-lg p-12
               flex flex-col items-center justify-center
               transition-colors
               ${
                  isDragActive
                     ? 'border-green-500 bg-green-50'
                     : 'border-gray-300 hover:border-green-500'
               }
            `}
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
                  <h3 className="font-medium mb-2 text-gray-400">Archivo seleccionado:</h3>
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
      </div>
   );
}
