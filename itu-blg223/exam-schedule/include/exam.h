#ifndef EXAM_H
#define EXAM_H

#define MAX_COURSE_CODE_LEN 50

// Struct for an Exam
struct Exam {
    int startTime;
    int endTime;
    char courseCode[MAX_COURSE_CODE_LEN];
    struct Exam* next;
};

// Function prototypes
struct Exam* CreateExam(int startTime, int endTime, const char* courseCode);
void PrintExam(struct Exam* exam);

#endif // EXAM_H
