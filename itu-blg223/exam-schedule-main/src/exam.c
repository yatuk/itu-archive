#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "exam.h"

// Function to create a new exam
struct Exam* CreateExam(int startTime, int endTime, const char* courseCode) {
    struct Exam* newExam = (struct Exam*)malloc(sizeof(struct Exam));
    if (newExam == NULL) {
        printf("Memory allocation failed for new exam.\n");
        return NULL;
    }
    
    newExam->startTime = startTime;
    newExam->endTime = endTime;
    strncpy(newExam->courseCode, courseCode, sizeof(newExam->courseCode) - 1);
    newExam->courseCode[sizeof(newExam->courseCode) - 1] = '\0'; // Ensure null-termination
    newExam->next = NULL;

    return newExam;
}

// Helper function to print an exam
void PrintExam(struct Exam* exam) {
    if (exam != NULL) {
        printf("%d-%d %s\n", exam->startTime, exam->endTime, exam->courseCode);
    }
}