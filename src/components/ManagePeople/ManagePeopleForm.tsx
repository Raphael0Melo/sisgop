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
import { Calendar } from '@/components/ui/calendar';
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CalendarIcon } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Graduations, People, Profiles, Situations, Unitys } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  rg: z.string().min(5, 'RG obrigatório'),
  nome_guerra: z.string().min(2, 'Nome de guerra obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  sexo: z.string().min(1, 'Selecione o sexo'),
  graduacao: z.string().min(1, 'Selecione a graduação'),
  unidade: z.string().min(1, 'Selecione a unidade'),
  situacao: z.string().min(1, 'Selecione a situação'),
  perfil: z.string().min(1, 'Selecione a função'),
  senha: z.string().optional(),
  status: z.string().min(1, 'Selecione o status'),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: People;
  isEditing?: boolean;
}

export function ManagePeopleForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduation, setListGraduation] = useState<Graduations[]>([]);
  const [listUnity, setListUnity] = useState<Unitys[]>([]);
  const [listSituation, setListSituation] = useState<Situations[]>([]);
  const [listProfile, setListProfile] = useState<Profiles[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

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
      nome: '',
      cpf: '',
      rg: '',
      nome_guerra: '',
      senha: '',
      email: '',
      graduacao: '',
      sexo: '',
      telefone: '',
      unidade: '',
      situacao: '',
      perfil: '',
      status: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        nome: initialData.nome || '',
        cpf: initialData.cpf || '',
        rg: initialData.rg || '',
        nome_guerra: initialData.nome_guerra || '',
        email: initialData.email || '',
        telefone: initialData.telefone || '',
        sexo: initialData.sexo || '',
        graduacao: initialData.graduacao?._id || '',
        unidade: initialData.unidade?._id || '',
        situacao: initialData.situacao?._id || '',
        perfil: initialData.perfil?._id || '',
        senha: initialData.senha || '',
        status: initialData.status || '',
      });
      console.log(initialData.data_nascimento);

      if (initialData.data_nascimento) {
        setSelectedDate(new Date(initialData.data_nascimento));
      }
    } else {
      reset({
        nome: '',
        cpf: '',
        rg: '',
        nome_guerra: '',
        email: '',
        telefone: '',
        sexo: '',
        graduacao: '',
        unidade: '',
        situacao: '',
        perfil: '',
        senha: '',
        status: '',
      });
      setSelectedDate(new Date());
    }
  }, [isEditing, initialData, reset]);

  // 📡 Fetch lists
  useEffect(() => {
    (async () => {
      try {
        const [grad, unity, sit, prof] = await Promise.all([
          myApi.get('/api/graduation'),
          myApi.get('/api/unityall'),
          myApi.get('/api/situation'),
          myApi.get('/api/profile'),
        ]);
        setListGraduation(grad.data);
        setListUnity(unity.data);
        setListSituation(sit.data);
        setListProfile(prof.data);
      } catch (error) {
        console.error('Erro ao buscar listas:', error);
      }
    })();
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, []);

  // 📤 Submissão
  const onSubmit = async (data: z.infer<typeof peopleSchema>) => {
    if (isFuture(selectedDate)) {
      toast.error('A data de nascimento não pode ser no futuro.');
      return;
    }

    setLoading(true);
    const date_birth = new Date(selectedDate).toISOString();
    try {
      const payload = {
        ...data,
        senha: data.cpf,
        data_nascimento: date_birth,
      };

      // console.log(payload);


      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/users/${initialData._id}`, payload);
        toast.success('Dados atualizados com sucesso!');
      } else {
        await myApi.post('/api/users/', payload);
        toast.success('Usuário criado com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar os dados.');
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
          <DialogContent className="sm:max-w-[600px]" >
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Dados do militar' : 'Cadastro de militar'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Edite as informações do militar.' : 'Adicione um novo militar.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input {...register('nome')} placeholder="Digite o nome completo" />
                {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
              </div>

              {/* RG e CPF */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RG</Label>
                  <Input {...register('rg')} placeholder="Digite o RG" />
                  {errors.rg && <p className="text-red-500 text-sm">{errors.rg.message}</p>}
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input {...register('cpf')} placeholder="Digite o CPF" />
                  {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
                </div>
              </div>

              {/* Nome de guerra e Graduação */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome de guerra</Label>
                  <Input {...register('nome_guerra')} placeholder="Digite o nome de guerra" />
                  {errors.nome_guerra && <p className="text-red-500 text-sm">{errors.nome_guerra.message}</p>}
                </div>
                <div>
                  <Label>Posto/Graduação</Label>
                  <Select onValueChange={(v) => setValue('graduacao', v)} value={String((watch('graduacao') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {listGraduation.map((g) => (
                        <SelectItem key={g._id} value={g._id}>{g.name_graduation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.graduacao && <p className="text-red-500 text-sm">{errors.graduacao.message}</p>}
                </div>
              </div>

              {/* Telefone e Sexo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input {...register('telefone')} placeholder="Digite o telefone" />
                  {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select onValueChange={(v) => setValue('sexo', v)} value={String((watch('sexo') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sexo && <p className="text-red-500 text-sm">{errors.sexo.message}</p>}
                </div>
              </div>

              {/* Data e Unidade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de nascimento</Label>
                  <PopoverPrimitive.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverPrimitive.Trigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(new Date(selectedDate), 'dd/MM/yyyy', { locale: ptBR })
                          : 'Selecione uma data'}
                      </Button>
                    </PopoverPrimitive.Trigger>

                    {/* Sem Portal — renderiza dentro do Dialog */}
                    <PopoverPrimitive.Content
                      side="bottom"
                      align="center"
                      className="z-[9999] w-auto rounded-md border bg-popover p-2 shadow-md"
                      sideOffset={5}
                      avoidCollisions={false}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date)
                            setPopoverOpen(false) // fecha o popover ao selecionar
                          }
                        }}
                        className="rounded-md border shadow-sm"
                        captionLayout="dropdown"
                        timeZone={timeZone}
                      />
                    </PopoverPrimitive.Content>
                  </PopoverPrimitive.Root>
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select onValueChange={(v) => setValue('unidade', v)} value={String((watch('unidade') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {listUnity.map((u) => (
                        <SelectItem key={u._id} value={u._id}>{u.sigla_unity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unidade && <p className="text-red-500 text-sm">{errors.unidade.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input {...register('email')} placeholder="Digite o email" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Situação e Função */}
              <div className="space-y-2">
                <div>
                  <Label>Situação</Label>
                  <Select onValueChange={(v) => setValue('situacao', v)} value={String((watch('situacao') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {listSituation.map((s) => (
                        <SelectItem key={s._id} value={s._id}>{s.name_situation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.situacao && <p className="text-red-500 text-sm">{errors.situacao.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Função</Label>
                  <Select onValueChange={(v) => setValue('perfil', v)} value={String((watch('perfil') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {listProfile.map((p) => (
                        <SelectItem key={p._id} value={p._id}>{p.name_profile}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.perfil && <p className="text-red-500 text-sm">{errors.perfil.message}</p>}
                </div>

                <div>
                  <Label>Status</Label>
                  <Select onValueChange={(v) => setValue('status', v)} value={String((watch('status') || ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">ATIVO</SelectItem>
                      <SelectItem value="inativo">INATIVO</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
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
        )}
    </Dialog>
  );
}
