import { Task } from './LinkedList';

export class TaskGraph {
  private adjacencyList: Map<string, Set<string>> = new Map();
  private tasks: Map<string, Task> = new Map();

  // Add task as vertex - O(1)
  addTask(task: Task): void {
    if (!this.adjacencyList.has(task.id)) {
      this.adjacencyList.set(task.id, new Set());
      this.tasks.set(task.id, task);
    }
  }

  // Add dependency edge (taskA depends on taskB) - O(1)
  addDependency(taskId: string, dependsOnId: string): boolean {
    if (!this.adjacencyList.has(taskId) || !this.adjacencyList.has(dependsOnId)) {
      return false;
    }
    
    // Check for circular dependency before adding
    if (this.wouldCreateCycle(taskId, dependsOnId)) {
      return false;
    }
    
    this.adjacencyList.get(taskId)!.add(dependsOnId);
    return true;
  }

  // Remove dependency - O(1)
  removeDependency(taskId: string, dependsOnId: string): boolean {
    if (!this.adjacencyList.has(taskId)) return false;
    return this.adjacencyList.get(taskId)!.delete(dependsOnId);
  }

  // Remove task and all its edges - O(V + E)
  removeTask(taskId: string): boolean {
    if (!this.adjacencyList.has(taskId)) return false;
    
    this.adjacencyList.delete(taskId);
    this.tasks.delete(taskId);
    
    // Remove all edges pointing to this task
    this.adjacencyList.forEach(edges => {
      edges.delete(taskId);
    });
    
    return true;
  }

  // Get dependencies of a task - O(1)
  getDependencies(taskId: string): Task[] {
    const dependencies = this.adjacencyList.get(taskId);
    if (!dependencies) return [];
    
    return Array.from(dependencies)
      .map(id => this.tasks.get(id))
      .filter((task): task is Task => task !== undefined);
  }

  // Get tasks that depend on this task - O(V)
  getDependents(taskId: string): Task[] {
    const dependents: Task[] = [];
    
    this.adjacencyList.forEach((edges, id) => {
      if (edges.has(taskId)) {
        const task = this.tasks.get(id);
        if (task) dependents.push(task);
      }
    });
    
    return dependents;
  }

  // Check if adding dependency would create cycle - O(V + E)
  private wouldCreateCycle(from: string, to: string): boolean {
    const visited = new Set<string>();
    
    const dfs = (current: string): boolean => {
      if (current === from) return true;
      if (visited.has(current)) return false;
      
      visited.add(current);
      const dependencies = this.adjacencyList.get(current);
      if (!dependencies) return false;
      
      for (const dep of dependencies) {
        if (dfs(dep)) return true;
      }
      
      return false;
    };
    
    return dfs(to);
  }

  // Topological sort - O(V + E)
  topologicalSort(): Task[] {
    const visited = new Set<string>();
    const result: Task[] = [];
    
    const dfs = (taskId: string): void => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const dependencies = this.adjacencyList.get(taskId);
      if (dependencies) {
        for (const dep of dependencies) {
          dfs(dep);
        }
      }
      
      const task = this.tasks.get(taskId);
      if (task) result.push(task);
    };
    
    this.adjacencyList.forEach((_, taskId) => {
      dfs(taskId);
    });
    
    return result;
  }

  // BFS - Find tasks at distance n from given task - O(V + E)
  getTasksAtDistance(taskId: string, distance: number): Task[] {
    if (!this.adjacencyList.has(taskId)) return [];
    
    const queue: [string, number][] = [[taskId, 0]];
    const visited = new Set<string>([taskId]);
    const result: Task[] = [];
    
    while (queue.length > 0) {
      const [current, dist] = queue.shift()!;
      
      if (dist === distance) {
        const task = this.tasks.get(current);
        if (task) result.push(task);
        continue;
      }
      
      if (dist > distance) break;
      
      const dependencies = this.adjacencyList.get(current);
      if (dependencies) {
        for (const dep of dependencies) {
          if (!visited.has(dep)) {
            visited.add(dep);
            queue.push([dep, dist + 1]);
          }
        }
      }
    }
    
    return result;
  }

  // Get all tasks - O(V)
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  // Get graph structure for visualization
  getGraphStructure(): { nodes: Task[]; edges: { from: string; to: string }[] } {
    const nodes = Array.from(this.tasks.values());
    const edges: { from: string; to: string }[] = [];
    
    this.adjacencyList.forEach((dependencies, taskId) => {
      dependencies.forEach(depId => {
        edges.push({ from: taskId, to: depId });
      });
    });
    
    return { nodes, edges };
  }

  // Build from tasks array
  buildFromTasks(tasks: Task[]): void {
    this.adjacencyList.clear();
    this.tasks.clear();
    tasks.forEach(task => this.addTask(task));
  }
}
