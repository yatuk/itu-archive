#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "schedule.h"

struct Schedule* CreateSchedule() {
    struct Schedule* schedule = (struct Schedule*)malloc(sizeof(struct Schedule));
    const char* daysOfWeek[] = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
    struct Day* lastDay = NULL;

    for (int i = 0; i < 7; i++) {
        struct Day* newDay = (struct Day*)malloc(sizeof(struct Day));
        if (newDay == NULL) {
            printf("Memory allocation failed for new day.\n");
            return NULL;
        }
        strncpy(newDay->dayName, daysOfWeek[i], MAX_DAY_NAME_LEN);
        newDay->examList = NULL;
        newDay->nextDay = NULL;

        if (lastDay) {
            lastDay->nextDay = newDay;
        } else {
            schedule->head = newDay;
        }
        lastDay = newDay;
    }

    lastDay->nextDay = schedule->head; // Circular link
    printf("Schedule created successfully.\n");

    return schedule;
}

// Other functions (AddExamToSchedule, RemoveExamFromSchedule, etc.)
// Reuse your provided implementations here.

void PrintSchedule(struct Schedule* schedule) {
    struct Day* currentDay = schedule->head;
    do {
        printf("%s:\n", currentDay->dayName);
        struct Exam* currentExam = currentDay->examList;
        while (currentExam) {
            PrintExam(currentExam);
            currentExam = currentExam->next;
        }
        printf("\n");
        currentDay = currentDay->nextDay;
    } while (currentDay != schedule->head);
}
