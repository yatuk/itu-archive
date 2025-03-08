#include <stdlib.h>
#include "../include/scheduler.h"

// Comparison function for the min heap
static int compare_processes(const void* a, const void* b) {
    const Process* p1 = (const Process*)a;
    const Process* p2 = (const Process*)b;
    return p1->vruntime - p2->vruntime;
}

Scheduler* create_scheduler(int capacity) {
    Scheduler* scheduler = malloc(sizeof(Scheduler));
    if (!scheduler) return NULL;
    
    scheduler->process_queue = heap_create(capacity, sizeof(Process), compare_processes);
    if (!scheduler->process_queue) {
        free(scheduler);
        return NULL;
    }
    
    scheduler->current_process = NULL;
    scheduler->time_slice = 100; // Default time slice of 100ms
    
    return scheduler;
}

void destroy_scheduler(Scheduler* scheduler) {
    if (!scheduler) return;
    
    heap_destroy(scheduler->process_queue);
    free(scheduler->current_process);
    free(scheduler);
}

void schedule_process(Scheduler* scheduler, Process process) {
    if (!scheduler) return;
    
    process.is_running = false;
    heap_insert(scheduler->process_queue, &process);
}

Process* get_next_process(Scheduler* scheduler) {
    if (!scheduler) return NULL;
    
    // If there's a currently running process, add it back to the queue
    if (scheduler->current_process) {
        scheduler->current_process->is_running = false;
        heap_insert(scheduler->process_queue, scheduler->current_process);
        free(scheduler->current_process);
        scheduler->current_process = NULL;
    }
    
    // Get the process with the lowest vruntime
    Process* next_process = malloc(sizeof(Process));
    if (!next_process) return NULL;
    
    if (!heap_extract_min(scheduler->process_queue, next_process)) {
        free(next_process);
        return NULL;
    }
    
    next_process->is_running = true;
    scheduler->current_process = next_process;
    
    return next_process;
}

void tick(Scheduler* scheduler) {
    if (!scheduler || !scheduler->current_process) return;
    
    // Update virtual runtime of the current process
    update_vruntime(scheduler->current_process, 1);
}