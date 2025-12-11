import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task, Priority } from '@/types/project';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-primary/15 text-primary' },
  high: { label: 'High', className: 'bg-warning/15 text-warning' },
  urgent: { label: 'Urgent', className: 'bg-destructive/15 text-destructive' },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card p-4 shadow-soft transition-all hover:shadow-hover hover:border-primary/30 animate-scale-in"
    >
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs font-normal px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge 
              variant="secondary" 
              className="text-xs font-normal px-2 py-0.5"
            >
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="font-medium text-card-foreground leading-snug group-hover:text-primary transition-colors">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <span className={cn(
            "rounded-md px-2 py-1 text-xs font-medium",
            priority.className
          )}>
            {priority.label}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
