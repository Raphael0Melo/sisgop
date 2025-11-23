'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ControlCarForm } from '@/components/ControlCar/ControlCarForm';
import { ControlCar } from '@/types';
import { Plus, Search, Car, Edit, Trash2, Clock } from 'lucide-react';
import { myApi } from '@/service/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ControlCarPage() {
  const [data, setData] = useState<ControlCar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ControlCar | null>(null);
  const [loading, setLoading] = useState(true);


  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get(`/api/accesscontrol/1/20`)
      setData(response.data.result);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }


  const filteredEntries = data.filter(entry =>
    entry.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entry: ControlCar) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };


  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      await myApi.delete(`accesscontrol/${id}`);
    }
  };

  // const handleRegisterExit = async (entry: ControlCar) => {
  //   const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  //   await update(entry.id, { exitTime: currentTime });
  // };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const getStatus = (entry: ControlCar) => {
    return entry.data_saida ? 'fechado' : 'aberto';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'occurrence': return 'destructive';
      case 'patrol': return 'default';
      case 'report': return 'secondary';
      default: return status;
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occurrence': return 'destructive';
      case 'fechado': return 'default';
      case 'aberto': return 'default';
      default: return 'default';
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [isFormOpen]);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-50">Controle de Acesso</h1>
            <p className="text-gray-100">Gerenciar entrada e saída no batalhão</p>
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
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos Dentro</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saídas Registradas</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.length}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Access Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Acesso</CardTitle>
            <CardDescription>
              Lista de todos os registros de entrada e saída
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por placa ou motorista..."
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
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Data de saida</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => {
                    const status = getStatus(entry);
                    return (
                      <TableRow key={entry._id}>
                        <TableCell className="font-medium">{entry.nome}</TableCell>
                        <TableCell>
                          {format(new Date(entry.data_entrada), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(entry.data_saida), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(status)}>
                            {getStatusLabel(status)}
                          </Badge>
                        </TableCell>
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
                              variant="outline"
                              onClick={() => handleDelete(entry._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Form Modal */}
        <ControlCarForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={editingEntry || undefined}
          isEditing={!!editingEntry}
        />
      </div>
    </MainLayout>
  );
}

