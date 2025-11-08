export function updateCodePanel(editor, allNodes, startnodes) {
    const nodes = Object.values(
        editor.drawflow.drawflow[editor.module].data,
    );
    let code = [];
    code.push({                   
        tag: 'start',
        text: `library(metaRange)\nlibrary(terra)\nset_verbosity(2)\n\n`,
        prio: 0
    });

    // If we have an environment node, we need to create the environment setup code
    const envNodes = nodes.filter(
        (node) => node.class === "env-node",
    );
    let uniqueEnv,
        envNames, 
        envNamesLabel,
        uniqueEnvArr;
    uniqueEnv = new Set(envNodes.map((node) => node.name));
    if (envNodes.length > 0) {
        code.push({
            tag: '',
            text: `#### Setup of the environment: #### (replace this with your own data)\n`,
            prio: 1
        });



        if (envNodes.some((node) => node.name === "Temperature")) {
            code.push({                       
                tag: 'temperature',
                text: `temperature <- rast(volcano + 150)\n`,
                prio: 2
            });
        }
        if (envNodes.some((node) => node.name === "Precipitation")) {
            code.push({
                tag: 'precipitation',
                text: `precipitation <- rast(volcano * 4)\n`,
                prio: 3
            });
        }
        if (envNodes.some((node) => node.name === "Resource")) {
            code.push({
                tag: 'resource',
                text: `resource <- rast((volcano - min(volcano)) / (max(volcano) -min(volcano)))\n`,
                prio: 4
            });
        }

        

        let custom_env_nodes = envNodes.filter((node) => node.name === "Custom Env");
        let custom_name = "custom_env";
        custom_env_nodes.forEach((node, index) => {
            uniqueEnv.delete("Custom Env");
            if (node.data.output_1 && node.data.output_1.vsOutputClasses) {
                custom_name = node.data.output_1.vsOutputClasses.split(" ").pop();
                uniqueEnv.add(custom_name);
                code.push({
                    tag: node.id,
                    text: `${custom_name} <- rast(volcano)\n`,
                    prio: 5
                });
            }
        });

    } else {
        envNames = "spatial_grid";
        envNamesLabel = "spatial_grid";
        code.push({
            tag: '',
            text: `spatial_grid <- rast(volcano)\n`,
            prio: 5
        });
    }
    uniqueEnvArr = [...uniqueEnv];
    envNames = uniqueEnvArr
        .join(", ")
        .toLowerCase();
    envNamesLabel = uniqueEnvArr
        .join("', '")
        .toLowerCase();
    code.push({
        tag: '',
        text:
            `landscape <- sds(${envNames})\n`+
            `names(landscape) <- c('${envNamesLabel}')\n\n`+
            `#### Create the simulation object\n`+
            `sim <- create_simulation(landscape)\n\n`,
        prio: 6
    });


    
    const startNodes = nodes.filter(
        (node) => node.class === "species-node",
    );
    let speciesNames = startNodes
        .map((node) => node.data?.vsSpeciesName);

    const customEnvPreferencesNodeIDs = nodes.filter(
        (node) => node.name === "Env. Preferences Custom",
    ).map((node) => node.id);
    // startNodes
    if (startNodes.length > 0) {

        code.push({
            tag: '',
            text:'#### Add Species: ####\n',
            prio: 7
        });
        speciesNames = speciesNames
            .map((name) => name)
            .join("', '");
        code.push({
            tag: "species",
            text: `sim$add_species(c('${speciesNames}'))\n\n`,
            prio: 8                  
        });

        code.push({
            tag: '',
            text: `#### Add traits: ####\n`,
            prio: 9          
        });

        startNodes.forEach((node) => {

            if (node.outputs.output_1) {
                for (const output of node.outputs.output_1.connections) {
                    let id = output.node;
                    let traitValue = editor.container.querySelectorAll(
                        "#node-" + id + ' input[type="number"]',
                    );

                    let custom_env_value = "";
                    if (customEnvPreferencesNodeIDs.includes(parseInt(id))) {
                        custom_env_value = editor.container.querySelectorAll(
                            "#node-" + id + ' input[type="text"]'
                            )[0].value;
                    }
                    traitValue.forEach((input) => {
                        if (input.name === "dispersal_distance") {                                      
                            code.push({
                                tag: id,
                                text: 
                                    `sim$add_traits(\n`+
                                    `    "${node.data?.vsSpeciesName}",\n`+
                                    `    population_level = FALSE,\n`+
                                    `    dispersal_kernel = calculate_dispersal_kernel(\n`+
                                    `        max_dispersal_dist = ${input.value * 2},\n`+
                                    `        kfun = negative_exponential_function,\n`+
                                    `        mean_dispersal_dist = ${input.value}\n`+
                                    `    )\n`+
                                    `)\n`,
                                prio: 9          
                            });

                        } else if (custom_env_value != "") {
                            code.push({
                                tag: '' + input.name + "_" + custom_env_value,
                                text: `sim$add_traits("${node.data?.vsSpeciesName || node.name}", ${input.name + "_" + custom_env_value} =  ${input.value})\n`,
                                prio: 9
                            });
                            
                        } else {
                            code.push({
                                tag: id,
                                text: `sim$add_traits("${node.data?.vsSpeciesName || node.name}", ${input.name} =  ${input.value})\n`,
                                prio: 9
                            });
                        }
                        if (input.name === "reproduction_rate" || input.name === "carrying_capacity") {
                            code.push({
                                tag: '',
                                text: `sim$add_traits("${node.data?.vsSpeciesName || node.name}", initial_${input.name} =  ${input.value})\n`,
                                prio: 9
                            });
                        }
                    });
                }
            }
        });

        const process_nodes = nodes.filter(
            (node) => node.class.includes("proc-node")
        );
        const suitability_nodes = process_nodes.filter(
            (node) => node.name === "Calculate Suitability"
        );
        // filter for node id where the node has the lowest node.data?.priority 
        const min_suitability_priority = Math.min(...suitability_nodes.map((node) => node.data?.priority || Infinity));
        let first_suitability_node = suitability_nodes.filter((node) => node.data?.priority === min_suitability_priority)[0]?.id;

        if (process_nodes.length > 0) { 
            process_nodes.forEach((node) => {

                if (!node.data.vsSpeciesName || !node.data.upstreamConnected) {
                    return;
                }
                let abundance_input, 
                    reproduction_rate_input,
                    carrying_capacity_input,
                    dispersal_distance_input,
                    weights_input,
                    survival_rate_input;
                if (node.name === "Reproduction Ricker" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0] &&
                    node.inputs.input_3?.connections[0]
                ) {
                    abundance_input = node.inputs.input_1?.connections[0] ? "self$traits$abundance" : "node_not_connected";
                    reproduction_rate_input = node.inputs.input_2?.connections[0] ? "self$traits$reproduction_rate" : "node_not_connected";
                    carrying_capacity_input = node.inputs.input_3?.connections[0] ? "self$traits$carrying_capacity" : "node_not_connected";

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "reproduction",\n`+
                            `    process_fun = function() {\n`+
                            `        self$traits$abundance <-\n`+
                            `            ricker_reproduction_model(\n`+
                            `                abundance = ${abundance_input},\n`+
                            `                reproduction_rate = ${reproduction_rate_input},\n`+
                            `                carrying_capacity = ${carrying_capacity_input}\n`+
                            `            )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Reproduction Beverton-Holt" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0] &&
                    node.inputs.input_3?.connections[0]
                ) {
                    abundance_input = node.inputs.input_1?.connections[0] ? "self$traits$abundance" : "node_not_connected";
                    reproduction_rate_input = node.inputs.input_2?.connections[0] ? "self$traits$reproduction_rate" : "node_not_connected";
                    carrying_capacity_input = node.inputs.input_3?.connections[0] ? "self$traits$carrying_capacity" : "node_not_connected";
                    survival_rate_input = node.inputs.input_4?.connections[0] ? "self$traits$survival_rate" : "node_not_connected";
                    
                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "reproduction",\n`+
                            `    process_fun = function() {\n`+
                            `        abundance <- ${abundance_input} * ${survival_rate_input}\n`+
                            `        abundance_t1 <- (${reproduction_rate_input} * abundance) /\n`+
                            `            (1 + ((${reproduction_rate_input} - 1) / ${carrying_capacity_input}) * abundance)\n`+
                            `        abundance_t1[abundance_t1 < 0] <- 0\n`+
                            `        ${abundance_input} <- abundance_t1\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Mortality" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0]
                ) {
                    abundance_input = node.inputs.input_1?.connections[0] ? "self$traits$abundance" : "node_not_connected";
                    survival_rate_input = node.inputs.input_2?.connections[0] ? "self$traits$survival_rate" : "node_not_connected";

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "mortality",\n`+
                            `    process_fun = function() {\n`+
                            `        self$traits$abundance <-\n`+
                            `            matrix(rpois(\n`+
                            `                length(${abundance_input}),\n`+
                            `                ${abundance_input} * ${survival_rate_input}\n`+
                            `            ), nrow = nrow(self$traits$abundance), ncol = ncol(self$traits$abundance))\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Dispersal" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0]
                ) {
                    abundance_input = node.inputs.input_1?.connections[0] ? "self$traits$abundance" : "node_not_connected";
                    dispersal_distance_input = node.inputs.input_2?.connections[0] ? "self$traits$dispersal_kernel" : "node_not_connected";
                    let continueFunction = node.inputs.input_3?.connections[0] ? "," : "";
                    weights_input = node.inputs.input_3?.connections[0] ? 'self$traits$suitability' : null;

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "dispersal_process",\n`+
                            `    process_fun = function() {\n`+
                            `        self$traits$abundance <-\n`+
                            `            dispersal(\n`+
                            `               abundance = ${abundance_input},\n`+
                            `               dispersal_kernel = ${dispersal_distance_input}${continueFunction}\n`+
                            (weights_input ? `               weights = ${weights_input}\n`: "")+
                            `            )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Calculate Suitability" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0] &&
                    node.inputs.input_3?.connections[0]
                ) {
                    const env_type = editor.container.querySelector("#node-" + node.id + ' .input_3').dataset.env_type;
                    const env_pref_type = editor.container.querySelector("#node-" + node.id + ' .input_2').dataset.env_type;

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "calculate_suitability",\n`+
                            `    process_fun = function() {\n`+
                            `        self$traits$suitability <-\n`+
                            (node.id !== first_suitability_node ? `            self$traits$suitability *\n`:"")+
                            `            calculate_suitability(\n`+
                            `                vmax = self$traits$max_${env_pref_type},\n`+
                            `                vopt = self$traits$optim_${env_pref_type},\n`+
                            `                vmin = self$traits$min_${env_pref_type},\n`+
                            `                venv = self$sim$environment$current$${env_type}\n`+
                            `            )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Metabolic Scaling" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0] &&
                    node.inputs.input_3?.connections[0]
                ) {
                    // TODO
                    // could be removed by data attrib
                    const mte_type = editor.container.querySelector("#node-" + node.id + ' .input_1').dataset.vsInputClasses;
                    let scaling_exponent, E_val, ftype;

                    if (mte_type === "reproduction_rate") {
                        scaling_exponent = "-1/4";
                        E_val = "-0.65";
                        ftype = "max("
                    } else if (mte_type === "carrying_capacity") {
                        scaling_exponent = "-3/4";
                        E_val = "0.65";                                    
                        ftype = "min("
                    }

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "metabolic_scaling_${mte_type}",\n`+
                            `    process_fun = function() {\n`+
                            `        normalization_constant <- calculate_normalization_constant(\n`+
                            `            parameter_value = mean(self$traits$initial_${mte_type}, na.rm=TRUE),\n`+
                            `            scaling_exponent = ${scaling_exponent},\n`+
                            `            mass = mean(self$traits$mass, na.rm = TRUE),\n`+
                            `            reference_temperature = ${ftype}self$sim$environment$current[["temperature"]], na.rm=TRUE),\n`+
                            `            E = ${E_val}\n`+
                            `        )\n`+
                            `        self$traits[["${mte_type}"]] <- metabolic_scaling(\n`+
                            `            normalization_constant = normalization_constant,\n`+
                            `            scaling_exponent = ${scaling_exponent},\n`+
                            `            mass = self$traits$mass,\n`+
                            `            temperature = self$sim$environment$current[["temperature"]],\n`+
                            `            E = ${E_val}\n`+
                            `        )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }
                if (node.name === "Save" &&
                    node.inputs.input_1?.connections[0]
                ) {
                    const save_node = editor.getNodeFromId(node.inputs.input_1.connections[0].node);
                    // TODO
                    // could be removed by data attrib
                    const trait_name = editor.container.querySelector("#node-" + node.id + ' .input_1').dataset.vsInputClasses;
                    let path = editor.container.querySelector("#node-" + node.id + ' input[type="text"]').value;
                    path = path !== "" ? path : "getwd()";

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "saving_${save_node.data?.vsSpeciesName}_${trait_name}",\n`+
                            `    process_fun = function() {\n`+
                            `        save_species(\n`+
                            `            x = sim$${save_node.data?.vsSpeciesName},\n`+
                            `            traits = "${trait_name}",\n`+
                            `            prefix =  paste0(self$sim$get_current_time_step(), "-"),\n`+
                            `            path = ${path}\n`+
                            `        )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }

                if (node.name === "Plot" &&
                    node.inputs.input_1?.connections[0]
                ) {
                    // TODO
                    // could be removed by data attrib
                    const plot_node = editor.getNodeFromId(node.inputs.input_1.connections[0].node);
                    const trait_name = editor.container.querySelector("#node-" + node.id + ' .input_1').dataset.vsInputClasses;

                    code.push({
                        tag: node.id,
                        text:
                            `sim$add_process(\n`+
                            `    species = "${node.data?.vsSpeciesName}",\n`+
                            `    process_name = "plotting_${plot_node.data?.vsSpeciesName}_${trait_name}",\n`+
                            `    process_fun = function() {\n`+
                            `        plot_cols <- hcl.colors(100, "Purple-Yellow", rev = TRUE)\n`+
                            `        plot(\n`+
                            `            sim$${plot_node.data?.vsSpeciesName},\n`+
                            `            trait = "${trait_name}",\n`+
                            `            main = "${plot_node.data?.vsSpeciesName} : ${trait_name}",\n`+
                            `            col = plot_cols\n`+
                            `        )\n`+
                            `    },\n`+
                            `    execution_priority = ${node.data?.priority || 1}\n`+
                            `)\n`,
                        prio: node.data?.priority + 100
                    });
                }
                if (node.name === "Multiply With" &&
                    node.inputs.input_1?.connections[0] &&
                    node.inputs.input_2?.connections[0]
                ) {
                    const input_one = editor.container.querySelector("#node-" + node.id + ' .input_1').dataset;
                    const input_two = editor.container.querySelector("#node-" + node.id + ' .input_2').dataset;
                    let ioNameOne = input_one.vsInputClasses ? input_one.vsInputClasses.replace(" ", "_") : "";
                    let  ioNameTwo = input_two.vsInputClasses ? input_two.vsInputClasses.replace(" ", "_") : "";
                    if (ioNameOne === "" || ioNameTwo === "") {
                        return;
                    }
                    let textToAdd = "";
                    textToAdd +=  `sim$add_process(\n`;
                    textToAdd +=  `    species = "${node.data?.vsSpeciesName}",\n`;
                    textToAdd +=  `    process_name = "multiply_${ioNameOne}_with_${ioNameTwo}",\n`;
                    textToAdd +=  `    process_fun = function() {\n`;
                    if (input_two.vsSpeciesName === input_one.vsSpeciesName && input_two.env_type === undefined) {
                    textToAdd +=  `        self$traits$${ioNameOne} <-\n`;
                    textToAdd +=  `            self$traits$${ioNameOne} *\n`;
                    textToAdd +=  `            self$traits$${ioNameTwo}\n`; 
                    } else if (input_two.vsSpeciesName !== input_one.vsSpeciesName && input_two.env_type === undefined) {
                    textToAdd +=  `        self$traits$${ioNameOne} <-\n`;
                    textToAdd +=  `            self$traits$${ioNameOne} *\n`;
                    textToAdd +=  `            self$sim$${input_two.vsSpeciesName}$traits$${ioNameTwo}\n`; 
                    } else if (input_two.env_type !== undefined) {
                    textToAdd +=  `        self$traits$${ioNameOne} <-\n`;
                    textToAdd +=  `            self$traits$${ioNameOne} *\n`;
                    textToAdd +=  `            self$sim$environment$current$${input_two.env_type}\n`; 
                    }
                    textToAdd +=  `    },\n`;
                    textToAdd +=  `    execution_priority = ${node.data?.priority || 1}\n`;
                    textToAdd +=  `)\n`;

                    code.push({
                        tag: node.id,
                        text: textToAdd,
                        prio: node.data?.priority + 100
                    });
                }
            });   
        }
    }

    code.push({
        tag: '',
        text:
            `\n#### Run the simulation: ####\n`+
            `sim$set_time_layer_mapping(rep(1, 10))\n`+
            `sim$begin()\n`,
        prio: 999
    });
    code.sort((a, b) => a.prio - b.prio);
    let combindedCodeWithTags = "";
    let pureTextCode = "";
    code.forEach((codeChunk) => {
        combindedCodeWithTags += '<span id="' + codeChunk.tag + '">' + codeChunk.text + '</span>';
        pureTextCode += codeChunk.text;
    });
    const codeOutputElem = document.querySelector("#code-area code");
    codeOutputElem.innerHTML = combindedCodeWithTags;

    const copyButton = document.querySelector("#code-area .copy button");
    if (copyButton) {
        copyButton.dataset.code = pureTextCode;
    }
}
