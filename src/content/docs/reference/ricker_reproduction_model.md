---
title: Ricker reproduction model
description: Function reference for 'ricker_reproduction_model'
slug: reference/ricker_reproduction_model
sidebar:
  label: ricker_reproduction_model
---

## Description

An implementation of the Ricker reproduction model (Ricker, 1954) with
an extension to handle negative reproduction rates.

## Usage

```r
ricker_reproduction_model(abundance, reproduction_rate, carrying_capacity)
```

## Arguments

* `abundance`: `<numeric>` vector (or matrix) of abundances.
* `reproduction_rate`: `<numeric>` vector (or matrix) of reproduction rates.
* `carrying_capacity`: `<numeric>` vector (or matrix) of carrying capacities.

## Details

### Equations:

If `reproduction_rate >= 0` (Ricker, 1954):
`N_{t+1} = N_t e^{r (1 - {N_t} / {K})}`If `reproduction_rate < 0$:
`N_{t+1} = N_t * e^{r}`With:

* `N_t` = abundance at time t
* `N_{t+1}` = abundance at time t+1
* `r` = reproduction rate
* `K` = carrying capacity

Note that:

* `abundance` should generally be greater than 0.
* `reproduction_rate` and  `carrying_capacity` should either both have the same size as the input abundance or both be of length 1.
* `carrying_capacity` should generally be greater than 0. If it is 0 or less, the abundance will be set to 0.

Important Note:
To optimize performance, the functions modifies the abundance in-place.
This mean the input abundance will be modified (See Examples).
Since the result of this function is usually assigned to the same variable as the input abundance, this is unnoticable in most use cases.
Should you wish to keep the input abundance unchanged, you can `rlang::duplicate()` it before passing it to this function.

## References

Ricker, W.E. (1954) Stock and recruitment.
*Journal of the Fisheries Research Board of Canada*, ***11***, 559--623.

## Value

`<numeric>` vector (or matrix) of abundances.

## Examples

```r
ricker_reproduction_model(
    abundance = 10,
    reproduction_rate = 0.25,
    carrying_capacity = 100
)
ricker_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  0.25,
    carrying_capacity =  100
)
ricker_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  matrix(seq(-0.5, 0.5, length.out = 25), 5, 5),
    carrying_capacity =  matrix(100, 5, 5)
)
ricker_reproduction_model(
    abundance = matrix(10, 5, 5),
    reproduction_rate =  matrix(seq(0, -2, length.out = 25), 5, 5),
    carrying_capacity =  matrix(100, 5, 5)
)
# Note that the input abundance is modified in-place
abu <- 10
res <- ricker_reproduction_model(
    abundance = abu,
    reproduction_rate = 0.25,
    carrying_capacity = 100
)
stopifnot(identical(abu, res))
```

