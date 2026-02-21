import { Task } from './LinkedList';

class QueueNode {
  data: Task;
  next: QueueNode | null = null;

  constructor(data: Task) {
    this.data = data;
  }
}

export class TaskQueue {
  private front: QueueNode | null = null;
  private rear: QueueNode | null = null;
  private size: number = 0;

  // Enqueue - O(1)
  enqueue(task: Task): void {
    const newNode = new QueueNode(task);
    
    if (!this.rear) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.size++;
  }

  // Dequeue - O(1)
  dequeue(): Task | null {
    if (!this.front) return null;
    
    const task = this.front.data;
    this.front = this.front.next;
    
    if (!this.front) {
      this.rear = null;
    }
    
    this.size--;
    return task;
  }

  // Peek - O(1)
  peek(): Task | null {
    return this.front?.data || null;
  }

  // Check if empty - O(1)
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Get size - O(1)
  getSize(): number {
    return this.size;
  }

  // Get all items - O(n)
  toArray(): Task[] {
    const result: Task[] = [];
    let current = this.front;
    
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Clear - O(1)
  clear(): void {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }
}

// Priority Queue using Binary Heap
export class PriorityQueue {
  private heap: Task[] = [];
  
  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private rightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Heapify up - O(log n)
  private heapifyUp(index: number): void {
    while (index > 0) {
      const parent = this.parentIndex(index);
      if (this.getPriorityValue(this.heap[parent].priority) < 
          this.getPriorityValue(this.heap[index].priority)) {
        this.swap(parent, index);
        index = parent;
      } else {
        break;
      }
    }
  }

  // Heapify down - O(log n)
  private heapifyDown(index: number): void {
    while (this.leftChildIndex(index) < this.heap.length) {
      let largest = index;
      const left = this.leftChildIndex(index);
      const right = this.rightChildIndex(index);

      if (this.getPriorityValue(this.heap[left].priority) > 
          this.getPriorityValue(this.heap[largest].priority)) {
        largest = left;
      }

      if (right < this.heap.length && 
          this.getPriorityValue(this.heap[right].priority) > 
          this.getPriorityValue(this.heap[largest].priority)) {
        largest = right;
      }

      if (largest !== index) {
        this.swap(index, largest);
        index = largest;
      } else {
        break;
      }
    }
  }

  // Insert - O(log n)
  enqueue(task: Task): void {
    this.heap.push(task);
    this.heapifyUp(this.heap.length - 1);
  }

  // Extract max priority - O(log n)
  dequeue(): Task | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return max;
  }

  // Peek - O(1)
  peek(): Task | null {
    return this.heap[0] || null;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getSize(): number {
    return this.heap.length;
  }

  toArray(): Task[] {
    return [...this.heap];
  }
}
