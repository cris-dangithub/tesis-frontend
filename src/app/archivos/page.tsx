'use client';

import { useState, useEffect } from 'react';
import { FilesService, FileInfo } from '@/lib/services/files';

export default function ArchivosPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FilesService.getFiles();
      setFiles(response.files);
    } catch (error) {
      console.error('Error loading files:', error);
      setError(error instanceof Error ? error.message : 'Error cargando archivos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando archivos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={loadFiles}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-black">
          Archivos Subidos
        </h1>
        <p className="text-gray-600">
          Lista de archivos disponibles en el sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Total: {files.length} archivo{files.length !== 1 ? 's' : ''}
            </h2>
            <button 
              onClick={loadFiles}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Actualizar
            </button>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-lg">No hay archivos subidos</p>
            <p className="text-gray-400 mt-2">
              Ve a la sección "SUBIR CARTILLA" para agregar archivos
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {files.map((file, index) => {
              const extension = file.name.split('.').pop()?.toUpperCase() || '';
              const formattedDate = FilesService.formatDate(file.modified);
              const sizeInKB = Math.round(file.size / 1024);
              
              return (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {extension}
                        </span>
                        <span>{sizeInKB} KB</span>
                        <span>Subido: {formattedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Future: Add download, process, delete buttons here */}
                      <div className="text-green-600 text-sm font-medium">
                        Disponible
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}