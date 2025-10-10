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

<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
  <mi>f</mi>
  <mo>(</mo>
  <mi>x</mi>
  <mo>)</mo>
  <mo>=</mo>
  <mfrac>
    <mn>1</mn>
    <mrow>
      <mn>2</mn>
      <mo>&#x22C5;</mo>
      <mi>&#x03C0;</mi>
      <msup>
        <mi>a</mi>
        <mn>2</mn>
      </msup>
    </mrow>
  </mfrac>
  <msup>
    <mi>e</mi>
    <mrow>
      <mo>-</mo>
      <mfrac>
        <mi>x</mi>
        <mi>a</mi>
      </mfrac>
    </mrow>
  </msup>
</math>

where `a` is the mean dispersal distance divided by 2.

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

