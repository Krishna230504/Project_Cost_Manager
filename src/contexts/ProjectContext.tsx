
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore';
import { useAppSelector } from '../store/hooks';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
  addProject: (name: string, description: string) => Promise<Project | null>;
  updateProject: (id: string, name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const { user } = useAppSelector(state => state.auth);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedProjects: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProjects.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          userId: data.userId,
          createdAt: data.createdAt.toDate(),
        });
      });
      
      setProjects(fetchedProjects);
      
      // Set current project to the first one if there's no current project
      if (fetchedProjects.length > 0 && !currentProject) {
        setCurrentProject(fetchedProjects[0]);
      }
    } catch (error: any) {
      toast.error(`Error fetching projects: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (name: string, description: string): Promise<Project | null> => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const projectsRef = collection(db, 'projects');
      const now = new Date();
      
      const docRef = await addDoc(projectsRef, {
        name,
        description,
        userId: user.uid,
        createdAt: now,
      });
      
      const newProject = {
        id: docRef.id,
        name,
        description,
        userId: user.uid,
        createdAt: now,
      };
      
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject);
      
      toast.success('Project created successfully');
      return newProject;
    } catch (error: any) {
      toast.error(`Error creating project: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, name: string, description: string) => {
    try {
      setLoading(true);
      
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        name,
        description,
        updatedAt: new Date(),
      });
      
      // Update projects list
      const updatedProjects = projects.map(project => {
        if (project.id === id) {
          const updatedProject = {
            ...project,
            name,
            description,
          };
          
          // Also update current project if this is the current one
          if (currentProject && currentProject.id === id) {
            setCurrentProject(updatedProject);
          }
          
          return updatedProject;
        }
        return project;
      });
      
      setProjects(updatedProjects);
      toast.success('Project updated successfully');
    } catch (error: any) {
      toast.error(`Error updating project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
      
      // Remove from projects list
      const filteredProjects = projects.filter(project => project.id !== id);
      setProjects(filteredProjects);
      
      // If we just deleted the current project, set new current project
      if (currentProject && currentProject.id === id) {
        setCurrentProject(filteredProjects.length > 0 ? filteredProjects[0] : null);
      }
      
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error(`Error deleting project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when auth changes
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const value = {
    projects,
    loading,
    currentProject,
    setCurrentProject,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
