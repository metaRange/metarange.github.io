---
title: Advanced Options
description: metaRange R package tutorial. Using advanced option.
slug: vignettes/A08_advanced_options
sidebar:
  label: Advanced Options
---


More realistic and complicated simulations may require a more advanced
setup. This vignette will cover some of the more advanced / hidden
features of the `metaRange` package.

## Time layer mapping

The setup and processing of the environmental `SDS` can take quite some
time, especially when the environmental data is large. In order to save
the user time, the method `set_time_layer_mapping()` allows the user to
define a custom mapping between the time steps and the layers of the
environmental raster. Use cases may be:

1.  In case of static environment -\> use the same environmental raster
    layer for all time steps.
2.  Shortening or lengthening the number of time steps of the
    simulation.
3.  Using a “burn-in” period to let the simulation state reach a
    semi-equilibrium, before the main simulation begins.

### Default mapping

The default configuration is that each layer in the environment
represents one time step of the simulation. I.e:

``` r
library(metaRange)
library(terra)
```

``` r
raster_file <- system.file("ex/elev.tif", package = "terra")
r <- rast(raster_file)
temperature <- scale(r, center = FALSE, scale = TRUE) * 10 + 273.15
precipitation <- r * 2
temperature <- rep(temperature, 10)
precipitation <- rep(precipitation, 10)
landscape <- sds(temperature, precipitation)
names(landscape) <- c("temperature", "precipitation")
```

``` r
sim <- create_simulation(landscape)
sim$get_number_of_time_steps()
#> [1] 10
sim$get_time_layer_mapping()
#>  [1]  1  2  3  4  5  6  7  8  9 10
```

### Static environment

To use the same environmental raster (i.e. the first one) for all time
steps, one can use:

``` r
sim$set_time_layer_mapping(rep_len(1, 10))
sim$get_number_of_time_steps()
#> [1] 10
sim$get_time_layer_mapping()
#>  [1] 1 1 1 1 1 1 1 1 1 1
```

### Changing the number of time steps

In the same way described above, one can also pick the specific layer
that are used and shorten the simulation length.

``` r
sim$set_time_layer_mapping(c(2, 4, 6))
sim$get_number_of_time_steps()
#> [1] 3
sim$get_time_layer_mapping()
#> [1] 2 4 6
```

### Burn-in period

To add a burn-in period of 10 time steps, where the environmental data
is not updated, one could use the function as follows:

``` r
sim$set_time_layer_mapping(c(rep_len(1, 10), 2:10))
sim$get_number_of_time_steps()
#> [1] 19
sim$get_time_layer_mapping()
#>  [1]  1  1  1  1  1  1  1  1  1  1  2  3  4  5  6  7  8  9 10
```

## Global variables and processes

In `metaRange` each species is described by its own biologically
relevant processes and traits. However, there may be cases where the
user wants to define a global variable or process that is shared between
all species, either to store intermediate results that don’t belong to
one species or processes to visualize or store output. This can be done
by using the `add_globals()` function for adding global variables and
the `add_process()` function with no `species` argument specified, for
adding global processes. The global variables and processes are
accessible through the `globals`and `processes` fields of the simulation
object itself, respectively. The benefit of using a global process is
that the `self` keyword refers to the simulation object itself, which
allows for easier indexing across multiple species.

``` r
sim$add_species("species_one")
sim$add_species("species_two")
sim$add_globals(
    mean_abundance_over_time = list(
        "species_one" = c(),
        "species_two" = c()
    )
    # ... more global variables
)
sim$globals$global_var
#> NULL
```

``` r
sim$add_process(
    # Note the missing species argument
    process_name = "global_process",
    process_fun = function() {
        # self = simulation object
        # easy access to simulation functions
        for (sp in self$species_names()) {
            self$globals$mean_abundance_over_time[[sp]] <-
                c(
                    self$globals$mean_abundance_over_time[[sp]],
                    mean(self[[sp]]$traits$abundance)
                )
        }
    },
    execution_priority = 1
)
sim$processes$global_process
#> Process name:  global_process 
#> PID:  PID-11951bb8c1-global_process-simulation_448f0fd5 
#> execution_priority:  1 
#> execution_environment_label:  simulation_448f0fd5 
#> $fun: function () 
#> {
#>     for (sp in self$species_names()) {
#>         self$globals$mean_abundance_over_time[[sp]] <- c(self$globals$mean_abundance_over_time[[sp]], 
#>             mean(self[[sp]]$traits$abundance))
#>     }
#> }
#> <environment: 0x000002078f328c80>
```

