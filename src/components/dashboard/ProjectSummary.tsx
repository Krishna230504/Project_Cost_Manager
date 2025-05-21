
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';

const ProjectSummary = () => {
  const { items } = useAppSelector((state) => state.items);
  const { costs } = useAppSelector((state) => state.costs);
  const { currentProject } = useProject();

  const calculateItemsTotal = () => {
    return items.reduce((acc, item) => acc + item.cost, 0);
  };

  const calculateCostsTotal = () => {
    return costs.reduce((acc, cost) => acc + cost.amount, 0);
  };

  const calculateTotal = () => {
    return calculateItemsTotal() + calculateCostsTotal();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-yellow-300 border-brand-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-brand-700">Items Total</CardTitle>
          <CardDescription>Sum of all items</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-brand-700">
            Rs{calculateItemsTotal().toFixed(2)}
          </p>
          <p className="text-sm text-brand-600 mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-300 border-teal-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-teal-700">Additional Costs</CardTitle>
          <CardDescription>Sum of other costs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-teal-700">
            Rs{calculateCostsTotal().toFixed(2)}
          </p>
          <p className="text-sm text-teal-600 mt-1">
            {costs.length} cost item{costs.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-red-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Project Cost</CardTitle>
          <CardDescription className="text-white/80">Items + Additional Costs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            Rs{calculateTotal().toFixed(2)}
          </p>
          <p className="text-sm text-white/80 mt-1">
            {currentProject ? currentProject.name : 'No project selected'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSummary;
