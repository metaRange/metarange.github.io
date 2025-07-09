---
title: Saving Results
description: Basics:'Saving Results'
slug: vignettes/A10_saving_results
sidebar:
  label: Saving Results
---


At the end of a simulation you will most likely want to save the results
to perform further analysis in the future without having to repeat the
whole simulation. This can be done through the function
`save_species()`. It takes as input a (metaRange) species object and
will by default save all its traits or, if the user list specific trait
names, only a subset.

If we take the example simulation from the first vignette:

``` r
library(metaRange)
library(terra)
raster_file <- system.file("ex/elev.tif", package = "terra")
r <- rast(raster_file)
r <- scale(r, center = FALSE, scale = TRUE)
r <- rep(r, 10)
landscape <- sds(r)
names(landscape) <- "habitat_quality"

sim <- create_simulation(landscape)
sim$add_species("species_1")

sim$add_traits(
    species = "species_1",
    population_level = TRUE,
    abundance = 100,
    reproduction_rate = 0.5,
    carrying_capacity = 1000
)

sim$add_process(
    species = "species_1",
    process_name = "reproduction",
    process_fun = function() {
        ricker_reproduction_model(
            self$traits$abundance,
            self$traits$reproduction_rate,
            self$traits$carrying_capacity * self$sim$environment$current$habitat_quality
        )
    },
    execution_priority = 1
)

sim$begin()
```

We can now call `save_species()` and supply the species as input and
also a path to a folder / directory where the results should be stored.

``` r
directory_name <- tempdir()

result_paths <- save_species(
    sim$species_1,
    path = directory_name
)

basename(result_paths)
#> [1] "species_1_abundance.tif"         "species_1_carrying_capacity.tif"
#> [3] "species_1_reproduction_rate.tif"
```

Because we don’t want to generate useless files when building this
document we are now going to delete these files again:

``` r
unlink(result_paths)
```

## Saving a time series of traits

Another important aspect of the analysis of the simulation results is
the change over time. So how can we save a time series of the traits and
not just the last time step? We can leverage the option to add global
processes and just include the call to `save_species()` there.

Here we will illustrate this with an example that includes two species:

``` r
sim <- create_simulation(landscape)#
sim$set_time_layer_mapping(c(1, 1, 1))
sim$add_species(c("species_1", "species_2"))

sim$add_traits(
    species = c("species_1", "species_2"),
    population_level = TRUE,
    abundance = 100,
    reproduction_rate = 0.5,
    carrying_capacity = 1000
)

sim$add_process(
    species = c("species_1", "species_2"),
    process_name = "reproduction",
    process_fun = function() {
        ricker_reproduction_model(
            self$traits$abundance,
            self$traits$reproduction_rate,
            self$traits$carrying_capacity * self$sim$environment$current$habitat_quality
        )
    },
    execution_priority = 1
)

sim$add_globals(
    result_paths = c(),
    save_dir = tempdir()
)

sim$add_process(
    #  "species" is NULL
    process_name = "saving_traits",
    process_fun = function() {
        # loop over all species
        for (species in self$species_names()){
            result_paths <- save_species(
                # pass the species object
                self[[species]],
                # specify traits we want to save
                traits = "abundance",
                # a prefix for each time step
                prefix = paste0(self$get_current_time_step(), "-"),
                # where should it be saved
                path = self$globals$save_dir
            )
            print(c("saved: ", basename(result_paths)))
            self$globals$result_paths <- c(
                self$globals$result_paths,
                result_paths
            )
        }
    },
    execution_priority = 2
)

sim$begin()
#> [1] "saved: "                   "1-species_2_abundance.tif"
#> [1] "saved: "                   "1-species_1_abundance.tif"
#> [1] "saved: "                   "2-species_2_abundance.tif"
#> [1] "saved: "                   "2-species_1_abundance.tif"
#> [1] "saved: "                   "3-species_2_abundance.tif"
#> [1] "saved: "                   "3-species_1_abundance.tif"
```

Now delete the files again. Don’t do this if you actually want to keep
the files.

``` r
unlink(sim$globals$result_paths)
```
