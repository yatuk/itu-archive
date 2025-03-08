#include <stdio.h>
#include "schedule.h"

int main() {
    struct Schedule* schedule = CreateSchedule();

    ReadScheduleFromFile(schedule, "exam_schedule_input.txt");

    PrintSchedule(schedule);

    AddExamToSchedule(schedule, "Tuesday", 15, 17, "BLG411E");
    AddExamToSchedule(schedule, "Monday", 16, 18, "BLG439E");
    AddExamToSchedule(schedule, "Sunday", 20, 23, "BLG439E");

    RemoveExamFromSchedule(schedule, "Thursday", 11);
    RemoveExamFromSchedule(schedule, "Tuesday", 9);

    UpdateExam(schedule, "Monday", 9, "Monday", 10, 11);
    UpdateExam(schedule, "Tuesday", 10, "Wednesday", 12, 13);
    UpdateExam(schedule, "Wednesday", 15, "Wednesday", 12, 14);

    ClearDay(schedule, "Wednesday");

    PrintSchedule(schedule);

    WriteScheduleToFile(schedule, "exam_schedule_output.txt");

    DeleteSchedule(schedule);

    return 0;
}
