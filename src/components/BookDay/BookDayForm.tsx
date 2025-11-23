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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookDays, BookDaysAll, Graduations } from '@/types';
import { z } from 'zod';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

// ✅ Schema de validação com Zod
const BookDaySchema = z.object({
  nome_completo_relator: z.string().min(1, 'Nome completo do relator é obrigatório'),
  rg_realtor: z.string().min(1, 'RG do relator é obrigatório'),
  graduacao_relator: z.string().min(1, 'Posto/Graduação do relator é obrigatório'),
  nome_guerra_relator: z.string().min(1, 'Nome de guerra do relator é obrigatório'),
  numero_parte: z.string().min(1, 'Nº da parte é obrigatório'),
  tipo_servico: z.string().min(1, 'Tipo de serviço é obrigatório'),
  turno: z.string().min(1, 'Turno de serviço é obrigatório'),
  graduacao_antecessor: z.string().min(1, 'Posto/Graduação do antecessor é obrigatório'),
  nome_guerra_antecessor: z.string().min(1, 'Nome de guerra do antecessor é obrigatório'),
});

interface BookDayFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BookDaysAll;
  isEditing?: boolean;
}

type GraduationOption = {
  value: string;
  label: string;
  index: number,
  array: string[]
}

export function BookDayForm({ isOpen, onClose, isEditing = false }: BookDayFormProps) {
  const [selectedDateInitial, setSelectedDateInitial] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduations, setListGraduations] = useState<GraduationOption[]>([]);

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
      nome_completo_relator: user?.nome,
      rg_realtor: user?.rg,
      graduacao_relator: user?.graduacao?._id,
      nome_guerra_relator: user?.nome_guerra,
      numero_parte: '',
      tipo_servico: '',
      turno: '',
      graduacao_antecessor: '',
      nome_guerra_antecessor: '',
    },
  });


  const onSubmit = async (data: z.infer<typeof BookDaySchema>) => {

    setLoading(true);
    try {
      const payload = {
        ...data,
        unidade: user?.unidade?._id,
        data_inicial: format(selectedDateInitial, 'yyyy-MM-dd'),
      };

      await myApi.post('/api/bookDay/', payload);
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
            {isEditing ? 'Editar Entrada do Livro do Dia' : 'Nova Entrada do Livro do Dia'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da entrada.' : 'Adicione uma nova entrada ao livro do dia.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo do Relator</Label>
              <Input {...register('nome_completo_relator')} placeholder="Digite o nome completo do relator" />
              {errors.nome_completo_relator && <p className="text-red-500 text-sm">{errors.nome_completo_relator.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Nome de guerra do relator</Label>
              <Input {...register('nome_guerra_relator')} placeholder="Digite o nome de guerra do relator" />
              {errors.nome_guerra_relator && <p className="text-red-500 text-sm">{errors.nome_guerra_relator.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rg do Relator</Label>
              <Input {...register('rg_realtor')} placeholder="Digite o rg do relator" />
              {errors.rg_realtor && <p className="text-red-500 text-sm">{errors.rg_realtor.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Posto/graduação do Relator</Label>
              <Select onValueChange={(v) => setValue('graduacao_relator', v)} value={String((watch('graduacao_relator') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {listGraduations.map((grad: GraduationOption) => (
                    <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.graduacao_relator && <p className="text-red-500 text-sm">{errors.graduacao_relator.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nº da Parte</Label>
              <Input {...register('numero_parte')} placeholder="Digite o nº da parte" />
              {errors.numero_parte && <p className="text-red-500 text-sm">{errors.numero_parte.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tipo de serviço</Label>
              <Select onValueChange={(v) => setValue('tipo_servico', v)} value={String((watch('tipo_servico') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FISCAL DE DIA">FISCAL DE DIA</SelectItem>
                  <SelectItem value="OFICIAL DE DIA">OFICIAL DE DIA</SelectItem>
                  <SelectItem value="SUPERVISÃO">SUPERVISÃO</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_servico && <p className="text-red-500 text-sm">{errors.tipo_servico.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data inicial do serviço</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDateInitial, 'dd/MM/yyyy', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateInitial}
                    onSelect={(date) => date && setSelectedDateInitial(date)}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
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
          </div>

          <div className="grid grid-cols-1 gap-4">
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
          </div>
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

