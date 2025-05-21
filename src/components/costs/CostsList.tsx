
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCosts, deleteCost, Cost } from '@/store/slices/costsSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CostModal from './CostModal';
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

const CostsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  
  const dispatch = useAppDispatch();
  const { costs, loading } = useAppSelector((state) => state.costs);
  const { currentProject } = useProject();

  const handleEditCost = (cost: Cost) => {
    setEditingCost(cost);
    setIsModalOpen(true);
  };

  const handleDeleteCost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this cost?')) {
      const resultAction = await dispatch(deleteCost(id));
      
      if (deleteCost.fulfilled.match(resultAction)) {
        toast.success('Cost deleted successfully');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCost(null);
  };

  useEffect(() => {
    if (currentProject) {
      dispatch(fetchCosts(currentProject.id));
    }
  }, [dispatch, currentProject]);

  return (
    <Card className="bg-pink-300 border-brand-200w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Other Costs</CardTitle>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600"
        >
          Add Cost
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">Loading costs...</div>
        ) : costs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No additional costs yet. Click the "Add Cost" button to add other costs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.description}</TableCell>
                    <TableCell className="text-right">${cost.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCost(cost)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteCost(cost.id)}
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

        <CostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCost={editingCost}
        />
      </CardContent>
    </Card>
  );
};

export default CostsList;
