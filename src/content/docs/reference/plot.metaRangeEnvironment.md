---
title: Plotting function
description: Function reference for 'plot.metaRangeEnvironment'
slug: reference/plot.metaRangeEnvironment
sidebar:
  label: plot.metaRangeEnvironment
---

## Description

Plots the specified current environment of a [metaRangeSimulation](../metaRangeSimulation) object.

## Usage

```r
# S3 method for metaRangeEnvironment
plot(x, env_name, col, as_timeseries = FALSE, main = NULL, ...)
```

## Arguments

* `x`: `<metaRangeEnvironment>` [metaRangeEnvironment](../metaRangeEnvironment) object.
* `env_name`: `<string>` name of the (sub) environment to plot.
* `col`: `<character>` colors to use. Defaults to `grDevices::hcl.colors()` with
`n = 50` and a random palette.
* `as_timeseries`: `<logical>` if `TRUE`, plot the mean of each layer of the (source)
environment as a line graph over time, if `FALSE` plot the (current) environment as a raster.
* `main`: `<string>` optional title of the plot. Will be labeled automatically when NULL.
* `...`: additional arguments passed to [terra::plot](https://rdrr.io/pkg/terra/man/plot.html) or [base::plot](https://rdrr.io/r/base/plot.html).

## Value

`<invisible NULL>`.

## Examples

```r
layer <- 100
sim_env <- terra::sds(
    terra::rast(
        vals = rnorm(4 * layer),
        nrow = 2,
        ncol = 2,
        nlyr = layer
    )
)
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$environment$set_current(1)
plot(test_sim$environment, "env_01")
plot(test_sim$environment, "env_01", as_timeseries = TRUE)
```

