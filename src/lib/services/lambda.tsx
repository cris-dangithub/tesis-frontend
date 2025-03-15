import { BUCKET_NAME, URL_RPESIGNED_SERVICE } from '../constants/services';

type PreSignedURLManagerEvents = 'post-presigned-url' | 'get-presigned-url';
interface PreSignedURLManagerServiceProps {
   event_name: PreSignedURLManagerEvents;
   object_key: string;
}
interface PreSignedURLManagerServiceResponse {
   url: string;
   fields: {
      [key: string]: string;
   };
}
export const PresignedURLManagerService = async ({
   event_name,
   object_key,
}: PreSignedURLManagerServiceProps) => {
   try {
      // Llama a la Lambda para obtener la URL prefirmada y los campos adicionales
      const response = await fetch(URL_RPESIGNED_SERVICE, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            type: event_name, // Campo requerido para identificar el tipo de operación
            bucket_name: BUCKET_NAME, // Cambia esto por tu bucket
            object_key: object_key, // Usar el nuevo nombre del archivo
         }),
      });

      if (!response.ok) {
         throw new Error(
            `Error al obtener la URL prefirmada: ${response.statusText}`
         );
      }

      const data: PreSignedURLManagerServiceResponse = await response.json();
      return data;
   } catch (error) {
      console.error('Error in PresignedURLManagerService:', error);
   }
};
