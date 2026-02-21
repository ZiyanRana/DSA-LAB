#ifndef NODE_H
#define NODE_H

class Node {
public:
    int data;
    Node *parent;
    Node *left;
    Node *right;
    bool color; // 1 = RED, 0 = BLACK

    Node(int d) {
        data = d;
        parent = left = right = nullptr;
        color = 1; // new node is RED by default
    }
};

#endif
