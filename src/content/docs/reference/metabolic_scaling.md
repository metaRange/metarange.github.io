---
title: Metabolic scaling
description: Function reference for 'metabolic_scaling'
slug: reference/metabolic_scaling
sidebar:
  label: metabolic_scaling
---

## Description

A function to calculate the metabolic scaling of a parameter, based on the
metabolic theory of ecology (Brown et al. 2004).

## Usage

```r
metabolic_scaling(
  normalization_constant,
  scaling_exponent,
  mass,
  temperature,
  E,
  k = 8.617333e-05
)
```

## Arguments

* `normalization_constant`: `<numeric>` normalization constant.
* `scaling_exponent`: `<numeric>` allometric scaling exponent of the mass.
* `mass`: `<numeric matrix>`  mean (individual) mass.
* `temperature`: `<numeric matrix>` temperature in kelvin (K).
* `E`: `<numeric>` activation energy in electronvolts (eV).
* `k`: `<numeric>` Boltzmann's constant (eV / K).

## Details

### Equation:

The function uses the equation in the form of:
`parameter = normalization_constant * mass^{scaling_exponent} * e^{{Activation_energy} / {k * temperature}}`

### Parameter:

Note the different scaling values for different parameter.
The following is a summary from table 2 in Brown, Sibly and Kodric-Brown (2012)
(see references).

|                       |                |                 |
|-----------------------|----------------|-----------------|
|Parameter              |Scaling exponent|Activation energy|
|resource usage         |3/4             |-0.65            |
|reproduction, mortality|-1/4            |-0.65            |
|carrying capacity      |-3/4            |0.65             |

### Units:

`1 \ electronvolt = 1.602176634 * 10^{-19} Joule``Boltzmann \ constant = 1.380649 * 10^{-23} {Joule} / {Kelvin}``Boltzmann \ constant \ in {eV} / {K} = 8.617333e-05 = {1.380649 * 10^{-23}} / {1.602176634 * 10^{-19}}`

## References

Brown, J.H., Gillooly, J.F., Allen, A.P., Savage, V.M. and West, G.B. (2004)
Toward a Metabolic Theory of Ecology. *Ecology*, ***85*** 1771--1789.
Brown, J.H., Sibly, R.M. and Kodric-Brown, A. (2012)
Introduction: Metabolism as the Basis for a Theoretical Unification of Ecology.
In *Metabolic Ecology* (eds R.M. Sibly, J.H. Brown and A. Kodric-Brown)

## Seealso

`calculate_normalization_constant()`

## Value

`<numeric>` The scaled parameter.

## Examples

```r
reproduction_rate <- 0.25
E_reproduction_rate <- -0.65
estimated_normalization_constant <-
    calculate_normalization_constant(
        parameter_value = reproduction_rate,
        scaling_exponent = -1/4,
        mass = 100,
        reference_temperature = 273.15 + 10,
        E = E_reproduction_rate
    )
metabolic_scaling(
    normalization_constant = estimated_normalization_constant,
    scaling_exponent = -1/4,
    mass = 100,
    temperature = 273.15 + 20,
    E = E_reproduction_rate
)

carrying_capacity <- 100
E_carrying_capacity <- 0.65
estimated_normalization_constant <-
    calculate_normalization_constant(
        parameter_value = carrying_capacity,
        scaling_exponent = -3/4,
        mass = 100,
        reference_temperature = 273.15 + 10,
        E = E_carrying_capacity
    )
metabolic_scaling(
    normalization_constant = estimated_normalization_constant,
    scaling_exponent = -3/4,
    mass = 100,
    temperature = 273.15 + 20,
    E = E_carrying_capacity
)
```

