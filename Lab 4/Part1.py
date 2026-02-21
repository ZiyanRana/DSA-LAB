class Quick:

    def __Partition(self,arr,l,r):
        pivot = arr[r]
        idx = l
        for j in range(l,r):
            if(arr[j] <= pivot):
            
                arr[j],arr[idx] = arr[idx],arr[j]
                idx += 1
        arr[idx],arr[r] = arr[r],arr[idx]

        return idx

    def __QuickSortHelper(self,arr,l,r):
        if(l >= r): return 
        pivIdx = self.__Partition(arr,l,r)
        self.__QuickSortHelper(arr,l,pivIdx - 1)
        self.__QuickSortHelper(arr,pivIdx + 1,r)
    
    def QuickSort(self,arr):
        self.__QuickSortHelper(arr,0,len(arr)-1)
        return arr



def main():
    arr = [5,4,6,7,-1,-3,0,1,7,9]
    s = Quick()
    sorted = s.QuickSort(arr)
    print(sorted)

main()