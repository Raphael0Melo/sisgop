'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Profiles, Situations } from '@/types';
import { Plus, Search, Edit } from 'lucide-react';
import { myApi } from '@/service/api';
import { SituationForm } from '@/components/Situation/SituationForm';
import { ProfileForm } from '@/components/Profile/ProfileForm';

export default function Profile() {
  const [data, setData] = useState<Profiles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Profiles | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get('/api/profile');
      const data = response.data;
      // console.log('data', data);
      // setCount(response.data.count);
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEntries = data.filter(entry =>
    entry.name_profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entry: Profiles) => {
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

  // const getTypeLabel = (type: string) => {
  //   switch (type) {
  //     case 'occurrence': return 'Ocorrência';
  //     case 'patrol': return 'Patrulhamento';
  //     case 'report': return 'Relatório';
  //     default: return type;
  //   }
  // };

  // const getTypeColor = (type: string) => {
  //   switch (type) {
  //     case 'occurrence': return 'destructive';
  //     case 'patrol': return 'default';
  //     case 'report': return 'secondary';
  //     default: return 'default';
  //   }
  // };

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
            <h1 className="text-3xl font-bold text-white">Gerenciar Funções</h1>
            <p className="text-white">Registro de Funções</p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Entrada
          </Button>
        </div>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Funções</CardTitle>
            <CardDescription>
              Lista de todas as Funções.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou nível..."
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
                      <TableCell className="max-w-md truncate">{entry.name_profile}</TableCell>
                      <TableCell className="max-w-md truncate">{entry.level ? entry.level.toUpperCase() : entry.level}</TableCell>
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
        <ProfileForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={editingEntry || undefined}
          isEditing={!!editingEntry}
        />
      </div>
    </MainLayout>
  );
}

