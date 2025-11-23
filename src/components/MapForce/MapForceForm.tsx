'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapForce } from '@/types';
import { X } from 'lucide-react';

interface MapForceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MapForce, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  initialData?: MapForce;
  isEditing?: boolean;
}

export function MapForceForm({ isOpen, onClose, onSubmit, initialData, isEditing = false }: MapForceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: {
      lat: initialData?.location?.lat || -1.4558,
      lng: initialData?.location?.lng || -48.4902,
      address: initialData?.location?.address || '',
    },
    personnel: initialData?.personnel || 1,
    status: initialData?.status || 'active' as 'active' | 'standby' | 'offline',
    description: initialData?.description || '',
    equipment: initialData?.equipment || [],
  });
  const [newEquipment, setNewEquipment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        personnel: Number(formData.personnel),
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        location: {
          lat: -1.4558,
          lng: -48.4902,
          address: '',
        },
        personnel: 1,
        status: 'active',
        description: '',
        equipment: [],
      });
      setNewEquipment('');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === 'lat' || locationField === 'lng' ? Number(value) : value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(item => item !== equipment)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEquipment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Unidade Operacional' : 'Nova Unidade Operacional'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da unidade.' : 'Adicione uma nova unidade ao mapa de força.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Unidade</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Base Alpha, Posto Bravo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personnel">Número de Pessoal</Label>
              <Input
                id="personnel"
                type="number"
                min="1"
                value={formData.personnel}
                onChange={(e) => handleInputChange('personnel', Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço/Localização</Label>
            <Input
              id="address"
              value={formData.location.address}
              onChange={(e) => handleInputChange('location.address', e.target.value)}
              placeholder="Endereço completo da unidade"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.location.lat}
                onChange={(e) => handleInputChange('location.lat', e.target.value)}
                placeholder="-1.4558"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.location.lng}
                onChange={(e) => handleInputChange('location.lng', e.target.value)}
                placeholder="-48.4902"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição da unidade e suas responsabilidades..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Equipamentos</Label>
            <div className="flex space-x-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite um equipamento e pressione Enter"
              />
              <Button type="button" onClick={addEquipment} variant="outline">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.equipment.map((item, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeEquipment(item)}
                  />
                </Badge>
              ))}
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
      </DialogContent>
    </Dialog>
  );
}

