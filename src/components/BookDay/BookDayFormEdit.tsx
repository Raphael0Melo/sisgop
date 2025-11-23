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
import { AdmOccurrences, BarracksChanges, BookDays, BookDaysAll, Gathers, Graduations, OpOccurrences } from '@/types';
import { myApi } from '@/service/api';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Step2BarracksChanger } from './Step2BarracksChanger';
import { Step3AdmOccurrences } from './Step3AdmOccurrences';
import { Step4OpOccurrences } from './Step4OpOccurences';
import { Step5Gather } from './Step5Gather';


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
  nome_completo_relator: FieldError;
  rg_realtor: FieldError;
  graduacao_relator: FieldError;
  nome_guerra_relator: FieldError;
  numero_parte: FieldError;
  tipo_servico: FieldError;
  turno: FieldError;
  graduacao_antecessor: FieldError;
  nome_guerra_antecessor: FieldError;
  nome_guerra_sucessor: FieldError;
  graduacao_sucessor: FieldError;
  quarto_hora: FieldError;
  data_inicial: FieldError;
  data_final: FieldError;
  unidade: FieldError;
  status: FieldError;
}


export function BookDayFormEdit({ isOpen, onClose, initialData, isEditing }: BookDayFormEditProps) {
  const [formData, setFormData] = useState<BookDays>({
    _id: '',
    nome_completo_relator: '',
    rg_realtor: '',
    graduacao_relator: '',
    nome_guerra_relator: '',
    numero_parte: '',
    tipo_servico: '',
    turno: '',
    graduacao_antecessor: '',
    nome_guerra_antecessor: '',
    nome_guerra_sucessor: '',
    graduacao_sucessor: '',
    quarto_hora: '',
    data_inicial: '',
    data_final: '',
    unidade: '',
    status: '',
  })
  const [errors, setErrors] = useState<ErrorsProps>({
    nome_completo_relator: { hasError: false, message: '' },
    rg_realtor: { hasError: false, message: '' },
    graduacao_relator: { hasError: false, message: '' },
    nome_guerra_relator: { hasError: false, message: '' },
    numero_parte: { hasError: false, message: '' },
    tipo_servico: { hasError: false, message: '' },
    turno: { hasError: false, message: '' },
    graduacao_antecessor: { hasError: false, message: '' },
    nome_guerra_antecessor: { hasError: false, message: '' },
    nome_guerra_sucessor: { hasError: false, message: '' },
    graduacao_sucessor: { hasError: false, message: '' },
    quarto_hora: { hasError: false, message: '' },
    data_inicial: { hasError: false, message: '' },
    data_final: { hasError: false, message: '' },
    unidade: { hasError: false, message: '' },
    status: { hasError: false, message: '' },
  });
  const [selectedDateInitial, setSelectedDateInitial] = useState<Date>(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [listGraduations, setListGraduations] = useState<GraduationOption[]>([]);

  // Carga do quartel
  const [listBarracksChanger, setListBarracksChanger] = useState<BarracksChanges[]>([]);
  const [editingBarracksChanger, setEditingBarracksChanger] = useState<BarracksChanges | null>(null);
  const [isFormOpenBarracksChanger, setIsFormOpenBarracksChanger] = useState(false);

  // Ocorrências adm
  const [listOcurrencesAdm, setListOcurrencesAdm] = useState<AdmOccurrences[]>([]);
  const [editingOcurrencesAdm, setEditingOcurrencesAdm] = useState<AdmOccurrences | null>(null);
  const [isFormOpenOcurrencesAdm, setIsFormOpenOcurrencesAdm] = useState(false);

  // Ocorrências operacionais
  const [listOcurrencesOperational, setListOcurrencesOperational] = useState<OpOccurrences[]>([]);
  const [editingOcurrencesOperational, setEditingOcurrencesOperational] = useState<OpOccurrences | null>(null);
  const [isFormOpenOcurrencesOperational, setIsFormOpenOcurrencesOperational] = useState(false);

  // Juntada
  const [listGather, setListGather] = useState<Gathers[]>([]);
  const [editingGather, setEditingGather] = useState<Gathers | null>(null);
  const [isFormOpenGather, setIsFormOpenGather] = useState(false);


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

  async function handleFetchBookDay() {
    const id = initialData?._id;
    setLoading(true)
    try {
      const response = await myApi.get(`/api/bookDay/${id}`);

      const data = response.data
      setFormData({
        _id: data?._id || '',
        nome_completo_relator: data?.nome_completo_relator || '',
        rg_realtor: data?.rg_realtor || '',
        graduacao_relator: data?.graduacao_relator || '',
        nome_guerra_relator: data?.nome_guerra_relator || '',
        numero_parte: data?.numero_parte || '',
        tipo_servico: data?.tipo_servico || '',
        turno: data?.turno || '',
        graduacao_antecessor: data?.graduacao_antecessor || '',
        nome_guerra_antecessor: data?.nome_guerra_antecessor || '',
        nome_guerra_sucessor: data?.nome_guerra_sucessor || '',
        graduacao_sucessor: data?.graduacao_sucessor || '',
        quarto_hora: data?.quarto_hora || '',
        data_inicial: data?.data_inicial ? new Date(data?.data_inicial) : data?.data_inicial,
        data_final: data.data_final ? new Date(data?.data_final) : data?.data_final,
        unidade: data?.unidade || '',
        status: data?.status || '',
      })

      if (data?.data_inicial) {
        setSelectedDateInitial(new Date(data?.data_inicial))
      }
      if (data?.data_final) {
        setSelectedDateEnd(new Date(data?.data_final))
      }

    } catch (error) {
      console.error('Erro ao buscar livro de dia:', error);
      toast.error('Erro ao buscar livro de dia.');
    } finally {
      setLoading(false)
    }
  }
  function validationFields(data: BookDays) {
    const errors: Partial<ErrorsProps> = {};
    let message = '';

    const setFieldError = (field: keyof ErrorsProps, msg: string) => {
      errors[field] = { hasError: true, message: msg };
      if (!message) message = msg;
    };

    if (!data.nome_guerra_relator)
      setFieldError('nome_guerra_relator', 'O nome de guerra do relator é obrigatório.');

    if (!data.rg_realtor)
      setFieldError('rg_realtor', 'O RG do relator é obrigatório.');

    if (!data.graduacao_relator)
      setFieldError('graduacao_relator', 'A graduação do relator é obrigatória.');

    if (!data.data_inicial)
      setFieldError('data_inicial', 'A data inicial é obrigatória.');

    if (!data.data_final)
      setFieldError('data_final', 'A data final é obrigatória.');

    if (!data.graduacao_sucessor)
      setFieldError('graduacao_sucessor', 'A graduação do sucessor é obrigatório')

    if (!data.nome_guerra_sucessor)
      setFieldError('nome_guerra_sucessor', 'O nome de guerra do sucessor é obrigatório')

    if (!data.numero_parte)
      setFieldError('numero_parte', 'O nº da parte é obrigatório')

    if (!data.quarto_hora)
      setFieldError('quarto_hora', 'O quarto  de hora da guarda é obrigatório')

    const hasError = Object.keys(errors).length > 0;

    return {
      hasError,
      errors,
      message: message || 'Campos obrigatórios não preenchidos.',
    };
  }

  async function handleUpdateBookDay() {
    const id = initialData?._id;
    const data = {
      nome_completo_relator: formData?.nome_completo_relator,
      rg_realtor: formData?.rg_realtor,
      graduacao_relator: formData?.graduacao_relator,
      nome_guerra_relator: formData?.nome_guerra_relator,
      numero_parte: formData?.numero_parte,
      tipo_servico: formData?.tipo_servico,
      turno: formData?.turno,
      graduacao_antecessor: formData?.graduacao_antecessor,
      nome_guerra_antecessor: formData?.nome_guerra_antecessor,
      nome_guerra_sucessor: formData?.nome_guerra_sucessor,
      graduacao_sucessor: formData?.graduacao_sucessor,
      quarto_hora: formData?.quarto_hora,
      data_inicial: selectedDateInitial,
      data_final: selectedDateEnd,
      unidade: formData?.unidade,
      status: formData?.status
    } as BookDays
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

  async function handleFechBarracksChanger() {
    try {
      const response = await myApi.get(`/api//barrackschargeallbyid/${initialData?._id}`);
      setListBarracksChanger(response.data);
    } catch (error) {
      console.error('Erro ao buscar quartel:', error);

    }
  }

  function handleSelectBarracksChanger(item: BarracksChanges) {
    setIsFormOpenBarracksChanger(true);
    setEditingBarracksChanger(item);
  }

  function handleCloseFormBarracksChanger() {
    setIsFormOpenBarracksChanger(false);
    setEditingBarracksChanger(null);
  }

  // ocorrencias administrativas

  async function handleFetchOccurrencesAdm() {
    try {
      const response = await myApi.get(`/api/administrativeOccurrencesallbyid/${initialData?._id}`);
      setListOcurrencesAdm(response.data);
    } catch (error) {
      console.error('Erro ao buscar ocorrencias:', error);
    }
  }

  function handleSelectOcurrencesAdm(item: AdmOccurrences) {
    setIsFormOpenOcurrencesAdm(true);
    setEditingOcurrencesAdm(item);
  }

  function handleCloseFormOcurrencesAdm() {
    setIsFormOpenOcurrencesAdm(false);
    setEditingOcurrencesAdm(null);
  }

  // ocorrencias operationais

  async function handleFetchOccurrencesOperational() {
    // setLoading(true)
    try {
      const response = await myApi.get(`/api/operationalOccurencesallid/${initialData?._id}`);

      setListOcurrencesOperational(response.data);
    } catch (error) {
      console.error('Erro ao buscar ocorrencias:', error);
    }
  }

  function handleSelectOcurrencesOperational(item: OpOccurrences) {
    setIsFormOpenOcurrencesOperational(true);
    setEditingOcurrencesOperational(item);
  }

  function handleCloseFormOcurrencesOperational() {
    setIsFormOpenOcurrencesOperational(false);
    setEditingOcurrencesOperational(null);
  }

  // juntada 

  async function handleFetchGather() {
    try {
      const response = await myApi.get(`/api/gatherallbyid/${initialData?._id}`);
      setListGather(response.data);
    } catch (error) {
      console.error('Erro ao buscar juntada:', error);
    }
  }

  function handleSelectGather(item: Gathers) {
    setIsFormOpenGather(true);
    setEditingGather(item);
  }

  function handleCloseFormGather() {
    setIsFormOpenGather(false);
    setEditingGather(null);
  }



  useEffect(() => {
    handleFetchBookDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFetchGather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpenGather]);

  useEffect(() => {
    handleFetchOccurrencesOperational();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpenOcurrencesOperational]);

  useEffect(() => {
    handleFechBarracksChanger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpenBarracksChanger]);

  useEffect(() => {
    handleFetchOccurrencesAdm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpenOcurrencesAdm]);

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
                <AccordionTrigger>I - DO RECEBIMENTO DO SERVIÇO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo do Relator</Label>
                      <Input value={formData.nome_completo_relator} name='nome_completo_relator' onChange={(e) => handleOnChange(e)} placeholder="Digite o nome completo do relator" />
                      {errors.nome_completo_relator.hasError && <p className="text-red-500 text-sm">{errors.nome_completo_relator.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Nome de guerra do relator</Label>
                      <Input value={formData.nome_guerra_relator} name='nome_guerra_relator' onChange={(e) => handleOnChange(e)} placeholder="Digite o nome de guerra do relator" />
                      {errors.nome_guerra_relator.message && <p className="text-red-500 text-sm">{errors.nome_guerra_relator.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rg do Relator</Label>
                      <Input value={formData.rg_realtor} name='rg_realtor' onChange={(e) => handleOnChange(e)} placeholder="Digite o rg do relator" />
                      {errors.rg_realtor.hasError && <p className="text-red-500 text-sm">{errors.rg_realtor.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Posto/graduação do Relator</Label>
                      <Select value={formData.graduacao_relator} onValueChange={(value) => handleOnChange('graduacao_relator', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {listGraduations.map((grad: GraduationOption) => (
                            <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.graduacao_relator.hasError && <p className="text-red-500 text-sm">{errors.graduacao_relator.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nº da Parte</Label>
                      <Input name='numero_parte' value={formData.numero_parte} onChange={(e) => handleOnChange(e)} placeholder="Digite o nº da parte" />
                      {errors.numero_parte.hasError && <p className="text-red-500 text-sm">{errors.numero_parte.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de serviço</Label>
                      <Select value={formData.tipo_servico} onValueChange={(value) => handleOnChange('tipo_servico', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FISCAL DE DIA">FISCAL DE DIA</SelectItem>
                          <SelectItem value="OFICIAL DE DIA">OFICIAL DE DIA</SelectItem>
                          <SelectItem value="SUPERVISÃO">SUPERVISÃO</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.tipo_servico.hasError && <p className="text-red-500 text-sm">{errors.tipo_servico.message}</p>}
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
                      <Select value={formData.turno} onValueChange={(value) => handleOnChange('turno', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno de serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1º TURNO">1° Turno</SelectItem>
                          <SelectItem value="2º TURNO">2° Turno</SelectItem>
                          <SelectItem value="24H DE SERVICO">24h de serviço</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.turno.hasError && <p className="text-red-500 text-sm">{errors.turno.message}</p>}
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
                      <Select value={formData.graduacao_antecessor} onValueChange={(value) => handleOnChange('graduacao_antecessor', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {listGraduations.map((grad: GraduationOption) => (
                            <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.graduacao_antecessor.hasError && <p className="text-red-500 text-sm">{errors.graduacao_antecessor.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Nome de guerra do antecessor</Label>
                      <Input name='nome_guerra_antecessor' value={formData.nome_guerra_antecessor} onChange={(e) => handleOnChange(e)} placeholder="Digite o nome de guerra do antecessor" />
                      {errors.nome_guerra_antecessor.hasError && <p className="text-red-500 text-sm">{errors.nome_guerra_antecessor.message}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* II - CARGA DO QUARTEL */}
              <AccordionItem value="carga">
                <AccordionTrigger>II - CARGA DO QUARTEL</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFormOpenBarracksChanger(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>

                  {listBarracksChanger.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum item adicionado.</p>
                  ) : (
                    listBarracksChanger.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border rounded-md p-2 text-sm"
                      >
                        <div>
                          <p>
                            <b>Prefixo:</b> {item.prefixo}
                          </p>
                          <p>
                            <b>Informação:</b> {item.informacao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handleSelectBarracksChanger(item)}
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

              {/* III - DO QUARTO DE HORA DA GUARDA */}
              <AccordionItem value="quarto_hora">
                <AccordionTrigger>III - DO QUARTO DE HORA DA GUARDA</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <Label>Do quarto de hora</Label>
                      <Textarea value={formData.quarto_hora} name="quarto_hora" onChange={(e) => handleOnChange(e)} placeholder="Descreva o quarto de hora" />
                      {errors.quarto_hora.hasError && <p className="text-red-500 text-sm">{errors.quarto_hora.message}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* IV - OCORRÊNCIAS ADMINISTRATIVAS */}
              <AccordionItem value="adm">
                <AccordionTrigger>IV - OCORRÊNCIAS ADMINISTRATIVAS</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFormOpenOcurrencesAdm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>

                  {listOcurrencesAdm.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma ocorrência administrativa.</p>
                  ) : (
                    listOcurrencesAdm.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border rounded-md p-2">
                        <div>
                          <p>
                            <b>Prefixo:</b> {item.prefixo}
                          </p>
                          <p>
                            <b>Informação:</b> {item.informacao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handleSelectOcurrencesAdm(item)}
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

              {/* V - OCORRÊNCIAS OPERACIONAIS */}
              <AccordionItem value="operational">
                <AccordionTrigger>V - OCORRÊNCIAS OPERACIONAIS</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFormOpenOcurrencesOperational(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>

                  {listOcurrencesOperational.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma ocorrência operacional.</p>
                  ) : (
                    listOcurrencesOperational.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border rounded-md p-2">
                        <div>
                          <p>
                            <b>Prefixo:</b> {item.prefixo}
                          </p>
                          <p>
                            <b>Informação:</b> {item.informacao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handleSelectOcurrencesOperational(item)}
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

              {/* VI - JUNTADA */}
              <AccordionItem value="juntada">
                <AccordionTrigger>VI - JUNTADA</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFormOpenGather(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>

                  {listGather.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma juntada adicionada.</p>
                  ) : (
                    listGather.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border rounded-md p-2">
                        <div>
                          <p>
                            <b>Prefixo:</b> {item.prefixo}
                          </p>
                          <p>
                            <b>Informação:</b> {item.informacao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handleSelectGather(item)}
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

              {/* VII - PASSAGEM */}
              <AccordionItem value="passagem">
                <AccordionTrigger>VII - DA PASSAGEM DO SERVIÇO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            selected={selectedDateEnd}
                            onSelect={(date) => date && setSelectedDateEnd(date)}
                            className="rounded-md border shadow-sm"
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Posto/graduação do sucessor</Label>
                      <Select value={formData.graduacao_sucessor} onValueChange={(value) => handleOnChange('graduacao_sucessor', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {listGraduations.map((grad: GraduationOption) => (
                            <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.graduacao_sucessor.hasError && <p className="text-red-500 text-sm">{errors.graduacao_sucessor.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Nome de guerra do sucessor</Label>
                      <Input name='nome_guerra_sucessor' value={formData.nome_guerra_sucessor} onChange={(e) => handleOnChange(e)} placeholder="Digite o nome de guerra do sucessor" />
                      {errors.nome_guerra_sucessor.hasError && <p className="text-red-500 text-sm">{errors.nome_guerra_sucessor.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleOnChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">ABERTO</SelectItem>
                          <SelectItem value="closed">FECHADO</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.turno.hasError && <p className="text-red-500 text-sm">{errors.turno.message}</p>}
                    </div>
                  </div>
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
      <Step2BarracksChanger
        isOpen={isFormOpenBarracksChanger}
        onClose={handleCloseFormBarracksChanger}
        initialData={editingBarracksChanger || undefined}
        isEditing={!!editingBarracksChanger}
        id_bookday={formData._id}
      />

      {/* {form admOccurrences} */}
      <Step3AdmOccurrences
        isOpen={isFormOpenOcurrencesAdm}
        onClose={handleCloseFormOcurrencesAdm}
        initialData={editingOcurrencesAdm || undefined}
        isEditing={!!editingOcurrencesAdm}
        id_bookday={formData._id}
      />

      {/* {form opOccurrences} */}
      <Step4OpOccurrences
        isOpen={isFormOpenOcurrencesOperational}
        onClose={handleCloseFormOcurrencesOperational}
        initialData={editingOcurrencesOperational || undefined}
        isEditing={!!editingOcurrencesOperational}
        id_bookday={formData._id}
      />

      {/* {form gather} */}
      <Step5Gather
        isOpen={isFormOpenGather}
        onClose={handleCloseFormGather}
        initialData={editingGather || undefined}
        isEditing={!!editingGather}
        id_bookday={formData._id}
      />
    </MainLayout>
  );
}
