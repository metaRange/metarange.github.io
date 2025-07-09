---
title: Set verbosity of metaRange simulation
description: Function reference for 'set_verbosity'
slug: reference/set_verbosity
sidebar:
  label: set_verbosity
---

## Description

Just a wrapper for `options(metaRange.verbose = [0 | 1 | 2])` but documented.
If `0`, metaRange functions will print no messages to the console.
If `1`, metaRange functions will print some messages to the console.
If `2`, metaRange functions will print many messages to the console.

## Usage

```r
set_verbosity(verbose)
```

## Arguments

* `verbose`: `<integer>` message verbosity (see description).

## Value

`<invisible list>` a list with the previous verbosity setting.

## Examples

```r
set_verbosity(0)
getOption("metaRange.verbose")
```

