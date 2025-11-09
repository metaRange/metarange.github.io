import { updateCodePanel } from "./codeGen.js";
export function applyNodeData(editor, nodeID, allNodes, startNodes) {
    allNodes.add(parseInt(nodeID));
    const node = editor.drawflow.drawflow[editor.module].data[nodeID];

    // for each input and output, if no class is set in data, add the "canChange" flag
    const input_names = Object.keys(node.inputs); 
    input_names.forEach((input_name) => {
        if (!Object.hasOwn(node.data, input_name)) {
            node.data[input_name] = {};
        }
        if (node.data[input_name].vsInputClasses === undefined) {
            node.data[input_name].vsInputClasses = "";
            node.data[input_name].canChange = true;
        }
    });

    const output_names = Object.keys(node.outputs); 
    output_names.forEach((output_name) => {
        if (!Object.hasOwn(node.data, output_name)) {
            node.data[output_name] = {};
        }
        if (node.data[output_name].vsOutputClasses === undefined) {
            node.data[output_name].vsOutputClasses = "";
            node.data[output_name].canChange = true;
        }
    });

    if (node.name === "Species") {
        startNodes.add(parseInt(nodeID));

        if (node.data.vsSpeciesName === undefined) {
            node.data.vsSpeciesName = node.name + '_' + Math.floor(Date.now() * Math.random() / 100000).toString(16);
        }

        const speciesNameInput = editor.container.querySelector(
            "#node-" + nodeID + " input[type='text']"
        );

        if (speciesNameInput) {
            speciesNameInput.value = node.data.vsSpeciesName;
            
            speciesNameInput.addEventListener("input", function () {
                node.data.vsSpeciesName = this.value;
                updateNodes(editor, allNodes, startNodes);
                updateCodePanel(editor, allNodes, startNodes);
            });
        } else {
            console.error("Species node input missing: " + nodeID);
        }

    }
    if (node.class === "env-node") {
        startNodes.add(parseInt(nodeID));
        const customEnvNameInput = editor.container.querySelector(
            "#node-" + nodeID + " input[type='text']"
        );

        if (customEnvNameInput) {
            customEnvNameInput.addEventListener("input", function () {
                node.data.output_1.vsOutputClasses = node.data.output_1.vsOutputClasses.split(" ")[0] + " " + this.value;
                const output_div = editor.container.querySelector(
                    "#node-" + nodeID + " .output_1",
                );
                if (output_div) {
                    output_div.dataset.vsOutputClasses = node.data.output_1.vsOutputClasses;
                }
            });
        }
    }
    if (node.name === "Env. Preferences Custom") {
        const customEnvNameInput = editor.container.querySelector(
            "#node-" + nodeID + " input[type='text']"
        );

        if (customEnvNameInput) {
            customEnvNameInput.addEventListener("input", function () {
                node.data.output_1.vsOutputClasses = node.data.output_1.vsOutputClasses.split(" ")[0] + " " + this.value;
                const output_div = editor.container.querySelector(
                    "#node-" + nodeID + " .output_1",
                );
                if (output_div) {
                    output_div.dataset.vsOutputClasses = node.data.output_1.vsOutputClasses;
                }
            });
        }
    }

    const nodeElement = editor.container.querySelector("#node-" + nodeID);
    editor.isSomethingSelected = false;
    const infoPanel = document.getElementById("node-info-panel");
    const infoTitle = infoPanel.querySelector(".title span");
    const infoBody = infoPanel.querySelector(".body");
    const infoSeeAlso = infoPanel.querySelector(".sl-link-card a");
    const infoSeeAlsoDescription = infoPanel.querySelector(".sl-link-card .description");
    const nodeInfo = node.data?.info || "";
    const dataEl = document.getElementById("glossary-data");
    const glossary = JSON.parse(dataEl.textContent);
    nodeElement.addEventListener("click", function () {
        editor.isSomethingSelected = true;
        infoTitle.textContent = node.name;
        let contentText = "";
        if (nodeInfo && glossary[nodeInfo]) {
            contentText += glossary[nodeInfo].text.join(" ");
            infoSeeAlso.href = glossary[nodeInfo].see_also_link;
            infoSeeAlsoDescription.textContent = glossary[nodeInfo].see_also_text;
        } else {
            contentText += "No additional information available.";
            infoSeeAlso.href = "#";
            infoSeeAlsoDescription.textContent = "Nothing here";
        }
        infoBody.textContent  = contentText;
    });
    updateDOM(allNodes, editor);
};

