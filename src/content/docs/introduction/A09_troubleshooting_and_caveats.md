---
title: Troubleshooting and Caveats
description: metaRange R package tutorial. How to do troubleshooting and general caveats.
slug: vignettes/A09_troubleshooting_and_caveats
sidebar:
  label: Troubleshooting and Caveats
---


When creating your own simulation, you may encounter issues / errors to
which the solution may not be immediately obvious. Here we will cover a
basic strategy on how to debug with the example of a simple typo in one
of the species traits.

## Debugging

The following code will result in an error:

``` r
library(metaRange)
library(terra)
set_verbosity(0)
raster_file <- system.file("ex/elev.tif", package = "terra")
r <- rast(raster_file)
r <- scale(r, center = FALSE, scale = TRUE)
r <- rep(r, 10)
landscape <- sds(r)
names(landscape) <- c("habitat_quality")

sim <- create_simulation(
    source_environment = landscape,
    ID = "example_simulation",
    seed = 1
)

sim$add_species(name = "species_1")
sim$add_traits(
    species = "species_1",
    population_level = TRUE,
    abundance = 100,
    reproduction_rtae = 0.5,
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

    #> Error: Not compatible with requested type: [type=NULL; target=double].

And it may not immediately be obvious what the problem is. The first
step to narrow down the problem is to enable extensive verbosity. So, if
we run the code again, but this time with `set_verbosity(2)`, we get the
following output:

``` r
set_verbosity(2)

sim <- create_simulation(
    source_environment = landscape,
    ID = "example_simulation",
    seed = 1
)
#> number of time steps: 10
#> time step layer mapping: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
#> added environment
#> class       : SpatRasterDataset 
#> subdatasets : 1 
#> dimensions  : 90, 95 (nrow, ncol)
#> nlyr        : 10 
#> resolution  : 0.008333333, 0.008333333  (x, y)
#> extent      : 5.741667, 6.533333, 49.44167, 50.19167  (xmin, xmax, ymin, ymax)
#> coord. ref. : lon/lat WGS 84 (EPSG:4326) 
#> source(s)   : memory 
#> names       : habitat_quality
#> 
#> created simulation: example_simulation

sim$add_species(name = "species_1")
#> adding species
#> name: species_1
sim$add_traits(
    species = "species_1",
    population_level = TRUE,
    abundance = 100,
    reproduction_rtae = 0.5,
    carrying_capacity = 1000
)
#> adding traits:
#> [1] "abundance"         "reproduction_rtae" "carrying_capacity"
#> 
#> to species:
#> [1] "species_1"
#> 
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
#> adding process: reproduction
#> to species:
#> [1] "species_1"
#> 
```

The setup look ok so far. Now we start the simulation.

``` r
sim$begin()
```

    #> 
    #> Starting simualtion.
    #> 
    #> passed initial sanity checks.
    #> 
    #> start of time step: 1
    #> |- species_1 : reproduction
    #> Error: Not compatible with requested type: [type=NULL; target=double].

We can see that the error occurs in the first time step, in the
`reproduction` process of “species_1”. With this information, we can now
insert a `browser()` function, which stops the code execution once it is
called and lets us inspect the process and the variables of the function
/ environment it has been called from.

``` r
set_verbosity(2)

sim <- create_simulation(
    source_environment = landscape,
    ID = "example_simulation",
    seed = 1
)

sim$add_species(name = "species_1")
sim$add_traits(
    species = "species_1",
    population_level = TRUE,
    abundance = 100,
    reproduction_rtae = 0.5,
    carrying_capacity = 1000
)
sim$add_process(
    species = "species_1",
    process_name = "reproduction",
    process_fun = function() {
        browser()

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

In the browser, we are conceptually inside the `reproduction` process of
“species_1”. This means we can make use of the `self` keyword to inspect
the state of the species.

As a first step, we might want to call `ls()` to see which objects we
can inspect.

``` r
# type this in the console,
# once the browser has halted the code execution
ls()
```

    #> [1] "initialize" "name"       "print"      "processes"  "sim"       
    #> [6] "traits"

Since the error was about an wrong type being passed to the reproduction
function, we can inspect the `traits` of the species to see if they are
as we would expect them to be. This means we can just type `self$traits`
in the console to see them and we may notice that the
`reproduction_rate` is misspelled as `reproduction_rtae`.

``` r
# type this in the console,
# once the browser has halted the code execution
self$traits
```

    #> abundance :  num [1:90, 1:95] 100 100 100 100 100 100 100 100 100 100 ...
    #> carrying_capacity :  num [1:90, 1:95] 1000 1000 1000 1000 1000 1000 1000 1000 1000 1000 ...
    #> reproduction_rtae :  num [1:90, 1:95] 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5 ...

We can quit the browser by typing `Q` and then `Enter` in the console.
Now we can remove the `browser()` call from the code again and proceed
to fix the typo.

## General caveats

While metaRange can be used to simulate a wide range of scenarios, there
are some caveats to keep in mind.

1.  **Different scales of the environment and the species**

    Since the size and resolution of the environment also describes the
    spatial size of each population (i.e. one grid cell = one
    population), it is important to choose scales that are appropriate
    for the species. This is especially important to keep in mind when
    simulating multiple species, since they may have different spatial
    requirements.

2.  **Gene flow**

    While it is planned for future versions, metaRange does (currently)
    not support gene flow during dispersal.

3.  **Spatial distortion**

    Since metaRange uses raster data to represent the environment, it is
    important to keep in mind that the raster is a 2D representation of
    a 3D world. The larger the geographic extent of the environment, the
    more distorted the raster will be (also depending on the map
    projection and the resolution).
