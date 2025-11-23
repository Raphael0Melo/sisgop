'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { CalendarIcon, Plus, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
// import { gerarLivroDeDiaPDF } from '@/lib/pdf/livroDeDiaPdf';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MainLayout } from '../Layout/MainLayout';
import { BarracksChanges, BookDaysAll, Graduations, Productivitys } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { StepOccurrences } from './StepOccurrences';


type BookDayFormEditProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BookDaysAll;
  isEditing?: boolean;
};

type GraduationOption = {
  value: string;
  label: string;
  index: number,
  array: string[]
}

interface FieldError {
  hasError: boolean;
  message: string;
}

interface ErrorsProps {
  nome_completo: FieldError;
  nome_oficial_dia: FieldError;
  graduacao_oficial_dia: FieldError;
  rg: FieldError;
  turno: FieldError;
  servico: FieldError;
  hora_inicial: FieldError;
  hora_final: FieldError;
  data_inicial: FieldError;
  data_final: FieldError;
  unidade: FieldError;
  nome_comandante_btl: FieldError;
  graduacao_comandante_btl: FieldError;
  nome_comandante_coint: FieldError;
  graduacao_comandante_coint: FieldError;
  nome_subComandante_btl: FieldError;
  graduacao_subComandante_btl: FieldError;
}


