'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Graduations, Situations } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  name_situation: z.string().min(3, 'nome da situação é obrigatório'),
  group: z.string().min(2, 'grupo da situação é obrigatório'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Situations;
  isEditing?: boolean;
}

export function SituationForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  // console.log(isEditing);


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
      name_situation: '',
      group: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        name_situation: initialData.name_situation || '',
        group: initialData.group || '',
      });
      // if (initialData.data_nascimento) {
      //   setSelectedDate(new Date(initialData.data_nascimento));
      // }
    } else {
      reset({
        name_situation: '',
        group: '',
      });
      setSelectedDate(new Date());
    }
  }, [isEditing, initialData, reset]);

  // 📤 Submissão
  const onSubmit = async (data: z.infer<typeof peopleSchema>) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
      };

      // console.log(payload);
      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/situation/${initialData._id}`, payload);
        toast.success('Permissão atualizada com sucesso!');
      } else {
        await myApi.post('/api/situation/', payload);
        toast.success('Permissão criada com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar permissão:', error);
      toast.error('Erro ao salvar permissão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Dados do posto/graduação' : 'Cadastro de posto/graduação'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações de posto/graduação.' : 'Adicione um novo posto/graduação.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome da situação</Label>
            <Input {...register('name_situation')} placeholder="Digite o nome" />
            {errors.name_situation && <p className="text-red-500 text-sm">{errors.name_situation.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Grupo da situação</Label>
              <Select onValueChange={(v) => setValue('group', v)} value={String((watch('group') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">ATIVO</SelectItem>
                  <SelectItem value="Inativo">INATIVO</SelectItem>
                  <SelectItem value="Reconvocado">RECONVOCADO</SelectItem>
                </SelectContent>
              </Select>
              {errors.group && <p className="text-red-500 text-sm">{errors.group.message}</p>}
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
