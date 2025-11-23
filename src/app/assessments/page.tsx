'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductivityForm } from '@/components/Productivity/ProductivityForm';
import { Assessment } from '@/types';
import { Plus, Search, TrendingUp, BarChart3, Target, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { myApi } from '@/service/api';
import { AssesmentForm } from '@/components/Assesment/AssesmentForm';

export default function Assessments() {
  const [data, setData] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFetchData() {
    setLoading(true);
    try {
      const response = await myApi.get('/api/assessmentall');
      const result = response.data
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEntries = data.filter(entry =>
    entry.number_assessment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.operation.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleEdit = (entry: Assessment) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta métrica?')) {
      await myApi.delete(`/api/assessments/${id}`);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'patrol': return 'Patrulhamento';
      case 'inspection': return 'Inspeção';
      case 'report': return 'Relatório';
      case 'training': return 'Treinamento';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'patrol': return 'default';
      case 'inspection': return 'secondary';
      case 'report': return 'outline';
      case 'training': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'planned': return 'outline';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in-progress': return 'Em Andamento';
      case 'planned': return 'Planejado';
      default: return status;
    }
  };

  const averageProductivity = data.length > 0
    ? data.reduce((acc, entry) => acc + Number(entry.fine), 0)
    : 0;

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
            <h1 className="text-3xl font-bold text-white">Autuações</h1>
            <p className="text-white">Acompanhamento de autuações de infrações ambientais</p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Autuação
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de multas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {averageProductivity.toFixed(1)} R$
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de autuações</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de autuações ativas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.filter(e => e.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de autuações anuladas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {data.filter(e => e.status === 'anulada').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Produtividade</CardTitle>
            <CardDescription>
              Evolução da produtividade ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de autuações será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        {/* Productivity Table */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de autuações</CardTitle>
            <CardDescription>
              Lista de todas as autuações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operação</TableHead>
                  <TableHead>Nº da autuação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhuma métrica encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-medium">{entry.operation}</TableCell>
                      <TableCell className="font-medium">{entry.number_assessment}</TableCell>
                      <TableCell>
                        {format(new Date(entry.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-medium">{entry.city}</TableCell>
                      <TableCell>
                        <Badge variant={getCategoryColor(entry.status)}>
                          {getCategoryLabel(entry.status)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Form Modal */}
        <AssesmentForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={editingEntry || undefined}
          isEditing={!!editingEntry}
        />
      </div>
    </MainLayout>
  );
}

