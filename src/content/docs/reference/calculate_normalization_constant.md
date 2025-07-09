---
title: Normalization constant calculation
description: Function reference for 'calculate_normalization_constant'
slug: reference/calculate_normalization_constant
sidebar:
  label: calculate_normalization_constant
---

## Description

Calculates the normalization constant for the metabolic scaling
based on a known or estimated parameter value under at a reference temperature.

## Usage

```r
calculate_normalization_constant(
  parameter_value,
  scaling_exponent,
  mass,
  reference_temperature,
  E = NULL,
  k = 8.617333e-05,
  warn_if_possibly_false_input = getOption("metaRange.verbose", default = FALSE) > 0
)
```

## Arguments

* `parameter_value`: `<numeric>` estimated parameter value at the reference temperature.
* `scaling_exponent`: `<numeric>` allometric scaling exponent of the mass.
* `mass`: `<numeric>`  mean (individual) mass.
* `reference_temperature`: `<numeric>` reference temperature in kelvin (K).
* `E`: `<numeric>` Activation energy in electronvolts (eV).
* `k`: `<numeric>` Boltzmann's constant (eV / K).
* `warn_if_possibly_false_input`: `<boolean>` Print a warning if the input
is different from the known literature value combinations.

## Details

Note the different scaling values for different parameter.
The following is a summary from table 2 in Brown, Sibly and Kodric-Brown (2012)
(see references).

|                       |                |                 |
|-----------------------|----------------|-----------------|
|Parameter              |Scaling exponent|Activation energy|
|resource usage         |3/4             |-0.65            |
|reproduction, mortality|-1/4            |-0.65            |
|carrying capacity      |-3/4            |0.65             |

## References

Brown, J.H., Gillooly, J.F., Allen, A.P., Savage, V.M. and West, G.B. (2004)
Toward a Metabolic Theory of Ecology. *Ecology*, ***85*** 1771--1789.
Brown, J.H., Sibly, R.M. and Kodric-Brown, A. (2012)
Introduction: Metabolism as the Basis for a Theoretical Unification of Ecology.
In *Metabolic Ecology* (eds R.M. Sibly, J.H. Brown and A. Kodric-Brown)

## Seealso

`metabolic_scaling()`

## Value

The calculated normalization constant.

## Examples

```r
calculate_normalization_constant(
    parameter_value = 1,
    scaling_exponent = -1 / 4,
    mass = 1,
    reference_temperature = 273.15,
    E = -0.65
)
```

