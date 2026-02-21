class Count:
    def _GetMax(self,arr):
        maxN = float('-inf')
        for n in arr:
            maxN = max(maxN,n)
        return maxN
    
    def __GetMinNeg(self,arr):
        minN = 0
        for n in arr:
                minN = min(minN,n)
        return minN
    
    def CountSort(self,arr):
        minimum = self.__GetMinNeg(arr)
        maximum = self._GetMax(arr)
        size = maximum - minimum
        freq = [0] * (size + 1)

        for i in range(len(arr)):
            freq[arr[i] - minimum] += 1
        
        for i in range(1,len(freq)):
            freq[i] += freq[i-1]

        
        ans = [0] * len(arr)

        for i in range(len(arr)-1,-1,-1):
            freq[arr[i] - minimum] -= 1
            idx = freq[arr[i]-minimum]
            ans[idx] = arr[i]
        
        return ans

class Radix(Count):
    def __CountSortByDigit(self,arr,exp):
        ans = [0] * len(arr)
        freq = [0] * 10
        for i in range(len(arr)):
            digit = (arr[i] // exp) % 10
            freq[digit] += 1
        
        for i in range(1,len(freq)):
            freq[i] += freq[i-1]
        
        for i in range(len(arr)-1,-1,-1):
            digit = (arr[i] // exp) % 10
            freq[digit] -= 1
            ans[freq[digit]] = arr[i]
        
        for i in range(len(arr)):
            arr[i] = ans[i]
    
    def RadixSort(self,arr):
        exp = 1
        maximum = self._GetMax(arr)
        while(maximum // exp > 0):
            self.__CountSortByDigit(arr,exp)
            exp *= 10
        return arr

class Bucket:
    def __InsertionSort(bucket):
        for i in range(1, len(bucket)):
            key = bucket[i]
            j = i - 1
            while j >= 0 and key < bucket[j]:
                bucket[j + 1] = bucket[j]
                j -= 1
            bucket[j + 1] = key
        return bucket
    
    def BucketSort(self,arr):
        n = len(arr)
        buckets = [[] for _ in range(n)]

        for num in arr:
            idx = int(num * n)
            buckets[idx].append(num)
        
        for b in buckets:
            Bucket.__InsertionSort(b)
        
        result = []
        for b in buckets:
            result.extend(b)

        return result

        


def main():
    countSorted = Count().CountSort([-100,5, 10, 0, 3, 8, 5,1, 10] )
    radixSorted = Radix().RadixSort([110, 45, 65,50, 90,602, 24, 2, 66])
    bucketSorted = Bucket().BucketSort([0.897, 0.565, 0.656,0.1234, 0.665, 0.3434]  )
    print("COUNT: ",countSorted)
    print("RADIX: ",radixSorted)
    print("BUCKET: ",bucketSorted)

main()