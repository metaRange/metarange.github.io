---
title: Calculate 2D dispersal kernel.
description: Function reference for 'calculate_dispersal_kernel'
slug: reference/calculate_dispersal_kernel
sidebar:
  label: calculate_dispersal_kernel
---

## Description

Use a probability function to create a 2D dispersal kernel matrix.

## Usage

```r
calculate_dispersal_kernel(max_dispersal_dist, kfun, normalize = TRUE, ...)
```

## Arguments

* `max_dispersal_dist`: `<numeric>` maximum dispersal distance in grid cells.
The size (rows and columns) of the created dispersal kernel matrix will be
`2 * max_dispersal_dist + 1`.
* `kfun`: `<function>` the probability function that is used to calculate
the values for each cell of the dispersal kernel. Can be user-defined,
in which case it needs to vectorized and accept (at least) the parameter
"x" representing the distance from the source as its input and return a
vector of the same size as `max_dispersal_dist`.
* `normalize`: `<boolean>` whether to normalize the kernel (`sum(kernel) == 1)`).
* `...`: additional parameters to be passed to the kernel function.

## Details

This function first creates an matrix of size `2 * max_dispersal_dist + 1`,
where each cell contains the distance from the center of the cell to the center
of the matrix. After that, the kernel function (`kfun`) is called with this
matrix as input and expected to return a vector with the calculated
probabilities for each cell. Lastly, the kernel is optionally normalized.

## Value

Dispersal kernel with probabilities.

## Examples

```r
# a very simple uniform kernel
uniform_kernel <- calculate_dispersal_kernel(
    max_dispersal_dist = 2,
    kfun = function(x) {
        rep(1, length(x))
    },
    normalize = FALSE
)
# same as
stopifnot(
    uniform_kernel == matrix(1, nrow = 5, ncol = 5)
)

# How does the input matrix look like,
# that is used as input for `kfun`?
calculate_dispersal_kernel(
    max_dispersal_dist = 2,
    kfun = function(x) {
        return(x)
    },
    normalize = FALSE
)

# now a negative exponential kernel.
# note that `mean_dispersal_dist` is a parameter of
# the `negative_exponential_function`
# and is passed to `kfun` via the `...`.
calculate_dispersal_kernel(
    max_dispersal_dist = 2,
    kfun = negative_exponential_function,
    mean_dispersal_dist = 1
)
```

