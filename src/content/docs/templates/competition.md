---
title: Non-overlapping Generations model template
description: A metaRange model template for non-overlapping using the Ricker model
---
**Features:**
* Ricker reproduction model
* dispersal
* suitability calculation (temperature)
* competition based on suitability in local evironment

```r
library(metaRange)
library(terra)
set_verbosity(2)
# -------------------------------------
# ----- Setup of the environment: -----
# -------------------------------------

temperature <- rast(volcano + 150)
landscape <- sds(temperature)
names(landscape) <- c('temperature')


# -------------------------------------
# ----- Simulation code: --------------
# -------------------------------------



#### Create the simulation object
sim <- create_simulation(landscape)

sim$add_species(c("A", "B"))

#### Add traits: ####
sim$add_traits(
    c("A", "B"),
    abundance =  100,
    reproduction_rate =  0.5,
    carrying_capacity =  100,
    suitability =  1,
    competition_advantage =  0
)

sim$add_traits(
    c("A", "B"),
    population_level = FALSE,
    dispersal_kernel = calculate_dispersal_kernel(
        max_dispersal_dist = 10,
        kfun = negative_exponential_function,
        mean_dispersal_dist = 5
    )
)

sim$add_traits(
    "A",
    max_temperature =  310,
    optim_temperature =  280,
    min_temperature =  260
)

sim$add_traits(
    "B",
    max_temperature =  300,
    optim_temperature =  270,
    min_temperature =  250
)

sim$add_globals(
    carrying_capacity = matrix(
        100,
        nrow = nrow(sim$environment$current$temperature),
        ncol = ncol(sim$environment$current$temperature)
    ),
    combined_suitability = matrix(
        0,
        nrow = nrow(sim$environment$current$temperature),
        ncol = ncol(sim$environment$current$temperature)
    )
)
sim$globals



#### Add processes: ####

sim$add_process(
    process_name = "set_combined_suitability_zerop",
    process_fun = function() {
        self$globals$combined_suitability <-
            matrix(
                0,
                nrow = nrow(self$environment$current$temperature),
                ncol = ncol(self$environment$current$temperature)
            )
    },
    execution_priority = 1
)

sim$add_process(
    species = c("A", "B"),
    process_name = "calculate_suitability",
    process_fun = function() {
        self$traits$suitability <-
            calculate_suitability(
                vmax = self$traits$max_temperature,
                vopt = self$traits$optim_temperature,
                vmin = self$traits$min_temperature,
                venv = self$sim$environment$current$temperature
            )
        self$sim$globals$combined_suitability <-
            self$sim$globals$combined_suitability + self$traits$suitability
    },
    execution_priority = 2
)

sim$add_process(
    species = c("A", "B"),
    process_name = "calculate_competition_advantage",
    process_fun = function() {
        self$traits$competition_advantage <-
            self$traits$suitability /
            self$sim$globals$combined_suitability
    },
    execution_priority = 2
)

sim$add_process(
    species = c("A", "B"),
    process_name = "reproduction_and_competition",
    process_fun = function() {
        self$traits$abundance <-
            ricker_reproduction_model(
                abundance = self$traits$abundance,
                reproduction_rate = self$traits$reproduction_rate,
                carrying_capacity = self$sim$globals$carrying_capacity * self$traits$competition_advantage
            )
    },
    execution_priority = 3
)

sim$add_process(
    species = c("A", "B"),
    process_name = "dispersal_process",
    process_fun = function() {
        self$traits$abundance <-
            dispersal(
                abundance = self$traits$abundance,
                dispersal_kernel = self$traits$dispersal_kernel
            )
    },
    execution_priority = 4
)



sim$add_process(
    species = c("A", "B"),
    process_name = "plotting_abundance",
    process_fun = function() {
        plot_cols <- hcl.colors(100, "Purple-Yellow", rev = TRUE)
        plot(
            self,
            trait = "abundance",
            main = paste0(self$name, " : abundance"),
            col = plot_cols
        )
    },
    execution_priority = 5
)

#### Run the simulation: ####
sim$set_time_layer_mapping(rep(1, 10))
sim$begin()

```
