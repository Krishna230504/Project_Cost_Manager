
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject } from '@/contexts/ProjectContext';

const ProjectSelector = () => {
  const { projects, currentProject, setCurrentProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectProject = (projectId: string) => {
    const selected = projects.find(p => p.id === projectId);
    if (selected) {
      setCurrentProject(selected);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="mb-6 border-brand-200">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full bg-green-300 border-brand-200 md:w-auto justify-between">
            <span className="truncate">
              {currentProject 
                ? currentProject.name 
                : 'Select a project'}
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
            >
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
              ></path>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects.length === 0 ? (
            <DropdownMenuItem disabled>No projects available</DropdownMenuItem>
          ) : (
            projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={currentProject?.id === project.id ? 'bg-brand-100' : ''}
              >
                {project.name}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectSelector;
