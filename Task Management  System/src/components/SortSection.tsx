import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, ArrowUpDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task, sortingAlgorithms, SortField, SortOrder } from '@/lib/dataStructures';

interface SortSectionProps {
  tasks: Task[];
  onSort: (algorithm: keyof typeof sortingAlgorithms, field: SortField, order: SortOrder) => Task[];
}

export const SortSection = ({ tasks, onSort }: SortSectionProps) => {
  const [algorithm, setAlgorithm] = useState<keyof typeof sortingAlgorithms>('quick');
  const [field, setField] = useState<SortField>('priority');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [sortTime, setSortTime] = useState<number | null>(null);

  const handleSort = () => {
    const startTime = performance.now();
    const result = onSort(algorithm, field, order);
    const endTime = performance.now();
    setSortedTasks(result);
    setSortTime(endTime - startTime);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-ds-queue" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-accent" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-accent text-accent-foreground">Medium</Badge>;
      case 'low': return <Badge className="bg-primary/20 text-primary">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Sort Tasks</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Multiple sorting algorithms — Compare performance on your data
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-ds-sort/10 rounded-lg">
              <ArrowDownUp className="w-4 h-4 text-ds-sort" />
            </div>
            Sorting Algorithms
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Choose algorithm, field, and order to sort tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Algorithm</label>
              <Select value={algorithm} onValueChange={(v: any) => setAlgorithm(v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sortingAlgorithms).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name} <span className="text-muted-foreground">({value.complexity})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
              <Select value={field} onValueChange={(v: any) => setField(v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Order</label>
              <Select value={order} onValueChange={(v: any) => setOrder(v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending ↑</SelectItem>
                  <SelectItem value="desc">Descending ↓</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full gap-2"
                variant="sort"
                onClick={handleSort}
                disabled={tasks.length === 0}
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort ({tasks.length} tasks)
              </Button>
            </div>
          </div>

          {sortTime !== null && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
              <Badge className="bg-ds-sort/20 text-ds-sort">
                {sortingAlgorithms[algorithm].name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Sorted {sortedTasks.length} tasks in{' '}
                <span className="font-mono text-foreground">{sortTime.toFixed(3)}ms</span>
              </span>
              <Badge variant="outline" className="ml-auto font-mono">
                {sortingAlgorithms[algorithm].complexity}
              </Badge>
            </div>
          )}

          {sortedTasks.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-3 bg-muted rounded-lg animate-slide-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className="w-8 h-8 rounded-full bg-ds-sort/20 text-ds-sort text-sm font-mono flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="font-medium text-foreground">{task.title}</span>
                    </div>
                  </div>
                  {getPriorityBadge(task.priority)}
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowDownUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select options and click Sort to see results</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sortingAlgorithms).map(([key, value]) => (
          <Card key={key} className={`bg-card border-border transition-all ${algorithm === key ? 'border-ds-sort' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{value.name}</h4>
                <Badge variant="outline" className="font-mono">{value.complexity}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {key === 'bubble' && 'Simple comparison-based sort. Best for small or nearly sorted data.'}
                {key === 'selection' && 'Finds minimum element repeatedly. Minimal memory usage.'}
                {key === 'insertion' && 'Builds sorted array one item at a time. Great for small datasets.'}
                {key === 'merge' && 'Divide and conquer approach. Stable and consistent performance.'}
                {key === 'quick' && 'Efficient general-purpose sort. Best average-case performance.'}
                {key === 'heap' && 'Uses binary heap structure. Good for priority-based sorting.'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
