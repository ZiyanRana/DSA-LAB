#include "RBTree.h"
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 15, 25};
    RBTree tree(arr, 5);

    cout << "RB Tree Visualization:\n";
    tree.visualizeTree(tree.Insert(5));
    return 0;
}
