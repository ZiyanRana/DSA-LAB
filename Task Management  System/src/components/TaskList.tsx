import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Layers, 
  Trash2, 
  Edit, 
  ListOrdered,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Task } from '@/lib/dataStructures';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => boolean;
  onUpdate: (id: string, updates: Partial<Task>) => Task | null;
  onEnqueue: (task: Task) => void;
}

export const TaskList = ({ tasks, onDelete, onUpdate, onEnqueue }: TaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleDelete = (id: string) => {
    const success = onDelete(id);
    if (success) {
      toast.success('Task deleted from Linked List');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdate(id, { title: editTitle.trim() });
      toast.success('Task updated in Linked List');
    }
    setEditingId(null);
  };

  const handleEnqueue = (task: Task) => {
    onEnqueue(task);
    toast.success(
      <div className="flex items-center gap-2">
        <ListOrdered className="w-4 h-4 text-ds-queue" />
        <span>Task added to execution queue</span>
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-accent text-accent-foreground">Medium</Badge>;
      case 'low': return <Badge className="bg-primary/20 text-primary">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-ds-queue" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">All Tasks</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Doubly Linked List traversal — O(n) display operation
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-ds-linkedlist/10 rounded-lg">
                  <Layers className="w-4 h-4 text-ds-linkedlist" />
                </div>
                Task List
              </CardTitle>
              <CardDescription className="font-mono text-xs mt-1">
                head → node1 ⇄ node2 ⇄ node3 → tail
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px] bg-input border-border">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found. Add a task to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    "relative flex items-center gap-4 p-4 bg-muted rounded-lg transition-all hover:bg-muted/80 animate-slide-in",
                    task.status === 'completed' && "opacity-60"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Node visualization */}
                  <div className="flex items-center gap-1">
                    {index > 0 && <ArrowLeft className="w-3 h-3 text-muted-foreground" />}
                    <div className="w-8 h-8 rounded-full bg-ds-linkedlist/20 border border-ds-linkedlist/50 flex items-center justify-center text-xs font-mono text-ds-linkedlist">
                      {index + 1}
                    </div>
                    {index < filteredTasks.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-input"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(task.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(task.status)}
                          <span className={cn(
                            "font-medium text-foreground",
                            task.status === 'completed' && "line-through"
                          )}>
                            {task.title}
                          </span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="queue"
                      onClick={() => handleEnqueue(task)}
                      className="gap-1"
                    >
                      <ListOrdered className="w-3 h-3" />
                      Queue
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
