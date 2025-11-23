'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OpOccurrences } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { Textarea } from '../ui/textarea';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  prefixo: z.string().min(1, 'prefixo é obrigatório'),
  informacao: z.string().min(3, 'informação é obrigatório'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: OpOccurrences;
  isEditing?: boolean;
  id_bookday: string
}

export function Step4OpOccurrences({ id_bookday, isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [loading, setLoading] = useState(false);
  const prefixes = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
    { value: 'H', label: 'H' },
    { value: 'I', label: 'I' },
    { value: 'J', label: 'J' },
    { value: 'K', label: 'K' },
    { value: 'L', label: 'L' },
    { value: 'M', label: 'M' },
    { value: 'N', label: 'N' },
    { value: 'O', label: 'O' },
    { value: 'P', label: 'P' },
    { value: 'Q', label: 'Q' },
    { value: 'R', label: 'R' },
    { value: 'S', label: 'S' },
    { value: 'T', label: 'T' },
    { value: 'U', label: 'U' },
    { value: 'V', label: 'V' },
    { value: 'W', label: 'W' },
    { value: 'X', label: 'X' },
    { value: 'Y', label: 'Y' },
    { value: 'Z', label: 'Z' },
  ]

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof peopleSchema>>({
    resolver: zodResolver(peopleSchema),
    defaultValues: {
      prefixo: '',
      informacao: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        prefixo: initialData.prefixo || '',
        informacao: initialData.informacao || '',
      });
    } else {
      reset({
        prefixo: '',
        informacao: '',
      });
    }
  }, [isEditing, initialData, reset]);

  // 📤 Submissão
  const onSubmit = async (data: z.infer<typeof peopleSchema>) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        id_livro: id_bookday,
      };

      // console.log(payload);
      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/operationalOccurences/${initialData._id}`, payload);
        toast.success('Ocorrencia operacional atualizada com sucesso!');
      } else {
        await myApi.post('/api/operationalOccurences/', payload);
        toast.success('Ocorrencia operacional criada com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar permissão:', error);
      toast.error('Erro ao salvar ocorrência operacional.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Dados da carga das ocorrencias operacionais' : 'Cadastro das ocorrencias operacionais'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações das ocorrencias operacionais.' : 'Adicione uma nova ocorrencia operacional.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Prefixo</Label>
            <Select onValueChange={(v) => setValue('prefixo', v)} value={String((watch('prefixo') || ''))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {prefixes.map((prefix) => (
                  <SelectItem key={prefix.value} value={prefix.value}>{prefix.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.prefixo && <p className="text-red-500 text-sm">{errors.prefixo.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Informação da carga</Label>
              <Textarea {...register('informacao')} placeholder="Digite a informação da carga" />
              {errors.informacao && <p className="text-red-500 text-sm">{errors.informacao.message}</p>}
            </div>
          </div>
          {/* Botões */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
