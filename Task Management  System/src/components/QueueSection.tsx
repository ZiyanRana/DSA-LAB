import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListOrdered, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Task } from '@/lib/dataStructures';
import { toast } from 'sonner';

interface QueueSectionProps {
  queuedTasks: Task[];
  lastExecuted: Task | null;
  onExecute: () => Task | null;
}

export const QueueSection = ({ queuedTasks, lastExecuted, onExecute }: QueueSectionProps) => {
  const handleExecute = () => {
    const task = onExecute();
    if (task) {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Executed: {task.title}</span>
        </div>
      );
    } else {
      toast.error('Queue is empty!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Execute Queue</h2>
        <p className="text-muted-foreground font-mono text-sm">
          FIFO Queue — First In, First Out execution order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-ds-queue/10 rounded-lg">
                <ListOrdered className="w-4 h-4 text-ds-queue" />
              </div>
              Task Queue
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              front → [task1] → [task2] → [task3] → rear
            </CardDescription>
          </CardHeader>
          <CardContent>
            {queuedTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ListOrdered className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Queue is empty. Add tasks from the task list.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queuedTasks.map((task, index) => (
                  <div
                    key={`${task.id}-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-ds-queue/20 text-ds-queue text-xs font-mono flex items-center justify-center">
                        {index + 1}
                      </span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs border-ds-queue text-ds-queue">
                          FRONT
                        </Badge>
                      )}
                      {index === queuedTasks.length - 1 && queuedTasks.length > 1 && (
                        <Badge variant="outline" className="text-xs border-muted-foreground">
                          REAR
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{task.title}</span>
                    <Badge className="ml-auto bg-accent/20 text-accent">{task.priority}</Badge>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="w-full mt-4 gap-2"
              variant="queue"
              onClick={handleExecute}
              disabled={queuedTasks.length === 0}
            >
              <Play className="w-4 h-4" />
              Execute Next Task (Dequeue)
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              Last Executed
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              queue.dequeue() → returns front element
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastExecuted ? (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground text-lg">{lastExecuted.title}</span>
                </div>
                {lastExecuted.description && (
                  <p className="text-sm text-muted-foreground mb-3">{lastExecuted.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">Completed</Badge>
                  <Badge variant="outline">{lastExecuted.priority}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks executed yet.</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">Queue Operations</h4>
              <div className="space-y-2 font-mono text-xs text-muted-foreground">
                <p>• <span className="text-ds-queue">enqueue(task)</span> — Add to rear — O(1)</p>
                <p>• <span className="text-ds-queue">dequeue()</span> — Remove from front — O(1)</p>
                <p>• <span className="text-ds-queue">peek()</span> — View front element — O(1)</p>
                <p>• <span className="text-ds-queue">isEmpty()</span> — Check if empty — O(1)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
