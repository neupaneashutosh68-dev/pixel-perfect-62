import { useState } from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { projects, tasks, getColumns } from '@/data/mockData';

const Index = () => {
  const [activeProject, setActiveProject] = useState('1');
  
  const currentProject = projects.find(p => p.id === activeProject) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === activeProject);
  const columns = getColumns(projectTasks);
  
  const stats = {
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.status === 'done').length,
    inProgress: projectTasks.filter(t => t.status === 'in-progress').length,
    overdue: 2, // Mock data
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName={currentProject.name} />
        
        <div className="flex-1 overflow-auto">
          {/* Stats Section */}
          <section className="border-b border-border bg-muted/30 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Tasks"
                value={stats.total}
                icon={ListTodo}
                trend={{ value: 12, label: 'vs last week' }}
                variant="default"
              />
              <StatsCard
                title="In Progress"
                value={stats.inProgress}
                icon={Clock}
                variant="primary"
              />
              <StatsCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                trend={{ value: 24, label: 'this week' }}
                variant="success"
              />
              <StatsCard
                title="Completion Rate"
                value={`${Math.round((stats.completed / stats.total) * 100)}%`}
                icon={TrendingUp}
                variant="warning"
              />
            </div>
          </section>

          {/* Kanban Board */}
          <section className="flex-1 px-6 py-6">
            <KanbanBoard columns={columns} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
