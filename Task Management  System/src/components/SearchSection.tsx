import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/lib/dataStructures';

interface SearchSectionProps {
  onSearch: (query: string) => Task[];
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Task[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(onSearch(value));
      setHasSearched(true);
    } else {
      setResults([]);
      setHasSearched(false);
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
        <h2 className="text-2xl font-bold text-foreground mb-1">Search Tasks</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Binary Search Tree — O(log n) average search complexity
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-ds-tree/10 rounded-lg">
              <GitBranch className="w-4 h-4 text-ds-tree" />
            </div>
            BST Search
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            search(key) → left if key {"<"} node else right
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tasks by title..."
              className="pl-10 bg-input border-border text-lg h-12"
            />
          </div>

          {hasSearched && (
            <div className="mb-4">
              <Badge className="bg-ds-tree/20 text-ds-tree">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
          )}

          {query && results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found matching "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 bg-muted rounded-lg animate-slide-in hover:bg-muted/80 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-ds-tree/20 border border-ds-tree/50 flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-ds-tree" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="font-medium text-foreground">
                        {task.title.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === query.toLowerCase() ? (
                            <span key={i} className="bg-ds-tree/30 text-ds-tree px-1 rounded">
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                  </div>
                  <Badge variant="outline">{task.priority}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter a search query to find tasks using BST</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">BST Visualization</CardTitle>
          <CardDescription className="font-mono text-xs">
            Tasks are indexed by title for fast lookup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Simple tree visualization */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-ds-tree/20 border border-ds-tree/50 rounded-lg text-ds-tree font-mono text-sm mb-4">
                root
              </div>
              <div className="flex justify-center gap-16">
                <div className="text-center">
                  <div className="w-px h-8 bg-ds-tree/30 mx-auto" />
                  <div className="inline-block px-3 py-1.5 bg-muted border border-border rounded-lg text-muted-foreground font-mono text-xs">
                    left {"<"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-px h-8 bg-ds-tree/30 mx-auto" />
                  <div className="inline-block px-3 py-1.5 bg-muted border border-border rounded-lg text-muted-foreground font-mono text-xs">
                    right {">"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">BST Operations</h4>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <p>• <span className="text-ds-tree">insert(task)</span> — Add task by title — O(log n)</p>
              <p>• <span className="text-ds-tree">search(title)</span> — Find task — O(log n)</p>
              <p>• <span className="text-ds-tree">delete(title)</span> — Remove task — O(log n)</p>
              <p>• <span className="text-ds-tree">inOrder()</span> — Get sorted list — O(n)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
