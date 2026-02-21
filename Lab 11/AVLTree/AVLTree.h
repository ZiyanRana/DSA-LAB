#ifndef AVLTREE_H
#define AVLTREE_H
#include "AVLNode.h"
#include <iostream>
using namespace std;
class AvlTree {
private:
    Node* root;

    int height(Node* n);
    int balanceFactor(Node* n);
    Node* rightRotate(Node* y);
    Node* leftRotate(Node* x);
    Node* insert(Node* node, int key);
    Node* minValueNode(Node* node);
    Node* deleteNode(Node* root, int key);
    void visualizeTree(Node* root, int space);

public:
    AvlTree();
    AvlTree(int arr[], int size);
    ~AvlTree();

    Node* Insert(int x);
    Node* Delete(int x);
    void visualizeTree(Node* T);
};

#endif
