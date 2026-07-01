#include <bits/stdc++.h>
using namespace std;

bool isValid(vector<vector<int>> &board, int row, int col, int num) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num) return false;
        if (board[i][col] == num) return false;
    }

    int startRow = (row / 3) * 3;
    int startCol = (col / 3) * 3;

    for (int i = startRow; i < startRow + 3; i++) {
        for (int j = startCol; j < startCol + 3; j++) {
            if (board[i][j] == num) return false;
        }
    }

    return true;
}

bool solve(vector<vector<int>> &board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {

            if (board[row][col] == 0) {

                for (int num = 1; num <= 9; num++) {

                    if (isValid(board, row, col, num)) {

                        board[row][col] = num;

                        if (solve(board))
                            return true;

                        board[row][col] = 0; // backtrack
                    }
                }

                return false; // no number worked
            }
        }
    }

    return true; // solved
}

int main() {
    vector<vector<int>> board(9, vector<int>(9));

    // Read board from stdin
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            cin >> board[i][j];
        }
    }

    if (solve(board)) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
    } else {
        cout << "NO_SOLUTION" << endl;
    }

    return 0;
}