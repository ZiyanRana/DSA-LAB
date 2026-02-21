import time
import random
from typing import List, Any, Callable
import heapq

class SortingAlgorithms:
    @staticmethod
    def bubble_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        arr_copy = arr.copy()
        n = len(arr_copy)
        
        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                val_j = key_func(arr_copy[j]) if key_func else arr_copy[j]
                val_j1 = key_func(arr_copy[j + 1]) if key_func else arr_copy[j + 1]
                
                if (val_j > val_j1 and not reverse) or (val_j < val_j1 and reverse):
                    arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                    swapped = True
            
            if not swapped:
                break
        
        end_time = time.perf_counter()
        return arr_copy, (end_time - start_time) * 1000
    
    @staticmethod
    def selection_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        arr_copy = arr.copy()
        n = len(arr_copy)
        
        for i in range(n):
            extreme_idx = i
            for j in range(i + 1, n):
                val_extreme = key_func(arr_copy[extreme_idx]) if key_func else arr_copy[extreme_idx]
                val_j = key_func(arr_copy[j]) if key_func else arr_copy[j]
                
                if (val_j < val_extreme and not reverse) or (val_j > val_extreme and reverse):
                    extreme_idx = j
            
            arr_copy[i], arr_copy[extreme_idx] = arr_copy[extreme_idx], arr_copy[i]
        
        end_time = time.perf_counter()
        return arr_copy, (end_time - start_time) * 1000
    
    @staticmethod
    def insertion_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        arr_copy = arr.copy()
        
        for i in range(1, len(arr_copy)):
            key_item = arr_copy[i]
            key_val = key_func(key_item) if key_func else key_item
            j = i - 1
            
            while j >= 0:
                compare_val = key_func(arr_copy[j]) if key_func else arr_copy[j]
                if (compare_val <= key_val and not reverse) or (compare_val >= key_val and reverse):
                    break
                arr_copy[j + 1] = arr_copy[j]
                j -= 1
            
            arr_copy[j + 1] = key_item
        
        end_time = time.perf_counter()
        return arr_copy, (end_time - start_time) * 1000
    
    @staticmethod
    def merge_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        
        def merge(left, right):
            result = []
            i = j = 0
            
            while i < len(left) and j < len(right):
                left_val = key_func(left[i]) if key_func else left[i]
                right_val = key_func(right[j]) if key_func else right[j]
                
                if (left_val <= right_val and not reverse) or (left_val >= right_val and reverse):
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    j += 1
            
            result.extend(left[i:])
            result.extend(right[j:])
            return result
        
        def merge_sort_recursive(arr):
            if len(arr) <= 1:
                return arr
            
            mid = len(arr) // 2
            left = merge_sort_recursive(arr[:mid])
            right = merge_sort_recursive(arr[mid:])
            
            return merge(left, right)
        
        arr_copy = arr.copy()
        sorted_arr = merge_sort_recursive(arr_copy)
        
        end_time = time.perf_counter()
        return sorted_arr, (end_time - start_time) * 1000
    
    @staticmethod
    def quick_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        
        def partition(arr, low, high):
            pivot = arr[high]
            pivot_val = key_func(pivot) if key_func else pivot
            i = low - 1
            
            for j in range(low, high):
                j_val = key_func(arr[j]) if key_func else arr[j]
                if (j_val <= pivot_val and not reverse) or (j_val >= pivot_val and reverse):
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
            
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            return i + 1
        
        def quick_sort_recursive(arr, low, high):
            if low < high:
                pi = partition(arr, low, high)
                quick_sort_recursive(arr, low, pi - 1)
                quick_sort_recursive(arr, pi + 1, high)
        
        arr_copy = arr.copy()
        if len(arr_copy) > 0:
            quick_sort_recursive(arr_copy, 0, len(arr_copy) - 1)
        
        end_time = time.perf_counter()
        return arr_copy, (end_time - start_time) * 1000
    
    @staticmethod
    def heap_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        
        def heapify(arr, n, i):
            largest = i
            left = 2 * i + 1
            right = 2 * i + 2
            
            if left < n:
                left_val = key_func(arr[left]) if key_func else arr[left]
                largest_val = key_func(arr[largest]) if key_func else arr[largest]
                if (left_val > largest_val and not reverse) or (left_val < largest_val and reverse):
                    largest = left
            
            if right < n:
                right_val = key_func(arr[right]) if key_func else arr[right]
                largest_val = key_func(arr[largest]) if key_func else arr[largest]
                if (right_val > largest_val and not reverse) or (right_val < largest_val and reverse):
                    largest = right
            
            if largest != i:
                arr[i], arr[largest] = arr[largest], arr[i]
                heapify(arr, n, largest)
        
        arr_copy = arr.copy()
        n = len(arr_copy)
        for i in range(n // 2 - 1, -1, -1):
            heapify(arr_copy, n, i)
        for i in range(n - 1, 0, -1):
            arr_copy[0], arr_copy[i] = arr_copy[i], arr_copy[0]
            heapify(arr_copy, i, 0)
        
        end_time = time.perf_counter()
        return arr_copy, (end_time - start_time) * 1000
    
    @staticmethod
    def counting_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        
        if not arr:
            end_time = time.perf_counter()
            return [], (end_time - start_time) * 1000
        values = []
        items_with_values = []
        
        for item in arr:
            val = key_func(item) if key_func else item
            try:
                if isinstance(val, str):
                    int_val = abs(hash(val)) % 100000
                elif isinstance(val, (int, float)):
                    int_val = int(val)
                else:
                    int_val = abs(hash(str(val))) % 100000
                    
                values.append(int_val)
                items_with_values.append((item, int_val))
            except:
                return SortingAlgorithms.merge_sort(arr, key_func, reverse)
        
        if not values:
            end_time = time.perf_counter()
            return arr.copy(), (end_time - start_time) * 1000
        min_val = min(values)
        max_val = max(values)
        range_val = max_val - min_val + 1
        if range_val > 100000:
            return SortingAlgorithms.merge_sort(arr, key_func, reverse)
        count = [[] for _ in range(range_val)]
        
        for item, val in items_with_values:
            count[val - min_val].append(item)
        
        result = []
        for i in range(range_val):
            if reverse:
                result.extend(count[range_val - 1 - i])
            else:
                result.extend(count[i])
        
        end_time = time.perf_counter()
        return result, (end_time - start_time) * 1000
    
    @staticmethod
    def radix_sort(arr: List[Any], key_func: Callable = None, reverse: bool = False) -> tuple:
        start_time = time.perf_counter()
        
        if not arr:
            end_time = time.perf_counter()
            return [], (end_time - start_time) * 1000
        items_with_values = []
        for item in arr:
            val = key_func(item) if key_func else item
            try:
                if isinstance(val, str):
                    num_val = abs(hash(val))
                elif isinstance(val, (int, float)):
                    num_val = abs(int(val))
                else:
                    num_val = abs(hash(str(val)))
                    
                items_with_values.append((item, num_val))
            except:
                return SortingAlgorithms.merge_sort(arr, key_func, reverse)
        
        if not items_with_values:
            end_time = time.perf_counter()
            return arr.copy(), (end_time - start_time) * 1000
        max_num = max(items_with_values, key=lambda x: x[1])[1]
        exp = 1
        while max_num // exp > 0:
            items_with_values = SortingAlgorithms._counting_sort_by_digit(items_with_values, exp)
            exp *= 10
        
        result = [item for item, _ in items_with_values]
        
        if reverse:
            result.reverse()
        
        end_time = time.perf_counter()
        return result, (end_time - start_time) * 1000
    
    @staticmethod
    def _counting_sort_by_digit(arr, exp):
        n = len(arr)
        output = [None] * n
        count = [0] * 10
        for item, val in arr:
            index = (val // exp) % 10
            count[index] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        i = n - 1
        while i >= 0:
            item, val = arr[i]
            index = (val // exp) % 10
            output[count[index] - 1] = (item, val)
            count[index] -= 1
            i -= 1
        
        return output

class DataSorter:
    def __init__(self):
        self.algorithms = {
            'Bubble Sort': SortingAlgorithms.bubble_sort,
            'Selection Sort': SortingAlgorithms.selection_sort,
            'Insertion Sort': SortingAlgorithms.insertion_sort,
            'Merge Sort': SortingAlgorithms.merge_sort,
            'Quick Sort': SortingAlgorithms.quick_sort,
            'Heap Sort': SortingAlgorithms.heap_sort,
            'Counting Sort': SortingAlgorithms.counting_sort,
            'Radix Sort': SortingAlgorithms.radix_sort
        }
    
    def sort_data(self, data: List[dict], column: str, algorithm: str, reverse: bool = False) -> tuple:
        
        if not data or column not in data[0]:
            return data.copy(), 0.0
        
        if algorithm not in self.algorithms:
            algorithm = 'Merge Sort'
        
        sort_func = self.algorithms[algorithm]
        
        def key_func(item):
            val = item[column]
            if isinstance(val, str):
                try:
                    if val.replace('.', '').replace('-', '').isdigit():
                        return float(val)
                    else:
                        return val.lower() 
                except:
                    return val.lower()
            elif isinstance(val, (int, float)):
                return val
            else:
                return str(val).lower()
        
        return sort_func(data, key_func, reverse)
    
    def get_available_algorithms(self) -> List[str]:
        return list(self.algorithms.keys())
    
    def benchmark_algorithms(self, data: List[dict], column: str, algorithms: List[str] = None) -> dict:
        if algorithms is None:
            algorithms = list(self.algorithms.keys())
        
        results = {}
        
        for algorithm in algorithms:
            if algorithm in self.algorithms:
                try:
                    _, time_taken = self.sort_data(data, column, algorithm)
                    results[algorithm] = time_taken
                except Exception as e:
                    results[algorithm] = float('inf')
        
        return results
