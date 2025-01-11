import { Navbar } from '@/components/navbar';
import { FileUpload } from '@/components/file-upload';

export default function Page() {
   return (
      <main className="min-h-screen bg-white">
         {/* <Navbar /> */}
         <FileUpload />
      </main>
   );
}
