'use client';
import { useFormContext } from 'react-hook-form';

export function Step6Summary() {
  const { watch } = useFormContext();
  const data = watch();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Resumo do Livro de Dia</h2>

      <div className="border-t pt-2 space-y-2">
        <p><strong>Data:</strong> {data.data}</p>
        <p><strong>Unidade:</strong> {data.unidade}</p>
        <p><strong>Comandante:</strong> {data.comandante}</p>
        {data.observacoes && <p><strong>Observações:</strong> {data.observacoes}</p>}
      </div>

      <div>
        <h3 className="font-medium mt-4">Carga do Quartel</h3>
        {data.carga?.length ? (
          <ul className="list-disc pl-5">
            {data.carga.map((c: any, i: number) => (
              <li key={i}>
                {c.tipo} - {c.descricao} ({c.quantidade})
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">Nenhum item cadastrado.</p>}
      </div>

      <div>
        <h3 className="font-medium mt-4">Ocorrências Administrativas</h3>
        {data.adm?.length ? (
          <ul className="list-disc pl-5">
            {data.adm.map((a: any, i: number) => (
              <li key={i}>{a.tipo}: {a.descricao}</li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">Nenhuma ocorrência administrativa.</p>}
      </div>

      <div>
        <h3 className="font-medium mt-4">Ocorrências Operacionais</h3>
        {data.oper?.length ? (
          <ul className="list-disc pl-5">
            {data.oper.map((o: any, i: number) => (
              <li key={i}>{o.natureza} - {o.local}: {o.resultado}</li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">Nenhuma ocorrência operacional.</p>}
      </div>

      <div>
        <h3 className="font-medium mt-4">Juntada</h3>
        {data.juntada?.length ? (
          <ul className="list-disc pl-5">
            {data.juntada.map((j: any, i: number) => (
              <li key={i}>{j.documento} — {j.observacao}</li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">Nenhuma juntada registrada.</p>}
      </div>
    </div>
  );
}
