import { cn } from '@/lib/utils';
import { 
  Layers, 
  ArrowDownUp, 
  History, 
  ListOrdered, 
  Network, 
  GitBranch,
  LayoutDashboard,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-foreground' },
  { id: 'add', label: 'Add Task', icon: Plus, color: 'text-ds-linkedlist' },
  { id: 'linkedlist', label: 'All Tasks', icon: Layers, color: 'text-ds-linkedlist' },
  { id: 'queue', label: 'Execute Queue', icon: ListOrdered, color: 'text-ds-queue' },
  { id: 'stack', label: 'Undo Stack', icon: History, color: 'text-ds-stack' },
  { id: 'search', label: 'Search (BST)', icon: GitBranch, color: 'text-ds-tree' },
  { id: 'sort', label: 'Sort Tasks', icon: ArrowDownUp, color: 'text-ds-sort' },
  { id: 'graph', label: 'Dependencies', icon: Network, color: 'text-ds-graph' },
];

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">TaskDS</h1>
            <p className="text-xs text-muted-foreground font-mono">Data Structures</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
          Menu
        </p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              activeSection === item.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground terminal-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className={cn('w-4 h-4', activeSection === item.id ? item.color : '')} />
            <span className="font-mono">{item.label}</span>
            {activeSection === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Data Structures Used
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['LinkedList', 'Stack', 'Queue', 'BST', 'Graph', 'Heap'].map((ds) => (
              <span key={ds} className="text-xs font-mono px-2 py-0.5 bg-background rounded text-foreground">
                {ds}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
