'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { union, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Graduations, Profile, Situation, Unity } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { MainLayout } from '../Layout/MainLayout';
import { group } from 'console';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  name_graduation: z.string().min(3, 'nome do posto/graduação é obrigatório'),
  sigla_graduation: z.string().min(3, 'sigla do posto/graduação é obrigatório'),
  group: z.string().min(2, 'grupo do posto/graduação é obrigatório'),
  level: z.string().min(1, 'nível do posto/graduação é obrigatório'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Graduations;
  isEditing?: boolean;
}

export function GraduationForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduation, setListGraduation] = useState<Graduations[]>([]);
  const [listUnity, setListUnity] = useState<Unity[]>([]);
  const [listSituation, setListSituation] = useState<Situation[]>([]);
  const [listProfile, setListProfile] = useState<Profile[]>([]);

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
      name_graduation: '',
      sigla_graduation: '',
      group: '',
      level: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        name_graduation: initialData.name_graduation || '',
        sigla_graduation: initialData.sigla_graduation || '',
        group: initialData.group || '',
        level: initialData.level.toString() || '',
      });
      // if (initialData.data_nascimento) {
      //   setSelectedDate(new Date(initialData.data_nascimento));
      // }
    } else {
      reset({
        name_graduation: '',
        sigla_graduation: '',
        group: '',
        level: '',
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
        await myApi.put(`/api/graduation/${initialData._id}`, payload);
        toast.success('Permissão atualizada com sucesso!');
      } else {
        await myApi.post('/api/graduation/', payload);
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
            <Label>Nome do posto/graduação</Label>
            <Input {...register('name_graduation')} placeholder="Digite o nome" />
            {errors.name_graduation && <p className="text-red-500 text-sm">{errors.name_graduation.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sigla do posto/graduação da permissão</Label>
              <Input {...register('sigla_graduation')} placeholder="Digite a sigla" />
              {errors.sigla_graduation && <p className="text-red-500 text-sm">{errors.sigla_graduation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Grupo do posto/graduação</Label>
              <Select onValueChange={(v) => setValue('group', v)} value={String((watch('group') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QOPM">QOPM</SelectItem>
                  <SelectItem value="QOAPM">QOAPM</SelectItem>
                  <SelectItem value="QPMP">QPMP</SelectItem>
                </SelectContent>
              </Select>
              {errors.group && <p className="text-red-500 text-sm">{errors.group.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nível do posto/graduação</Label>
              <Input {...register('level')} placeholder="Digite o nível" />
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
