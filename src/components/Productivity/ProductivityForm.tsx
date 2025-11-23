'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookDays, BookDaysAll, Graduations, Productivitys } from '@/types';
import { z } from 'zod';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';


// ✅ Schema de validação com Zod
const BookDaySchema = z.object({
  nome_oficial_dia: z.string().min(3, 'nome oficial dia é obrigatório'),
  nome_completo: z.string().min(3, 'nome completo é obrigatório'),
  graduacao_oficial_dia: z.string().min(3, 'graduação oficial dia é obrigatório'),
  rg: z.string().min(5, 'RG obrigatório'),
  turno: z.string().min(3, 'turno é obrigatório'),
  servico: z.string().min(3, 'servico é obrigatório'),
  hora_inicial: z.string().min(3, 'hora inicial é obrigatório'),
  hora_final: z.string().min(3, 'hora final é obrigatório'),
});

interface BookDayFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Productivitys;
  isEditing?: boolean;
}

type GraduationOption = {
  value: string;
  label: string;
  index: number,
  array: string[]
}

export function ProductivityForm({ isOpen, onClose, isEditing = false }: BookDayFormProps) {
  const [selectedDateInitial, setSelectedDateInitial] = useState<Date>(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduations, setListGraduations] = useState<GraduationOption[]>([]);
  const [popoverOpenDateInital, setPopoverOpenDateInitial] = useState(false)
  const [popoverOpenDateEnd, setPopoverOpenDateEnd] = useState(false)

  const { user } = useAuth();

  async function handleFetchGraduation() {
    try {
      const response = await myApi.get('/api/graduation');
      const result = response.data.map((i: Graduations) => {
        const grad = {
          value: i._id,
          label: `${i.sigla_graduation} - ${i.group}`,
        };
        return grad;
      });
      setListGraduations(result);
    } catch (error) {
      console.error('Erro ao buscar graduações:', error);
      toast.error('Erro ao buscar graduações.');
      return [];
    }
  }


  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof BookDaySchema>>({
    resolver: zodResolver(BookDaySchema) as unknown as Resolver<z.infer<typeof BookDaySchema>>,
    defaultValues: {
      nome_oficial_dia: user?.nome_guerra,
      nome_completo: user?.nome,
      graduacao_oficial_dia: user?.graduacao?._id,
      rg: user?.rg,
      turno: '',
      servico: '',
      hora_inicial: '',
      hora_final: '',
    },
  });


  const onSubmit = async (data: z.infer<typeof BookDaySchema>) => {

    setLoading(true);
    const date_initial = new Date(selectedDateInitial).toISOString();
    const date_end = new Date(selectedDateInitial).toISOString();
    try {
      const payload = {
        ...data,
        unidade: user?.unidade?._id,
        data_inicial: date_initial,
        data_final: date_end,
        nome_comandante_coint: 'teste',
        graduacao_comandante_coint: 'teste',
        nome_comandante_btl: 'teste',
        graduacao_comandante_btl: 'teste',
        nome_subComandante_btl: 'teste',
        graduacao_subComandante_btl: 'teste',
      };

      await myApi.post('/api/productivity/', payload);
      toast.success('Livro de dia criado com sucesso!');

      onClose();
    } catch (error) {
      console.error('Erro ao salvar autuação:', error);
      toast.error('Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGraduation();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Entrada da produtividade' : 'Nova Entrada de produtividade'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da produtividade.' : 'Adicione uma nova entrada na produtividade.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input {...register('nome_completo')} placeholder="Digite o nome completo" />
              {errors.nome_completo && <p className="text-red-500 text-sm">{errors.nome_completo.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Nome de guerra</Label>
              <Input {...register('nome_oficial_dia')} placeholder="Digite o nome de guerra" />
              {errors.nome_oficial_dia && <p className="text-red-500 text-sm">{errors.nome_oficial_dia.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>RG</Label>
              <Input {...register('rg')} placeholder="Digite o rg" />
              {errors.rg && <p className="text-red-500 text-sm">{errors.rg.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Posto/graduação do Relator</Label>
              <Select onValueChange={(v) => setValue('graduacao_oficial_dia', v)} value={String((watch('graduacao_oficial_dia') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {listGraduations.map((grad: GraduationOption) => (
                    <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.graduacao_oficial_dia && <p className="text-red-500 text-sm">{errors.graduacao_oficial_dia.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Turno de serviço</Label>
              <Select onValueChange={(v) => setValue('turno', v)} value={String((watch('turno') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1º TURNO">1° Turno</SelectItem>
                  <SelectItem value="2º TURNO">2° Turno</SelectItem>
                  <SelectItem value="24H DE SERVICO">24h de serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de serviço</Label>
              <Select onValueChange={(v) => setValue('servico', v)} value={String((watch('servico') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FISCAL DE DIA">FISCAL DE DIA</SelectItem>
                  <SelectItem value="OFICIAL DE DIA">OFICIAL DE DIA</SelectItem>
                  <SelectItem value="SUPERVISÃO">SUPERVISÃO</SelectItem>
                </SelectContent>
              </Select>
              {errors.servico && <p className="text-red-500 text-sm">{errors.servico.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data inicial do serviço</Label>
              <PopoverPrimitive.Root open={popoverOpenDateInital} onOpenChange={setPopoverOpenDateInitial}>
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
            <div className="space-y-2">
              <Label htmlFor="date">Data final do serviço</Label>
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
            <div className="space-y-2">
              <Label>Hora inicial</Label>
              <Input type='time' {...register('hora_inicial')} placeholder="Digite a hora inicial" />
              {errors.hora_inicial && <p className="text-red-500 text-sm">{errors.hora_inicial.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Hora final</Label>
              <Input type='time' {...register('hora_final')} placeholder="Digite a hora final" />
              {errors.hora_final && <p className="text-red-500 text-sm">{errors.hora_final.message}</p>}
            </div>
          </div>

          {/* <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label htmlFor="date">Quem passou o serviço:</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posto/graduação do antecessor</Label>
              <Select onValueChange={(v) => setValue('graduacao_antecessor', v)} value={String((watch('graduacao_antecessor') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {listGraduations.map((grad: GraduationOption) => (
                    <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.graduacao_antecessor && <p className="text-red-500 text-sm">{errors.graduacao_antecessor.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nome de guerra do antecessor</Label>
              <Input {...register('nome_guerra_antecessor')} placeholder="Digite o nome de guerra do antecessor" />
              {errors.nome_guerra_antecessor && <p className="text-red-500 text-sm">{errors.nome_guerra_antecessor.message}</p>}
            </div>
          </div> */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent >
    </Dialog >
  );
}

