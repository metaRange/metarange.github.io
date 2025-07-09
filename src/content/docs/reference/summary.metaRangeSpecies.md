---
title: Summary for metaRange species
description: Function reference for 'summary.metaRangeSpecies'
slug: reference/summary.metaRangeSpecies
sidebar:
  label: summary.metaRangeSpecies
---

## Description

Summary for metaRange species

## Usage

```r
# S3 method for metaRangeSpecies
summary(object, ...)
```

## Arguments

* `object`: `<metaRangeSpecies>` The [metaRangeSpecies](../metaRangeSpecies) object to summarize.
* `...`: `<any>` ignored.

## Value

`<invisible NULL>`

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$add_species("species_01")
summary(test_sim$species_01)
```

