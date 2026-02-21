import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ListOrdered,
  History
} from 'lucide-react';

interface DashboardProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    queued: number;
    undoCount: number;
  };
}

export const Dashboard = ({ stats }: DashboardProps) => {
  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: Layers, color: 'text-ds-linkedlist', bg: 'bg-ds-linkedlist/10' },
    { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-ds-queue', bg: 'bg-ds-queue/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Queued', value: stats.queued, icon: ListOrdered, color: 'text-ds-queue', bg: 'bg-ds-queue/10' },
    { label: 'Undo History', value: stats.undoCount, icon: History, color: 'text-ds-stack', bg: 'bg-ds-stack/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Main Title */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
          TASK MANAGEMENT SYSTEM
        </h1>
        <p className="text-lg text-muted-foreground font-mono">
          Powered by Data Structures & Algorithms
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
