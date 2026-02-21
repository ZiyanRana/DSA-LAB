#include <iostream>
#include <vector>
using namespace std;

class Node {
    public:
        int data;
        Node *left;
        Node *right;
        Node(int value)
        {
            data = value;
            left = right = NULL;
        }
};

Node *insert(Node *root, int val)
{
    if (root == NULL)
        return new Node(val);
    if ( val < root->data )
        root->left = insert(root->left, val);
    else
    {
        root->right = insert(root->right, val);
    }
}

Node *buildBST(vector<int> nums)
{
    Node *root = NULL;
    for (int x : nums)
    {
        root = insert(root, x);
    }
    return root;
}

void inorderTraversal(Node *root)
{
    if (root == NULL)
        return;

    inorderTraversal(root->left);
    cout << root->data << " ";
    inorderTraversal(root->right);
}

void postorderTraversal(Node *root)
{
    if (root == NULL)
        return;
    postorderTraversal(root->left);
    postorderTraversal(root->right);
    cout << root->data;
}

void preorderTraversal(Node *root)
{
    cout << root->data;
    postorderTraversal(root->left);
    postorderTraversal(root->right);
}

bool searchBST(Node *root, int val)
{
    if (root == NULL)
    {
        return false;
    }
    if (root->data > val)
    {
        return searchBST(root->left, val);
    }
    else
    {
        return searchBST(root->right, val);
    }
}

int countNodes(Node *root)
{
    if (root == NULL)
    {
        return 0;
    }
    int leftCount = countNodes(root->left);
    int rightCount = countNodes(root->right);
    return leftCount + rightCount + 1;
}

int height(Node *root)
{
    if (height == NULL)
        return 0;
    return max(height(root->left), height(root->right)+1);
}

int main()
{
    vector<int> arr{3, 5, 4, 6, 2, 1, 7};
    Node *root = buildBST(arr);
    preorderTraversal(root);
    cout << "\nNumber of nodes of the BST: " << countNodes(root) << endl ;

    return 0;
}