import { Task } from './LinkedList';

class BSTNode {
  task: Task;
  left: BSTNode | null = null;
  right: BSTNode | null = null;

  constructor(task: Task) {
    this.task = task;
  }
}

export class TaskBST {
  private root: BSTNode | null = null;

  // Compare tasks by title
  private compare(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  // Insert - O(log n) average, O(n) worst
  insert(task: Task): void {
    const newNode = new BSTNode(task);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (this.compare(task.title, current.task.title) < 0) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  // Search by title - O(log n) average
  search(title: string): Task | null {
    let current = this.root;
    
    while (current) {
      const cmp = this.compare(title, current.task.title);
      if (cmp === 0) {
        return current.task;
      } else if (cmp < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }

  // Search with partial match - O(n)
  searchPartial(query: string): Task[] {
    const results: Task[] = [];
    this.inOrderTraversal(this.root, (task) => {
      if (task.title.toLowerCase().includes(query.toLowerCase())) {
        results.push(task);
      }
    });
    return results;
  }

  // In-order traversal - O(n)
  private inOrderTraversal(node: BSTNode | null, callback: (task: Task) => void): void {
    if (node) {
      this.inOrderTraversal(node.left, callback);
      callback(node.task);
      this.inOrderTraversal(node.right, callback);
    }
  }

  // Get all tasks sorted by title - O(n)
  getSortedByTitle(): Task[] {
    const result: Task[] = [];
    this.inOrderTraversal(this.root, (task) => result.push(task));
    return result;
  }

  // Find minimum - O(log n)
  findMin(): Task | null {
    if (!this.root) return null;
    
    let current = this.root;
    while (current.left) {
      current = current.left;
    }
    return current.task;
  }

  // Find maximum - O(log n)
  findMax(): Task | null {
    if (!this.root) return null;
    
    let current = this.root;
    while (current.right) {
      current = current.right;
    }
    return current.task;
  }

  // Delete - O(log n) average
  delete(title: string): boolean {
    let parent: BSTNode | null = null;
    let current = this.root;
    let isLeftChild = false;

    // Find the node
    while (current && this.compare(title, current.task.title) !== 0) {
      parent = current;
      if (this.compare(title, current.task.title) < 0) {
        current = current.left;
        isLeftChild = true;
      } else {
        current = current.right;
        isLeftChild = false;
      }
    }

    if (!current) return false;

    // Case 1: Leaf node
    if (!current.left && !current.right) {
      if (!parent) {
        this.root = null;
      } else if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }
    // Case 2: One child
    else if (!current.left) {
      if (!parent) {
        this.root = current.right;
      } else if (isLeftChild) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    } else if (!current.right) {
      if (!parent) {
        this.root = current.left;
      } else if (isLeftChild) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }
    }
    // Case 3: Two children
    else {
      const successor = this.findSuccessor(current);
      if (!parent) {
        this.root = successor;
      } else if (isLeftChild) {
        parent.left = successor;
      } else {
        parent.right = successor;
      }
      successor!.left = current.left;
    }

    return true;
  }

  private findSuccessor(node: BSTNode): BSTNode {
    let successorParent = node;
    let successor = node.right!;
    
    while (successor.left) {
      successorParent = successor;
      successor = successor.left;
    }

    if (successor !== node.right) {
      successorParent.left = successor.right;
      successor.right = node.right;
    }

    return successor;
  }

  // Build from array
  buildFromArray(tasks: Task[]): void {
    this.root = null;
    tasks.forEach(task => this.insert(task));
  }

  // Get tree structure for visualization
  getTreeStructure(): any {
    return this.buildTreeVisualization(this.root);
  }

  private buildTreeVisualization(node: BSTNode | null): any {
    if (!node) return null;
    return {
      task: node.task,
      left: this.buildTreeVisualization(node.left),
      right: this.buildTreeVisualization(node.right)
    };
  }
}
