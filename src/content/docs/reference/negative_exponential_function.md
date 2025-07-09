---
title: Negative Exponential kernel
description: Function reference for 'negative_exponential_function'
slug: reference/negative_exponential_function
sidebar:
  label: negative_exponential_function
---

## Description

Negative Exponential kernel

## Usage

```r
negative_exponential_function(x, mean_dispersal_dist)
```

## Arguments

* `x`: `<numeric>` distance at which the probability should be calculated.
* `mean_dispersal_dist`: `<numeric>` mean dispersal distance. Needs to be (>0).

## Details

The negative exponential kernel is defined as:
`f(x) = {1} / {2 \pi a^2} e^{-{x} / {a}}`where `a` is the mean dispersal distance divided by 2.

## References

Nathan, R., Klein, E., Robledo-Arnuncio, J.J. and Revilla, E. (2012)
Dispersal kernels: review.
in: *Dispersal Ecology and Evolution* pp. 187--210.
(eds J. Clobert, M. Baguette, T.G. Benton and J.M. Bullock),
Oxford, UK: Oxford Academic, 2013.

## Value

`<numeric>` The probability at distance x.

## Examples

```r
negative_exponential_function(1, 1)
```

