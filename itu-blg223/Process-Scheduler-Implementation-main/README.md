# Process Scheduler Implementation

A C implementation of a Completely Fair Scheduler (CFS) using a generic min-heap data structure. This scheduler is inspired by the Linux kernel's CFS algorithm and provides fair CPU time distribution among processes.

## Features

- Generic min-heap implementation supporting any data type
- CFS-based process scheduling
- Dynamic memory management
- Fair CPU time distribution
- Efficient O(log n) operations for process management
- Automatic capacity scaling

## Components

### Min Heap (`min_heap.h`, `min_heap.c`)
A generic min-heap implementation that provides:
- Dynamic array-based storage
- Automatic capacity growth
- Generic type support through void pointers
- O(log n) insertion and extraction
- O(1) minimum element access

### Scheduler (`scheduler.h`, `scheduler.c`)
Process scheduler implementation featuring:
- CFS-based scheduling algorithm
- Virtual runtime tracking
- Time slice management
- Process queue management

## Time Complexity

- Process insertion: O(log n)
- Next process selection: O(log n)
- Minimum virtual runtime lookup: O(1)
- Scheduler tick: O(1)

## Usage

### Creating a Scheduler

```c
// Create a scheduler with initial capacity for 10 processes
Scheduler* scheduler = create_scheduler(10);
```

### Managing Processes

```c
// Create and schedule a new process
Process process = {
    .pid = 1,
    .vruntime = 0,
    .is_running = false
};
schedule_process(scheduler, process);

// Get the next process to run
Process* next = get_next_process(scheduler);

// Update scheduler state
tick(scheduler);
```

### Using the Min Heap Directly

```c
// Create a min heap for integers
int compare_ints(const void* a, const void* b) {
    return *(const int*)a - *(const int*)b;
}

MinHeap* heap = heap_create(10, sizeof(int), compare_ints);

// Insert elements
int value = 42;
heap_insert(heap, &value);

// Extract minimum
int min_value;
heap_extract_min(heap, &min_value);
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/process-scheduler.git
```

2. Build the project:
```bash
mkdir build && cd build
cmake ..
make
```

## API Reference

### Min Heap Functions

```c
MinHeap* heap_create(size_t capacity, size_t element_size, int (*compare)(const void*, const void*));
void heap_destroy(MinHeap* heap);
int heap_insert(MinHeap* heap, const void* element);
int heap_extract_min(MinHeap* heap, void* result);
int heap_peek(const MinHeap* heap, void* result);
size_t heap_size(const MinHeap* heap);
int heap_merge(MinHeap* heap1, const MinHeap* heap2);
```

### Scheduler Functions

```c
Scheduler* create_scheduler(int capacity);
void destroy_scheduler(Scheduler* scheduler);
void schedule_process(Scheduler* scheduler, Process process);
Process* get_next_process(Scheduler* scheduler);
void tick(Scheduler* scheduler);
```

## Technical Details

### Memory Management
- Automatic capacity doubling when heap is full
- Proper cleanup of all allocated resources
- NULL pointer safety checks

### Error Handling
- All functions validate input parameters
- Memory allocation failure handling
- Return status indicators for critical operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use consistent indentation (4 spaces)
- Add comments for complex algorithms
- Include documentation for public functions
- Write unit tests for new features
