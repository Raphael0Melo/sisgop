'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapForceForm } from '@/components/MapForce/MapForceForm';
import { useFirestore } from '@/hooks/useFirestore';
import { mapForceService } from '@/lib/firestore';
import { MapForce } from '@/types';
import { Plus, Search, MapPin, Users, Shield, Activity, Edit, Trash2, Eye } from 'lucide-react';

export default function HomeMapForce() {
  const { data: units, loading, create, update, remove } = useFirestore<MapForce>(mapForceService);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MapForce | null>(null);

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Omit<MapForce, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    await create(data);
  };

  const handleEdit = (unit: MapForce) => {
    setEditingUnit(unit);
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: Omit<MapForce, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingUnit) {
      await update(editingUnit.id, data);
      setEditingUnit(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta unidade?')) {
      await remove(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUnit(null);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'standby': return 'Standby';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'standby': return 'secondary';
      case 'offline': return 'destructive';
      default: return 'default';
    }
  };

  const totalPersonnel = units.reduce((acc, unit) => acc + unit.personnel, 0);
  const activeUnits = units.filter(unit => unit.status === 'active').length;

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
            <h1 className="text-3xl font-bold text-gray-900">Mapa de Força</h1>
            <p className="text-gray-600">Distribuição e controle de unidades operacionais</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{units.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Ativas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUnits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pessoal</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalPersonnel}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {((activeUnits / Math.max(units.length, 1)) * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa Operacional</CardTitle>
            <CardDescription>
              Visualização geográfica das unidades operacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Mapa interativo será implementado aqui</p>
                <p className="text-sm text-gray-400">Integração com Google Maps ou similar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Table */}
        <Card>
          <CardHeader>
            <CardTitle>Unidades Operacionais</CardTitle>
            <CardDescription>
              Lista de todas as unidades e seus status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou localização..."
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
                  <TableHead>Localização</TableHead>
                  <TableHead>Pessoal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Equipamentos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhuma unidade encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.name}</TableCell>
                      <TableCell className="max-w-md truncate">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {unit.location.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {unit.personnel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(unit.status) as "default" | "secondary" | "destructive" | "outline"}>
                          {getStatusLabel(unit.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {unit.equipment.slice(0, 2).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                          {unit.equipment.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{unit.equipment.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(unit)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(unit.id)}
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
        <MapForceForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingUnit ? handleUpdate : handleCreate}
          initialData={editingUnit || undefined}
          isEditing={!!editingUnit}
        />
      </div>
    </MainLayout>
  );
}

