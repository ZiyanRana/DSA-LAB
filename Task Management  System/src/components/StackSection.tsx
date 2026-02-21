import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Undo2, ArrowDown, Layers } from 'lucide-react';
import { Action } from '@/lib/dataStructures';
import { toast } from 'sonner';

interface StackSectionProps {
  canUndo: boolean;
  onUndo: () => Action | null;
  getHistory: () => Action[];
}

export const StackSection = ({ canUndo, onUndo, getHistory }: StackSectionProps) => {
  const history = getHistory();

  const handleUndo = () => {
    const action = onUndo();
    if (action) {
      toast.success(
        <div className="flex items-center gap-2">
          <Undo2 className="w-4 h-4 text-ds-stack" />
          <span>Undid: {action.type} operation</span>
        </div>
      );
    } else {
      toast.error('Nothing to undo!');
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'add': return 'bg-ds-linkedlist/20 text-ds-linkedlist';
      case 'delete': return 'bg-destructive/20 text-destructive';
      case 'update': return 'bg-accent/20 text-accent';
      case 'execute': return 'bg-ds-queue/20 text-ds-queue';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Undo Stack</h2>
        <p className="text-muted-foreground font-mono text-sm">
          LIFO Stack — Last In, First Out for undo operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-ds-stack/10 rounded-lg">
                <History className="w-4 h-4 text-ds-stack" />
              </div>
              Action History Stack
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              top → [last action] → [previous] → ... → bottom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mb-4 gap-2"
              variant="stack"
              onClick={handleUndo}
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
              Undo Last Action (Pop)
            </Button>

            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Stack is empty. Perform some actions to see history.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs border-ds-stack text-ds-stack">
                          TOP
                        </Badge>
                      )}
                      <span className="w-6 h-6 rounded bg-ds-stack/20 text-ds-stack text-xs font-mono flex items-center justify-center">
                        {history.length - index}
                      </span>
                    </div>
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <Badge className={getActionColor(action.type)}>
                      {action.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                      {action.taskId.slice(0, 15)}...
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-ds-stack/10 rounded-lg">
                <History className="w-4 h-4 text-ds-stack" />
              </div>
              Stack Visualization
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              Visual representation of the call stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {/* Stack visualization */}
              <div className="w-48 space-y-1">
                {history.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Empty Stack</span>
                  </div>
                ) : (
                  history.slice(0, 5).map((action, index) => (
                    <div
                      key={index}
                      className={`h-12 rounded-lg flex items-center justify-center font-mono text-sm transition-all ${
                        index === 0 ? 'bg-ds-stack text-primary-foreground terminal-glow' : 'bg-ds-stack/30 text-ds-stack'
                      }`}
                      style={{
                        opacity: 1 - index * 0.15,
                      }}
                    >
                      {action.type}
                    </div>
                  ))
                )}
                {history.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    +{history.length - 5} more...
                  </div>
                )}
              </div>

              {/* Stack pointer */}
              {history.length > 0 && (
                <div className="flex items-center gap-2 mt-4 text-ds-stack">
                  <span className="text-sm font-mono">← TOP</span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">Stack Operations</h4>
              <div className="space-y-2 font-mono text-xs text-muted-foreground">
                <p>• <span className="text-ds-stack">push(action)</span> — Add to top — O(1)</p>
                <p>• <span className="text-ds-stack">pop()</span> — Remove from top — O(1)</p>
                <p>• <span className="text-ds-stack">peek()</span> — View top element — O(1)</p>
                <p>• <span className="text-ds-stack">isEmpty()</span> — Check if empty — O(1)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
