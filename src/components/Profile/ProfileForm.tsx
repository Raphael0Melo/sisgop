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
import { Permission, Profiles } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { Checkbox } from '../ui/checkbox';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  name_profile: z.string().min(3, 'nome da função é obrigatório'),
  level: z.string().min(2, 'o nível da função é obrigatório'),
  permissions: z.array(z.string()).optional(),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Profiles;
  isEditing?: boolean;
}

export function ProfileForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listPermissions, setListPermissions] = useState<Permission[]>([]);

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
      name_profile: '',
      level: '',
      permissions: [],
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        name_profile: initialData.name_profile || '',
        level: initialData.level || '',
        permissions: initialData.permissions || [],
      });
      // if (initialData.data_nascimento) {
      //   setSelectedDate(new Date(initialData.data_nascimento));
      // }
    } else {
      reset({
        name_profile: '',
        level: '',
        permissions: [],
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
        await myApi.put(`/api/profile/${initialData._id}`, payload);
        toast.success('Permissão atualizada com sucesso!');
      } else {
        await myApi.post('/api/profile/', payload);
        toast.success('Permissão criada com sucesso!');
      }

      onClose();
    } catch (error: unknown) {
      // Safe checks: handle Axios-style errors or generic Error instances
      if (typeof error === 'object' && error !== null && 'response' in error && (error as any).response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao salvar permissão.');
      }
      console.error('Erro ao salvar permissão:', error);
    } finally {
      setLoading(false);
    }
  };

  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get('/api/permissionsall');
      const data = response.data.response;
      // setCount(response.data.count);
      setListPermissions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Dados da função' : 'Cadastro de funções'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da função.' : 'Adicione uma nova função.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome da situação */}
          <div className="space-y-2">
            <Label>Nome da situação</Label>
            <Input {...register('name_profile')} placeholder="Digite o nome" />
            {errors.name_profile && <p className="text-red-500 text-sm">{errors.name_profile.message}</p>}
          </div>

          {/* Grupo */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Grupo da situação</Label>
              <Select onValueChange={(v) => setValue('level', v)} value={watch('level') || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cmt">COMANDO</SelectItem>
                  <SelectItem value="subcmt">SUBCOMANDO</SelectItem>
                  <SelectItem value="normal">NORMAL</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
            </div>
          </div>

          {/* Lista de permissões */}
          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listPermissions.map((perm) => {
                const selected = watch('permissions')?.includes(perm.name);
                return (
                  <div key={perm._id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(checked) => {
                        const current = watch('permissions') || [];
                        if (checked) {
                          setValue('permissions', [...current, perm.name]);
                        } else {
                          setValue(
                            'permissions',
                            current.filter((p) => p !== perm.name)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{perm.name}</span>
                  </div>
                );
              })}
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
