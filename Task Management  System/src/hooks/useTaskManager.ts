import { useState, useCallback, useMemo } from 'react';
import { 
  DoublyLinkedList, 
  Task, 
  UndoStack, 
  Action, 
  TaskQueue, 
  PriorityQueue,
  TaskBST,
  TaskGraph,
  sortingAlgorithms,
  SortField,
  SortOrder
} from '@/lib/dataStructures';

export const useTaskManager = () => {
  const [taskList] = useState(() => new DoublyLinkedList());
  const [undoStack] = useState(() => new UndoStack());
  const [taskQueue] = useState(() => new TaskQueue());
  const [priorityQueue] = useState(() => new PriorityQueue());
  const [taskBST] = useState(() => new TaskBST());
  const [taskGraph] = useState(() => new TaskGraph());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [queuedTasks, setQueuedTasks] = useState<Task[]>([]);
  const [lastExecutedTask, setLastExecutedTask] = useState<Task | null>(null);

  const refreshTasks = useCallback(() => {
    setTasks(taskList.toArray());
    setQueuedTasks(taskQueue.toArray());
  }, [taskList, taskQueue]);

  const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add Task - Uses Linked List
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
    };

    taskList.append(newTask);
    taskBST.insert(newTask);
    taskGraph.addTask(newTask);

    undoStack.recordAction({
      type: 'add',
      taskId: newTask.id,
      previousState: null,
      timestamp: new Date(),
    });

    refreshTasks();
    return newTask;
  }, [taskList, taskBST, taskGraph, undoStack, refreshTasks]);

  // Delete Task - Uses Linked List
  const deleteTask = useCallback((id: string) => {
    const deletedTask = taskList.find(id);
    
    if (deletedTask) {
      undoStack.recordAction({
        type: 'delete',
        taskId: id,
        previousState: { ...deletedTask },
        timestamp: new Date(),
      });

      taskList.delete(id);
      taskBST.delete(deletedTask.title);
      taskGraph.removeTask(id);
      refreshTasks();
      return true;
    }
    return false;
  }, [taskList, taskBST, taskGraph, undoStack, refreshTasks]);

  // Update Task - Uses Linked List
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const currentTask = taskList.find(id);
    
    if (currentTask) {
      undoStack.recordAction({
        type: 'update',
        taskId: id,
        previousState: { ...currentTask },
        timestamp: new Date(),
      });

      const updatedTask = taskList.update(id, updates);
      refreshTasks();
      return updatedTask;
    }
    return null;
  }, [taskList, undoStack, refreshTasks]);

  // Undo Last Action - Uses Stack
  const undo = useCallback(() => {
    const action = undoStack.undo();
    
    if (!action) return null;

    switch (action.type) {
      case 'add':
        taskList.delete(action.taskId);
        break;
      case 'delete':
        if (action.previousState) {
          taskList.append(action.previousState);
        }
        break;
      case 'update':
        if (action.previousState) {
          taskList.update(action.taskId, action.previousState);
        }
        break;
    }

    refreshTasks();
    return action;
  }, [taskList, undoStack, refreshTasks]);

  // Execute Task (FIFO Queue)
  const enqueueTask = useCallback((task: Task) => {
    taskQueue.enqueue(task);
    setQueuedTasks(taskQueue.toArray());
  }, [taskQueue]);

  const executeTask = useCallback(() => {
    const task = taskQueue.dequeue();
    if (task) {
      taskList.update(task.id, { status: 'completed' });
      setLastExecutedTask(task);
      
      undoStack.recordAction({
        type: 'execute',
        taskId: task.id,
        previousState: { status: task.status },
        timestamp: new Date(),
      });

      refreshTasks();
    }
    return task;
  }, [taskQueue, taskList, undoStack, refreshTasks]);

  // Priority Queue operations
  const enqueuePriority = useCallback((task: Task) => {
    priorityQueue.enqueue(task);
  }, [priorityQueue]);

  const executePriorityTask = useCallback(() => {
    const task = priorityQueue.dequeue();
    if (task) {
      taskList.update(task.id, { status: 'completed' });
      refreshTasks();
    }
    return task;
  }, [priorityQueue, taskList, refreshTasks]);

  // Search - Uses BST
  const searchTasks = useCallback((query: string) => {
    return taskBST.searchPartial(query);
  }, [taskBST]);

  // Sort Tasks - Uses various sorting algorithms
  const sortTasks = useCallback((
    algorithm: keyof typeof sortingAlgorithms,
    field: SortField,
    order: SortOrder
  ) => {
    const sorted = sortingAlgorithms[algorithm].fn(tasks, field, order);
    return sorted;
  }, [tasks]);

  // Graph operations
  const addDependency = useCallback((taskId: string, dependsOnId: string) => {
    return taskGraph.addDependency(taskId, dependsOnId);
  }, [taskGraph]);

  const getDependencies = useCallback((taskId: string) => {
    return taskGraph.getDependencies(taskId);
  }, [taskGraph]);

  const getTopologicalOrder = useCallback(() => {
    return taskGraph.topologicalSort();
  }, [taskGraph]);

  // Sync BST and Graph with current tasks
  const syncDataStructures = useCallback(() => {
    taskBST.buildFromArray(tasks);
    taskGraph.buildFromTasks(tasks);
  }, [taskBST, taskGraph, tasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    queued: queuedTasks.length,
    undoCount: undoStack.getHistorySize(),
  }), [tasks, queuedTasks, undoStack]);

  return {
    // State
    tasks,
    queuedTasks,
    lastExecutedTask,
    stats,
    
    // Linked List operations
    addTask,
    deleteTask,
    updateTask,
    
    // Stack operations
    undo,
    canUndo: undoStack.canUndo(),
    getUndoHistory: () => undoStack.getHistory(),
    
    // Queue operations
    enqueueTask,
    executeTask,
    enqueuePriority,
    executePriorityTask,
    getPriorityQueue: () => priorityQueue.toArray(),
    
    // BST operations
    searchTasks,
    getSortedByTitle: () => taskBST.getSortedByTitle(),
    
    // Graph operations
    addDependency,
    getDependencies,
    getTopologicalOrder,
    getGraphStructure: () => taskGraph.getGraphStructure(),
    
    // Sorting
    sortTasks,
    
    // Utilities
    syncDataStructures,
    refreshTasks,
  };
};
