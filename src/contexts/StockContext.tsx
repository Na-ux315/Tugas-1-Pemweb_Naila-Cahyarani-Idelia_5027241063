import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StockItem, StockCategory } from '@/types';
import { toast } from '@/hooks/use-toast';

interface StockContextType {
  items: StockItem[];
  addItem: (item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<StockItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => StockItem | undefined;
  getItemsByCategory: (category: StockCategory) => StockItem[];
  getLowStockItems: () => StockItem[];
}

const StockContext = createContext<StockContextType | undefined>(undefined);

// Data demo untuk contoh
const DEMO_ITEMS: StockItem[] = [
  {
    id: '1',
    name: 'Beras',
    category: 'dapur',
    quantity: 2,
    unit: 'kg',
    minStock: 5,
    notes: 'Beras pandan wangi',
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Minyak Goreng',
    category: 'dapur',
    quantity: 1,
    unit: 'liter',
    minStock: 2,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Sabun Cuci Piring',
    category: 'kebersihan',
    quantity: 3,
    unit: 'botol',
    minStock: 2,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Pasta Gigi',
    category: 'kamar_mandi',
    quantity: 1,
    unit: 'tube',
    minStock: 2,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Paracetamol',
    category: 'obat',
    quantity: 10,
    unit: 'tablet',
    minStock: 5,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function StockProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StockItem[]>(DEMO_ITEMS);

  const addItem = (newItem: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: StockItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setItems(prev => [...prev, item]);
    
    toast({
      title: 'Barang Ditambahkan! ✓',
      description: `${item.name} berhasil ditambahkan ke stok`,
    });
  };

  const updateItem = (id: string, updates: Partial<StockItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));
    
    toast({
      title: 'Stok Diperbarui! ✓',
      description: 'Perubahan berhasil disimpan',
    });
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: 'Barang Dihapus',
      description: item ? `${item.name} telah dihapus dari stok` : 'Barang telah dihapus',
    });
  };

  const getItemById = (id: string) => items.find(item => item.id === id);

  const getItemsByCategory = (category: StockCategory) => 
    items.filter(item => item.category === category);

  const getLowStockItems = () => 
    items.filter(item => item.quantity <= item.minStock);

  return (
    <StockContext.Provider value={{
      items,
      addItem,
      updateItem,
      deleteItem,
      getItemById,
      getItemsByCategory,
      getLowStockItems,
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}
