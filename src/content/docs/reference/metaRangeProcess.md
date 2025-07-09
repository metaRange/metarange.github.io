---
title: metaRangeProcess object
description: Function reference for 'metaRangeProcess'
slug: reference/metaRangeProcess
sidebar:
  label: metaRangeProcess
---

## Description

Creates an metaRangeProcess object in form of an
[R6](https://rdrr.io/pkg/R6/man/R6Class.html) class that stores and handles all the parts
that define a process.

## Public fields

* `fun`: `<function>` The processes function.
This will be called when the process is executed.

## Methods

### Public methods

* [`metaRangeProcess$new()`](#method-new)
* [`metaRangeProcess$get_PID()`](#method-get_PID)
* [`metaRangeProcess$get_name()`](#method-get_name)
* [`metaRangeProcess$get_priority()`](#method-get_priority)
* [`metaRangeProcess$get_env_label()`](#method-get_env_label)
* [`metaRangeProcess$print()`](#method-print)

### Method `new()`

Creates a new [metaRangeProcess](../metaRangeProcess) object

#### Usage

```
metaRangeProcess$new(
  process_name,
  id = "",
  process_fun,
  execution_priority,
  env,
  env_label = NULL
)
```

#### Arguments

* `process_name`: `<string>` name of the process.
* `id`: `<string>` optional ID of the process.
* `process_fun`: `<function>` The function to be
called when the process is executed. It will be executed
in the specified environment (see argument: env) and has access to all the
variables in that environment. This function may not have any arguments,
i.e. `is.null(formals(process_fun))` must be `TRUE`.
* `execution_priority`: `<integer>` the priority of the process.
The lower the number the earlier the process is executed (1 == highest priority).
Note that the priority is only used to sort the processes
in the priority queue. The actual execution order is determined
by the order of the processes in the queue.
* `env`: `<environment>` the environment where the process should be executed.
* `env_label`: `<string>` optional name of the execution environment.
Just used as a human readable label for debug purposes.

#### Returns

`<metaRangeProcess>` A [metaRangeProcess](../metaRangeProcess) object.

#### Examples

```
# Note: Only for illustration purposes. Use the add_process method of the
# simulation object to add processes to a simulation.
pr <- metaRangeProcess$new(
   process_name = "ecological_process",
   process_fun = function() {
      cat("Execute ecological process!")
   },
   execution_priority = 1L,
   env = new.env(),
   env_label = "a_species_name"
)
pr
```

### Method `get_PID()`

get the process ID

#### Usage

```
metaRangeProcess$get_PID()
```

#### Returns

`<string>` The process ID

#### Examples

```
pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_PID()
```

### Method `get_name()`

get the process name

#### Usage

```
metaRangeProcess$get_name()
```

#### Returns

`<string>` The process name

#### Examples

```
pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_name()
```

### Method `get_priority()`

get the process execution priority

#### Usage

```
metaRangeProcess$get_priority()
```

#### Returns

`<integer>` The process execution priority

#### Examples

```
pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_priority()
```

### Method `get_env_label()`

get the name of the process execution environment

#### Usage

```
metaRangeProcess$get_env_label()
```

#### Returns

`<string>` The name of the process execution environment or NULL

#### Examples

```
pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env(), "human_readable_label")
pr$get_env_label()
```

### Method `print()`

Prints information about the process to the console

#### Usage

```
metaRangeProcess$print()
```

#### Returns

`<invisible self>`

#### Examples

```
pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$print()
```

## Seealso

[metaRangePriorityQueue](../metaRangePriorityQueue)

## Value

`<metaRangeProcess>` A [metaRangeProcess](../metaRangeProcess) object.

## Examples

```r
## ------------------------------------------------
## Method `metaRangeProcess$new`
## ------------------------------------------------

# Note: Only for illustration purposes. Use the add_process method of the
# simulation object to add processes to a simulation.
pr <- metaRangeProcess$new(
   process_name = "ecological_process",
   process_fun = function() {
      cat("Execute ecological process!")
   },
   execution_priority = 1L,
   env = new.env(),
   env_label = "a_species_name"
)
pr

## ------------------------------------------------
## Method `metaRangeProcess$get_PID`
## ------------------------------------------------

pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_PID()

## ------------------------------------------------
## Method `metaRangeProcess$get_name`
## ------------------------------------------------

pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_name()

## ------------------------------------------------
## Method `metaRangeProcess$get_priority`
## ------------------------------------------------

pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$get_priority()

## ------------------------------------------------
## Method `metaRangeProcess$get_env_label`
## ------------------------------------------------

pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env(), "human_readable_label")
pr$get_env_label()

## ------------------------------------------------
## Method `metaRangeProcess$print`
## ------------------------------------------------

pr <- metaRangeProcess$new("A", "1", \() {}, 1, new.env())
pr$print()
```

