#include <iostream>
using namespace std;

#define size = 20;
#define empty = -1;

int hash1(int x) {
    return x % 7;
}

int hash2(int x) {
    return x % 3;
}

void printArray(int A[]) {
    for (int i = 0; i < size; i++) {
        if (A[i] == empty)
            cout << "_ ";
        else
            cout << A[i] << " ";
    }
    cout << endl;
}

void insert(int A[], int key) {
    int index;
    for (int i = 0; i < size; i++) {
        index = (h1(key) + i * h2(key)) % size;
        if (A[index] == empty) {
            A[index] = key;
            break;
        }
    }
}

int main() {
    int A[size];
    for (int i = 0; i < size; i++)
        A[i] = empty;

    int key;
    cout << "Enter 10 elements:\n";

    for (int i = 0; i < 10; i++) {
        cout << "Enter element " << i + 1 << ": ";
        cin >> key;
        insert(A, key);
        printArray(A);
        cout << endl;
    }

    return 0;
}