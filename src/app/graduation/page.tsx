'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Graduations, Permission } from '@/types';
import { Plus, Search, Book, Calendar, FileText, Edit, FileBadge } from 'lucide-react';
import { ManagePeopleForm } from '@/components/ManagePeople/ManagePeopleForm';
import { myApi } from '@/service/api';
import { PermissionsForm } from '@/components/Permissions/PermissionsForm';
import { GraduationForm } from '@/components/Graduation/GraduationForm';

export default function Graduation() {
  const [data, setData] = useState<Graduations[]>([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Graduations | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get('/api/graduation');
      const data = response.data;
      console.log('data', data);
      // setCount(response.data.count);
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEntries = data.filter(entry =>
    entry.sigla_graduation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entry: Graduations) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };


  // const handleDelete = async (id: string) => {
  //   // if (confirm('Tem certeza que deseja excluir esta entrada?')) {
  //   //   await remove(id);
  //   // }
  // };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'occurrence': return 'Ocorrência';
      case 'patrol': return 'Patrulhamento';
      case 'report': return 'Relatório';
      default: return type;
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

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'completed': return 'default';
  //     case 'pending': return 'secondary';
  //     default: return 'default';
  //   }
  // };

  // const getStatusLabel = (status: string) => {
  //   switch (status) {
  //     case 'completed': return 'Concluído';
  //     case 'pending': return 'Pendente';
  //     default: return status;
  //   }
  // };

  useEffect(() => {
    handleFetchData();
  }, [isFormOpen]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <div className="ml-4 text-gray-100 mt-10">Carregando...</div>
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
            <h1 className="text-3xl font-bold text-white">Gerenciar Postos/Graduações</h1>
            <p className="text-white">Registro de postos/graduações</p>
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
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de efetivo</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {data.filter(e => e.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrulhamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.filter(e => e.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {data.filter(e => e.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Postos/Graduações</CardTitle>
            <CardDescription>
              Lista de todas os postos/graduações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por sigla ou grupo..."
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
                  <TableHead>Sigla</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Nível</TableHead>
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
                  filteredEntries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="max-w-md truncate">{entry.name_graduation}</TableCell>
                      <TableCell className="max-w-md truncate">{entry.sigla_graduation}</TableCell>
                      <TableCell className="max-w-md truncate">{entry.group ? entry.group.toUpperCase() : entry.group}</TableCell>
                      <TableCell className="max-w-md truncate">{entry.level}</TableCell>
                      {/* <TableCell>
                        <Badge variant={getTypeColor(entry.status)}>
                          {getTypeLabel(entry.status)}
                        </Badge>
                      </TableCell> */}
                      {/* <TableCell>
                        {format(new Date(entry.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}
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
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { }}
                          >
                            <FileBadge className="w-4 h-4" />
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
        <GraduationForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={editingEntry || undefined}
          isEditing={!!editingEntry}
        />
      </div>
    </MainLayout>
  );
}

