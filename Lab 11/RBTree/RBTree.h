#ifndef RBTREE_H
#define RBTREE_H
#include "Node.h"
#include <iostream>
using namespace std;

class RBTree {
private:
    Node* root;

    void leftRotate(Node* x);
    void rightRotate(Node* x);
    void fixInsert(Node* x);
    Node* BSTInsert(Node* root, Node* pt);
    void visualizeTree(Node* root, int space);

public:
    RBTree();
    RBTree(int arr[], int size);
    ~RBTree();

    Node* Insert(int x);
    void visualizeTree(Node* T);
};

#endif
