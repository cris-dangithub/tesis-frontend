export interface FileInfo {
  name: string;
  size: number;
  modified: string;
}

export interface FilesResponse {
  files: FileInfo[];
  total: number;
  accepted_formats: string[];
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:5000';

export class FilesService {
  static async getFiles(): Promise<FilesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/files`);
      
      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in FilesService.getFiles:', error);
      throw error;
    }
  }

  static async uploadFile(file: File, alternativeName?: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (alternativeName) {
        formData.append('alternativeName', alternativeName);
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error uploading file: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in FilesService.uploadFile:', error);
      throw error;
    }
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  static generateSafeName(originalName: string, existingFiles: string[]): string {
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    
    let counter = 2;
    let newName = `${nameWithoutExt}_${counter}${extension}`;
    
    while (existingFiles.includes(newName)) {
      counter++;
      newName = `${nameWithoutExt}_${counter}${extension}`;
    }
    
    return newName;
  }
}