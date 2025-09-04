"use client";
import React, { useState } from "react";

export default function ContactUs() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const isFormComplete = nombre.trim() && correo.trim() && mensaje.trim();

  return (
    <div className="flex flex-col items-center bg-white pt-12 pb-8 min-h-screen">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">Contáctanos</h1>
        <p className="mb-6 text-center text-gray-700 font-medium">
          ¿Tienes dudas, sugerencias o necesitas soporte? ¡Escríbenos!
        </p>
        <div className="bg-white p-6 rounded shadow-md flex flex-col md:flex-row gap-6 justify-center">
          {/* Persona 1 */}
          <ul className="mb-4 flex-1">
            <li className="mb-2">
              <strong className="font-bold text-black">Email:</strong>{" "}
              <span className="text-black">Cristiandaniel8080@gmail.com</span>
            </li>
            <li className="mb-2">
              <strong className="font-bold text-black">Teléfono:</strong>{" "}
              <span className="text-black">+57 3112499796</span>
            </li>
            <li>
              <strong className="font-bold text-black">Ciudad:</strong>{" "}
              <span className="text-black">Neiva, Huila</span>
            </li>
          </ul>
          {/* Persona 2 */}
          <ul className="mb-4 flex-1">
            <li className="mb-2">
              <strong className="font-bold text-black">Email:</strong>{" "}
              <span className="text-black">Lizethgasca990@hotmail.com</span>
            </li>
            <li className="mb-2">
              <strong className="font-bold text-black">Teléfono:</strong>{" "}
              <span className="text-black">+57 3208718308</span>
            </li>
            <li>
              <strong className="font-bold text-black">Ciudad:</strong>{" "}
              <span className="text-black">Neiva, Huila</span>
            </li>
          </ul>
        </div>
        {/* Formulario más junto a la información */}
        <div className="bg-white p-6 rounded shadow-md mt-4">
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tu nombre"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Tu correo"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <textarea
              placeholder="Tu mensaje"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              rows={4}
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`bg-green-500 text-white py-2 rounded hover:bg-green-600 ${!isFormComplete ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isFormComplete}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}