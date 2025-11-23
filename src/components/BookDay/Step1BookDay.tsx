'use client';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Step1BookDay() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label>Data do Livro</Label>
        <Input type="date" {...register('data')} />
        {errors.data && <p className="text-red-500 text-sm">{errors.data.message}</p>}
      </div>

      <div>
        <Label>Unidade</Label>
        <Input {...register('unidade')} placeholder="Ex: 1º BPM" />
        {errors.unidade && <p className="text-red-500 text-sm">{errors.unidade.message}</p>}
      </div>

      <div>
        <Label>Comandante de Dia</Label>
        <Input {...register('comandante')} placeholder="Nome do comandante" />
        {errors.comandante && <p className="text-red-500 text-sm">{errors.comandante.message}</p>}
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea {...register('observacoes')} placeholder="Observações gerais..." />
      </div>
    </div>
  );
}
