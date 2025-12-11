import { useState } from 'react';
import { Plus, MoreHorizontal, FolderKanban, CheckCircle2, Clock, Users } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { projects as initialProjects, tasks as initialTasks, users } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Task, Project } from '@/types/project';

const projectColors = [
  'hsl(185 70% 42%)',
  'hsl(270 70% 55%)',
  'hsl(38 92% 50%)',
  'hsl(145 65% 42%)',
  'hsl(0 72% 55%)',
  'hsl(220 70% 55%)',
];

const Projects = () => {
  const { isAdmin } = useAuth();
  const [activeProject, setActiveProject] = useState('1');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // New project form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(projectColors[0]);
  
  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    const newProject: Project = {
      id: String(Date.now()),
      name: newProjectName,
      color: newProjectColor,
      taskCount: 0,
      completedCount: 0,
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectColor(projectColors[0]);
    setNewProjectOpen(false);
    toast.success('Project created successfully');
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedProjectId) {
      toast.error('Task title is required');
      return;
    }
    
    const assignee = users.find(u => u.id === newTaskAssignee);
    
    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      priority: newTaskPriority,
      assignee,
      projectId: selectedProjectId,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    
    // Update project task count
    setProjects(projects.map(p => 
      p.id === selectedProjectId 
        ? { ...p, taskCount: p.taskCount + 1 }
        : p
    ));
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskAssignee('');
    setNewTaskOpen(false);
    toast.success('Task created successfully');
  };

  const openNewTaskDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setNewTaskOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName="Projects" />
        
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {/* Header with Add Project Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Projects</h1>
              <p className="text-muted-foreground mt-1">Manage and track all your projects</p>
            </div>
            
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 gradient-primary text-primary-foreground">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      placeholder="Enter project name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      {projectColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewProjectColor(color)}
                          className={cn(
                            'h-8 w-8 rounded-full transition-all',
                            newProjectColor === color && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateProject} className="w-full">
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'done').length;
              const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress').length;
              const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
              
              return (
                <div
                  key={project.id}
                  className="group bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-hover transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{projectTasks.length} tasks</p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-md transition-all">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">{completedTasks} done</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{inProgressTasks} active</span>
                    </div>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {users.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
                        >
                          {user.initials}
                        </div>
                      ))}
                      {users.length > 3 && (
                        <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                          +{users.length - 3}
                        </div>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => openNewTaskDialog(project.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Task
                      </Button>
                    )}
                  </div>

                  {/* Project Tasks List */}
                  {projectTasks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Recent Tasks</h4>
                      <div className="space-y-2">
                        {projectTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div className={cn(
                              'h-2 w-2 rounded-full',
                              task.status === 'done' ? 'bg-success' :
                              task.status === 'in-progress' ? 'bg-primary' :
                              'bg-muted-foreground'
                            )} />
                            <span className="text-muted-foreground line-clamp-1">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* New Task Dialog */}
          <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter task description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTaskPriority} onValueChange={(v: any) => setNewTaskPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Projects;
