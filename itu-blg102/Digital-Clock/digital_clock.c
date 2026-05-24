#include <stdio.h>
#include <windows.h>

int main() {
    int hours, mins, secs;

    while (1) {
        printf("Please enter current time (in HH:MM:SS format): \n");
        int result = scanf("%d:%d:%d", &hours, &mins, &secs);

        if (result != 3 || hours < 0 || hours > 23 || mins < 0 || mins > 59 || secs < 0 || secs > 59) {
            printf("Invalid time format. Please enter again.\n");
            while (getchar() != '\n'); // Clear input buffer
        } else {
            break; // Exit the loop if input is valid
        }
    }

    while (1) {
        secs++;
        if (secs >= 60) {
            mins++;
            secs = 0;
        }
        if (mins >= 60) {
            hours++;
            mins = 0;
        }
        if (hours >= 24) {
            hours = 0;
        }

        printf("Clock is : \n");
        printf("%02d:%02d:%02d\n", hours, mins, secs);
        Sleep(1000); // Sleep for 1 second (1000 milliseconds)
        system("cls"); // Clear the screen
    }

    return 0;
}
