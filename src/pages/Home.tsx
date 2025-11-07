import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function Home() {
  const [firstClick, setFirstClick] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);

    // Primeiro clique
    if (!firstClick) {
      setFirstClick(Date.now());
      setMessage("Clique novamente o mais rápido possível!");
      setLastResult(null);
      return;
    }

    // Segundo clique
    const elapsed = Date.now() - firstClick;
    setFirstClick(null);
    setLoading(true);
    setMessage(`Tempo registrado: ${elapsed} ms. Salvando...`);

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elapsedMs: elapsed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Erro ${res.status}`);
      }

      const data = await res.json();
      setLastResult(data.elapsedMs);
      setMessage("Registro salvo com sucesso!");
    } catch (e: any) {
      setError(e.message || "Erro ao salvar registro");
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  function resetState() {
    setFirstClick(null);
    setMessage("");
    setLastResult(null);
    setError(null);
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Registrar Fast Double-Click</h1>
        <p className="text-sm text-slate-600">
          Clique no botão abaixo duas vezes. O sistema mede o tempo entre os cliques e envia o
          resultado para o back-end, que salva em <code>registros.json</code>.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full max-w-xs rounded-2xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {firstClick ? "Clique novamente!" : "Clique duas vezes"}
        </button>

        <div className="text-sm space-y-1">
          {message && <p className="text-slate-700">{message}</p>}
          {lastResult !== null && (
            <p className="text-emerald-700">
              Último tempo salvo: <strong>{lastResult} ms</strong>
            </p>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </div>

        {(lastResult !== null || firstClick || error) && (
          <button
            onClick={resetState}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Limpar e começar de novo
          </button>
        )}
      </div>
    </section>
  );
}
