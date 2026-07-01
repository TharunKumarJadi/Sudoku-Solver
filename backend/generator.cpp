#include <bits/stdc++.h>
using namespace std;

bool isValid(vector<vector<int>>& board,int row,int col,int num){

    for(int i=0;i<9;i++){
        if(board[row][i]==num) return false;
        if(board[i][col]==num) return false;
    }

    int sr=(row/3)*3;
    int sc=(col/3)*3;

    for(int i=sr;i<sr+3;i++){
        for(int j=sc;j<sc+3;j++){
            if(board[i][j]==num) return false;
        }
    }

    return true;
}

bool fillBoard(vector<vector<int>>& board){

    for(int r=0;r<9;r++){
        for(int c=0;c<9;c++){

            if(board[r][c]==0){

                vector<int> nums={1,2,3,4,5,6,7,8,9};
                random_shuffle(nums.begin(),nums.end());

                for(int num:nums){

                    if(isValid(board,r,c,num)){

                        board[r][c]=num;

                        if(fillBoard(board))
                            return true;

                        board[r][c]=0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

void removeCells(vector<vector<int>>& board,int clues){

    int remove = 81 - clues;

    while(remove>0){

        int r=rand()%9;
        int c=rand()%9;

        if(board[r][c]!=0){
            board[r][c]=0;
            remove--;
        }
    }
}

int main(int argc,char* argv[]){

    srand(time(0));

    string difficulty="medium";

    if(argc>1)
        difficulty=argv[1];

    int clues;

    if(difficulty=="easy") clues=40;
    else if(difficulty=="hard") clues=25;
    else clues=32;

    vector<vector<int>> board(9,vector<int>(9,0));

    fillBoard(board);

    removeCells(board,clues);

    for(int i=0;i<9;i++){
        for(int j=0;j<9;j++){
            cout<<board[i][j]<<" ";
        }
        cout<<endl;
    }

}