export function updateNodes(editor, allNodes, startNodes) {
    let connnectedNodes = new Set();
    for (const nodeId of startNodes) {
        traverseNodesAndUpdateSpeciesName(editor, {node: nodeId, output: "input_1"}, {}, "input_1", connnectedNodes);
    }

    let unconnectedNodes = new Set(
        [...allNodes].filter((id) => !connnectedNodes.has(id)),
    );

    for (const nodeId of unconnectedNodes) {
        const node = editor.drawflow.drawflow[editor.module].data[nodeId];
        node.data.vsSpeciesName = undefined;
        node.data.upstreamConnected = false;
        const input_names = Object.keys(node.inputs); 
        input_names.forEach((input_name) => {
            const nodeData = node.data;
            if (nodeData[input_name] && typeof nodeData[input_name] === 'object' && !Array.isArray(nodeData[input_name])) {
                delete nodeData[input_name].vsSpeciesName;
                delete nodeData[input_name].upstreamConnected;
                if (node.data[input_name].canChange !== undefined && node.data[input_name].canChange === true){
                    delete nodeData[input_name].vsInputClasses;
                }
            }
        });

        const output_names = Object.keys(node.outputs); 
        output_names.forEach((output_name) => {
            const nodeData = node.data;
            if (nodeData[output_name] && typeof nodeData[output_name] === 'object' && !Array.isArray(nodeData[output_name])) {
                delete nodeData[output_name].vsSpeciesName;
                delete nodeData[output_name].upstreamConnected;
                if (node.data[output_name].canChange !== undefined && node.data[output_name].canChange === true){
                    delete nodeData[output_name].vsOutputClasses;
                }
            }
        });
    }
    updateDOM(allNodes, editor);
};
function updateDOM(allNodes, editor) {
    for (const nodeId of allNodes) {
        const nodeElement = editor.container.querySelector("#node-" + nodeId);
        const node = editor.drawflow.drawflow[editor.module].data[nodeId];

        nodeElement.dataset.vsSpeciesName = node.data.vsSpeciesName || "";
        nodeElement.dataset.upstreamConnected = node.data.upstreamConnected || false;
        nodeElement.dataset.priority = node.data.priority || "";

        const input_names = Object.keys(node.inputs); 
        input_names.forEach((input_name) => {
            const input_div = nodeElement.querySelector("." + input_name);
            if (input_div && Object.hasOwn(node.data, input_name)) {
                input_div.dataset.vsInputClasses = node.data[input_name].vsInputClasses || "";
                input_div.dataset.vsSpeciesName = node.data[input_name].vsSpeciesName || "";
                input_div.dataset.upstreamConnected = node.data[input_name].upstreamConnected || false;
                input_div.dataset.vsOptional = node.data[input_name].optional || false;
                            }
        });

        const output_names = Object.keys(node.outputs); 
        output_names.forEach((output_name) => {
            const output_div = nodeElement.querySelector("." + output_name);
            if (output_div && Object.hasOwn(node.data, output_name)) {
                output_div.dataset.vsOutputClasses = node.data[output_name].vsOutputClasses || "";
                output_div.dataset.vsSpeciesName = node.data[output_name].vsSpeciesName || "";
                output_div.dataset.upstreamConnected = node.data[output_name].upstreamConnected || false;
            }
        });
        
    }
}
function traverseNodesAndUpdateSpeciesName(editor, connection, data, expectedInputClass, connnectedNodes, commingfromSpecies = undefined, processPriority = 1) {

    const nodeId = connection.node;
    const connectedViaInput = connection.output;
    let new_data = {};

    const node = editor.drawflow.drawflow[editor.module].data[nodeId];
    if (!node) {
        console.log("Node not found: " + nodeId);
        return
    };
    // if species node, pass its id to the next node, so that traits can be added
    let passSpeciesnodeId = undefined;
    if (node.name === "Species") {
        passSpeciesnodeId = nodeId;
    }
    // if the last node was a species node, then add trait information to the species node
    if (commingfromSpecies !== undefined) {
        const parentNode = editor.drawflow.drawflow[editor.module].data[commingfromSpecies];
        
        if (!Object.hasOwn(parentNode.data, "traits") || !( parentNode.data.traits instanceof Set)) {
            parentNode.data.traits = new Set();
        }
        if (!parentNode.data.traits.has(node.name)) {
            parentNode.data.traits.add(node.name);
        }
    }


    // now setting the species name.
    // Priority
    // 1. If the incoming 'data' has a species name it is the only source of truth.
    // 2. elif the node already has a name set (e.g. a Species node) keep it.
    // 3. elif input_1 provides a name and the node supports multiSpecies, take that.
    // 4. Otherwise leave undefined.

    const dataInput1 = node.data?.input_1;

    if (Object.hasOwn(data, 'vsSpeciesName') && data.vsSpeciesName !== undefined) {
        // The name from the parent (data) is the source of truth, always overwrite
        node.data.vsSpeciesName = data.vsSpeciesName;
    } else if (node.data.vsSpeciesName !== undefined) {
        // Keep an existing species name on the node (-> Species nodes!)
        // do nothing
    } else if (dataInput1 && dataInput1.vsSpeciesName !== undefined && node.data.multiSpecies) {
        // No name came from the parent, but input_1 is connected and the node is multi species -> take that name
        node.data.vsSpeciesName = dataInput1.vsSpeciesName;
    } else {
        // No name found anywhere -> undefined
        node.data.vsSpeciesName = undefined;
    }

    // add the species name to the new data object so that it can be passed on
    new_data.vsSpeciesName = node.data.vsSpeciesName;


    // add the node id to the connected nodes set
    connnectedNodes.add(parseInt(nodeId));

    let currentPriority, nextPriority;
    // check and assign the priority for process nodes
    if (node.class.includes("proc-node")) {
        currentPriority = parseInt(node.data.priority);
        if (currentPriority === null || Number.isNaN(currentPriority) || currentPriority === undefined || currentPriority < processPriority) {
            node.data.priority = processPriority;
        }
        nextPriority = processPriority + 1;   
    }



    // assign data to the conncted input
    if (Object.hasOwn(node.inputs, connectedViaInput)) {
        if (!Object.hasOwn(node.data, connectedViaInput)) {
            node.data[connectedViaInput] = {};
        }
        node.data[connectedViaInput].vsSpeciesName = data?.vsSpeciesName || node.data.vsSpeciesName;


        // setting input classes
        node.data[connectedViaInput].upstreamConnected = data.upstreamConnected && data[connectedViaInput].upstreamConnected;
        
        
        // if the node has no input class, take it from the connected output
        const curenntNodeInputClass = node.data[connectedViaInput].vsInputClasses;
        if (!curenntNodeInputClass && node.data[connectedViaInput].canChange && node.data[connectedViaInput].canChange === true) {
            node.data[connectedViaInput].vsInputClasses = expectedInputClass;
        }

        // set environmetn type
        if (data.env_type) {
            node.data[connectedViaInput].env_type = data.env_type;
        }
    }


    const areAllInputsConnected = Object.keys(node.inputs).every((inputClass) => {
        const inputLengthBiggerZero = node.inputs[inputClass].connections.length > 0;
        const isOptional = node.data[inputClass] && node.data[inputClass].optional ? true : false;
        const isUpstreamConntected =
            data.upstreamConnected &&
            Object.hasOwn(node.data, inputClass) &&
            node.data[inputClass].upstreamConnected;
        return (inputLengthBiggerZero && isUpstreamConntected) || isOptional;
    });
    if (areAllInputsConnected) {
        node.data.upstreamConnected = true;
        new_data.upstreamConnected = true;
    } else {
        node.data.upstreamConnected = false;
        new_data.upstreamConnected = false;
    }


    if (Object.hasOwn(node.outputs, "output_1")) {
        if (!Object.hasOwn(node.data, "output_1")) {
            node.data.output_1 = {};
        }
        node.data.output_1.vsSpeciesName = node.data.vsSpeciesName;

        const outputClass =  node.data.output_1?.vsOutputClasses;
        if (!outputClass && connectedViaInput == "input_1") {
            node.data.output_1.vsOutputClasses = node.data[connectedViaInput].vsInputClasses;
        }
        if (node.class == "env-node" || node.name === "Env. Preferences Temperature" || node.name === "Env. Preferences Precipitation" || node.name === "Env. Preferences Resource") {
            new_data.env_type = node.name.toLowerCase().split(" ").pop();
        }
        if (node.class == "env-node" && node.name === "Custom Env" || node.name === "Env. Preferences Custom") {
            new_data.env_type = node.data.output_1.vsOutputClasses.split(" ").pop();
        }

        if (node.outputs["output_1"].connections.length > 0) {
            node.outputs["output_1"].connections.forEach((new_connection) => {
                if (!new_data[new_connection.output]) {
                    new_data[new_connection.output] = {};
                }
                new_data[new_connection.output].upstreamConnected = true;
                connnectedNodes.add(parseInt(new_connection.node));
                traverseNodesAndUpdateSpeciesName(editor, new_connection, new_data, outputClass, connnectedNodes, passSpeciesnodeId, nextPriority);
            });
        }

    }
};
