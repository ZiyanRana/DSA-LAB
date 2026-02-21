#include <iostream>
#include <vector>
using namespace std;

void displayArray(const vector<int>& array, int size) {
    for (int i = 0; i < size; i++) {
        cout << array[i] << " ";
    }
    cout << endl;
}

void insertionSort(vector<int>& array) {
    for (int i = 1; i < array.size(); i++) {
        int key = array[i];
        int j = i - 1;

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
}

int main() {
    int size;
    cout << "Enter the array size: ";
    cin >> size;

    vector<int> array(size);

    for (int i = 0; i < size; i++) {
        cout << "Enter element " << i + 1 << ": ";
        cin >> array[i];
    }

    cout << "\nGiven array: ";
    displayArray(array, size);

    vector<int> evenElements;
    for (int i = 1; i < size; i += 2) {
        evenElements.push_back(array[i]);
    }

    insertionSort(evenElements);

    int index = 0;
    for (int i = 1; i < size; i += 2) {
        array[i] = evenElements[index++];
    }

    cout << "Sorted at even indexes: ";
    displayArray(array, size);

    return 0;
}
