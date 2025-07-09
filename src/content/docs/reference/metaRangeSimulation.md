---
title: metaRangeSimulation object
description: Function reference for 'metaRangeSimulation'
slug: reference/metaRangeSimulation
sidebar:
  label: metaRangeSimulation
---

## Description

Creates an simulation object in form of an
[R6](https://rdrr.io/pkg/R6/man/R6Class.html) class that stores and handles all the parts
that are necessary to run a simulation.

## Public fields

* `ID`: `<string>` simulation identification.
* `globals`: `<environment>` a place to store global variables.
I.e. variables and data that are no specific to one species.
* `environment`: `<metaRangeEnvironment>` A [metaRangeEnvironment](../metaRangeEnvironment)
that holds all the environmental values influencing the simulation.
* `number_time_steps`: `<integer>` number of time steps in the simulation.
* `time_step_layer`: `<integer>` vector of layer IDs
that describe which environmental layer to use at each time step.
* `current_time_step`: `<integer>` current time step.
* `queue`: `<metaRangePriorityQueue>` manages the order in which the processes should be executed.
* `processes`: `<list>` of global (simulation level) `<metaRangeProcess>` (es).
* `seed`: `<integer>` seed for the random number generator.

## Methods

### Public methods

* [`metaRangeSimulation$new()`](#method-new)
* [`metaRangeSimulation$add_globals()`](#method-add_globals)
* [`metaRangeSimulation$set_time_layer_mapping()`](#method-set_time_layer_mapping)
* [`metaRangeSimulation$get_current_time_step()`](#method-get_current_time_step)
* [`metaRangeSimulation$add_species()`](#method-add_species)
* [`metaRangeSimulation$species_names()`](#method-species_names)
* [`metaRangeSimulation$add_process()`](#method-add_process)
* [`metaRangeSimulation$add_traits()`](#method-add_traits)
* [`metaRangeSimulation$exit()`](#method-exit)
* [`metaRangeSimulation$begin()`](#method-begin)
* [`metaRangeSimulation$print()`](#method-print)
* [`metaRangeSimulation$summary()`](#method-summary)

### Method `new()`

Creates a new [metaRangeSimulation](../metaRangeSimulation) object.

#### Usage

```
metaRangeSimulation$new(source_environment, ID = NULL, seed = NULL)
```

#### Arguments

* `source_environment`: `<SpatRasterDataset>` created by `[terra::sds()](https://rdrr.io/pkg/terra/man/sds.html)` that represents the environment.
The individual data sets represent different environmental variables
(e.g. temperature or habitat availability) and the different layer of the data sets
represent the different time steps of the simulation.
The function [metaRangeSimulation](../metaRangeSimulation)`$set_time_layer_mapping()` can be used
to extend/ shorten the simulation time steps and set the mapping between each time step and a corresponding
environmental layer. This can be used e.g. to repeat the first (few) layer as a burn-in period.
The number of layers must be the same for all data sets.
* `ID`: `<string>` optional simulation identification string.
Will be set automatically if none is specified.
* `seed`: `<integer>` optional seed for the random number generator.
Will be set automatically if none is specified.

#### Returns

A `<metaRangeSimulation>` object.

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim
```

### Method `add_globals()`

Add global variables to the simulation

#### Usage

```
metaRangeSimulation$add_globals(...)
```

#### Arguments

* `...`: `<any>` the variables to add.
Variables to add to the simulation. They will be saved and accessible
through the 'globals' field.

#### Returns

`<invisible self>`

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_globals(a = 1, b = 2)
sim$globals$a
#> [1] 1
```

### Method `set_time_layer_mapping()`

Set the time layer mapping of the simulation.

#### Usage

```
metaRangeSimulation$set_time_layer_mapping(x)
```

#### Arguments

* `x`: `<integer>` vector of layer indices
that describe which environmental layer to use for each time step.
The length of this vector is equal to the number of time steps.

#### Returns

`<invisible self>`

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$set_time_layer_mapping(1:2)
stopifnot(identical(sim$time_step_layer, 1:2))
```

### Method `get_current_time_step()`

Get the index of the current time step

#### Usage

```
metaRangeSimulation$get_current_time_step()
```

#### Returns

`<integer>` the current time step index

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$get_current_time_step()
#> [1] 1
```

### Method `add_species()`

Adds new species to the simulation

#### Usage

```
metaRangeSimulation$add_species(names)
```

#### Arguments

* `names`: `<character>` names of the species to add.

#### Returns

`<invisible boolean>``TRUE` on success `FALSE` on failure.

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species(c("species_1", "species_2"))
sim$species_1
```

### Method `species_names()`

Returns the names of all species in the simulation.

#### Usage

```
metaRangeSimulation$species_names()
```

#### Returns

`<character>` vector of species names

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_species("species_2")
sim$species_names()
#> [1] "species_1" "species_2"
```

### Method `add_process()`

Adds a process to the simulation.

#### Usage

```
metaRangeSimulation$add_process(
  species = NULL,
  process_name,
  process_fun,
  execution_priority,
  queue = TRUE
)
```

#### Arguments

* `species`: `<character>` Names of the species that the process should be added to.
If `NULL` the process will be "global", i.e added to the simulation object itself.
* `process_name`: `<string>` Name of the process to add.
* `process_fun`: `<named function>` The function to call when the process gets executed.
* `execution_priority`: `<positive integer>` This number decides when the process should be
executed within each time step. The samller the number the earlier it will executed
(1 == highest priority i.e. this function will be the executed first).
In case multiple processes in the simulation have the same priority, it is assumed that
they are independent from each other and there execution order does not matter
(i.e. they could be executed in parallel).
* `queue`: `<boolean>` If `TRUE` the process will be added to the process execution queue directly.
If `FALSE` the process will be added to the simulation but not to the queue,
which means that in order to execute the process, it has to be added manually
via the [metaRangePriorityQueue](../metaRangePriorityQueue)`$enqueue()` method.

#### Returns

`<invisible self>`.

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_process("species_1", "species_process_1", function() {message("process_1")}, 1)
sim$species_1$processes$species_process_1
sim$add_process(species = NULL, "global_process_2", function() {message("process_2")}, 2)
sim$processes$global_process_2
```

### Method `add_traits()`

Adds traits to a species.

#### Usage

```
metaRangeSimulation$add_traits(species, population_level = TRUE, ...)
```

#### Arguments

* `species`: `<character>` Names of the species that the traits should be added to.
* `population_level`: `<boolean>` If `TRUE` the traits will be added at the population level
(i.e. as a matrix with same dimensions (nrow/ncol) as the environment with one value for each population).
This means that the traits either need to be single values that will be extended
to such a matrix via `[base::matrix()](https://rdrr.io/r/base/matrix.html)` or they already need to be a matrix with these dimension.
If `FALSE` the traits will be added without any conversion and may have any type and dimension.
* `...`: `<atomic>` (see `[base::is.atomic()](https://rdrr.io/r/base/is.recursive.html)`) The named traits to be added.
Named means: `Name = value` e.g. `a = 1`.

#### Returns

`<invisible self>`.

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_traits("species_1", population_level = TRUE, a = 1)
sim$add_traits("species_1", population_level = FALSE, b = 2, c = "c")
sim$species_1$traits$a
#>      [,1] [,2]
#> [1,]    1    1
#> [2,]    1    1
sim$species_1$traits$b
#> [1] 2
sim$species_1$traits$c
#> [1] "c"
```

### Method `exit()`

When called, will end the simulation (prematurely) once the current process is finished.
Useful to e.g. end the simulation safely (i.e. without an error) when no species is alive anymore
and there would be no benefit to continue the execution until the last time step.

#### Usage

```
metaRangeSimulation$exit()
```

#### Returns

`invisible NULL`

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
names(sim_env) <- "env_var_name"
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_process("species_1", "species_process_1", function() {self$sim$exit()}, 1)
sim$begin()
```

### Method `begin()`

Begins the simulation

#### Usage

```
metaRangeSimulation$begin()
```

#### Returns

`<invisible self>` The finished simulation

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
names(sim_env) <- "env_var_name"
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_process(
     species = NULL,
     "timestep_counter",
     function() {
         message("timestep: ", self$get_current_time_step())
     },
     1
)
sim$begin()
```

### Method `print()`

Prints information about the simulation to the console

#### Usage

```
metaRangeSimulation$print()
```

#### Returns

`<invisible self>`

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$print()
```

### Method `summary()`

Summarizes information about the simulation and outputs
it to the console

#### Usage

```
metaRangeSimulation$summary()
```

#### Returns

`<invisible self>`

#### Examples

```
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$summary()
```

## Value

A `<metaRangeSimulation>` object.

## Examples

```r
## ------------------------------------------------
## Method `metaRangeSimulation$new`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim

## ------------------------------------------------
## Method `metaRangeSimulation$add_globals`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_globals(a = 1, b = 2)
sim$globals$a
#> [1] 1

## ------------------------------------------------
## Method `metaRangeSimulation$set_time_layer_mapping`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$set_time_layer_mapping(1:2)
stopifnot(identical(sim$time_step_layer, 1:2))

## ------------------------------------------------
## Method `metaRangeSimulation$get_current_time_step`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$get_current_time_step()
#> [1] 1

## ------------------------------------------------
## Method `metaRangeSimulation$add_species`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species(c("species_1", "species_2"))
sim$species_1

## ------------------------------------------------
## Method `metaRangeSimulation$species_names`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_species("species_2")
sim$species_names()
#> [1] "species_1" "species_2"

## ------------------------------------------------
## Method `metaRangeSimulation$add_process`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_process("species_1", "species_process_1", function() {message("process_1")}, 1)
sim$species_1$processes$species_process_1
sim$add_process(species = NULL, "global_process_2", function() {message("process_2")}, 2)
sim$processes$global_process_2

## ------------------------------------------------
## Method `metaRangeSimulation$add_traits`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_traits("species_1", population_level = TRUE, a = 1)
sim$add_traits("species_1", population_level = FALSE, b = 2, c = "c")
sim$species_1$traits$a
#>      [,1] [,2]
#> [1,]    1    1
#> [2,]    1    1
sim$species_1$traits$b
#> [1] 2
sim$species_1$traits$c
#> [1] "c"

## ------------------------------------------------
## Method `metaRangeSimulation$exit`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
names(sim_env) <- "env_var_name"
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_species("species_1")
sim$add_process("species_1", "species_process_1", function() {self$sim$exit()}, 1)
sim$begin()

## ------------------------------------------------
## Method `metaRangeSimulation$begin`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 4))
names(sim_env) <- "env_var_name"
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$add_process(
     species = NULL,
     "timestep_counter",
     function() {
         message("timestep: ", self$get_current_time_step())
     },
     1
)
sim$begin()

## ------------------------------------------------
## Method `metaRangeSimulation$print`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$print()

## ------------------------------------------------
## Method `metaRangeSimulation$summary`
## ------------------------------------------------

sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
sim <- metaRangeSimulation$new(source_environment = sim_env)
sim$summary()
```

