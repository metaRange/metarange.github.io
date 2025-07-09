---
title: Summary for metaRange simulation
description: Function reference for 'summary.metaRangeSimulation'
slug: reference/summary.metaRangeSimulation
sidebar:
  label: summary.metaRangeSimulation
---

## Description

Print a summary of the simulation to the console.

## Usage

```r
# S3 method for metaRangeSimulation
summary(object, ...)
```

## Arguments

* `object`: `<metaRangeSimulation>` The [metaRangeSimulation](../metaRangeSimulation) object to summarize.
* `...`: `<any>` ignored.

## Value

`<invisible NULL>`

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$add_species("species_01")
summary(test_sim)
```

