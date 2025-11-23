'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ControlCar } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { toast } from 'react-toastify';
import { myApi } from '@/service/api';
import { format, isFuture } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import * as PopoverPrimitive from '@radix-ui/react-popover'



const controlCarSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  setor: z.string().min(1, 'Local é obrigatório'),
  tipo_veiculo: z.string().optional().default(''),
  placa: z.string().optional().default(''),
  obs: z.string().optional().default(''),
});

interface ControlCarFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ControlCar;
  isEditing?: boolean;
}

export function ControlCarForm({ isOpen, onClose, initialData, isEditing = false }: ControlCarFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDateBirth, setSelectedDateBirth] = useState<Date>(new Date());
  const [selectedDateInitial, setSelectedDateInitial] = useState<Date>(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date>(new Date());
  const [popoverOpenDateBirth, setPopoverOpenDateBirth] = useState(false)
  const [popoverOpenDateInitial, setPopoverOpenDateInitial] = useState(false)
  const [popoverOpenDateEnd, setPopoverOpenDateEnd] = useState(false)

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof controlCarSchema>>({
    resolver: zodResolver(controlCarSchema) as unknown as Resolver<z.infer<typeof controlCarSchema>>,
    defaultValues: {
      nome: '',
      placa: '',
      setor: '',
      tipo_veiculo: '',
      obs: '',
    },
  });



  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        nome: initialData.nome || '',
        placa: initialData.placa || '',
        setor: initialData.setor || '',
        tipo_veiculo: initialData.tipo_veiculo || '',
        obs: initialData.obs || '',

      });
      if (initialData.data_nascimento) {
        setSelectedDateBirth(new Date(initialData.data_nascimento));
      }
      if (initialData.data_entrada) {
        setSelectedDateInitial(new Date(initialData.data_entrada));
      }
      if (initialData.data_saida) {
        setSelectedDateEnd(new Date(initialData.data_saida));
      }
    } else {
      reset({
        nome: '',
        placa: '',
        setor: '',
        tipo_veiculo: '',
        obs: '',
      });
      setSelectedDateBirth(new Date());
      setSelectedDateInitial(new Date());
      setSelectedDateEnd(new Date());
    }
  }, [isEditing, initialData, reset]);

  // 📤 Submissão
  const onSubmit = async (data: z.infer<typeof controlCarSchema>) => {
    if (isFuture(selectedDateBirth)) {
      toast.error('A data de nascimento não pode ser no futuro.');
      return;
    }

    setLoading(true);
    const date_birth = new Date(selectedDateBirth).toISOString();
    const date_initial = new Date(selectedDateInitial).toISOString();
    const date_end = new Date(selectedDateEnd).toISOString();
    try {
      const payload = {
        ...data,
        data_nascimento: date_birth,
        data_entrada: date_initial,
        data_saida: date_end,
      };


      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/accesscontrol/${initialData._id}`, payload);
        toast.success('Dados atualizados com sucesso!');
      } else {
        await myApi.post('/api/accesscontrol/', payload);
        toast.success('controle de acesso criado com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar controle de acesso:', error);
      toast.error('Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Registro de Acesso' : 'Novo Registro de controle de Acesso'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações do registro de controle de acesso.' : 'Registre a entrada de um novo controle de acesso.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Input {...register('nome')} placeholder="Digite o nome completo" />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de entrada</Label>
              <PopoverPrimitive.Root open={popoverOpenDateInitial} onOpenChange={setPopoverOpenDateInitial}>
                <PopoverPrimitive.Trigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateInitial
                      ? format(new Date(selectedDateInitial), 'dd/MM/yyyy', { locale: ptBR })
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
                    selected={selectedDateInitial}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDateInitial(date)
                        setPopoverOpenDateInitial(false) // fecha o popover ao selecionar
                      }
                    }}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            </div>
            <div>
              <Label>Data de saida</Label>
              <PopoverPrimitive.Root open={popoverOpenDateEnd} onOpenChange={setPopoverOpenDateEnd}>
                <PopoverPrimitive.Trigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateEnd
                      ? format(new Date(selectedDateEnd), 'dd/MM/yyyy', { locale: ptBR })
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
                    selected={selectedDateEnd}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDateEnd(date)
                        setPopoverOpenDateEnd(false) // fecha o popover ao selecionar
                      }
                    }}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Nascimento</Label>
              <PopoverPrimitive.Root open={popoverOpenDateBirth} onOpenChange={setPopoverOpenDateBirth}>
                <PopoverPrimitive.Trigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateBirth
                      ? format(new Date(selectedDateBirth), 'dd/MM/yyyy', { locale: ptBR })
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
                    selected={selectedDateBirth}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDateInitial(date)
                        setPopoverOpenDateBirth(false) // fecha o popover ao selecionar
                      }
                    }}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            </div>
            <div>
              <Label>Setor</Label>
              <Input {...register('setor')} placeholder="Digite o setor" />
              {errors.setor && <p className="text-red-500 text-sm">{errors.setor.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de veiculo</Label>
              <Input {...register('tipo_veiculo')} placeholder="Digite o tipo de veiculo" />
              {errors.tipo_veiculo && <p className="text-red-500 text-sm">{errors.tipo_veiculo.message}</p>}
            </div>
            <div>
              <Label>Placa</Label>
              <Input {...register('placa')} placeholder="Digite a placa" />
              {errors.placa && <p className="text-red-500 text-sm">{errors.placa.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea {...register('obs')} placeholder="Digite a observação" />
            {errors.obs && <p className="text-red-500 text-sm">{errors.obs.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

