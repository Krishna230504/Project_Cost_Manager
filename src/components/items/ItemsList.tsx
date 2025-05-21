
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchItems, deleteItem, Item } from '@/store/slices/itemsSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ItemModal from './ItemModal';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ItemsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.items);
  const { currentProject } = useProject();

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const resultAction = await dispatch(deleteItem(id));
      
      if (deleteItem.fulfilled.match(resultAction)) {
        toast.success('Item deleted successfully');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  useEffect(() => {
    if (currentProject) {
      dispatch(fetchItems(currentProject.id));
    }
  }, [dispatch, currentProject]);

  return (
    <Card className="bg-blue-50 border-brand-200 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Items</CardTitle>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600"
        >
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No items yet. Click the "Add Item" button to add your first item.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">Rs{item.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
      </CardContent>
    </Card>
  );
};

export default ItemsList;
