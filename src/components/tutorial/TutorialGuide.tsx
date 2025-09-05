"use client";
import React from "react";
import Link from "next/link";
import { Home, Upload, Loader2, Download, BookOpen, Mail } from "lucide-react";

const pasos = [
  {
    titulo: "Ir a la página principal",
    descripcion: "Haz clic en 'INICIO' en la barra de navegación para regresar a la página principal en cualquier momento.",
    icon: <Home className="h-8 w-8 text-green-500" />,
  },
  {
    titulo: "Subir tu cartilla",
    descripcion: "Selecciona 'SUBIR CARTILLA' en la barra de navegación. Haz clic en el botón para seleccionar tu archivo PDF o imagen y súbelo.",
    icon: <Upload className="h-8 w-8 text-blue-500" />,
  },
  {
    titulo: "Esperar el procesamiento",
    descripcion: "La página procesará tu archivo. Espera unos segundos hasta que veas la confirmación de que el archivo fue subido correctamente.",
    icon: <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />,
  },
  {
    titulo: "Descargar resultados",
    descripcion: "Haz clic en 'DESCARGAR RESULTADOS' para ver y descargar los archivos generados por la plataforma.",
    icon: <Download className="h-8 w-8 text-purple-500" />,
  },
  {
    titulo: "Consultar el tutorial",
    descripcion: "Si tienes dudas, vuelve a esta sección haciendo clic en 'TUTORIAL'. Aquí encontrarás la guía paso a paso.",
    icon: <BookOpen className="h-8 w-8 text-pink-500" />,
  },
  {
    titulo: "Contactar soporte",
    descripcion: "Si necesitas ayuda adicional, haz clic en 'CONTACTANOS' para enviar tus preguntas o comentarios.",
    icon: <Mail className="h-8 w-8 text-red-500" />,
  },
];

const glosario = [
  {
    termino: "Cartilla",
    definicion: "Documento PDF o imagen que contiene la información a procesar.",
  },
  {
    termino: "Resultados",
    definicion: "Archivos generados por la plataforma después de procesar tu cartilla.",
  },
  {
    termino: "Soporte",
    definicion: "Ayuda o asistencia técnica proporcionada por el equipo de la plataforma.",
  },
];

const faqs = [
  {
    pregunta: "¿Qué tipo de archivos puedo subir?",
    respuesta: "Puedes subir archivos en formato PDF o imagen (JPG, PNG).",
  },
  {
    pregunta: "¿Cuánto tarda el procesamiento?",
    respuesta: "Normalmente solo unos segundos, dependiendo del tamaño del archivo.",
  },
  {
    pregunta: "¿Dónde descargo mis resultados?",
    respuesta: "En la sección 'DESCARGAR RESULTADOS' de la barra de navegación.",
  },
];

export default function TutorialGuide() {
  return (
    <section className="max-w-3xl mx-auto mt-24 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-800">
        <span className="text-green-600">Tutorial</span> de Uso
      </h1>
      <div className="grid gap-8">
        {pasos.map((paso, idx) => (
          <div
            key={idx}
            className="flex items-start gap-5 bg-gray-50 rounded-lg p-5 shadow transition hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex-shrink-0">{paso.icon}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-1">
                {idx + 1}. {paso.titulo}
              </h2>
              <p className="text-gray-600">{paso.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center text-base text-gray-500">
        ¿Tienes más dudas?{" "}
        <Link
          href="/contact-us"
          className="font-semibold text-green-600 underline hover:text-green-800 transition"
        >
          Escríbenos
        </Link>{" "}
        en la sección de contacto.
      </div>

      {/* Glosario */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Glosario</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          {glosario.map((item, idx) => (
            <li key={idx}>
              <span className="font-semibold text-gray-800">{item.termino}:</span> {item.definicion}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Preguntas Frecuentes</h2>
        <div className="space-y-3 text-gray-600">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <span className="font-semibold text-gray-800">{faq.pregunta}</span>
              <br />
              {faq.respuesta}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}