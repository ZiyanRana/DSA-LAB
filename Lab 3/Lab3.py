#Problem 1

def search(arr, x):
    ans = []
    for i in range(len(arr)):
        if(x == arr[i]):
            ans.append(i)
    
    return ans

#Problem 2

def searchB(arr, target):
    l = 0
    r = len(arr) - 1
    least = 0
    max = 0
    while(l <= r):
        m = (l + r) // 2
        if(arr[m] > target): r = m -1
        elif(arr[m] < target): l = m + 1
        else:
            left = m
            right = m
            while(left > 0 and arr[left] == arr[left -1]): left -= 1
            while(right < len(arr) - 1 and arr[right] == arr[right + 1]):right += 1
            least = left
            max = right
            break
    return [x for x in range(least,max+1)]

#Problem 3

def minimum(arr,st,en):
    minNumber = arr[st]
    minIdx = st

    for i in range(st,en+1):
        if(arr[i] < minNumber):
            minNumber = arr[i]
            minIdx = i
    
    return minIdx

#Problem 4

def Sort4(arr):
    n = len(arr)

    for i in range(0,n):
        smallest = i
        for j in range(i,n):
            if(arr[j] < arr[smallest]):
                smallest = j

        arr[i],arr[smallest] = arr[smallest],arr[i]

    return arr
            

#Problem 5

def StringReverse(str,st,en):
    return (str[st:en+1])[::-1]

#Problem 6

def SumIterative(num):
    sum = 0
    while num != 0:
        sum += num % 10
        num //= 10
    return sum

def SumReccursive(num):
    if(num // 10 == 0): return num % 10
    return num%10 + SumReccursive(num//10)

#Problem 7

def ColumnWiseSum(matrix):
    ans = []
    for i in range(len(matrix)):
        sum = 0
        for j in range(len(matrix[i])):
            sum += matrix[j][i]
        ans.append(sum)
    return ans

def RowWiseSum(matrix):
    ans = []
    n = len(matrix)
    m = len(matrix[0])
    for i in range(m):
        sum = 0
        for j in range(n):
            sum += matrix[i][j]
        ans.append(sum)
    return ans

#Problem 8

def SortedMerge(A,B):
    ans = []

    n,m,i,j = len(A),len(B),0,0 

    while(i < n or j < m):
        if(i == n):
            ans.append(B[j:m])
            return ans
        elif(j == m):
            ans.append(A[i:n])
            return ans
        elif(A[i] <= B[j]):
            ans.append(A[i])
            i += 1
        elif(B[j] < A[i]):
            ans.append(B[j])
            j += 1
        

    return ans
        
#Problem 9

def PalindromRecursive(str : str) -> bool:
    if(len(str) == 0 or len(str) == 1): return True 
    return str[0] == str[-1] and PalindromRecursive(str[1:-1])

#Problem 10

def Sort10(arr):
    neg = []
    pos = []
    ans = []
    for num in arr:
        if(num < 0): neg.append(num)
        if(num >= 0): pos.append(num)
    
    i,j =0,0
    n,m = len(neg),len(pos)
    neg = Sort4(neg)
    pos = Sort4(pos)
    flag = True
    while(i < n or j < m):
        if(i == n):
            for x in range(j,m):
                ans.append(pos[x])
            return ans
        if(j == m):
            for x in range(i,n):
                ans.append(neg[x])
            return ans
        if(flag):
            ans.append(neg[i])
            flag = not flag
            i += 1
        else:
            ans.append(pos[j])
            flag = not flag
            j += 1
    return ans