#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include "../include/min_heap.h"

static size_t parent(size_t i) { return (i - 1) / 2; }
static size_t left_child(size_t i) { return 2 * i + 1; }
static size_t right_child(size_t i) { return 2 * i + 2; }

static void swap_elements(MinHeap* heap, size_t i, size_t j) {
    char temp[heap->element_size];
    char* data = (char*)heap->data;
    memcpy(temp, data + i * heap->element_size, heap->element_size);
    memcpy(data + i * heap->element_size, data + j * heap->element_size, heap->element_size);
    memcpy(data + j * heap->element_size, temp, heap->element_size);
}

static void bubble_up(MinHeap* heap, size_t index) {
    while (index > 0) {
        size_t p = parent(index);
        if (heap->compare((char*)heap->data + index * heap->element_size, 
                         (char*)heap->data + p * heap->element_size) >= 0) break;
        swap_elements(heap, index, p);
        index = p;
    }
}

static void bubble_down(MinHeap* heap, size_t index) {
    size_t smallest;
    do {
        smallest = index;
        size_t l = left_child(index);
        size_t r = right_child(index);
        
        if (l < heap->size && heap->compare((char*)heap->data + l * heap->element_size, 
                                          (char*)heap->data + smallest * heap->element_size) < 0)
            smallest = l;
        
        if (r < heap->size && heap->compare((char*)heap->data + r * heap->element_size, 
                                          (char*)heap->data + smallest * heap->element_size) < 0)
            smallest = r;
            
        if (smallest == index) break;
        
        swap_elements(heap, index, smallest);
        index = smallest;
    } while (1);
}

MinHeap* heap_create(size_t capacity, size_t element_size, int (*compare)(const void*, const void*)) {
    MinHeap* heap = malloc(sizeof(MinHeap));
    if (!heap) return NULL;
    
    heap->data = malloc(capacity * element_size);
    if (!heap->data) {
        free(heap);
        return NULL;
    }
    
    heap->element_size = element_size;
    heap->capacity = capacity;
    heap->size = 0;
    heap->compare = compare;
    return heap;
}

void heap_destroy(MinHeap* heap) {
    if (!heap) return;
    free(heap->data);
    free(heap);
}

int heap_insert(MinHeap* heap, const void* element) {
    if (!heap || !element) return 0;
    
    if (heap->size == heap->capacity) {
        size_t new_capacity = heap->capacity * 2;
        void* new_data = realloc(heap->data, new_capacity * heap->element_size);
        if (!new_data) return 0;
        heap->data = new_data;
        heap->capacity = new_capacity;
    }
    
    memcpy((char*)heap->data + heap->size * heap->element_size, element, heap->element_size);
    bubble_up(heap, heap->size);
    heap->size++;
    return 1;
}

int heap_extract_min(MinHeap* heap, void* result) {
    if (!heap || !result || heap->size == 0) return 0;
    
    memcpy(result, heap->data, heap->element_size);
    
    heap->size--;
    if (heap->size > 0) {
        memcpy(heap->data, (char*)heap->data + heap->size * heap->element_size, heap->element_size);
        bubble_down(heap, 0);
    }
    return 1;
}

int heap_peek(const MinHeap* heap, void* result) {
    if (!heap || !result || heap->size == 0) return 0;
    memcpy(result, heap->data, heap->element_size);
    return 1;
}

size_t heap_size(const MinHeap* heap) {
    return heap ? heap->size : 0;
}

int heap_merge(MinHeap* heap1, const MinHeap* heap2) {
    if (!heap1 || !heap2 || heap1->element_size != heap2->element_size || 
        heap1->compare != heap2->compare) return 0;
    
    for (size_t i = 0; i < heap2->size; i++) {
        if (!heap_insert(heap1, (char*)heap2->data + i * heap2->element_size))
            return 0;
    }
    return 1;
}