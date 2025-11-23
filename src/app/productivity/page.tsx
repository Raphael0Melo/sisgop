'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookDayForm } from '@/components/BookDay/BookDayForm';
import { BookDaysAll, Productivitys } from '@/types';
import { Plus, Search, Book, Calendar, FileText, Edit, Trash2, FileCheck2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { myApi } from '@/service/api';
import { BookDayFormEdit } from '@/components/BookDay/BookDayFormEdit';
import { PdfBookDay } from '@/components/BookDay/PdfbookDay';
import { ProductivityForm } from '@/components/Productivity/ProductivityForm';
import { ProductivityEditForm } from '@/components/Productivity/ProducitvityEditForm';

interface BookDayProps {
  administrativeOccurrences: string[];
  operationalOccurrences: string[];
  gather: string[];
  barracksCharge: string[];
}

export default function Productivity() {
  const [data, setData] = useState<Productivitys[]>([]);
  const [count, setCount] = useState(0);
  const [bookCurrent, setBookCurrent] = useState<BookDayProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormOpenEdit, setIsFormOpenEdit] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Productivitys | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get('/api/productivityallbyid/1/20');
      const data = response.data.result;
      setBookCurrent(response.data.result);
      setCount(response.data.count);
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }



  const filteredEntries = data.filter(entry =>
    entry.data_inicial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.data_final.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleEdit = (entry: Productivitys) => {
    setEditingEntry(entry);
    setIsFormOpenEdit(true);
  };

  const handleVisualize = (entry: Productivitys) => {
    PdfBookDay(entry);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      await myApi.delete(`/api/bookdays/${id}`);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleCloseFormEdit = () => {
    setIsFormOpenEdit(false);
    setEditingEntry(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'occurrence': return 'Ocorrência';
      case 'patrol': return 'Patrulhamento';
      case 'report': return 'Relatório';
      default: return type === 'open' ? 'Aberto' : 'Fechado';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'occurrence': return 'destructive';
      case 'patrol': return 'default';
      case 'report': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [isFormOpen, isFormOpenEdit]);

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
    <>
      {isFormOpenEdit ?
        <ProductivityEditForm
          isOpen={isFormOpenEdit}
          onClose={handleCloseFormEdit}
          initialData={editingEntry || undefined}
          isEditing={!!editingEntry}
        />
        :
        <MainLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Produtividade</h1>
                <p className="text-white">Registro de produtividades diárias</p>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Entrada
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entradas Hoje</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookCurrent.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocorrências Administrativas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {bookCurrent[0]?.administrativeOccurrences?.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocorrências Operacionais</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {bookCurrent[0]?.operationalOccurrences?.length}
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {data.filter(e => e.status === 'pending').length}
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Entries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Registros de proditividade</CardTitle>
                <CardDescription>
                  Lista de todas as entradas de ocorrências, patrulhamentos e relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nº da parteo ou data inicial..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Tipo de serviço</TableHead>
                      <TableHead>Data inicial</TableHead>
                      <TableHead>Data final</TableHead>
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhuma entrada encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntries.map((entry: Productivitys) => (
                        <TableRow key={entry._id}>
                          <TableCell>{entry.nome_oficial_dia}</TableCell>
                          <TableCell className="max-w-md truncate">{entry.turno}</TableCell>
                          <TableCell className="max-w-md truncate">{entry.servico}</TableCell>
                          <TableCell>
                            {format(new Date(entry.data_inicial), 'dd/MM/yyyy', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {entry.data_final ? format(new Date(entry.data_final), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                          </TableCell>
                          {/* <TableCell>
                            <Badge variant={getTypeColor(entry.status)}>
                              {getTypeLabel(entry.status)}
                            </Badge>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleVisualize(entry)}
                              >
                                <FileCheck2 className="w-4 h-4" />
                              </Button>
                              {/* <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(entry._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Form Modal */}
            <ProductivityForm
              isOpen={isFormOpen}
              onClose={handleCloseForm}
              initialData={editingEntry || undefined}
              isEditing={!!editingEntry}
            />
          </div>
        </MainLayout>
      }
    </>
  );
}

