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
import { Graduations, People, Permission, Profile, Situation, Unity } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { MainLayout } from '../Layout/MainLayout';
import { group } from 'console';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  name: z.string().min(3, 'descrição da permissão é obrigatório'),
  group: z.string().min(2, 'grupo da permissão é obrigatório'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Permission;
  isEditing?: boolean;
}

export function PermissionsForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduation, setListGraduation] = useState<Graduation[]>([]);
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
      name: '',
      group: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        name: initialData.name || '',
        group: initialData.group || '',
      });
      // if (initialData.data_nascimento) {
      //   setSelectedDate(new Date(initialData.data_nascimento));
      // }
    } else {
      reset({
        name: '',
        group: '',
      });
      setSelectedDate(new Date());
    }
  }, [isEditing, initialData, reset]);

  // 📡 Fetch lists
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const [grad, unity, sit, prof] = await Promise.all([
  //         myApi.get('/api/graduation'),
  //         myApi.get('/api/unityall'),
  //         myApi.get('/api/situation'),
  //         myApi.get('/api/profile'),
  //       ]);
  //       setListGraduation(grad.data);
  //       setListUnity(unity.data);
  //       setListSituation(sit.data);
  //       setListProfile(prof.data);
  //     } catch (error) {
  //       console.error('Erro ao buscar listas:', error);
  //     }
  //   })();
  // }, []);

  // 📤 Submissão
  const onSubmit = async (data: z.infer<typeof peopleSchema>) => {
    if (isFuture(selectedDate)) {
      toast.error('A data de nascimento não pode ser no futuro.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...data,
      };

      // console.log(payload);
      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/permissions/${initialData._id}`, payload);
        toast.success('Permissão atualizada com sucesso!');
      } else {
        await myApi.post('/api/permissions/', payload);
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
      {loading ? (
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <div className="ml-4 text-gray-700 mt-10">Carregando...</div>
          </div>
        </DialogContent>
      )
        :
        (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Dados da permissão' : 'Cadastro de permissão'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Edite as informações da permissão.' : 'Adicione uma nova permissão.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label>Descrição da permissão</Label>
                <Input {...register('name')} placeholder="Digite o nome completo" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Grupo da permissão</Label>
                <Select onValueChange={(v) => setValue('group', v)} value={String((watch('group') || ''))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sistema">SISTEMA</SelectItem>
                    <SelectItem value="efetivo">EFETIVO</SelectItem>
                    <SelectItem value="livro_dia">LIVRO DE DIA</SelectItem>
                    <SelectItem value="mapa_força">MAPA FORÇA</SelectItem>
                    <SelectItem value="produtividade">PRODUTIVIDADE</SelectItem>
                    <SelectItem value="controle_acesso">CONTROLE DE ACESSO</SelectItem>
                    <SelectItem value="autuações">AUTUAÇÕES</SelectItem>
                  </SelectContent>
                </Select>
                {errors.group && <p className="text-red-500 text-sm">{errors.group.message}</p>}
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
        )}
    </Dialog>
  );
}