## Interaction with the priority queue

With some study questions, it may not be desired to simulate all species
from the first time step. For example, when simulating invasion
dynamics, one may want to have a burn-in period without the invasive
species present and then introduce it after this point. Aditionally,
there may be the need to simulate a species for a period of time and
then remove it from the simulation (e.g. there is no point in
calculating the reproduction of a species that has gone extinct). To
accommodate this, `metaRange` allows the user to manually add and remove
processes from the priority queue during the simulation.

### Queuing a process

The default behavior of `add_process()` is to directly add the process
to the priority queue (so that is is executed in the first time step).
Setting the argument `queue = FALSE` will add the process to the
simulation, but not to the priority queue. In that case, the user has at
any point during the simulation the option to add the process to the
priority queue using the `enqueue()` method of the priority queue.

``` r
sim <- create_simulation(landscape)
sim$set_time_layer_mapping(c(1:6))
sim$add_species(name = "species_1")
sim$add_process(
    species = "species_1",
    process_name = "invasion",
    process_fun = function() {
        message("Species invades!")
    },
    execution_priority = 1,
    # Note the queue = FALSE argument
    queue = FALSE
)
sim$add_process(
    process_name = "activate_species_1",
    process_fun = function() {
        message(paste0("time step: ", self$get_current_time_step()))
        # Note that when manually changing the queue,
        # the changes will take place in the
        # _next_ time step
        # e.g. the following will lead to the process
        # being first executed in time step 4)
        if (self$get_current_time_step() == 3) {
            message("Activating species 1")
            for (pr in self$species_1$processes) {
                self$queue$enqueue(pr)
            }
        }
    },
    execution_priority = 1
)
sim$begin()
#> time step: 1
#> time step: 2
#> time step: 3
#> Activating species 1
#> time step: 4
#> Species invades!
#> time step: 5
#> Species invades!
#> time step: 6
#> Species invades!
```

### Dequeue a process

The `dequeue()` function of the priority queue allows the user to remove
a process from the priority queue.

``` r
sim <- create_simulation(landscape)
sim$set_time_layer_mapping(c(1:6))
sim$add_species(name = "species_1")
sim$add_process(
    species = "species_1",
    process_name = "invasion",
    process_fun = function() {
        message("Species invades!")
    },
    execution_priority = 1,
)
sim$add_process(
    process_name = "stop_invasion",
    process_fun = function() {
        message(paste0("time step: ", self$get_current_time_step()))
        if (self$get_current_time_step() == 3) {
            message("Extiction species 1")
            for (pr in self$species_1$processes) {
                # Here we are querying the process ID,
                # which is a unique identifier for each process
                # so that the priority queue knows what to remove
                self$queue$dequeue(pr$get_PID())
            }
        }
    },
    execution_priority = 1
)
sim$begin()
#> Species invades!
#> time step: 1
#> Species invades!
#> time step: 2
#> Species invades!
#> time step: 3
#> Extiction species 1
#> time step: 4
#> time step: 5
#> time step: 6
```

## Ending the simulation early

To end the simulation safely, before the last time step, the user can
use the `exit()` method of the simulation. This will end the simulation
at the end of the process it is called inside of. A possible use case
would be to conditionally end the simulation if all species are extinct.

``` r
sim <- create_simulation(landscape)
sim$set_time_layer_mapping(c(1:6))
sim$add_species(name = "species_1")
sim$add_process(
    species = "species_1",
    process_name = "invasion",
    process_fun = function() {
        message("Species invades!")
    },
    execution_priority = 1,
)
sim$add_process(
    process_name = "end_simualtion",
    process_fun = function() {
        message(paste0("time step: ", self$get_current_time_step()))
        if (self$get_current_time_step() == 4) {
            message("Ending simulation early")
            self$exit()
        }
    },
    execution_priority = 1
)
sim$begin()
#> Species invades!
#> time step: 1
#> Species invades!
#> time step: 2
#> Species invades!
#> time step: 3
#> Species invades!
#> time step: 4
#> Ending simulation early
```
