import { Column } from '@/types/project';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  columns: Column[];
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4">
      {columns.map((column, index) => (
        <KanbanColumn key={column.id} column={column} index={index} />
      ))}
    </div>
  );
}
