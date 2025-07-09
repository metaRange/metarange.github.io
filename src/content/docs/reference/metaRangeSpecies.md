---
title: metaRangeSpecies object
description: Function reference for 'metaRangeSpecies'
slug: reference/metaRangeSpecies
sidebar:
  label: metaRangeSpecies
---

## Description

Creates an species object in form of an
[R6](https://rdrr.io/pkg/R6/man/R6Class.html) class that stores and handles all the parts
that define a species.

## Public fields

* `name`: `<string>` name or ID of the species.
* `processes`: `<list>` of `<metaRangeProcesses>`.
The processes that describe how the species interacts
with the environment, itself and other species.
* `traits`: `<environment>` holds the traits of the species.
* `sim`: `<metaRangeSimulation>` A reference to the [metaRangeSimulation](../metaRangeSimulation)
simulation object that the species is part of.
Useful to access environmental data or data of other species.

## Methods

### Public methods

* [`metaRangeSpecies$new()`](#method-new)
* [`metaRangeSpecies$print()`](#method-print)

### Method `new()`

Creates a new [metaRangeSpecies](../metaRangeSpecies) object

#### Usage

```
metaRangeSpecies$new(name, sim)
```

#### Arguments

* `name`: `<string>` name or ID of the species.
* `sim`: `<metaRangeSimulation>` A reference to the [metaRangeSimulation](../metaRangeSimulation)
simulation object that the species is part of.
Useful to access environmental data or data of other species.

#### Returns

A `<metaRangeSpecies>` object.

#### Examples

```
# The following is only for illustration purposes!
# species should be added to a simulation via the `add_species` method
# of the simulation object.
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
sp <- metaRangeSpecies$new(name = "species_01", sim = test_sim)
sp
```

### Method `print()`

Prints information about the species to the console

#### Usage

```
metaRangeSpecies$print()
```

#### Returns

`<invisible self>`

## Value

A `<metaRangeSpecies>` object.

## Examples

```r
## ------------------------------------------------
## Method `metaRangeSpecies$new`
## ------------------------------------------------

# The following is only for illustration purposes!
# species should be added to a simulation via the `add_species` method
# of the simulation object.
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
sp <- metaRangeSpecies$new(name = "species_01", sim = test_sim)
sp
```

