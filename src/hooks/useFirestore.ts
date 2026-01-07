'use client';

import { useState, useEffect } from 'react';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export function useFirestore<T>(service: FirestoreService<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.getAll(user?.uid);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const create = async (newData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const id = await service.create({
        ...newData,
        userId: user?.uid,
      } as Omit<T, "id" | "createdAt" | "updatedAt">);
      await fetchData(); // Refresh data
      toast.success('Item criado com sucesso!');
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar item';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updateData: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      await service.update(id, updateData);
      await fetchData(); // Refresh data
      toast.success('Item atualizado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar item';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      await service.delete(id);
      await fetchData(); // Refresh data
      toast.success('Item removido com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const search = async (field: string, value: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.search(field, value, user?.uid);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    search,
    refresh: fetchData,
  };
}

