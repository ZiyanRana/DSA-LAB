import random

n = int(input("Enter array size: "))

def RandomArray(n):
    array = []
    for i in range(n):
        array.append(random.randint(0, 500))
    return array

print ("The random array generated is: ", RandomArray(n))