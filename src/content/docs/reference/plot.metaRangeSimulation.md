---
title: Plotting function
description: Function reference for 'plot.metaRangeSimulation'
slug: reference/plot.metaRangeSimulation
sidebar:
  label: plot.metaRangeSimulation
---

## Description

Plots the specified element of a [metaRangeSimulation](../metaRangeSimulation) object.

## Usage

```r
# S3 method for metaRangeSimulation
plot(x, obj, name, col, ...)
```

## Arguments

* `x`: `<metaRangeSimulation>` [metaRangeSimulation](../metaRangeSimulation) object.
* `obj`: `<string>` either the string `environment` or the name of a species.
* `name`: `<string>` either the name of an environment of the name of a species trait.
* `col`: `<character>` colors to use. Defaults to `grDevices::hcl.colors()` with
`n = 50` and a random palette.
* `...`: additional arguments passed to [terra::plot](https://rdrr.io/pkg/terra/man/plot.html) or [base::plot](https://rdrr.io/r/base/plot.html).

## Value

`<invisible NULL>`.

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
plot(test_sim, "environment", "env_01")

test_sim$add_species("species_01")
test_sim$add_traits("species_01", trait_01 = matrix(1, nrow = 2, ncol = 2))
plot(test_sim, "species_01", "trait_01")

test_sim$add_globals("global_01" = 1:10)
plot(test_sim, "globals", "global_01")
```

