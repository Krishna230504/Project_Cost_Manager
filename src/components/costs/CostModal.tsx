
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addCost, updateCost, Cost } from '@/store/slices/costsSlice';
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

interface CostModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCost: Cost | null;
}

const CostModal = ({ isOpen, onClose, editingCost }: CostModalProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const dispatch = useAppDispatch();
  const { currentProject } = useProject();

  useEffect(() => {
    if (editingCost) {
      setDescription(editingCost.description);
      setAmount(editingCost.amount.toString());
    } else {
      setDescription('');
      setAmount('');
    }
  }, [editingCost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount.trim() || !currentProject) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 0) {
      toast.error('Amount must be a positive number');
      return;
    }
    
    try {
      if (editingCost) {
        await dispatch(updateCost({
          id: editingCost.id,
          description: description.trim(),
          amount: amountValue,
        }));
        
        toast.success('Cost updated successfully');
      } else {
        await dispatch(addCost({
          description: description.trim(),
          amount: amountValue,
          projectId: currentProject.id,
        }));
        
        toast.success('Cost added successfully');
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
          <DialogTitle>{editingCost ? 'Edit Cost' : 'Add New Cost'}</DialogTitle>
          <DialogDescription>
            {editingCost 
              ? 'Update the details of the cost' 
              : 'Add a new additional cost to your project'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="E.g., Shipping, Tax, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rs)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              {editingCost ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CostModal;
