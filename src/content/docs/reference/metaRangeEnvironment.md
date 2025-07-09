---
title: metaRangeEnvironment object
description: Function reference for 'metaRangeEnvironment'
slug: reference/metaRangeEnvironment
sidebar:
  label: metaRangeEnvironment
---

## Description

Creates an [metaRangeEnvironment](../metaRangeEnvironment) object in form of an
[R6](https://rdrr.io/pkg/R6/man/R6Class.html) class that stores and handles the environmental
values that influence the species in the simulation.

## Public fields

* `sourceSDS`: A *SpatRasterDataset* created by `[terra::sds()](https://rdrr.io/pkg/terra/man/sds.html)`
that holds all the environmental values influencing the simulation.
Note that the individual data sets should be sensibly named as
their names will used throughout the simulation to refer to them.
* `current`: an R environment that holds all the
environmental values influencing the present / current time step of the
simulation. These values are copies of the current layers
of the respective individual data sets in the sourceSDS and they are
stored as regular 2D R matrices under the same name given to the
corresponding sub data set in the sourceSDS. These matrices are updated
automatically at the beginning of each time step.

## Methods

### Public methods

* [`metaRangeEnvironment$new()`](#method-new)
* [`metaRangeEnvironment$set_current()`](#method-set_current)
* [`metaRangeEnvironment$print()`](#method-print)

### Method `new()`

Creates a new [metaRangeEnvironment](../metaRangeEnvironment) object.
This is done automatically when a simulation is created. There is no need to
call this as user.

#### Usage

```
metaRangeEnvironment$new(sourceSDS = NULL)
```

#### Arguments

* `sourceSDS`: `<SpatRasterDataset>` created by `[terra::sds()](https://rdrr.io/pkg/terra/man/sds.html)`
that holds all the environmental values influencing the simulation.
Note that the individual data sets should be sensibly named as
their names will used throughout the simulation to refer to them.

#### Returns

A `<metaRangeEnvironment>` object

#### Examples

```
# Note: Only for illustration purposes.
# The environment is automatically created when creating a simulation.
metaRangeEnvironment$new(
     sourceSDS = terra::sds(
         terra::rast(vals = 1, nrow = 2, ncol = 2)
     )
)
```

### Method `set_current()`

Set current (active) time step / environment layer.
No reason to call this as user. The current time step is set
automatically by the simulation.

#### Usage

```
metaRangeEnvironment$set_current(layer)
```

#### Arguments

* `layer`: `<integer>` layer number.

#### Returns

`<invisible self>`

#### Examples

```
# Note: Only for illustration purposes.
# The time step is automatically set by the simulation.
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 2))
names(sim_env) <- "env_01"
env <- metaRangeEnvironment$new(sourceSDS = sim_env)
env$set_current(layer = 1)
```

### Method `print()`

Prints information about the environment to the console

#### Usage

```
metaRangeEnvironment$print()
```

#### Returns

`<invisible self>`

#### Examples

```
env <- metaRangeEnvironment$new(
    sourceSDS = terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 2))
)
env$print()
```

## Value

An `<metaRangeEnvironment>` object

## Examples

```r
## ------------------------------------------------
## Method `metaRangeEnvironment$new`
## ------------------------------------------------

# Note: Only for illustration purposes.
# The environment is automatically created when creating a simulation.
metaRangeEnvironment$new(
     sourceSDS = terra::sds(
         terra::rast(vals = 1, nrow = 2, ncol = 2)
     )
)

## ------------------------------------------------
## Method `metaRangeEnvironment$set_current`
## ------------------------------------------------

# Note: Only for illustration purposes.
# The time step is automatically set by the simulation.
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 2))
names(sim_env) <- "env_01"
env <- metaRangeEnvironment$new(sourceSDS = sim_env)
env$set_current(layer = 1)

## ------------------------------------------------
## Method `metaRangeEnvironment$print`
## ------------------------------------------------

env <- metaRangeEnvironment$new(
    sourceSDS = terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2, nlyr = 2))
)
env$print()
```

