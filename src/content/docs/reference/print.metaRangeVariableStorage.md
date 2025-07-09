---
title: Print traits or globals
description: Function reference for 'print.metaRangeVariableStorage'
slug: reference/print.metaRangeVariableStorage
sidebar:
  label: print.metaRangeVariableStorage
---

## Description

Print method for species traits and simulation globals.

## Usage

```r
# S3 method for metaRangeVariableStorage
print(x, ...)
```

## Arguments

* `x`: `<metaRangeVariableStorage>` The object to print.
* `...`: `<any>` ignored.

## Value

`<invisible x>`

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$add_species("species_01")
test_sim$add_traits(species = "species_01", a = 1)
print(test_sim$species_01$traits)
test_sim$add_globals(b = 2)
print(test_sim$globals)
```

