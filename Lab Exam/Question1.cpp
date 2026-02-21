#include <iostream>
using namespace std;

struct Edge {
    int u, v, w;
};

int parent[100];

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

void unite(int a, int b) {
    int rootA = find(a);
    int rootB = find(b);
    parent[rootB] = rootA;
}

int main() {
    int n, m;
    cout << "Enter vertices: ";
    cin >> n;
    cout << "Enter edges: ";
    cin >> m;

    Edge edges[100];

    for (int i = 0; i < m; i++) {
        cout << "Enter edge " << i + 1 << " (format: value1 value2 weight): ";
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }

    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }

    for (int i = 0; i < m - 1; i++) {
        for (int j = 0; j < m - i - 1; j++) {
            if (edges[j].w > edges[j + 1].w) {
                Edge temp = edges[j];
                edges[j] = edges[j + 1];
                edges[j + 1] = temp;
            }
        }
    }

    int totalWeight = 0;

    for (int i = 0; i < m; i++) {
        int u = edges[i].u;
        int v = edges[i].v;

        if (find(u) != find(v)) {
            unite(u, v);
            totalWeight += edges[i].w;
        }
    }

    cout << "Weight of the MST: " << totalWeight << endl;

    return 0;
}
