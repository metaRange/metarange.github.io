---
title: Ricker reproduction model with Allee effects
description: Function reference for 'ricker_allee_reproduction_model'
slug: reference/ricker_allee_reproduction_model
sidebar:
  label: ricker_allee_reproduction_model
---

## Description

An implementation of the Ricker reproduction model with Allee effects based on
(Cabral and Schurr, 2010) with variable overcompensation and an extension to
handle negative reproduction rates.

## Usage

```r
ricker_allee_reproduction_model(
  abundance,
  reproduction_rate,
  carrying_capacity,
  allee_threshold,
  overcomp_factor = as.numeric(c(1))
)
```

## Arguments

* `abundance`: `<numeric>` vector (or matrix) of abundances.
* `reproduction_rate`: `<numeric>` vector (or matrix) of reproduction rates.
* `carrying_capacity`: `<numeric>` vector (or matrix) of carrying capacities.
* `allee_threshold`: `<numeric>` vector (or matrix) of Allee thresholds.
* `overcomp_factor`: `<numeric>` overcompensation factor (default: 1.0).
Higher values lead to stronger overcompensation. Can also be a vector or matrix.

## Details

### Equations:

If `reproduction_rate >= 0` (based on: Cabral and Schurr, 2010):
`N_{t+1} = N_t e^{b r {(K - N_t)(N_t - C)} / {(K - C)^2})}`If `reproduction_rate < 0$:
`N_{t+1} = N_t * e^{r}`With:

* `N_t` = abundance at time t
* `N_{t+1}` = abundance at time t+1
* `r` = reproduction rate
* `K` = carrying capacity
* `C` = (critical) Allee threshold
* `b` = overcompensation factor

Note that:

* `abundance` should generally be greater than 0.
* `reproduction_rate`, `carrying_capacity` and `allee_threshold` should either all have the same size as the input abundance or all be of length 1.
* `carrying_capacity` should be greater than 0. If it is 0 or less, the abundance will be set to 0.
* `allee_threshold` should be less than `carrying_capacity`. If it is greater than or equal, the abundance will be set to 0.

Important Note:
To optimize performance, the functions modifies the abundance in-place.
This mean the input abundance will be modified (See Examples).
Since the result of this function is usually assigned to the same variable as the input abundance, this is unnoticable in most use cases.
Should you wish to keep the input abundance unchanged, you can `rlang::duplicate()` it before passing it to this function.

## References

Cabral, J.S. and Schurr, F.M. (2010)
Estimating demographic models for the range dynamics of plant species.
*Global Ecology and Biogeography*, ***19***, 85--97.

## Value

`<numeric>` vector (or matrix) of abundances.

## Examples

```r
ricker_allee_reproduction_model(
    abundance = 50,
    reproduction_rate = 2,
    carrying_capacity = 100,
    allee_threshold = -100
)
ricker_allee_reproduction_model(
    abundance = 50,
    reproduction_rate = 2,
    carrying_capacity = 100,
    allee_threshold = -100,
    overcomp_factor = 4
)
ricker_allee_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  0.25,
    carrying_capacity =  100,
    allee_threshold =  20
)
ricker_allee_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  matrix(seq(-0.5, 0.5, length.out = 25), 5, 5),
    carrying_capacity =  matrix(100, 5, 5),
    allee_threshold =  matrix(20, 5, 5)
)
ricker_allee_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  matrix(1, 5, 5),
    carrying_capacity =  matrix(100, 5, 5),
    allee_threshold =  matrix(seq(0, 100, length.out = 25), 5, 5)
)
ricker_allee_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  matrix(seq(0, -2, length.out = 25), 5, 5),
    carrying_capacity =  matrix(100, 5, 5),
    allee_threshold =  matrix(20, 5, 5)
)
# Note that the input abundance is modified in-place
abu <- 10
res <- ricker_allee_reproduction_model(
    abundance = abu,
    reproduction_rate = 0.25,
    carrying_capacity = 100,
    allee_threshold = -100
)
stopifnot(identical(abu, res))
```

