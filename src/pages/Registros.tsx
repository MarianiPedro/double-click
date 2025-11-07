import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

type Registro = {
  id: number;
  elapsedMs: number;
  createdAt: string; // ISO
};

type SortField = "date" | "time";
type SortDir = "asc" | "desc";

export default function Registros() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/registers`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data: Registro[] = await res.json();
        setRegistros(data);
      } catch (e: any) {
        setError(e.message || "Erro ao carregar registros");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = [...registros];

    // filtro por intervalo de datas
    if (fromDate) {
      const from = new Date(fromDate + "T00:00:00");
      list = list.filter((r) => new Date(r.createdAt) >= from);
    }
    if (toDate) {
      const to = new Date(toDate + "T23:59:59");
      list = list.filter((r) => new Date(r.createdAt) <= to);
    }

    // ordenação
    list.sort((a, b) => {
      let comp = 0;
      if (sortField === "date") {
        comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comp = a.elapsedMs - b.elapsedMs;
      }
      return sortDir === "asc" ? comp : -comp;
    });

    return list;
  }, [registros, fromDate, toDate, sortField, sortDir]);

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Registros de cliques</h1>
        <p className="text-sm text-slate-600">
          Lista de todos os tempos registrados, com opções de filtro por data e ordenação.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-end text-sm">
        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Data inicial</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-9 rounded-lg border px-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Data final</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-9 rounded-lg border px-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Ordenar por</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="h-9 rounded-lg border px-2"
          >
            <option value="date">Data/Hora</option>
            <option value="time">Tempo (ms)</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Direção</label>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
            className="h-9 rounded-lg border px-2"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setSortField("date");
            setSortDir("asc");
          }}
          className="text-xs text-slate-500 hover:text-slate-800 underline"
        >
          Limpar filtros
        </button>
      </div>

      {loading && <p className="text-sm text-slate-600">Carregando registros...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl bg-white shadow border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Data/Hora</th>
                <th className="px-3 py-2 text-left">Tempo (ms)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
              {filteredAndSorted.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-2">{r.elapsedMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
