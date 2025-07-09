---
title: Save function
description: Function reference for 'save_species'
slug: reference/save_species
sidebar:
  label: save_species
---

## Description

Saves the specified traits of a [metaRangeSpecies](../metaRangeSpecies) object.

## Usage

```r
save_species(x, traits = NULL, prefix = NULL, path, overwrite = FALSE, ...)
```

## Arguments

* `x`: `<metaRangeSpecies>` [metaRangeSpecies](../metaRangeSpecies) object.
* `traits`: `<character>` `NULL` or a character vector specifying the trait to save.
If `NULL`, all traits are saved.
* `prefix`: `<string>` prefix for the file names or `NULL`.
* `path`: `<string>`path to the directory where the files are saved.
* `overwrite`: `<boolean>` overwrite existing files.
* `...`: additional arguments passed to [terra::writeRaster](https://rdrr.io/pkg/terra/man/writeRaster.html).

## Details

The generated file names are of the form
`file.path(path, paste0(prefix, species_name, "_", trait_name, ".file_extension"))`.
If the trait is in a matrix or raster form, the file extension is `.tif`. Otherwise it is `.csv`.
The prefix is optional and mainly useful to add a time step to the file name, in case the trait
is saved multiple times during a simulation.

## Value

`<invisible character>` the paths to the saved files.

## Examples

```r
sim_env <- terra::sds(terra::rast(vals = 1, nrow = 2, ncol = 2))
names(sim_env) <- "env_01"
test_sim <- metaRangeSimulation$new(source_environment = sim_env)
test_sim$add_species("species_01")
test_sim$add_traits(
    "species_01",
    trait_01 = matrix(1, nrow = 2, ncol = 2),
    trait_02 = matrix(2, nrow = 2, ncol = 2)
)

file_prefix <- "This_could_be_a_time_step"
directory_name <- tempdir()

res_path <- save_species(
    test_sim$species_01,
    traits = "trait_01",
    prefix = file_prefix,
    path = directory_name
)
# the following should be TRUE
# but might fail due to floating point errors (that's why we round the values)
identical(
    round(terra::as.matrix(terra::rast(res_path), wide = TRUE)),
    round(test_sim$species_01$traits[["trait_01"]])
)

# test overwrite
res_path2 <- save_species(
    test_sim$species_01,
    traits = "trait_01",
    prefix = file_prefix,
    path = directory_name,
    overwrite = TRUE
)
stopifnot(identical(res_path, res_path2))

# Saving all traits
res_path3 <- save_species(
    test_sim$species_01,
    prefix = basename(tempfile()),
    path = directory_name
)
# cleanup
unlink(c(res_path, res_path3))
stopifnot(all(!file.exists(res_path, res_path3)))
```

