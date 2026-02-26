import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from "@/components/ui/toaster";
// 1. הוסף את הייבוא הזה:
import TextReaderWidget from './TextReaderWidget'; 

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      
      <aside className="hidden md:flex md:w-64 flex-shrink-0 md:border-l border-slate-200 bg-white z-20">
        <Navbar />
      </aside>

      <div className="md:hidden fixed z-50 top-4 right-4">
        <Navbar mobileOnly={true} />
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 w-full">
        <Outlet />
      </main>

      <Toaster />
      
      {/* 2. הוסף את הקומפוננטה כאן בסוף (מחוץ ל-main) */}
      <TextReaderWidget />
      
    </div>
  );
}