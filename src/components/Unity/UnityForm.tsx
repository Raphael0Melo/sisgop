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
import { Unitys } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  name_unity: z.string().min(3, 'nome da unidade é obrigatório'),
  sigla_unity: z.string().min(3, 'sigla da unidade é obrigatório'),
  level: z.string().min(1, 'nível da unidade é obrigatório'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Unitys;
  isEditing?: boolean;
}

export function UnityForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
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
      name_unity: '',
      sigla_unity: '',
      level: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        name_unity: initialData.name_unity || '',
        sigla_unity: initialData.sigla_unity || '',
        level: initialData.level || '',
      });
      // if (initialData.data_nascimento) {
      //   setSelectedDate(new Date(initialData.data_nascimento));
      // }
    } else {
      reset({
        name_unity: '',
        sigla_unity: '',
        level: '',
      });
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
        await myApi.put(`/api/unity/${initialData._id}`, payload);
        toast.success('Permissão atualizada com sucesso!');
      } else {
        await myApi.post('/api/unity/', payload);
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
          <DialogTitle>{isEditing ? 'Editar Dados da unidade' : 'Cadastro de unidades'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da unidade.' : 'Adicione uma nova unidade.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome do posto/graduação</Label>
            <Input {...register('name_unity')} placeholder="Digite o nome" />
            {errors.name_unity && <p className="text-red-500 text-sm">{errors.name_unity.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sigla do posto/graduação da permissão</Label>
              <Input {...register('sigla_unity')} placeholder="Digite a sigla" />
              {errors.sigla_unity && <p className="text-red-500 text-sm">{errors.sigla_unity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Grupo do posto/graduação</Label>
              <Select onValueChange={(v) => setValue('level', v)} value={String((watch('level') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coint">COINT</SelectItem>
                  <SelectItem value="btl">BATALHÃO</SelectItem>
                  <SelectItem value="cia">COMPANHIA</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
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
