'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Resultado {
  [key: string]: string | number;
}

interface Metricas {
  [key: string]: string | number;
}

interface Columna {
  name: string;
  type?: string;
}

interface Cartilla {
  [key: string]: string | number;
}

function ResultadosContent() {
  const searchParams = useSearchParams();
  const document_number = searchParams.get('document_number') || '';
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [metricas, setMetricas] = useState<Metricas>({});
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [cartilla, setCartilla] = useState<Cartilla[]>([]);
  const [loading, setLoading] = useState(false); // Estado para el loader

  // Recupera los datos de localStorage al montar el componente
  useEffect(() => {
    setResultados(JSON.parse(localStorage.getItem('resultados') || '[]'));
    setMetricas(JSON.parse(localStorage.getItem('metricas') || '{}'));
    setColumnas(JSON.parse(localStorage.getItem('columnas') || '[]'));
    setCartilla(JSON.parse(localStorage.getItem('cartilla') || '[]'));
  }, []);

  const handleDownloadPDF = async () => {
    if (!document_number || !resultados.length || !metricas || !columnas.length) {
      alert('Faltan datos para generar el PDF.');
      return;
    }
    setLoading(true); // Mostrar loader
    try {
      const bodyData: {
        resultados: Resultado[];
        metricas: Metricas;
        columnas: Columna[];
        document_number: string;
        cartilla?: Cartilla[];
      } = {
        resultados,
        metricas,
        columnas,
        document_number,
      };
      if (cartilla && cartilla.length > 0) {
        bodyData.cartilla = cartilla;
      }
      const response = await fetch('http://localhost:5000/descargar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('No se pudo generar el PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan_corte_${document_number || 'descarga'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Limpia localStorage después de descargar el PDF
      localStorage.removeItem('resultados');
      localStorage.removeItem('metricas');
      localStorage.removeItem('columnas');
      localStorage.removeItem('cartilla');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('No se pudo descargar el PDF: ' + errorMessage);
    } finally {
      setLoading(false); // Ocultar loader
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-bold mb-8 text-green-700">¡Análisis completado!</h2>
      <Button
        size="lg"
        className="bg-green-700 hover:bg-green-900 text-xl px-12 py-8 rounded-2xl mb-6"
        onClick={handleDownloadPDF}
        disabled={loading}
      >
        {loading ? 'Generando PDF...' : 'Descargar PDF'}
      </Button>
      {loading && (
        <div className="flex flex-col items-center mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mb-2"></div>
          <span className="text-green-700 font-semibold">Generando y descargando PDF, por favor espere...</span>
        </div>
      )}
      <p className="text-gray-600 text-lg">Haz clic en el botón para descargar tu reporte optimizado en PDF.</p>
    </div>
  );
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]">Cargando...</div>}>
      <ResultadosContent />
    </Suspense>
  );
}