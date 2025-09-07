"use client";
import React from "react";

export default function ContactUs() {
  return (
    <div className="flex flex-col items-center bg-white pt-12 pb-8 min-h-screen">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">Contáctanos</h1>
        <p className="mb-6 text-center text-gray-700 font-medium">
          ¿Tienes dudas, sugerencias o necesitas soporte? ¡Escríbenos!
        </p>
        <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-6 justify-center">
          <ul className="mb-4 flex-1 text-center">
            <li className="mb-2">
              <strong className="font-bold text-black">Email:</strong>{" "}
              <span className="text-black">Lizethgasca990@gmail.com</span>
            </li>
            <li>
              <strong className="font-bold text-black">Ciudad:</strong>{" "}
              <span className="text-black">Neiva, Huila</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded shadow-md mt-4">
          <form
            className="flex flex-col gap-4"
            action="https://formspree.io/f/mvgbdwvk" //Link for Formspree
            method="POST"
          >
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              required
            />
            <input
              type="email"
              name="correo"
              placeholder="Tu correo"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              required
            />
            <textarea
              name="mensaje"
              placeholder="Tu mensaje"
              className="border-2 border-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-black placeholder:text-gray-600"
              rows={4}
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}