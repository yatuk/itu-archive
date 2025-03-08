#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void print_map(int wallLength, int playerPosX, int playerPosY, int treasureX, int treasureY, char name) {
    for (int y = 0; y < wallLength; y++) {
        for (int x = 0; x < wallLength; x++) {
            if (x == 0 && y == 0) {
                printf("F");
            } else if (x == playerPosX && y == playerPosY) {
                printf("F");
            } else if (x == treasureX && y == treasureY) {
                printf("$");
            } else {
                printf("#");
            }
        }
        printf("\n");
    }
}

void print_room(int wallLength, char side, int steps_left) {
    int center = wallLength / 2;

    if (side == 'r') {
        for (int i = 0; i < wallLength; i++) {
            if (i == center) {
                printf("->");
            } else {
                printf("  ");
            }

            for (int j = 0; j < wallLength; j++) {
                if (i == 0 || i == wallLength - 1 || j == 0 || j == wallLength - 1) {
                    printf(steps_left == 1 ? "$" : "#");
                } else if (i == center && j == center) {
                    printf("F");
                } else {
                    printf(" ");
                }
            }
            printf("\n");
        }
    }

    if (side == 'l') {
        for (int i = 0; i < wallLength; i++) {
            for (int j = 0; j < wallLength; j++) {
                if (i == 0 || i == wallLength - 1 || j == 0 || j == wallLength - 1) {
                    printf(steps_left == 1 ? "$" : "#");
                } else if (i == center && j == center) {
                    printf("F");
                } else {
                    printf(" ");
                }
            }

            if (i == center) {
                printf("<-");
            }

            printf("\n");
        }
    }

    if (side == 'u') {
        for (int i = 0; i < wallLength; i++) {
            for (int j = 0; j < wallLength; j++) {
                if (i == 0 || i == wallLength - 1 || j == 0 || j == wallLength - 1) {
                    printf(steps_left == 1 ? "$" : "#");
                } else if (i == center && j == center) {
                    printf("F");
                } else {
                    printf(" ");
                }
            }
            printf("\n");
        }

        for (int i = 0; i < center; i++) {
            printf(" ");
        }
        printf("^\n");
        for (int i = 0; i < center; i++) {
            printf(" ");
        }
        printf("|\n");
    }

if (side == 'd') {
            for (int j = 0; j < wallLength; j++) {
                if (j == center) {
                    printf("|");
                } else {
                    printf(" ");
                }
            }
            printf("\n");
        for (int j = 0; j < wallLength; j++) {
            if (j == center) {
                printf("V");
            } else {
                printf(" ");
            }
        }
        printf("\n");

        for (int i = 0; i < wallLength; i++) {
            for (int j = 0; j < wallLength; j++) {
                if (i == 0 || i == wallLength - 1 || j == 0 || j == wallLength - 1) {
                    printf(steps_left == 1 ? "$" : "#");
                } else if (i == center && j == center) {
                    printf("F");
                } else {
                    printf(" ");
                }
            }
            printf("\n");
        }
    }
}

int main() {
    srand(time(0));

    int steps_to_treasure = rand() % 5 + 4;

    int wallLength;
    printf("Please enter length of the WALL (an odd number greater or equal to 5): ");
    scanf("%d", &wallLength);
    while (wallLength % 2 == 0 || wallLength < 5) {
        printf("Invalid wall length. Please enter length of the WALL (an odd number greater or equal to 5): ");
        scanf("%d", &wallLength);
    }

    int centerX = wallLength / 2;
    int centerY = wallLength / 2;

    int playerPosX = centerX;
    int playerPosY = centerY;

    int treasureX = rand() % wallLength;
    int treasureY = rand() % wallLength;

for (int i = 0; i < wallLength; i++) {
        for (int j = 0; j < wallLength; j++) {
            if (i == 0 || i == wallLength - 1 || j == 0 || j == wallLength - 1) {
                printf("#");
            } else if (i == treasureY && j == treasureX) {
                printf("$");
            } else if (i == playerPosY && j == playerPosX) {
                printf("F");
            } else {
                printf(" ");
            }
        }
        printf("\n");
    }

    while (steps_to_treasure > 0) {
        char side;
        printf("Which way do you want to go? ('u' for up, 'd' for down, 'r' for right, 'l' for left): ");
        scanf(" %c", &side);
        while (side != 'u' && side != 'd' && side != 'l' && side != 'r') {
        }

        printf("Please enter the next room wall size (the wall size can not be less than 5 and should be an odd number): ");
        int next_wallLength;
        scanf("%d", &next_wallLength);
        while (next_wallLength % 2 == 0 || next_wallLength < 5) {
        }

        print_room(next_wallLength, side, steps_to_treasure);

        steps_to_treasure--;
    }

    printf("\nCongratulations! You have reached the treasure room. Press any key to exit...");    
    return 0; 
}

