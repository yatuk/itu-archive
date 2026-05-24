# Exam Scheduler

A C-based exam scheduling system that helps manage and organize academic examination timetables. The system supports various operations including adding, removing, and updating exam schedules across different days of the week.

## Features

- Create and manage weekly exam schedules
- Add new exams with time slot validation
- Remove existing exams
- Update exam times and days
- Clear entire day's schedule
- Read/Write schedules from/to files
- Automatic conflict detection for overlapping exam times
- Circular linked list implementation for efficient day traversal

## Structure

The project consists of three main components:

### Core Files
- `exam.c/h` - Handles individual exam creation and management
- `schedule.c/h` - Manages the weekly schedule implementation
- `main.c` - Contains the program entry point and example usage

### Data Structures

#### Exam
```c
struct Exam {
    int startTime;
    int endTime;
    char courseCode[MAX_COURSE_CODE_LEN];
    struct Exam* next;
};
```

#### Day
```c
struct Day {
    char dayName[MAX_DAY_NAME_LEN];
    struct Exam* examList;
    struct Day* nextDay;
};
```

#### Schedule
```c
struct Schedule {
    struct Day* head;
};
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/exam-scheduler.git
cd exam-scheduler
```

2. Compile the project:
```bash
gcc -o exam_scheduler main.c exam.c schedule.c -Wall -Wextra
```

## Usage

### Basic Operations

1. Create a new schedule:
```c
struct Schedule* schedule = CreateSchedule();
```

2. Add an exam:
```c
AddExamToSchedule(schedule, "Monday", 9, 11, "CS101");
```

3. Remove an exam:
```c
RemoveExamFromSchedule(schedule, "Monday", 9);
```

4. Update an exam:
```c
UpdateExam(schedule, "Monday", 9, "Tuesday", 10, 12);
```

### File Operations

1. Read schedule from file:
```c
ReadScheduleFromFile(schedule, "exam_schedule_input.txt");
```

2. Write schedule to file:
```c
WriteScheduleToFile(schedule, "exam_schedule_output.txt");
```

### Input File Format
```
DayName StartTime EndTime CourseCode
Monday 9 11 CS101
Tuesday 14 16 MAT102
```

## Error Handling

The system includes comprehensive error handling for:
- Memory allocation failures
- Invalid time ranges
- Schedule conflicts
- File operations
- NULL pointer checks
- Invalid day names

## Limitations

- Time slots are integer-based (24-hour format)
- Course codes are limited to MAX_COURSE_CODE_LEN characters
- Day names must match exactly (case-sensitive)
- No support for recurring exams
- Single semester scheduling only

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
