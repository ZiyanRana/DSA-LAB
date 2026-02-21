#include "AVLTree.h"
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50} ;
    AvlTree tree(arr, 5) ;

    cout << "AVL Tree Visualization:" << endl ;
    tree.visualizeTree(tree.Insert(25)) ; 
    return 0 ;
}
