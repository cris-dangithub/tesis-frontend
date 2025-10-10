'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { PresignedURLManagerService } from '@/lib/services/lambda';
import { FilesService, FileInfo } from '@/lib/services/files';

export function FileUpload() {
   const [files, setFiles] = useState<File[]>([]);
   const [loadingSendButton, setLoadingSendButton] = useState(false);
   const [alternativeName, setAlternativeName] = useState<string>(''); 
   const [existingFiles, setExistingFiles] = useState<FileInfo[]>([]);
   const [fileConflict, setFileConflict] = useState<boolean>(false);
   const [suggestedName, setSuggestedName] = useState<string>('');

   // Load existing files on component mount
   useEffect(() => {
      loadExistingFiles();
   }, []);

   const loadExistingFiles = async () => {
      try {
         const response = await FilesService.getFiles();
         setExistingFiles(response.files);
      } catch (error) {
         console.error('Error loading existing files:', error);
      }
   };

   const onDrop = useCallback(async (acceptedFiles: File[]) => {
      console.log({ acceptedFiles });
      if (acceptedFiles.length > 0) {
         setFiles(acceptedFiles);
         checkFileConflict(acceptedFiles[0]);
      }
   }, [existingFiles]);

   const checkFileConflict = (file: File) => {
      const existingFileNames = existingFiles.map(f => f.name);
      const hasConflict = existingFileNames.includes(file.name);
      
      setFileConflict(hasConflict);
      
      if (hasConflict) {
         const suggested = FilesService.generateSafeName(file.name, existingFileNames);
         setSuggestedName(suggested);
         setAlternativeName(suggested);
      } else {
         setSuggestedName('');
         setAlternativeName('');
      }
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'application/xlsx': ['.xlsx'],
      },
      maxFiles: 1,
      multiple: false,
   });

   const handleSend = async () => {
      if (files.length === 0) {
         console.log('No hay archivos para enviar');
         return;
      }

      if (fileConflict && !alternativeName.trim()) {
         alert('Debe proporcionar un nombre alternativo para el archivo');
         return;
      }

      // Use local upload instead of cloud upload
      await handleLocalUpload();
   };

   // Cloud upload function (preserved but not used)
   const handleCloudUpload = async () => {
      if (files.length === 0) {
         console.log('No hay archivos para enviar');
         return;
      }

      const file = files[0];
      const newFileName = alternativeName.trim() || file.name;

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
         setAlternativeName(''); // Limpiar el campo del nombre alternativo
         console.log('Archivo subido con éxito a S3');
      } catch (error) {
         console.error('Error manejando el archivo:', error);
      } finally {
         setLoadingSendButton(false);
      }
   };

   // Local upload function
   const handleLocalUpload = async () => {
      if (files.length === 0) {
         console.log('No hay archivos para enviar');
         return;
      }

      const file = files[0];

      try {
         setLoadingSendButton(true);

         // Create FormData for local upload
         const formData = new FormData();
         formData.append('file', file);
         
         if (alternativeName.trim()) {
            formData.append('alternativeName', alternativeName.trim());
         }

         // Upload to local backend
         const uploadResponse = await fetch('http://localhost:5050/upload', {
            method: 'POST',
            body: formData,
         });

         if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.message || `Error al subir el archivo: ${uploadResponse.statusText}`);
         }

         const responseData = await uploadResponse.json();
         
         setFiles([]);
         setAlternativeName(''); // Limpiar el campo del nombre alternativo
         setFileConflict(false);
         setSuggestedName('');
         
         // Reload existing files to update the list
         await loadExistingFiles();
         
         console.log('Archivo subido con éxito al servidor local:', responseData);
         
         // You can add a success message here if needed
         alert('Archivo subido exitosamente');
         
      } catch (error) {
         console.error('Error subiendo archivo:', error);
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
         alert(`Error: ${errorMessage}`);
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
                  
                  {fileConflict && (
                     <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm mb-2">
                           ⚠️ Ya existe un archivo con este nombre. Debe proporcionar un nombre alternativo.
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>

         <div className="mt-8 text-center">
            {fileConflict && (
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Nombre alternativo (requerido)
                  </label>
                  <input
                     type="text"
                     value={alternativeName}
                     onChange={(e) => setAlternativeName(e.target.value)}
                     placeholder="Ingrese un nombre alternativo para el archivo"
                     className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {suggestedName && (
                     <p className="text-xs text-gray-500 mt-1">
                        Sugerencia: {suggestedName}
                     </p>
                  )}
               </div>
            )}

            <Button
               size="lg"
               onClick={handleSend}
               className="bg-blue-600 hover:bg-blue-800 text-lg px-8 py-4 rounded-lg"
               disabled={
                  files.length === 0 || 
                  (fileConflict && !alternativeName.trim()) || 
                  loadingSendButton
               }
               loading={loadingSendButton}
            >
               Enviar
            </Button>
         </div>
      </div>
   );
}
