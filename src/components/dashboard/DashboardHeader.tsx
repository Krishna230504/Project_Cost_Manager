
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProject } from '@/contexts/ProjectContext';
import AddProjectModal from '../projects/AddProjectModal';

const DashboardHeader = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { currentProject } = useProject();

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    
    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-brand-600">Project Cost Manager</h1>
            {currentProject && (
              <span className="ml-4 text-sm text-gray-500">
                Current Project: <span className="font-medium text-gray-900">{currentProject.name}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="bg-black-100 text-black hover:bg-brand-600"
              onClick={() => setIsAddModalOpen(true)}
            >
              New Project
            </Button>
            
            <div className="relative ml-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AddProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </header>
  );
};

export default DashboardHeader;
