---
title: Overlapping Generations model template
description: A metaRange model template for non-overlapping using the Ricker model
---
**Features:**
* Beverton-Holt reproduction model
* dispersal
* suitability calculation (temperature)

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



#### Define custom Beverton Holt function for overlapping generations
# NOTE! The beverton holt model use the per capita reproduction rate (R0),
# which is different from the intrinsic growth rate (r) used in the Ricker model.
# R0 = exp(r * mean generation time) (roughly) 
beverton_holt <- function(abundance, reproduction_rate, carrying_capacity, survival_rate) {
    # Safeguarding the input
    survival_rate <- ifelse(survival_rate > 1, 1, survival_rate)
    survival_rate <- ifelse(survival_rate < 0, 0, survival_rate)
    reproduction_rate <- ifelse(reproduction_rate < 0, 0, reproduction_rate)


    abundance <- abundance * survival_rate
    abundance_t1 <- (reproduction_rate * abundance) /
        (1 + ((reproduction_rate - 1) / carrying_capacity) * abundance)
    abundance_t1[abundance_t1 < 0] <- 0
    return(abundance_t1)
}



#### Create the simulation object
sim <- create_simulation(landscape)

sim$add_species(c("Species_ad8482"))

#### Add traits: ####
sim$add_traits("Species_ad8482", abundance = 100)
sim$add_traits("Species_ad8482", reproduction_rate = 15)
sim$add_traits("Species_ad8482", initial_reproduction_rate = 0.5)
sim$add_traits("Species_ad8482", carrying_capacity = 100)
sim$add_traits("Species_ad8482", initial_carrying_capacity = 100)
sim$add_traits("Species_ad8482", suitability = 1)
sim$add_traits("Species_ad8482", survival_rate = 1)
sim$add_traits("Species_ad8482", max_temperature = 25)
sim$add_traits("Species_ad8482", optim_temperature = 23)
sim$add_traits("Species_ad8482", min_temperature = 20)
sim$add_traits(
    "Species_ad8482",
    population_level = FALSE,
    dispersal_kernel = calculate_dispersal_kernel(
        max_dispersal_dist = 10,
        kfun = negative_exponential_function,
        mean_dispersal_dist = 5
    )
)

#### Add processes: ####

sim$add_process(
    species = "Species_ad8482",
    process_name = "calculate_suitability",
    process_fun = function() {
        self$traits$suitability <-
            calculate_suitability(
                vmax = self$traits$max_temperature,
                vopt = self$traits$optim_temperature,
                vmin = self$traits$min_temperature,
                venv = self$sim$environment$current$bio1_ssp126
            )
        self$traits$survival_rate <- 1 - self$traits$suitability
    },
    execution_priority = 1
)

sim$add_process(
    species = "Species_ad8482",
    process_name = "reproduction",
    process_fun = function() {
        self$traits$abundance <- beverton_holt(
            abundance = self$traits$abundance,
            reproduction_rate = self$traits$reproduction_rate,
            carrying_capacity = self$traits$carrying_capacity * self$traits$suitability,
            survival_rate = self$traits$survival_rate
        )
    },
    execution_priority = 2
)

sim$add_process(
    species = "Species_ad8482",
    process_name = "dispersal_process",
    process_fun = function() {
        self$traits$abundance <-
            dispersal(
                abundance = self$traits$abundance,
                dispersal_kernel = self$traits$dispersal_kernel,
                weights = self$traits$suitability
            )
    },
    execution_priority = 3
)
sim$add_process(
    species = "Species_ad8482",
    process_name = "plotting_Species_ad8482_abundance",
    process_fun = function() {
        plot_cols <- hcl.colors(100, "Purple-Yellow", rev = TRUE)
        plot(
            sim$Species_ad8482,
            trait = "abundance",
            main = "Species_ad8482 : abundance",
            col = plot_cols
        )
    },
    execution_priority = 4
)

#### Run the simulation: ####
sim$set_time_layer_mapping(rep(1, 10))
sim$begin()


```
