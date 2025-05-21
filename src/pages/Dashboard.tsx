
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import ItemsList from '@/components/items/ItemsList';
import CostsList from '@/components/costs/CostsList';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProject } from '@/contexts/ProjectContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { currentProject, projects } = useProject();

  useEffect(() => {
    console.log("Dashboard - Auth state:", user ? "Authenticated" : "Not authenticated");
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Project Dashboard</h2>
            
            <ProjectSelector />
            
            {currentProject ? (
              <>
                <ProjectSummary />
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <ItemsList />
                  <CostsList />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                {projects.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-2">Welcome to Project Cost Manager</h3>
                    <p className="text-gray-600 mb-6">
                      Get started by creating your first project. Click the "New Project" button in the header.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-2">Select a project</h3>
                    <p className="text-gray-600 mb-6">
                      Please select a project from the dropdown to view its details.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
