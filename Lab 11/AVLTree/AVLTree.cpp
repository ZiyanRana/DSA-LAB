#include "AVLTree.h"
#include <iostream>
using namespace std;
AvlTree::AvlTree() {
    root = nullptr;
}
AvlTree::AvlTree(int arr[], int size) {
    root = nullptr;
    for (int i = 0; i < size; i++)
        Insert(arr[i]);
}
AvlTree::~AvlTree() {
}
int AvlTree::height(Node* n) {
    if (!n) return 0;
    return n->height;
}
int AvlTree::balanceFactor(Node* n) {
    if (!n) return 0;
    return height(n->left) - height(n->right);
}
Node* AvlTree::rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;

    x->right = y;
    y->left = T2;

    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;

    return x;
}
Node* AvlTree::leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;

    y->left = x;
    x->right = T2;

    x->height = max(height(x->left), height(x->right)) + 1;
    y->height = max(height(y->left), height(y->right)) + 1;

    return y;
}
Node* AvlTree::insert(Node* node, int key) {
    if (!node)
        return new Node(key);

    if (key < node->data)
        node->left = insert(node->left, key);
    else if (key > node->data)
        node->right = insert(node->right, key);
    else
        return node; 

    node->height = 1 + max(height(node->left), height(node->right));
    int bf = balanceFactor(node);

    // LL
    if (bf > 1 && key < node->left->data)
        return rightRotate(node);

    // RR
    if (bf < -1 && key > node->right->data)
        return leftRotate(node);

    // LR
    if (bf > 1 && key > node->left->data) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // RL
    if (bf < -1 && key < node->right->data) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}
Node* AvlTree::Insert(int x) {
    root = insert(root, x);
    return root;
}
Node* AvlTree::minValueNode(Node* node) {
    Node* current = node;
    while (current && current->left != nullptr)
        current = current->left;
    return current;
}
Node* AvlTree::deleteNode(Node* root, int key) {
    return root;
}
Node* AvlTree::Delete(int x) {
    root = deleteNode(root, x);
    return root;
}
void AvlTree::visualizeTree(Node* root, int space) {
    if (!root) return;

    space += 10;
    visualizeTree(root->right, space);

    cout << endl;
    for (int i = 10; i < space; i++)
        cout << " ";
    cout << root->data << endl;

    visualizeTree(root->left, space);
}
void AvlTree::visualizeTree(Node* T) {
    visualizeTree(T, 0);
}
