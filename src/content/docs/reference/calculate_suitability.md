---
title: Calculate (estimate) environmental suitability
description: Function reference for 'calculate_suitability'
slug: reference/calculate_suitability
sidebar:
  label: calculate_suitability
---

## Description

Calculate / estimate the environmental suitability for a given environmental value,
based on a beta distribution, using the three "cardinal" values of the species for that environmental niche.

## Usage

```r
calculate_suitability(vmax, vopt, vmin, venv)
```

## Arguments

* `vmax`: `<numeric>` upper (i.e. maximum) tolerable value
* `vopt`: `<numeric>` optimal (i.e. preferred) value
* `vmin`: `<numeric>` lower (i.e. minimum) tolerable value
* `venv`: `<numeric>` environmental value for which to calculate the suitability

## Details

The environmental suitability is calculated based on a beta distribution
after a formula provided by Yin et al. (1995) and simplified by Yan and Hunt (1999) (see references paragraph)

<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
    <mi>suitability</mi>
    <mo>=</mo>
    <mrow>
        <mfrac>
            <mrow>
                <msub><mi>V</mi><mi>max</mi></msub>
                <mo>-</mo>
                <msub><mi>V</mi><mi>env</mi></msub>
            </mrow>
            <mrow>
                <msub><mi>V</mi><mi>max</mi></msub>
                <mo>-</mo>
                <msub><mi>V</mi><mi>opt</mi></msub>
            </mrow>
        </mfrac>
        <mo>&#x22C5;</mo>
        <msup>
            <mrow>
                <mfrac>
                    <mrow>
                        <msub><mi>V</mi><mi>env</mi></msub>
                        <mo>-</mo>
                        <msub><mi>V</mi><mi>min</mi></msub>
                    </mrow>
                    <mrow>
                        <msub><mi>V</mi><mi>opt</mi></msub>
                        <mo>-</mo>
                        <msub><mi>V</mi><mi>min</mi></msub>
                    </mrow>
                </mfrac>
            </mrow>
            <mrow>
                <mfrac>
                    <mrow>
                        <msub><mi>V</mi><mi>opt</mi></msub>
                        <mo>-</mo>
                        <msub><mi>V</mi><mi>min</mi></msub>
                    </mrow>
                    <mrow>
                        <msub><mi>V</mi><mi>max</mi></msub>
                        <mo>-</mo>
                        <msub><mi>V</mi><mi>opt</mi></msub>
                    </mrow>
                </mfrac>
            </mrow>
        </msup>
    </mrow>
</math>

## Note

The original formula by Yin et al. was only intended to calculate
the relative daily growth rate of plants in relation to temperature. The abstraction to
use this to A) calculate a niche suitability; and B) use it on other
environmental values than temperature might not be valid. However, the assumption that the
environmental suitability for one niche dimension is highest at one optimal value and
decreases towards the tolerable minimum and maximum values in a nonlinear fashion seems reasonable.

## References

Yin, X., Kropff, M.J., McLaren, G., Visperas, R.M., (1995)
A nonlinear model for crop development as a function of temperature,
*Agricultural and Forest Meteorology*,
Volume ***77***, Issues 1–2,
Pages 1--16,
Also, see equation 4 in:
Weikai Yan, L.A. Hunt, (1999)
An Equation for Modelling the Temperature Response of Plants using only the Cardinal Temperatures,
*Annals of Botany*,
Volume ***84***, Issue 5,
Pages 607--614,
ISSN 0305-7364,

## Value

`<numeric>` environmental suitability

## Examples

```r
calculate_suitability(
    vmax = 30,
    vopt = 25,
    vmin = 10,
    venv = 1:40
)
calculate_suitability(
    vmax = seq(30, 32, length.out = 40),
    vopt = seq(20, 23, length.out = 40),
    vmin = seq(9, 11, length.out = 40),
    venv = 1:40
)

try(calculate_suitability(
    vmax = 1,
    vopt = seq(20, 23, length.out = 40),
    vmin = seq(9, 11, length.out = 40),
    venv = 1:40
))
```

