'use client';

import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Assessment } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { Textarea } from '../ui/textarea';

// ✅ Schema de validação com Zod
const peopleSchema = z.object({
  operation: z.string().min(1, 'Operação é obrigatória'),
  disk_report: z.string().optional().default(''),
  latitude: z.string().min(1, 'Latitude é obrigatória'),
  longitude: z.string().min(1, 'Longitude é obrigatória'),
  city: z.string().min(1, 'Municipio é obrigatório'),
  location: z.string().min(1, 'Localidade é obrigatória'),
  number_assessment: z.string().min(1, 'Número do auto é obrigatório'),
  term_seizure: z.string().optional().default(''),
  term_embargo: z.string().optional().default(''),
  term_realease: z.string().optional().default(''),
  term_deposit: z.string().optional().default(''),
  type_action: z.string().min(1, 'Tipo de ação é obrigatório'),
  number_document: z.string().optional().default(''),
  inspection_agent: z.string().min(1, 'Agente de fiscalização é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  fine: z.string().min(1, 'Multas é obrigatória'),
  year: z.string().min(1, 'Ano é obrigatório'),
  number_process: z.string().optional().default(''),
  status: z.string().optional().default(''),
});

interface UsersFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Assessment;
  isEditing?: boolean;
}

export function AssesmentForm({ isOpen, onClose, initialData, isEditing = false }: UsersFormProps) {
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
    resolver: zodResolver(peopleSchema) as unknown as Resolver<z.infer<typeof peopleSchema>>,
    defaultValues: {
      operation: '',
      disk_report: '',
      latitude: '',
      longitude: '',
      city: '',
      location: '',
      number_assessment: '',
      term_seizure: '',
      term_embargo: '',
      term_realease: '',
      term_deposit: '',
      type_action: '',
      number_document: '',
      inspection_agent: '',
      summary: '',
      fine: '',
      year: '',
      number_process: '',
      status: '',
    },
  });

  // 🔁 Preencher formulário ao editar
  useEffect(() => {
    if (isEditing && initialData?._id) {
      reset({
        operation: initialData.operation || '',
        disk_report: initialData.disk_report || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        city: initialData.city || '',
        location: initialData.location || '',
        number_assessment: initialData.number_assessment || '',
        term_seizure: initialData.term_seizure || '',
        term_embargo: initialData.term_embargo || '',
        term_realease: initialData.term_realease || '',
        term_deposit: initialData.term_deposit || '',
        type_action: initialData.type_action || '',
        number_document: initialData.number_document || '',
        inspection_agent: initialData.inspection_agent || '',
        summary: initialData.summary || '',
        fine: initialData.fine || '',
        year: initialData.year || '',
        number_process: initialData.number_process || '',
        status: initialData.status || '',
      });
      if (initialData.date) {
        setSelectedDate(new Date(initialData.date));
      }
    } else {
      reset({
        operation: '',
        disk_report: '',
        latitude: '',
        longitude: '',
        city: '',
        location: '',
        number_assessment: '',
        term_seizure: '',
        term_embargo: '',
        term_realease: '',
        term_deposit: '',
        type_action: '',
        number_document: '',
        inspection_agent: '',
        summary: '',
        fine: '',
        year: '',
        number_process: '',
        status: '',
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
        date: format(selectedDate, 'yyyy-MM-dd'),
      };


      if (isEditing && initialData?._id) {
        console.log('SALVOU');
        await myApi.put(`/api/assessment/${initialData._id}`, payload);
        toast.success('Dados atualizados com sucesso!');
      } else {

        await myApi.post('/api/assessment/', payload);
        toast.success('Autuação criada com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar autuação:', error);
      toast.error('Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Dados da autuação' : 'Cadastro de autuação'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da autuação.' : 'Adicione uma nova autuação.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Operação</Label>
              <Select onValueChange={(v) => setValue('operation', v)} value={String((watch('operation') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERAÇÃO ACUÁ">OPERAÇÃO ACUÃ</SelectItem>
                  <SelectItem value="OPERAÇÃO APOEMA">OPERAÇÃO APOEMA</SelectItem>
                  <SelectItem value="OPERAÇÃO CURUPIRA">OPERAÇÃO CURUPIRA</SelectItem>
                  <SelectItem value="OPERAÇÃO ANTONIO LEMOS">OPERAÇÃO ANTONIO LEMOS</SelectItem>
                  <SelectItem value="OPERAÇÃO ARCO DE FOGO">OPERAÇÃO ARCO DE FOGO</SelectItem>
                  <SelectItem value="OPERAÇÃO AMAZÔNIA VIVA">OPERAÇÃO AMAZÔNIA VIVA</SelectItem>
                  <SelectItem value="OPERAÇÃO TABULEIRO">OPERAÇÃO TABULEIRO</SelectItem>
                </SelectContent>
              </Select>
              {errors.operation && <p className="text-red-500 text-sm">{errors.operation.message}</p>}
            </div>
            <div>
              <Label>Disk denúncia</Label>
              <Input {...register('disk_report')} placeholder="Digite o disk denúncia" />
              {errors.disk_report && <p className="text-red-500 text-sm">{errors.disk_report.message}</p>}
            </div>
          </div>
          {/* Data e localidade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data da autuação</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Localidade</Label>
              <Input {...register('location')} placeholder="Digite a localidade" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
          </div>

          {/* latitude e longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input {...register('latitude')} placeholder="Digite a latitude" />
              {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
            </div>
            <div>
              <Label>Longitude</Label>
              <Input {...register('longitude')} placeholder="Digite a longitude" />
              {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
            </div>
          </div>

          {/* Município e tipo de acão */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Município</Label>
              <Input {...register('city')} placeholder="Digite o município" />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            <div>
              <Label>Tipo de ação</Label>
              <Select onValueChange={(v) => setValue('type_action', v)} value={String((watch('type_action') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDEM DE FISCALIZAÇÃO">ORDEM DE FISCALIZAÇÃO</SelectItem>
                  <SelectItem value="FLAGRANTE">FLAGRANTE</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_action && <p className="text-red-500 text-sm">{errors.type_action.message}</p>}
            </div>
          </div>

          {/* nº do auto e termo de apreensão */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nº do auto</Label>
              <Input {...register('number_assessment')} placeholder="Digite o nº do auto" />
              {errors.number_assessment && <p className="text-red-500 text-sm">{errors.number_assessment.message}</p>}
            </div>
            <div>
              <Label>Termo de apreensão</Label>
              <Input {...register('term_seizure')} placeholder="Digite o termo de apreensão" />
              {errors.term_seizure && <p className="text-red-500 text-sm">{errors.term_seizure.message}</p>}
            </div>
          </div>

          {/* termo de embargo e termo de soltura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Termo de embargo</Label>
              <Input {...register('term_embargo')} placeholder="Digite o termo de embargo" />
              {errors.term_embargo && <p className="text-red-500 text-sm">{errors.term_embargo.message}</p>}
            </div>
            <div>
              <Label>Termo de soltura</Label>
              <Input {...register('term_realease')} placeholder="Digite o termo de soltura" />
              {errors.term_realease && <p className="text-red-500 text-sm">{errors.term_realease.message}</p>}
            </div>
          </div>
          {/* termo de deposito e nº do documento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Termo de deposito</Label>
              <Input {...register('term_deposit')} placeholder="Digite o termo de deposito" />
              {errors.term_deposit && <p className="text-red-500 text-sm">{errors.term_deposit.message}</p>}
            </div>
            <div>
              <Label>Nº do documento</Label>
              <Input {...register('number_document')} placeholder="Digite o nº do documento" />
              {errors.number_document && <p className="text-red-500 text-sm">{errors.number_document.message}</p>}
            </div>
          </div>

          {/* nº do processo e agente de fiscalização */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nº do processo</Label>
              <Input {...register('number_process')} placeholder="Digite o nº do processo" />
              {errors.number_process && <p className="text-red-500 text-sm">{errors.number_process.message}</p>}
            </div>
            <div>
              <Label>Agente de fiscalização</Label>
              <Input {...register('inspection_agent')} placeholder="Digite o nome de guerra do agente" />
              {errors.inspection_agent && <p className="text-red-500 text-sm">{errors.inspection_agent.message}</p>}
            </div>
          </div>

          {/* multa e ano */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Multa</Label>
              <Input {...register('fine')} placeholder="Digite o valor da multa" />
              {errors.fine && <p className="text-red-500 text-sm">{errors.fine.message}</p>}
            </div>
            <div>
              <Label>Ano</Label>
              <Input  {...register('year')} placeholder="Digite o ano" />
              {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
            </div>
          </div>

          {/* resumo */}
          <div className="space-y-2">
            <Label>Resumo</Label>
            <Textarea {...register('summary')} placeholder="Digite o resumo" />
            {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
          </div>

          {/* status */}
          {/* {isEditing && ( */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select onValueChange={(v) => setValue('status', v)} value={String((watch('status') || ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">ATIVO</SelectItem>
                  <SelectItem value="anulado">ANULADO</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
          </div>
          {/* )} */}

          {/* Botões */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}
