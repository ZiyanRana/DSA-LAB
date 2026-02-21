import { Task } from './LinkedList';

export type SortField = 'title' | 'priority' | 'createdAt' | 'dueDate' | 'status';
export type SortOrder = 'asc' | 'desc';

// Comparison functions
const getPriorityValue = (priority: string): number => {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

const getStatusValue = (status: string): number => {
  switch (status) {
    case 'completed': return 3;
    case 'in-progress': return 2;
    case 'pending': return 1;
    default: return 0;
  }
};

const compareByField = (a: Task, b: Task, field: SortField, order: SortOrder): number => {
  let comparison = 0;
  
  switch (field) {
    case 'title':
      comparison = a.title.localeCompare(b.title);
      break;
    case 'priority':
      comparison = getPriorityValue(a.priority) - getPriorityValue(b.priority);
      break;
    case 'createdAt':
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      break;
    case 'dueDate':
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      comparison = dateA - dateB;
      break;
    case 'status':
      comparison = getStatusValue(a.status) - getStatusValue(b.status);
      break;
  }
  
  return order === 'asc' ? comparison : -comparison;
};

// Bubble Sort - O(n²)
export const bubbleSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compareByField(arr[j], arr[j + 1], field, order) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
};

// Selection Sort - O(n²)
export const selectionSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (compareByField(arr[j], arr[minIdx], field, order) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
};

// Insertion Sort - O(n²)
export const insertionSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && compareByField(arr[j], key, field, order) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  
  return arr;
};

// Merge Sort - O(n log n)
export const mergeSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  
  if (arr.length <= 1) return arr;
  
  const merge = (left: Task[], right: Task[]): Task[] => {
    const result: Task[] = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (compareByField(left[i], right[j], field, order) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return [...result, ...left.slice(i), ...right.slice(j)];
  };
  
  const sort = (arr: Task[]): Task[] => {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    
    return merge(left, right);
  };
  
  return sort(arr);
};

// Quick Sort - O(n log n) average
export const quickSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  
  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (compareByField(arr[j], pivot, field, order) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };
  
  const sort = (low: number, high: number): void => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };
  
  sort(0, arr.length - 1);
  return arr;
};

// Heap Sort - O(n log n)
export const heapSort = (tasks: Task[], field: SortField, order: SortOrder): Task[] => {
  const arr = [...tasks];
  const n = arr.length;
  
  const heapify = (size: number, root: number): void => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    
    if (left < size && compareByField(arr[left], arr[largest], field, order) > 0) {
      largest = left;
    }
    
    if (right < size && compareByField(arr[right], arr[largest], field, order) > 0) {
      largest = right;
    }
    
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      heapify(size, largest);
    }
  };
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
  
  return arr;
};

export const sortingAlgorithms = {
  bubble: { fn: bubbleSort, name: 'Bubble Sort', complexity: 'O(n²)' },
  selection: { fn: selectionSort, name: 'Selection Sort', complexity: 'O(n²)' },
  insertion: { fn: insertionSort, name: 'Insertion Sort', complexity: 'O(n²)' },
  merge: { fn: mergeSort, name: 'Merge Sort', complexity: 'O(n log n)' },
  quick: { fn: quickSort, name: 'Quick Sort', complexity: 'O(n log n)' },
  heap: { fn: heapSort, name: 'Heap Sort', complexity: 'O(n log n)' },
};
