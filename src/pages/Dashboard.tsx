import { useState } from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Calendar, MoreHorizontal } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { projects, tasks, getColumns } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [activeProject, setActiveProject] = useState('1');
  
  const currentProject = projects.find(p => p.id === activeProject) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === activeProject);
  const columns = getColumns(projectTasks);
  const allTasks = tasks;
  
  const stats = {
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.status === 'done').length,
    inProgress: projectTasks.filter(t => t.status === 'in-progress').length,
    overdue: 2,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/20 text-destructive';
      case 'high': return 'bg-warning/20 text-warning';
      case 'medium': return 'bg-primary/20 text-primary';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-success/20 text-success';
      case 'in-progress': return 'bg-primary/20 text-primary';
      case 'review': return 'bg-warning/20 text-warning';
      case 'todo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName={currentProject.name} />
        
        <div className="flex-1 overflow-auto custom-scrollbar">
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
          <section className="px-6 py-6">
            <KanbanBoard columns={columns} />
          </section>

          {/* All Tasks Section */}
          <section className="px-6 py-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">All Tasks</h2>
              <Badge variant="secondary" className="text-muted-foreground">
                {allTasks.length} total
              </Badge>
            </div>
            
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-soft">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Task</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignee</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allTasks.map((task) => {
                      const project = projects.find(p => p.id === task.projectId);
                      return (
                        <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{task.title}</span>
                              {task.description && (
                                <span className="text-sm text-muted-foreground line-clamp-1">{task.description}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-2.5 w-2.5 rounded-full" 
                                style={{ backgroundColor: project?.color }}
                              />
                              <span className="text-sm text-foreground">{project?.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={cn('text-xs capitalize', getStatusColor(task.status))}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={cn('text-xs capitalize', getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {task.dueDate ? (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                  {task.assignee.initials}
                                </div>
                                <span className="text-sm text-foreground">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button className="p-1 hover:bg-muted rounded-md transition-colors">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
