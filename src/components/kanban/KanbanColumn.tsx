import { Plus } from 'lucide-react';
import { Column } from '@/types/project';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  index: number;
}

const columnStyles: Record<string, string> = {
  'todo': 'border-t-muted-foreground/50',
  'in-progress': 'border-t-primary',
  'review': 'border-t-warning',
  'done': 'border-t-success',
};

export function KanbanColumn({ column, index }: KanbanColumnProps) {
  return (
    <div 
      className="flex h-full w-80 flex-shrink-0 flex-col animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Column Header */}
      <div className={cn(
        "mb-4 rounded-lg border border-border bg-card/50 px-4 py-3 border-t-4",
        columnStyles[column.id]
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{column.title}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {column.tasks.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
        {column.tasks.map((task, taskIndex) => (
          <div 
            key={task.id}
            style={{ animationDelay: `${(index * 100) + (taskIndex * 50)}ms` }}
          >
            <TaskCard task={task} />
          </div>
        ))}
        
        {/* Add Task Button */}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
