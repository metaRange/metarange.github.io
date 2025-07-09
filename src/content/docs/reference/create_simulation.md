---
title: Create a simulation
description: Function reference for 'create_simulation'
slug: reference/create_simulation
sidebar:
  label: create_simulation
---

## Description

Creates a [metaRangeSimulation](../metaRangeSimulation) object.
A convenience wrapper for `metaRangeSimulation$new()`.

## Usage

```r
create_simulation(source_environment, ID = NULL, seed = NULL)
```

## Arguments

* `source_environment`: `<SpatRasterDataset>` created by `[terra::sds()](https://rdrr.io/pkg/terra/man/sds.html)` that represents the environment.
The individual data sets represent different environmental variables
(e.g. temperature or habitat availability) and the different layer of the data sets
represent the different timesteps of the simulation.
The function [metaRangeSimulation](../metaRangeSimulation)`$set_time_layer_mapping()` can be used
to extend/ shorten the simulation timesteps and set the mapping between each time step and a corresponding
environmental layer. This can be used e.g. to repeat the first (few) layer as a burn-in period.
The number of layers must be the same for all data sets.
* `ID`: `<string>` optional simulation identification string.
Will be set automatically if none is specified.
* `seed`: `<integer>` optional seed for the random number generator.
Will be set automatically if none is specified.

## Value

A [metaRangeSimulation](../metaRangeSimulation) object

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- create_simulation(sim_env)
```