export function ProductivityEditForm({ isOpen, onClose, initialData, isEditing }: BookDayFormEditProps) {
  const [formData, setFormData] = useState<Productivitys>({
    _id: '',
    nome_completo: '',
    nome_oficial_dia: '',
    graduacao_oficial_dia: '',
    rg: '',
    turno: '',
    servico: '',
    hora_inicial: '',
    hora_final: '',
    data_inicial: '',
    data_final: '',
    unidade: '',
    nome_comandante_btl: '',
    graduacao_comandante_btl: '',
    nome_comandante_coint: '',
    graduacao_comandante_coint: '',
    nome_subComandante_btl: '',
    graduacao_subComandante_btl: '',
  })
  const [errors, setErrors] = useState<ErrorsProps>({
    nome_completo: { hasError: false, message: '' },
    nome_oficial_dia: { hasError: false, message: '' },
    graduacao_oficial_dia: { hasError: false, message: '' },
    rg: { hasError: false, message: '' },
    turno: { hasError: false, message: '' },
    servico: { hasError: false, message: '' },
    hora_inicial: { hasError: false, message: '' },
    hora_final: { hasError: false, message: '' },
    data_inicial: { hasError: false, message: '' },
    data_final: { hasError: false, message: '' },
    unidade: { hasError: false, message: '' },
    nome_comandante_btl: { hasError: false, message: '' },
    graduacao_comandante_btl: { hasError: false, message: '' },
    nome_comandante_coint: { hasError: false, message: '' },
    graduacao_comandante_coint: { hasError: false, message: '' },
    nome_subComandante_btl: { hasError: false, message: '' },
    graduacao_subComandante_btl: { hasError: false, message: '' },
  });
  const [selectedDateInitial, setSelectedDateInitial] = useState<Date>(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduations, setListGraduations] = useState<GraduationOption[]>([]);

  // Carga do quartel
  const [listOccurrences, setListOccurrences] = useState<BarracksChanges[]>([]);
  const [editingOccurrences, setEditingOccurrences] = useState<BarracksChanges | null>(null);
  const [isFormOpenOccurrences, setIsFormOpenOccurrences] = useState(false);

  async function handleFetchGraduation() {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  async function handleFetchProductivity() {
    const id = initialData?._id;
    setLoading(true)
    try {
      const response = await myApi.get(`/api/productivity/${id}`);

      const data = response.data
      setFormData({
        _id: data._id,
        nome_completo: data?.nome_completo,
        nome_oficial_dia: data?.nome_oficial_dia,
        graduacao_oficial_dia: data?.graduacao_oficial_dia,
        rg: data?.rg,
        turno: data?.turno,
        servico: data?.servico,
        hora_inicial: data?.hora_inicial,
        hora_final: data?.hora_final,
        data_inicial: data?.data_inicial,
        data_final: data?.data_final,
        unidade: data?.unidade,
        nome_comandante_btl: data?.nome_comandante_btl,
        graduacao_comandante_btl: data?.graduacao_comandante_btl,
        nome_comandante_coint: data?.nome_comandante_coint,
        graduacao_comandante_coint: data?.graduacao_comandante_coint,
        nome_subComandante_btl: data?.nome_subComandante_btl,
        graduacao_subComandante_btl: data?.graduacao_subComandante_btl
      })

      if (data?.data_inicial) {
        setSelectedDateInitial(new Date(data?.data_inicial))
      }
      if (data?.data_final) {
        setSelectedDateEnd(new Date(data?.data_final))
      }

    } catch (error) {
      console.error('Erro ao buscar a productividade:', error);
      toast.error('Erro ao buscar a productividade.');
    } finally {
      setLoading(false)
    }
  }
  function validationFields(data: Productivitys) {
    const errors: Partial<ErrorsProps> = {};
    let message = '';

    const setFieldError = (field: keyof ErrorsProps, msg: string) => {
      errors[field] = { hasError: true, message: msg };
      if (!message) message = msg;
    };

    if (!data.nome_completo)
      setFieldError('nome_completo', 'O nome completo é obrigatório.');

    if (!data.nome_oficial_dia)
      setFieldError('nome_oficial_dia', 'O nome completo é obrigatório.');

    if (!data.rg)
      setFieldError('rg', 'O RG é obrigatório.');

    if (!data.graduacao_oficial_dia)
      setFieldError('graduacao_oficial_dia', 'A graduação é obrigatória.');

    if (!data.data_inicial)
      setFieldError('data_inicial', 'A data inicial é obrigatória.');

    if (!data.data_final)
      setFieldError('data_final', 'A data final é obrigatória.');

    if (!data.servico)
      setFieldError('servico', 'O tipo de serviço é obrigatório')

    if (!data.turno)
      setFieldError('turno', 'O turno de serviço é obrigatório')

    const hasError = Object.keys(errors).length > 0;

    return {
      hasError,
      errors,
      message: message || 'Campos obrigatórios não preenchidos.',
    };
  }

  async function handleUpdateBookDay() {
    const date_initial = new Date(selectedDateInitial).toISOString();
    const date_end = new Date(selectedDateEnd).toISOString();
    const id = initialData?._id;
    const data = {
      _id: formData?._id,
      nome_completo: formData?.nome_completo,
      nome_oficial_dia: formData?.nome_oficial_dia,
      graduacao_oficial_dia: formData?.graduacao_oficial_dia,
      rg: formData?.rg,
      turno: formData?.turno,
      servico: formData?.servico,
      hora_inicial: formData?.hora_inicial,
      hora_final: formData?.hora_final,
      data_inicial: date_initial,
      data_final: date_end,
      unidade: formData?.unidade,
      nome_comandante_btl: formData?.nome_comandante_btl,
      graduacao_comandante_btl: formData?.graduacao_comandante_btl,
      nome_comandante_coint: formData?.nome_comandante_coint,
      graduacao_comandante_coint: formData?.graduacao_comandante_coint,
      nome_subComandante_btl: formData?.nome_subComandante_btl,
      graduacao_subComandante_btl: formData?.graduacao_subComandante_btl
    } as Productivitys
    const validationResult = validationFields(data);

    if (validationResult.hasError) {
      // Atualiza apenas os campos com erro
      setErrors((prev) => ({
        ...prev,
        ...validationResult.errors,
      }));
      toast.error(validationResult.message);
      return;
    }
    setLoading(true)
    try {
      await myApi.put(`/api/bookDay/${id}`, data);
      toast.success('Livro de dia atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar livro de dia:', error);
      toast.error('Erro ao atualizar livro de dia.');
    } finally {
      setLoading(false)
    }
  }


  function handleOnChange(
    eventOrName: React.ChangeEvent<HTMLInputElement> | string,
    valueFromSelect?: string
  ) {
    if (typeof eventOrName === 'string' && valueFromSelect !== undefined) {
      // Quando vier do Select
      const name = eventOrName;
      const value = valueFromSelect;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Quando vier do Input
      const event = eventOrName as React.ChangeEvent<HTMLInputElement>;
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }


  // Carga do Quartel

  async function handleFetchOccurrences() {
    try {
      const response = await myApi.get(`/api/productivityoccurrencesallbyid/${initialData?._id}`);
      setListOccurrences(response.data);
    } catch (error) {
      console.error('Erro ao buscar quartel:', error);

    }
  }

  function handleSelectOccurrences(item: BarracksChanges) {
    setIsFormOpenOccurrences(true);
    setEditingOccurrences(item);
  }

  function handleCloseFormOccurrences() {
    setIsFormOpenOccurrences(false);
    setEditingOccurrences(null);
  }


  useEffect(() => {
    handleFetchProductivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFetchOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpenOccurrences]);

  useEffect(() => {
    handleFetchGraduation();
  }, []);


  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl text-gray-50 font-bold mb-6 text-center">📘 Livro de Dia</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {/* I - RECEBIMENTO */}
              <AccordionItem value="recebimento">
                <AccordionTrigger>I - DO SERVIÇO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo do Relator</Label>
                      <Input value={formData.nome_completo} name='nome_completo' onChange={(e) => handleOnChange(e)} placeholder="Digite o nome completo" />
                      {errors.nome_completo.hasError && <p className="text-red-500 text-sm">{errors.nome_completo.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Nome de guerra do relator</Label>
                      <Input value={formData.nome_oficial_dia} name='nome_oficial_dia' onChange={(e) => handleOnChange(e)} placeholder="Digite o nome de guerra" />
                      {errors.nome_oficial_dia.message && <p className="text-red-500 text-sm">{errors.nome_oficial_dia.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rg do Relator</Label>
                      <Input value={formData.rg} name='rg' onChange={(e) => handleOnChange(e)} placeholder="Digite o RG" />
                      {errors.rg.hasError && <p className="text-red-500 text-sm">{errors.rg.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Posto/graduação</Label>
                      <Select value={formData.graduacao_oficial_dia} onValueChange={(value) => handleOnChange('graduacao_oficial_dia', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {listGraduations.map((grad: GraduationOption) => (
                            <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.graduacao_oficial_dia.hasError && <p className="text-red-500 text-sm">{errors.nome_oficial_dia.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de serviço</Label>
                      <Select value={formData.servico} onValueChange={(value) => handleOnChange('servico', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FISCAL DE DIA">FISCAL DE DIA</SelectItem>
                          <SelectItem value="OFICIAL DE DIA">OFICIAL DE DIA</SelectItem>
                          <SelectItem value="SUPERVISÃO">SUPERVISÃO</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.servico.hasError && <p className="text-red-500 text-sm">{errors.servico.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de serviço</Label>
                      <Select value={formData.turno} onValueChange={(value) => handleOnChange('turno', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1º TURNO">1º TURNO</SelectItem>
                          <SelectItem value="2º TURNO">2º TURNO</SelectItem>
                          <SelectItem value="24H DE SERVICO">24 HORAS DE SERVIÇO</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.turno.hasError && <p className="text-red-500 text-sm">{errors.turno.message}</p>}
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
                      <Label htmlFor="date">Data final do serviço</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(selectedDateEnd, 'dd/MM/yyyy', { locale: ptBR })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDateInitial}
                            onSelect={(date) => date && setSelectedDateEnd(date)}
                            className="rounded-md border shadow-sm"
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hora inicial</Label>
                      <Input type='time' value={formData.hora_inicial} name='hora_inicial' onChange={(e) => handleOnChange(e)} placeholder="Digite a hora inicial" />
                      {errors.hora_inicial.message && <p className="text-red-500 text-sm">{errors.hora_inicial.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Hora final</Label>
                      <Input type='time' value={formData.hora_final} name='hora_final' onChange={(e) => handleOnChange(e)} placeholder="Digite a hora final" />
                      {errors.hora_final.message && <p className="text-red-500 text-sm">{errors.hora_final.message}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* II - CARGA DO QUARTEL */}
              <AccordionItem value="carga">
                <AccordionTrigger>II - DAS OCORRÊNCIAS</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFormOpenOccurrences(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>

                  {listOccurrences.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum item adicionado.</p>
                  ) : (
                    listOccurrences.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border rounded-md p-2 text-sm"
                      >
                        <div>
                          <p>
                            <b>Fato:</b> {item.prefixo}
                          </p>
                          <p>
                            <b>Ação policial:</b> {item.informacao}
                          </p>
                          <p>
                            <b>Data:</b> {item.informacao}
                          </p>
                          <p>
                            <b>Observação:</b> {item.informacao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handleSelectOccurrences(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => { }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="secondary" onClick={() => onClose()}>Voltar</Button>
              <Button variant="default" onClick={() => handleUpdateBookDay()} disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* {form barracksChanger} */}
      <StepOccurrences
        isOpen={isFormOpenOccurrences}
        onClose={handleCloseFormOccurrences}
        initialData={editingOccurrences || undefined}
        isEditing={!!editingOccurrences}
        id_bookday={formData._id}
      />
    </MainLayout>
  );
}
