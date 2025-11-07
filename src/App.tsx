import { Link, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Registros from "./pages/Registros";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <span className="font-semibold text-slate-900">Fast Double-Click</span>
        <div className="flex gap-3 text-sm">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg ${
              isHome ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Registrar clique
          </Link>
          <Link
            to="/registros"
            className={`px-3 py-1.5 rounded-lg ${
              !isHome ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Ver registros
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registros" element={<Registros />} />
        </Routes>
      </main>
    </div>
  );
}
