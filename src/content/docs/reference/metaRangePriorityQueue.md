---
title: Process priority queue
description: Function reference for 'metaRangePriorityQueue'
slug: reference/metaRangePriorityQueue
sidebar:
  label: metaRangePriorityQueue
---

## Description

Creates a priority queue in form of an [R6](https://rdrr.io/pkg/R6/man/R6Class.html) class,
that manages the correct process execution order.

## Methods

### Public methods

* [`metaRangePriorityQueue$new()`](#method-new)
* [`metaRangePriorityQueue$execute_next_process()`](#method-execute_next_process)
* [`metaRangePriorityQueue$enqueue()`](#method-enqueue)
* [`metaRangePriorityQueue$dequeue()`](#method-dequeue)
* [`metaRangePriorityQueue$sort_future_queue()`](#method-sort_future_queue)
* [`metaRangePriorityQueue$update()`](#method-update)
* [`metaRangePriorityQueue$is_empty()`](#method-is_empty)
* [`metaRangePriorityQueue$get_queue()`](#method-get_queue)
* [`metaRangePriorityQueue$get_future_queue()`](#method-get_future_queue)
* [`metaRangePriorityQueue$get_current_index()`](#method-get_current_index)
* [`metaRangePriorityQueue$print()`](#method-print)

### Method `new()`

Creates a new [metaRangePriorityQueue](../metaRangePriorityQueue) object.
Note: No reason to call this as user.
The priority queue is created automatically when a simulation is created.

#### Usage

```
metaRangePriorityQueue$new()
```

#### Returns

`<metaRangePriorityQueue>` A [metaRangePriorityQueue](../metaRangePriorityQueue) object.

#### Examples

```
# Only for illustration purposes.
pr_queue <- metaRangePriorityQueue$new()
pr_queue
```

### Method `execute_next_process()`

Executes the next process in the queue.
No reason to call this as user. The next process is executed
automatically, when the previous process is finished.

#### Usage

```
metaRangePriorityQueue$execute_next_process(verbose)
```

#### Arguments

* `verbose`: `<logical>` Should timing and process information be
printed when the process is executed?

#### Returns

`<logical>``TRUE` if the next process has been executed,
`FALSE` if not, in which case the queue is empty.

#### Examples

```
# Only for illustration purposes.
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$execute_next_process(verbose = TRUE)
```

### Method `enqueue()`

Add a process to the (future) queue.
Users should only use this method if they added a process to the simulation
via the add_process method of the simulation object with the argument
`queue = FALSE`. Otherwise the process is added to the queue automatically.

#### Usage

```
metaRangePriorityQueue$enqueue(process)
```

#### Arguments

* `process`: `<metaRangeProcess>` A [metaRangeProcess](../metaRangeProcess) that should be added
to the queue.

#### Returns

`<boolean>``TRUE` on success `FALSE` on failure.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$get_future_queue()
```

### Method `dequeue()`

Remove a process from the (future) queue.
Useful to remove a process from the queue if it is no longer needed.
E.g. if a species went extinct.

#### Usage

```
metaRangePriorityQueue$dequeue(PID = NULL)
```

#### Arguments

* `PID`: `<string>` the ID of the process, that should be dequeued.

#### Returns

`<boolean>``TRUE` on success `FALSE` on failure.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$dequeue(pr$get_PID())
pr_queue$get_future_queue()
```

### Method `sort_future_queue()`

Sort the (future) queue based on the execution priority.
This method is called automatically when a process is added to the queue.
Note: No reason to call this as user.

#### Usage

```
metaRangePriorityQueue$sort_future_queue()
```

#### Returns

`<invisible self>`.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$sort_future_queue()
# at least no error
```

### Method `update()`

Update and reset the queue.
This method is called automatically at the end of each time step.
Note: No reason to call this as user.

#### Usage

```
metaRangePriorityQueue$update()
```

#### Returns

`<invisible self>`.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_queue()
```

### Method `is_empty()`

Check if the queue is empty.

#### Usage

```
metaRangePriorityQueue$is_empty()
```

#### Returns

`<boolean>``TRUE` if queue is empty `FALSE` otherwise.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
stopifnot(pr_queue$is_empty())
```

### Method `get_queue()`

Return the current queue.

#### Usage

```
metaRangePriorityQueue$get_queue()
```

#### Returns

`<named int vector>` The current queue.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_queue()
```

### Method `get_future_queue()`

Return the future queue.

#### Usage

```
metaRangePriorityQueue$get_future_queue()
```

#### Returns

`<named int vector>` The future queue.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$get_future_queue()
```

### Method `get_current_index()`

Get the index of the process that will be executed next.

#### Usage

```
metaRangePriorityQueue$get_current_index()
```

#### Returns

`<integer>` The index.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_current_index()
```

### Method `print()`

Prints information about the queue to the console.

#### Usage

```
metaRangePriorityQueue$print()
```

#### Returns

`<invisible self>`.

#### Examples

```
pr_queue <- metaRangePriorityQueue$new()
pr_queue$print()
```

## Value

`<metaRangePriorityQueue>` A [metaRangePriorityQueue](../metaRangePriorityQueue) object.

## Examples

```r
## ------------------------------------------------
## Method `metaRangePriorityQueue$new`
## ------------------------------------------------

# Only for illustration purposes.
pr_queue <- metaRangePriorityQueue$new()
pr_queue

## ------------------------------------------------
## Method `metaRangePriorityQueue$execute_next_process`
## ------------------------------------------------

# Only for illustration purposes.
pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$execute_next_process(verbose = TRUE)

## ------------------------------------------------
## Method `metaRangePriorityQueue$enqueue`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$get_future_queue()

## ------------------------------------------------
## Method `metaRangePriorityQueue$dequeue`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$dequeue(pr$get_PID())
pr_queue$get_future_queue()

## ------------------------------------------------
## Method `metaRangePriorityQueue$sort_future_queue`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$sort_future_queue()
# at least no error

## ------------------------------------------------
## Method `metaRangePriorityQueue$update`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_queue()

## ------------------------------------------------
## Method `metaRangePriorityQueue$is_empty`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
stopifnot(pr_queue$is_empty())

## ------------------------------------------------
## Method `metaRangePriorityQueue$get_queue`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_queue()

## ------------------------------------------------
## Method `metaRangePriorityQueue$get_future_queue`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$get_future_queue()

## ------------------------------------------------
## Method `metaRangePriorityQueue$get_current_index`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr <- metaRangeProcess$new("A", "1", \() {message("test")}, 1, new.env())
pr_queue$enqueue(pr)
pr_queue$update()
pr_queue$get_current_index()

## ------------------------------------------------
## Method `metaRangePriorityQueue$print`
## ------------------------------------------------

pr_queue <- metaRangePriorityQueue$new()
pr_queue$print()
```

