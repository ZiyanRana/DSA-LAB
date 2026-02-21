#include <iostream>
using namespace std;

const int SIZE = 20;
const int EMPTY = -1;

int h1(int x) {
    return x % 7;
}

int h2(int x) {
    return x % 3;
}

void printArray(int A[]) {
    for (int i = 0; i < SIZE; i++) {
        if (A[i] == EMPTY)
            cout << "_ ";
        else
            cout << A[i] << " ";
    }
    cout << endl;
}

void insert(int A[], int key) {
    int index;
    for (int i = 0; i < SIZE; i++) {
        index = (h1(key) + i * h2(key)) % SIZE;
        if (A[index] == EMPTY) {
            A[index] = key;
            break;
        }
    }
}

int main() {
    int A[SIZE];
    for (int i = 0; i < SIZE; i++)
        A[i] = EMPTY;

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