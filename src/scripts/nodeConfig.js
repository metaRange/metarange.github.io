export const nodeConfig = {
    temperature: {
        name: "Temperature",
        inputs: 0,
        outputs: 1,
        className: "env-node",
        data: {
            output_1: {
                vsOutputClasses: "env_values temperature",
            },
            info: "environment"
        },
        html: "<div class='title'>Temperature</div>",
    },
    precipitation: {
        name: "Precipitation",
        inputs: 0,
        outputs: 1,
        className: "env-node",
        data: {
            output_1: {
                vsOutputClasses: "env_values precipitation",
            },
            info: "environment"
        },
        html: "<div class='title'>Precipitation</div>",
    },
    resource: {
        name: "Resource",
        inputs: 0,
        outputs: 1,
        className: "env-node",
        data: {
            output_1: {
                vsOutputClasses: "env_values resource",
            },
            info: "environment"
        },
        html: "<div class='title'>Resource (0-1)</div>",
    },
    custom_env: {
        name: "Custom Env",
        inputs: 0,
        outputs: 1,
        className: "env-node",
        data: {
            output_1: {
                vsOutputClasses: "env_values",
            },
            info: "environment"
        },
        html: '<div class="title">Custom Env.</div><div class="input-container"><input type="text" pattern="^[a-z]+[a-z0-9._]*$" data-vs-custom-env-name placeholder="env_name"><span class="validity"></span><p>(unique, lowercase R variable name)</p></div>',
    },
    species: {
        name: "Species",
        inputs: 0,
        outputs: 1,
        className: "species-node",
        data: {
            output_1: {
                vsOutputClasses: "traits",
            },
            info: "species"
        },
        html: '<div class =\'title\'>Species</div><div class=\'species-node\'><div class="input-container"><input type="text" pattern="^[a-zA-Z]+[a-zA-Z0-9._]*$" data-vs-species-name placeholder="species_name"><span class="validity"></span><p>(unique and valid R variable name)</p></div></div>',
    },
    reproduction: {
        name: "Reproduction Ricker",
        inputs: 3,
        inputClasses: ["abundance", "reproduction_rate", "carrying_capacity"],
        outputs: 1,
        outputClasses: ["abundance"],
        className: "proc-node single-species",
        data: {
            input_1: {
                vsInputClasses: "abundance",
            },
            input_2: {
                vsInputClasses: "reproduction_rate",
            },
            input_3: {
                vsInputClasses: "carrying_capacity",
            },
            output_1: {
                vsOutputClasses: "abundance",
            },
            info: "ricker_model"
        },
        html: "<div class =\'title\'>Reproduction Ricker</div>",
    },
    reproductionBV: {
        name: "Reproduction Beverton-Holt",
        inputs: 4,
        inputClasses: ["abundance", "reproduction_rate", "carrying_capacity", "survival_rate"],
        outputs: 1,
        outputClasses: ["abundance"],
        className: "proc-node single-species",
        data: {
            input_1: {
                vsInputClasses: "abundance",
            },
            input_2: {
                vsInputClasses: "reproduction_rate",
            },
            input_3: {
                vsInputClasses: "carrying_capacity",
            },
            input_4: {
                vsInputClasses: "survival_rate",
            },
            output_1: {
                vsOutputClasses: "abundance",
            },
            info: "beverton_holt_model"
        },
        html: "<div class =\'title\'>Reproduction BvH</div>",
    },
    mortality: {
        name: "Mortality",
        inputs: 2,
        inputClasses: ["abundance", "survival_rate"],
        outputs: 1,
        outputClasses: ["abundance"],
        className: "proc-node single-species",
        data: {
            input_1: {
                vsInputClasses: "abundance",
            },
            input_2: {
                vsInputClasses: "survival_rate",
            },
            output_1: {
                vsOutputClasses: "abundance",
            },
            info: "mortality"
        },
        html: "<div class =\'title\'>Mortality</div>",
    },
    dispersal: {
        name: "Dispersal",
        inputs: 3,
        outputs: 1,
        className: "proc-node single-species",
        data: {
            input_1: {
                vsInputClasses: "abundance",
            },
            input_2: {
                vsInputClasses: "dispersal_distance",
            },
            input_3: {
                vsInputClasses: "suitability",
                optional: true,
            },
            output_1: {
                vsOutputClasses: "abundance",
            },
            info: "dispersal"
        },
        html: "<div class =\'title\'>Dispersal</div>",
    },
    calculate_suitability: {
        name: "Calculate Suitability",
        inputs: 3,
        inputClasses: ["suitability", "env_preferences", "env_values"],
        outputs: 1,
        outputClasses: ["suitability"],
        className: "proc-node single-species",
        data: {
            input_1: {
                vsInputClasses: "suitability",
            },
            input_2: {
                vsInputClasses: "env_preferences",  
            },
            input_3: {
                vsInputClasses: "env_values",
            },
            output_1: {
                vsOutputClasses: "suitability", 
            },
            info: "calculate_suitability"
        },
        html: "<div class =\'title\'>Calculate Suitability</div>",
    },
    metabolic_scaling: {
        name: "Metabolic Scaling",
        inputs: 3,
        outputs: 1,
        className: "proc-node single-species",
        data: {
            input_2: {
                vsInputClasses: "mass",
            },
            input_3: {
                vsInputClasses: "temperature",  
            },
            info: "metabolic_scaling"
        },
        html: "<div class =\'title\'>Metabolic Scaling</div>",
    },
    save: {
        name: "Save",
        inputs: 1,
        outputs: 0,
        className: "proc-node save",
        data: {
            info: "save"
        },
        html: '<div class =\'title\'>Save</div><div class="input-container"><input type="text" id="savepath" name="savepath" required placeholder="[path] default: getwd()" minlength="1" maxlength=260" size="20" /></div>',
    },
    plot: {
        name: "Plot",
        inputs: 1,
        outputs: 0,
        className: "proc-node",
        data: {
            info: "plot"
        },
        html: "<div class =\'title\'>Plot</div>",
    },
    mult: {
        name: "Multiply With",
        inputs: 2,
        outputs: 1,
        className: "proc-node multi-species",
        data: {
            info: "multiply",
        },
        html: "<div class =\'title\'>Multiply With</div>",
    },
    abundance: {
        name: "Abundance",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "abundance",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Abundance</div><div class=\'input-container\'><p><input type="number" name="abundance" min="10" max="1000" value="100"/>initial value</p></div>',
    },
    reproduction_rate: {
        name: "Reproduction Rate",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "reproduction_rate",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Reproduction Rate</div><div class=\'input-container\'><p><input type="number" step="0.1" name="reproduction_rate" min="0" max="10" value="0.5"/>initial value</p></div>',
    },
    survival_rate: {
        name: "Survival Rate",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "survival_rate",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Survival Rate</div><div class=\'input-container\'><p><input type="number" step="0.1" name="survival_rate" min="0" max="1" value="0.9"/>initial value</p></div>',
    },
    carrying_capacity: {
        name: "Carrying Capacity",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "carrying_capacity",   
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Carrying Capacity</div><div class=\'input-container\'><p><input type="number" name="carrying_capacity" min="10" max="1000" value="100"/>initial value</p></div>',
    },
    dispersal_distance: {
        name: "Dispersal Distance",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "dispersal_distance",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Dispersal Distance</div><div class=\'input-container\'><p><input type="number" name="dispersal_distance" min="2" max="20" value="5"/>initial value</p></div>',
    },
    environmental_preferences_temperature: {
        name: "Env. Preferences Temperature",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "env_preferences",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Env. Preferences Temperature</div><div class=\'input-container\'><p><input type="number" name="max_temperature" min="240" max="320" value="315" data-nodetype="temp" data-inputtype="max"/>max</p><p><input type="number" name="optim_temperature" min="240" max="315" value="280" data-nodetype="temp" data-inputtype="optim"/>optim</p><p><input type="number" name="min_temperature" min="240" max="315" value="244" data-nodetype="temp" data-inputtype="min"/>min</p></div>',
    },
    environmental_preferences_precipitation: {
        name: "Env. Preferences Precipitation",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "env_preferences",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Env. Preferences Precipitation</div><div class=\'input-container\'><p><input type="number" name="max_precipitation" min="0" max="1000" value="780" data-nodetype="prec" data-inputtype="max"/>max</p><p><input type="number" name="optim_precipitation" min="0" max="1000" value="520" data-nodetype="prec" data-inputtype="optim"/>optim</p><p><input type="number" name="min_precipitation" min="0" max="1000" value="380" data-nodetype="prec" data-inputtype="min"/>min</p></div>',
    },
    environmental_preferences_resource: {
        name: "Env. Preferences Resource",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "env_preferences",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Env. Preferences Resource</div><div class=\'input-container\'><p><input type="number" step="0.01" name="max_resource" min="0" max="1" value="0.75" data-nodetype="res" data-inputtype="max"/>max</p><p><input type="number" step="0.01" name="optim_resource" min="0" max="1" value="0.5" data-nodetype="res" data-inputtype="optim"/>optim</p><p><input type="number" step="0.01" name="min_resource" min="0" max="1" value="0.23" data-nodetype="res" data-inputtype="min"/>min</p></div>',
    },
    environmental_preferences_custom: {
        name: "Env. Preferences Custom",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "env_preferences",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Env. Preferences Custom</div><div class=\'input-container\'><input type="text" pattern="^[a-zA-Z]+[a-zA-Z0-9._]*$" data-vs-custom-env-name placeholder="env_name"></p><p><input type="number" step="0.1" name="max" min="-1000" max="1000" value="100" data-nodetype="custom" data-inputtype="max"/>max</p><p><input type="number" step="0.1" name="optim" min="-1000" max="1000" value="50" data-nodetype="custom" data-inputtype="optim"/>optim</p><p><input type="number" step="0.1" name="min" min="-1000" max="1000" value="0" data-nodetype="custom" data-inputtype="min"/>min</p></div>',
    },
    mass: {
        name: "Mass",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "mass",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Mass</div><div class=\'input-container\'><p><input type="number" name="mass" min="0.01" max="1000" step="0.01" value="1"/>initial value</p></div>',
    },
    suitability: {
        name: "Suitability",
        inputs: 1,
        outputs: 1,
        className: "trait-node",
        data: {
            input_1: {
                vsInputClasses: "traits",
            },
            output_1: {
                vsOutputClasses: "suitability",
            },
            info: "trait"
        },
        html: '<div class =\'title\'>Suitability (0-1)</div><div class=\'input-container\'><p><input type="number" name="suitability" min="0" max="1" step="0.01" value="1"/>initial value</p></div>',
    },
};