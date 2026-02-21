import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, ArrowRight, Link2, Unlink } from 'lucide-react';
import { Task } from '@/lib/dataStructures';
import { toast } from 'sonner';

interface GraphSectionProps {
  tasks: Task[];
  onAddDependency: (taskId: string, dependsOnId: string) => boolean;
  getDependencies: (taskId: string) => Task[];
  getTopologicalOrder: () => Task[];
}

export const GraphSection = ({ 
  tasks, 
  onAddDependency, 
  getDependencies,
  getTopologicalOrder 
}: GraphSectionProps) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [dependsOn, setDependsOn] = useState<string>('');
  const [viewingDependencies, setViewingDependencies] = useState<string>('');
  const [topOrder, setTopOrder] = useState<Task[]>([]);

  const handleAddDependency = () => {
    if (!selectedTask || !dependsOn) {
      toast.error('Please select both tasks');
      return;
    }
    if (selectedTask === dependsOn) {
      toast.error('A task cannot depend on itself');
      return;
    }
    
    const success = onAddDependency(selectedTask, dependsOn);
    if (success) {
      toast.success('Dependency added to graph');
      setSelectedTask('');
      setDependsOn('');
    } else {
      toast.error('Cannot add dependency (would create cycle)');
    }
  };

  const handleViewDependencies = (taskId: string) => {
    setViewingDependencies(taskId);
  };

  const handleGetTopologicalOrder = () => {
    const order = getTopologicalOrder();
    setTopOrder(order);
    toast.success('Topological sort completed');
  };

  const currentDependencies = viewingDependencies ? getDependencies(viewingDependencies) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Task Dependencies</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Directed Acyclic Graph (DAG) — Manage task relationships
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-ds-graph/10 rounded-lg">
                <Link2 className="w-4 h-4 text-ds-graph" />
              </div>
              Add Dependency
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              graph.addEdge(taskA, taskB) — taskA depends on taskB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Task</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select task..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">depends on</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Depends On</label>
                <Select value={dependsOn} onValueChange={setDependsOn}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select dependency..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.filter(t => t.id !== selectedTask).map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full gap-2"
                variant="graph"
                onClick={handleAddDependency}
                disabled={!selectedTask || !dependsOn}
              >
                <Link2 className="w-4 h-4" />
                Add Dependency
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-ds-graph/10 rounded-lg">
                <Network className="w-4 h-4 text-ds-graph" />
              </div>
              View Dependencies
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              graph.getDependencies(taskId) — Get all prerequisites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={viewingDependencies} onValueChange={handleViewDependencies}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select task to view dependencies..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {viewingDependencies && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Dependencies for: {tasks.find(t => t.id === viewingDependencies)?.title}
                  </h4>
                  {currentDependencies.length > 0 ? (
                    <div className="space-y-2">
                      {currentDependencies.map((dep) => (
                        <div key={dep.id} className="flex items-center gap-2 p-2 bg-background rounded">
                          <ArrowRight className="w-4 h-4 text-ds-graph" />
                          <span className="text-sm text-foreground">{dep.title}</span>
                          <Badge variant="outline" className="ml-auto">{dep.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No dependencies</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-ds-graph/10 rounded-lg">
              <Network className="w-4 h-4 text-ds-graph" />
            </div>
            Topological Order
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            graph.topologicalSort() — Execute tasks in dependency order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="mb-4 gap-2"
            variant="graph"
            onClick={handleGetTopologicalOrder}
            disabled={tasks.length === 0}
          >
            <Network className="w-4 h-4" />
            Get Execution Order
          </Button>

          {topOrder.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topOrder.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="px-3 py-2 bg-ds-graph/10 border border-ds-graph/30 rounded-lg">
                    <span className="text-xs text-ds-graph font-mono mr-2">{index + 1}.</span>
                    <span className="text-sm text-foreground">{task.title}</span>
                  </div>
                  {index < topOrder.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click the button to generate execution order</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Graph Operations</h4>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <p>• <span className="text-ds-graph">addVertex(task)</span> — Add task node — O(1)</p>
              <p>• <span className="text-ds-graph">addEdge(a, b)</span> — Add dependency — O(1)</p>
              <p>• <span className="text-ds-graph">topologicalSort()</span> — Get order — O(V+E)</p>
              <p>• <span className="text-ds-graph">hasCycle()</span> — Detect cycles — O(V+E)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
