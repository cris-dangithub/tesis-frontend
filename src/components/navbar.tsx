import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavButton from './ui/nav-button';

export function Navbar() {
   // get current url from the

   return (
      <>
         {/* <div className='mb-[24px] bg-blue-200'></div> */}
         <nav className="border-b !bg-gray-100 fixed top-0 left-0 w-full z-10">
            <div className="flex h-16 items-center px-4 container mx-auto">
               <Link
                  href="/about"
                  className="flex items-center gap-2 font-semibold text-xl text-black"
               >
                  <Heart className="h-6 w-6 fill-green-500 text-green-500" />
               </Link>

               <div className="flex items-center gap-6 mx-6">
                  <NavButton to="/about" status="inactive" content="INICIO" />
                  <NavButton to="/" status="active" content="SUBIR CARTILLA" />
                  <NavButton
                     to="/results"
                     status="inactive"
                     content="DESCARGAR RESULTADOS"
                  />
                  <NavButton
                     to="/tutorial"
                     status="inactive"
                     content="TUTORIAL"
                  />
                  <NavButton
                     to="/countact-us"
                     status="inactive"
                     content="CONTACTANOS"
                  />
                  {/* <div className="relative group">
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1">
                     CONVERTIR PDF
                     <span className="text-xs">▼</span>
                  </button>
               </div>
               <div className="relative group">
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1">
                     TODAS LAS HERRAMIENTAS PDF
                     <span className="text-xs">▼</span>
                  </button>
               </div> */}
               </div>

               {/* <div className="ml-auto flex items-center gap-4">
               <Button variant="outline">Acceder</Button>
               <Button className="bg-red-500 hover:bg-red-600">Registro</Button>
            </div> */}
            </div>
         </nav>
      </>
   );
}
