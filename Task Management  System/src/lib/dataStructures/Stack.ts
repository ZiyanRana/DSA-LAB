export interface Action {
  type: 'add' | 'delete' | 'update' | 'execute';
  taskId: string;
  previousState?: any;
  timestamp: Date;
}

export class Stack<T> {
  private items: T[] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  // Push - O(1)
  push(item: T): void {
    if (this.items.length >= this.maxSize) {
      this.items.shift(); // Remove oldest if at capacity
    }
    this.items.push(item);
  }

  // Pop - O(1)
  pop(): T | undefined {
    return this.items.pop();
  }

  // Peek - O(1)
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Check if empty - O(1)
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Get size - O(1)
  size(): number {
    return this.items.length;
  }

  // Clear - O(1)
  clear(): void {
    this.items = [];
  }

  // Get all items (for display) - O(n)
  toArray(): T[] {
    return [...this.items].reverse();
  }
}

// Specialized Undo Stack for Task Management
export class UndoStack {
  private stack: Stack<Action>;

  constructor() {
    this.stack = new Stack<Action>(50);
  }

  recordAction(action: Action): void {
    this.stack.push(action);
  }

  undo(): Action | undefined {
    return this.stack.pop();
  }

  canUndo(): boolean {
    return !this.stack.isEmpty();
  }

  getHistory(): Action[] {
    return this.stack.toArray();
  }

  getHistorySize(): number {
    return this.stack.size();
  }

  clear(): void {
    this.stack.clear();
  }
}
