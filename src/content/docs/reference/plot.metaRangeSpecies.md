---
title: Plotting function
description: Function reference for 'plot.metaRangeSpecies'
slug: reference/plot.metaRangeSpecies
sidebar:
  label: plot.metaRangeSpecies
---

## Description

Plots the specified trait of a [metaRangeSpecies](../metaRangeSpecies) object.

## Usage

```r
# S3 method for metaRangeSpecies
plot(x, trait_name, col, main = NULL, ...)
```

## Arguments

* `x`: `<metaRangeSpecies>` [metaRangeSpecies](../metaRangeSpecies) object.
* `trait_name`: `<string>` name of the trait to plot.
* `col`: `<character>` colors to use. Defaults to `grDevices::hcl.colors()` with
`n =50` and a random palette.
* `main`: `<string>` optional title of the plot. Will be labeled automatically when NULL.
* `...`: additional arguments passed to [terra::plot](https://rdrr.io/pkg/terra/man/plot.html) or [base::plot](https://rdrr.io/r/base/plot.html).

## Value

`<invisible NULL>`.

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$add_species("species_01")
test_sim$add_traits("species_01", trait_01 = matrix(1:4, nrow = 2, ncol = 2))
plot(test_sim$species_01, "trait_01")
```

