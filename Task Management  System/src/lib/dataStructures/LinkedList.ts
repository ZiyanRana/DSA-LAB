export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  dueDate?: Date;
}

class ListNode {
  data: Task;
  next: ListNode | null = null;
  prev: ListNode | null = null;

  constructor(data: Task) {
    this.data = data;
  }
}

export class DoublyLinkedList {
  private head: ListNode | null = null;
  private tail: ListNode | null = null;
  private size: number = 0;

  // Insert at the end - O(1)
  append(task: Task): void {
    const newNode = new ListNode(task);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  // Insert at the beginning - O(1)
  prepend(task: Task): void {
    const newNode = new ListNode(task);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  // Delete by ID - O(n)
  delete(id: string): Task | null {
    let current = this.head;
    
    while (current) {
      if (current.data.id === id) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }
        
        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }
        
        this.size--;
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  // Update task - O(n)
  update(id: string, updates: Partial<Task>): Task | null {
    let current = this.head;
    
    while (current) {
      if (current.data.id === id) {
        current.data = { ...current.data, ...updates };
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  // Find by ID - O(n)
  find(id: string): Task | null {
    let current = this.head;
    
    while (current) {
      if (current.data.id === id) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  // Search by title (partial match) - O(n)
  search(query: string): Task[] {
    const results: Task[] = [];
    let current = this.head;
    const lowerQuery = query.toLowerCase();
    
    while (current) {
      if (current.data.title.toLowerCase().includes(lowerQuery) ||
          current.data.description.toLowerCase().includes(lowerQuery)) {
        results.push(current.data);
      }
      current = current.next;
    }
    return results;
  }

  // Get all tasks - O(n)
  toArray(): Task[] {
    const result: Task[] = [];
    let current = this.head;
    
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Get size - O(1)
  getSize(): number {
    return this.size;
  }

  // Check if empty - O(1)
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Get first task - O(1)
  getFirst(): Task | null {
    return this.head?.data || null;
  }

  // Get last task - O(1)
  getLast(): Task | null {
    return this.tail?.data || null;
  }
}
