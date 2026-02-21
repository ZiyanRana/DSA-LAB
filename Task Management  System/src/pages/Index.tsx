import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { AddTask } from '@/components/AddTask';
import { TaskList } from '@/components/TaskList';
import { QueueSection } from '@/components/QueueSection';
import { StackSection } from '@/components/StackSection';
import { SearchSection } from '@/components/SearchSection';
import { SortSection } from '@/components/SortSection';
import { GraphSection } from '@/components/GraphSection';
import { useTaskManager } from '@/hooks/useTaskManager';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const taskManager = useTaskManager();

  // Add some sample tasks on first load
  useEffect(() => {
    if (taskManager.tasks.length === 0) {
      const sampleTasks = [
        { title: 'Design Homepage', description: 'Create wireframes and mockups', priority: 'high' as const, status: 'in-progress' as const },
        { title: 'Setup Database', description: 'Configure PostgreSQL with proper schemas', priority: 'high' as const, status: 'pending' as const },
        { title: 'Write Unit Tests', description: 'Add tests for all data structure implementations', priority: 'medium' as const, status: 'pending' as const },
        { title: 'API Documentation', description: 'Document all endpoints using Swagger', priority: 'low' as const, status: 'pending' as const },
        { title: 'Code Review', description: 'Review pull requests from team', priority: 'medium' as const, status: 'pending' as const },
      ];
      sampleTasks.forEach(task => taskManager.addTask(task));
    }
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard stats={taskManager.stats} />;
      case 'add':
        return <AddTask onAddTask={taskManager.addTask} />;
      case 'linkedlist':
        return (
          <TaskList
            tasks={taskManager.tasks}
            onDelete={taskManager.deleteTask}
            onUpdate={taskManager.updateTask}
            onEnqueue={taskManager.enqueueTask}
          />
        );
      case 'queue':
        return (
          <QueueSection
            queuedTasks={taskManager.queuedTasks}
            lastExecuted={taskManager.lastExecutedTask}
            onExecute={taskManager.executeTask}
          />
        );
      case 'stack':
        return (
          <StackSection
            canUndo={taskManager.canUndo}
            onUndo={taskManager.undo}
            getHistory={taskManager.getUndoHistory}
          />
        );
      case 'search':
        return <SearchSection onSearch={taskManager.searchTasks} />;
      case 'sort':
        return (
          <SortSection
            tasks={taskManager.tasks}
            onSort={taskManager.sortTasks}
          />
        );
      case 'graph':
        return (
          <GraphSection
            tasks={taskManager.tasks}
            onAddDependency={taskManager.addDependency}
            getDependencies={taskManager.getDependencies}
            getTopologicalOrder={taskManager.getTopologicalOrder}
          />
        );
      default:
        return <Dashboard stats={taskManager.stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;
