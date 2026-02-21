#ifndef AVLNODE_H
#define AVLNODE_H

class Node {
public:
    int data;
    Node* left;
    Node* right;
    int height;

    Node(int d) {
        data = d;
        left = right = nullptr;
        height = 1;
    }
};

#endif
