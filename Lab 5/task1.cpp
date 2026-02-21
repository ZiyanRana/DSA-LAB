#include <iostream>
using namespace std;

struct Node 
{
    int data;
    Node* next;
    Node(int d) { data = d; next = NULL; }
};

class LinkList 
{

    public:
    LinkList() { head = NULL; }
    ~LinkList() {
        Node* temp;
        while (head) {
            temp = head;
            head = head->next;
            delete temp;
        }
    }

    bool isEmpty() { return head == NULL; }

    Node* insertNode(int index, int x) {
        if (index == 0) return insertAtHead(x);
        Node* temp = head;
        for (int i = 0; i < index - 1 && temp; i++) temp = temp->next;
        if (!temp) return NULL;
        Node* newNode = new Node(x);
        newNode->next = temp->next;
        temp->next = newNode;
        return head;
    }

    Node* insertAtHead(int x) {
        Node* newNode = new Node(x);
        newNode->next = head;
        head = newNode;
        return head;
    }

    Node* insertAtEnd(int x) {
        Node* newNode = new Node(x);
        if (isEmpty()) {
            head = newNode;
            return head;
        }
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
        return head;
    }

    bool findNode(int x) {
        Node* temp = head;
        while (temp) {
            if (temp->data == x) return true;
            temp = temp->next;
        }
        return false;
    }

    bool deleteNode(int x) {
        if (isEmpty()) return false;
        bool deleted = false;
        while (head && head->data == x) {
            Node* temp = head;
            head = head->next;
            delete temp;
            deleted = true;
        }
        Node* current = head;
        while (current && current->next) {
            if (current->next->data == x) {
                Node* temp = current->next;
                current->next = temp->next;
                delete temp;
                deleted = true;
            } else current = current->next;
        }
        return deleted;
    }

    bool deleteFromStart() {
        if (isEmpty()) return false;
        Node* temp = head;
        head = head->next;
        delete temp;
        return true;
    }

    bool deleteFromEnd() {
        if (isEmpty()) return false;
        if (head->next == NULL) {
            delete head;
            head = NULL;
            return true;
        }
        Node* temp = head;
        while (temp->next->next) temp = temp->next;
        delete temp->next;
        temp->next = NULL;
        return true;
    }

    void showList(void) {
        Node* temp = head;
        while (temp) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }

    Node* reverseList() {
        Node* prev = NULL;
        Node* current = head;
        Node* next = NULL;
        while (current) {
            next = current->next;
            current->next = prev;
            prev = current;
            current = next;
        }
        head = prev;
        return head;
    }

    Node* sortList(Node* list) {
        if (!list || !list->next) return list;
        bool swapped;
        do {
            swapped = false;
            Node* temp = list;
            while (temp->next) {
                if (temp->data > temp->next->data) {
                    swap(temp->data, temp->next->data);
                    swapped = true;
                }
                temp = temp->next;
            }
        } while (swapped);
        return list;
    }

    Node* removeDuplicates(Node* list) {
        Node* temp = list;
        while (temp && temp->next) {
            if (temp->data == temp->next->data) {
                Node* dup = temp->next;
                temp->next = dup->next;
                delete dup;
            } else temp = temp->next;
        }
        return list;
    }

    Node* mergeLists(Node* list1, Node* list2) {
        if (!list1) return list2;
        if (!list2) return list1;
        Node* result = NULL;
        if (list1->data <= list2->data) {
            result = list1;
            result->next = mergeLists(list1->next, list2);
        } else {
            result = list2;
            result->next = mergeLists(list1, list2->next);
        }
        return result;
    }

    Node* interestLists(Node* list1, Node* list2) {
        Node* result = NULL;
        Node* tail = NULL;
        Node* a = list1;
        Node* b = list2;
        while (a && b) {
            if (a->data == b->data) {
                Node* newNode = new Node(a->data);
                if (!result) result = tail = newNode;
                else { tail->next = newNode; tail = newNode; }
                a = a->next;
                b = b->next;
            } else if (a->data < b->data) a = a->next;
            else b = b->next;
        }
        return result;
    }

private:
    Node* head;
};

int main() 
{
    LinkList list;
    list.insertAtEnd(7);
    list.insertAtEnd(2);
    list.insertAtEnd(4);
    list.showList();
    list.sortList(list.reverseList());
    list.showList();
    list.deleteNode(2);
    list.showList();
    return 0;
}