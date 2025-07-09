---
title: Dispersal process
description: Function reference for 'dispersal'
slug: reference/dispersal
sidebar:
  label: dispersal
---

## Description

Disperse a (abundance) matrix using a dispersal kernel and optional weights.

## Usage

```r
dispersal(dispersal_kernel, abundance, weights)
```

## Arguments

* `dispersal_kernel`: `<numeric matrix>` dispersal kernel. A 2D matrix of
uneven size, containing the weights that deciedes how the individuals from the
cell in the center are going to be distributed to the sourrounding cells.
* `abundance`: `<numeric matrix>` abundance matrix.
* `weights`: `<numeric matrix>` optional weights in form of a matrix
that has the same dimensions as the abundance and a range between `0` and `1`.
Should not contain any `NA`.

## Details

Each cell in the abundance matrix is dispersed using the dispersal kernel.
If a matrix of weights is supplied, the individuals will redistribute
within the dispersal kernel according to the weights.
I.e. individuals will more likely move towards areas with a higher
weight, if they are within their dispersal distance.
Note:

* the abundance is modified in place, to optimize performance.
* Any `NA` or `NaN` in abundance or weights will be (in-place) replaced by `0`.

## Value

`<numeric matrix>` Dispersed abundance matrix.

## Examples

```r
n <- 10
n2 <- n^2
abu <- matrix(1:n2, nrow = n, ncol = n)
suitab <- matrix(1, nrow = n, ncol = n)
kernel <- calculate_dispersal_kernel(
    max_dispersal_dist = 4,
    kfun = negative_exponential_function,
    mean_dispersal_dist = 1.2
)
res1 <- dispersal(
    dispersal_kernel = kernel,
    abundance = abu
)
res2 <- dispersal(
    dispersal_kernel = kernel,
    abundance = abu,
    weights = suitab
)
stopifnot(sum(res1) - sum(res2) < 0.01)
# Note that the abundance is modified in place, i.e:
stopifnot(sum(abu - res2) < 0.01)
```

