---
title: Metabolic scaling model template
description: A metaRange model template for the use of metabolic scaling
---

**Features:**
* Metabolic scaling based on the metabolic Theory of Ecology
* Ricker reproduction model
* dispersal

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

sim$add_species(c('Species_fb4521'))

#### Add traits: ####
initial_reproduction_rate <- 0.5
initial_carrying_capacity <- 100
bodymass <- 1
exponent_reproduction_rate <- -1 / 4
exponent_carrying_capacity <- -3 / 4
optim_temperature <- 280
sim$add_traits("Species_fb4521", abundance =  100)
sim$add_traits("Species_fb4521", reproduction_rate =  initial_reproduction_rate)
sim$add_traits("Species_fb4521", initial_reproduction_rate =  initial_reproduction_rate)
sim$add_traits("Species_fb4521", carrying_capacity =  initial_carrying_capacity)
sim$add_traits("Species_fb4521", bodymass =  bodymass)
sim$add_traits("Species_fb4521", initial_carrying_capacity =  initial_carrying_capacity)
sim$add_traits("Species_fb4521", suitability =  1)
sim$add_traits("Species_fb4521", max_temperature =  310)
sim$add_traits("Species_fb4521", optim_temperature =  optim_temperature)
sim$add_traits("Species_fb4521", min_temperature =  260)
sim$add_traits(
    species = "Species_fb4521",
    population_level = FALSE,
    dispersal_kernel = calculate_dispersal_kernel(
        max_dispersal_dist = 10,
        kfun = negative_exponential_function,
        mean_dispersal_dist = 5
    )
)
sim$add_traits(
    species = "Species_fb4521",
    population_level = FALSE,
    "exponent_reproduction_rate" = exponent_reproduction_rate,
    "exponent_carrying_capacity" = exponent_carrying_capacity
)
sim$add_traits(
    species = "Species_fb4521",
    population_level = FALSE,
    "reproduction_rate_mte_constant" = calculate_normalization_constant(
        parameter_value = initial_reproduction_rate,
        scaling_exponent = exponent_reproduction_rate,
        mass = bodymass,
        reference_temperature = optim_temperature + 273.15,
        E = -0.65,
        k = 8.617333e-05),
    "carrying_capacity_mte_constant" = calculate_normalization_constant(
        parameter_value = initial_carrying_capacity,
        scaling_exponent = exponent_carrying_capacity,
        mass = bodymass,
        reference_temperature = optim_temperature + 273.15,
        E = 0.65,
        k = 8.617333e-05)
)


#### Add processes: ####

sim$add_process(
    species = "Species_fb4521",
    process_name = "calculate_suitability",
    process_fun = function() {
        self$traits$suitability <-
            calculate_suitability(
                vmax = self$traits$max_temperature,
                vopt = self$traits$optim_temperature,
                vmin = self$traits$min_temperature,
                venv = self$sim$environment$current$bio1_ssp126
            )
    },
    execution_priority = 1
)

sim$add_process(
    species = "Species_fb4521",
    process_name = "mte",
    process_fun = function() {
        temperature_kelvin <- self$sim$environment$current$bio1_ssp126 + 273.15

        self$traits$reproduction_rate <-
            metabolic_scaling(
                normalization_constant = self$traits$reproduction_rate_mte_constant,
                scaling_exponent = self$traits$exponent_reproduction_rate,
                mass = self$traits$bodymass,
                temperature = temperature_kelvin,
                E = -0.65,
                k = 8.617333e-05)

        self$traits$reproduction_rate <-
            self$traits$reproduction_rate *
            self$traits$suitability

        self$traits$carrying_capacity <-
            metabolic_scaling(
                normalization_constant = self$traits$carrying_capacity_mte_constant,
                scaling_exponent = self$traits$exponent_carrying_capacity,
                mass = self$traits$bodymass,
                temperature = temperature_kelvin,
                E = 0.65,
                k = 8.617333e-05)

        self$traits$carrying_capacity <-
            self$traits$carrying_capacity *
            self$traits$suitability

        self$traits$carrying_capacity <-
            trunc(self$traits$carrying_capacity)
    },
    execution_priority = 2
)

sim$add_process(
    species = "Species_fb4521",
    process_name = "reproduction",
    process_fun = function() {
        self$traits$abundance <-
            ricker_reproduction_model(
                abundance = self$traits$abundance,
                reproduction_rate = self$traits$reproduction_rate,
                carrying_capacity = self$traits$carrying_capacity
            )
    },
    execution_priority = 3
)

sim$add_process(
    species = "Species_fb4521",
    process_name = "dispersal_process",
    process_fun = function() {
        self$traits$abundance <-
            dispersal(
                abundance = self$traits$abundance,
                dispersal_kernel = self$traits$dispersal_kernel,
                weights = self$traits$suitability
            )
    },
    execution_priority = 4
)
sim$add_process(
    species = "Species_fb4521",
    process_name = "plotting_Species_fb4521_abundance",
    process_fun = function() {
        plot_cols <- hcl.colors(100, "Purple-Yellow", rev = TRUE)
        plot(
            sim$Species_fb4521,
            trait = "abundance",
            main = "Species_fb4521 : abundance",
            col = plot_cols
        )
    },
    execution_priority = 5
)

#### Run the simulation: ####
sim$set_time_layer_mapping(rep(1, 10))
sim$begin()


```
