
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addItem, updateItem, Item } from '@/store/slices/itemsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: Item | null;
}

const ItemModal = ({ isOpen, onClose, editingItem }: ItemModalProps) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  
  const dispatch = useAppDispatch();
  const { currentProject } = useProject();

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCost(editingItem.cost.toString());
    } else {
      setName('');
      setCost('');
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !cost.trim() || !currentProject) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue < 0) {
      toast.error('Cost must be a positive number');
      return;
    }
    
    try {
      if (editingItem) {
        await dispatch(updateItem({
          id: editingItem.id,
          name: name.trim(),
          cost: costValue,
        }));
        
        toast.success('Item updated successfully');
      } else {
        await dispatch(addItem({
          name: name.trim(),
          cost: costValue,
          projectId: currentProject.id,
        }));
        
        toast.success('Item added successfully');
      }
      
      onClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {editingItem 
              ? 'Update the details of the item' 
              : 'Add a new item to your project'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Rs)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-brand-500 hover:bg-brand-600"
            >
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
