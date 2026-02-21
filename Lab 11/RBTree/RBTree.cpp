#include "RBTree.h"
#include <iostream>
using namespace std;
RBTree::RBTree() {
    root = nullptr;
}
RBTree::RBTree(int arr[], int size) {
    root = nullptr;
    for (int i = 0; i < size; i++)
        Insert(arr[i]);
}
RBTree::~RBTree() {
}
Node* RBTree::BSTInsert(Node* root, Node* pt) {
    if (!root)
        return pt;

    if (pt->data < root->data) {
        root->left = BSTInsert(root->left, pt);
        root->left->parent = root;
    } else {
        root->right = BSTInsert(root->right, pt);
        root->right->parent = root;
    }
    return root;
}
void RBTree::leftRotate(Node* x) {
    Node* y = x->right;
    x->right = y->left;

    if (y->left != nullptr)
        y->left->parent = x;

    y->parent = x->parent;

    if (x->parent == nullptr)
        root = y;
    else if (x == x->parent->left)
        x->parent->left = y;
    else
        x->parent->right = y;

    y->left = x;
    x->parent = y;
}
void RBTree::rightRotate(Node* x) {
    Node* y = x->left;
    x->left = y->right;

    if (y->right != nullptr)
        y->right->parent = x;

    y->parent = x->parent;

    if (x->parent == nullptr)
        root = y;
    else if (x == x->parent->right)
        x->parent->right = y;
    else
        x->parent->left = y;

    y->right = x;
    x->parent = y;
}
void RBTree::fixInsert(Node* x) {
    while (x != root && x->parent->color == 1) {
        Node* parent = x->parent;
        Node* grandparent = parent->parent;
        if (parent == grandparent->left) {
            Node* uncle = grandparent->right;
            if (uncle && uncle->color == 1) {
                parent->color = 0;
                uncle->color = 0;
                grandparent->color = 1;
                x = grandparent;
            }
            else {
                if (x == parent->right) {
                    x = parent;
                    leftRotate(x);
                }
                parent->color = 0;
                grandparent->color = 1;
                rightRotate(grandparent);
            }
        }
        else {
            Node* uncle = grandparent->left;
            if (uncle && uncle->color == 1) {
                parent->color = 0;
                uncle->color = 0;
                grandparent->color = 1;
                x = grandparent;
            } else {
                if (x == parent->left) {
                    x = parent;
                    rightRotate(x);
                }
                parent->color = 0;
                grandparent->color = 1;
                leftRotate(grandparent);
            }
        }
    }
    root->color = 0; 
}
Node* RBTree::Insert(int x) {
    Node* pt = new Node(x);
    root = BSTInsert(root, pt);
    fixInsert(pt);
    return pt;
}
void RBTree::visualizeTree(Node* root, int space) {
    if (!root) return;

    space += 10;
    visualizeTree(root->right, space);

    cout << endl;
    for (int i = 10; i < space; i++)
        cout << " ";
    cout << root->data << (root->color ? "(R)" : "(B)") << endl;

    visualizeTree(root->left, space);
}
void RBTree::visualizeTree(Node* T) {
    visualizeTree(T, 0);
}
