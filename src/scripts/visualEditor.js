import { nodeConfig } from './nodeConfig.js';
import { updateCodePanel } from './codeGen.js';
import { applyNodeData, updateNodes, propagateDisconnect } from './graphLogic.js';
window.addEventListener("DOMContentLoaded", () => {
    async function copyToClipboard(input, elem) {
        try {
            if (typeof input !== "string") return;
            if (!navigator.clipboard) throw new Error("Clipboard API not available");
            if (!elem) throw new Error("No element provided");
                
            await navigator.clipboard.writeText(input);
            const oldText = elem.textContent;
            const elemWidth = elem.offsetWidth;
            elem.style.width = `${elemWidth}px`;
            elem.textContent = "Copied!";
            setTimeout(() => {
                elem.textContent = oldText;
                elem.style.width = null;
            }, 2000);
        } catch (err) {
            const oldText = elem.textContent;
            elem.textContent = "Failed";
            setTimeout(() => {
                elem.textContent = oldText;
            }, 2000);
        }
    }
    const drawflowAreaContainer = document.getElementById("drawflow-area");
    let drawflowContainer;
    if (!document.getElementById("drawflow")) {
        drawflowContainer = document.createElement("div");
        drawflowContainer.id = "drawflow";
        drawflowContainer.style.width = "100%";
        drawflowContainer.style.height = "100%";
        drawflowAreaContainer.appendChild(drawflowContainer);
    }
    drawflowContainer = document.getElementById("drawflow");
    const codeOutputElem = document.querySelector("#code-area code");
    var editor;
    const storage = new Map();
    storage.set("example1",
{
"drawflow": {
    "Home": {
        "data": {
            "46": {
                "id": 46,
                "name": "Species",
                "data": {
                    "output_1": {
                        "vsOutputClasses": "traits",
                        "vsSpeciesName": "Species_17c7da"
                    },
                    "info": "species",
                    "vsSpeciesName": "Species_17c7da",
                    "upstreamConnected": true,
                    "traits": {}
                },
                "class": "species-node",
                "html": "<div class ='title'>Species</div><div class='species-node'><div class=\"input-container\"><input type=\"text\" pattern=\"^[a-zA-Z]+[a-zA-Z0-9._]*$\" data-vs-species-name placeholder=\"species_name\"><span class=\"validity\"></span><p>(unique and valid R variable name)</p></div></div>",
                "typenode": false,
                "inputs": {},
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "47",
                                "output": "input_1"
                            },
                            {
                                "node": "48",
                                "output": "input_1"
                            },
                            {
                                "node": "49",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 42,
                "pos_y": 79
            },
            "47": {
                "id": 47,
                "name": "Abundance",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "abundance",
                        "vsSpeciesName": "Species_17c7da"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_17c7da",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Abundance</div><div class='input-container'><p><input type=\"number\" name=\"abundance\" min=\"10\" max=\"1000\" value=\"100\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "46",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "52",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 356,
                "pos_y": 23
            },
            "48": {
                "id": 48,
                "name": "Reproduction Rate",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "reproduction_rate",
                        "vsSpeciesName": "Species_17c7da"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_17c7da",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Reproduction Rate</div><div class='input-container'><p><input type=\"number\" step=\"0.1\" name=\"reproduction_rate\" min=\"0\" max=\"10\" value=\"0.5\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "46",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "52",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 358,
                "pos_y": 100
            },
            "49": {
                "id": 49,
                "name": "Carrying Capacity",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "carrying_capacity",
                        "vsSpeciesName": "Species_17c7da"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_17c7da",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Carrying Capacity</div><div class='input-container'><p><input type=\"number\" name=\"carrying_capacity\" min=\"10\" max=\"1000\" value=\"100\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "46",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "51",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 358,
                "pos_y": 174
            },
            "50": {
                "id": 50,
                "name": "Resource",
                "data": {
                    "output_1": {
                        "vsOutputClasses": "env_values resource"
                    },
                    "info": "environment",
                    "upstreamConnected": true
                },
                "class": "env-node",
                "html": "<div class='title'>Resource (0-1)</div>",
                "typenode": false,
                "inputs": {},
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "51",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 285,
                "pos_y": 283
            },
            "51": {
                "id": 51,
                "name": "Multiply With",
                "data": {
                    "info": "multiply",
                    "priority": 1,
                    "input_2": {
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true,
                        "vsInputClasses": "env_values resource",
                        "env_type": "resource",
                        "canChange": true
                    },
                    "upstreamConnected": true,
                    "output_1": {
                        "vsSpeciesName": "Species_17c7da",
                        "vsOutputClasses": "carrying_capacity"
                    },
                    "vsSpeciesName": "Species_17c7da",
                    "input_1": {
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true,
                        "vsInputClasses": "carrying_capacity",
                        "canChange": true
                    }
                },
                "class": "proc-node multi-species",
                "html": "<div class ='title'>Multiply With</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "49",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "50",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "52",
                                "output": "input_3"
                            }
                        ]
                    }
                },
                "pos_x": 587,
                "pos_y": 179
            },
            "52": {
                "id": 52,
                "name": "Reproduction Ricker",
                "data": {
                    "input_1": {
                        "vsInputClasses": "abundance",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "input_2": {
                        "vsInputClasses": "reproduction_rate",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "input_3": {
                        "vsInputClasses": "carrying_capacity",
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "abundance",
                        "vsSpeciesName": "Species_17c7da"
                    },
                    "info": "ricker_model",
                    "vsSpeciesName": "Species_17c7da",
                    "priority": 2,
                    "upstreamConnected": true
                },
                "class": "proc-node single-species",
                "html": "<div class ='title'>Reproduction Ricker</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "47",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "48",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_3": {
                        "connections": [
                            {
                                "node": "51",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "53",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 814,
                "pos_y": 82
            },
            "53": {
                "id": 53,
                "name": "Plot",
                "data": {
                    "info": "plot",
                    "vsSpeciesName": "Species_17c7da",
                    "priority": 3,
                    "input_1": {
                        "vsSpeciesName": "Species_17c7da",
                        "upstreamConnected": true,
                        "vsInputClasses": "abundance",
                        "canChange": true
                    },
                    "upstreamConnected": true
                },
                "class": "proc-node",
                "html": "<div class ='title'>Plot</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "52",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {},
                "pos_x": 1027,
                "pos_y": 81
            }
        }
    }
}
});
    storage.set("example2",
{
"drawflow": {
    "Home": {
        "data": {
            "54": {
                "id": 54,
                "name": "Species",
                "data": {
                    "output_1": {
                        "vsOutputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "species",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "traits": {}
                },
                "class": "species-node",
                "html": "<div class ='title'>Species</div><div class='species-node'><div class=\"input-container\"><input type=\"text\" pattern=\"^[a-zA-Z]+[a-zA-Z0-9._]*$\" data-vs-species-name placeholder=\"species_name\"><span class=\"validity\"></span><p>(unique and valid R variable name)</p></div></div>",
                "typenode": false,
                "inputs": {},
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "55",
                                "output": "input_1"
                            },
                            {
                                "node": "56",
                                "output": "input_1"
                            },
                            {
                                "node": "60",
                                "output": "input_1"
                            },
                            {
                                "node": "68",
                                "output": "input_1"
                            },
                            {
                                "node": "69",
                                "output": "input_1"
                            },
                            {
                                "node": "57",
                                "output": "input_1"
                            },
                            {
                                "node": "59",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 54,
                "pos_y": 64
            },
            "55": {
                "id": 55,
                "name": "Abundance",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "abundance",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Abundance</div><div class='input-container'><p><input type=\"number\" name=\"abundance\" min=\"10\" max=\"1000\" value=\"100\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "64",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 348,
                "pos_y": 9
            },
            "56": {
                "id": 56,
                "name": "Reproduction Rate",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "reproduction_rate",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Reproduction Rate</div><div class='input-container'><p><input type=\"number\" step=\"0.1\" name=\"reproduction_rate\" min=\"0\" max=\"10\" value=\"0.5\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "64",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 349,
                "pos_y": 79
            },
            "57": {
                "id": 57,
                "name": "Dispersal Distance",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "dispersal_distance",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Dispersal Distance</div><div class='input-container'><p><input type=\"number\" name=\"dispersal_distance\" min=\"2\" max=\"20\" value=\"5\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "65",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 353,
                "pos_y": 309
            },
            "59": {
                "id": 59,
                "name": "Mass",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "mass",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Mass</div><div class='input-container'><p><input type=\"number\" name=\"mass\" min=\"0.01\" max=\"1000\" step=\"0.01\" value=\"1\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "61",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 345,
                "pos_y": 236
            },
            "60": {
                "id": 60,
                "name": "Suitability",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "suitability",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Suitability (0-1)</div><div class='input-container'><p><input type=\"number\" name=\"suitability\" min=\"0\" max=\"1\" step=\"0.01\" value=\"1\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "63",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 346,
                "pos_y": 383
            },
            "61": {
                "id": 61,
                "name": "Metabolic Scaling",
                "data": {
                    "input_2": {
                        "vsInputClasses": "mass",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_3": {
                        "vsInputClasses": "temperature",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "env_type": "temperature"
                    },
                    "info": "metabolic_scaling",
                    "vsSpeciesName": "Species_e5a9f",
                    "priority": 1,
                    "input_1": {
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "vsInputClasses": "carrying_capacity",
                        "canChange": true
                    },
                    "upstreamConnected": true,
                    "output_1": {
                        "vsSpeciesName": "Species_e5a9f",
                        "vsOutputClasses": "carrying_capacity"
                    }
                },
                "class": "proc-node single-species",
                "html": "<div class ='title'>Metabolic Scaling</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "68",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "59",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_3": {
                        "connections": [
                            {
                                "node": "70",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "67",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 728,
                "pos_y": 147
            },
            "63": {
                "id": 63,
                "name": "Calculate Suitability",
                "data": {
                    "input_1": {
                        "vsInputClasses": "suitability",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_2": {
                        "vsInputClasses": "env_preferences",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "env_type": "temperature"
                    },
                    "input_3": {
                        "vsInputClasses": "env_values",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "env_type": "temperature"
                    },
                    "output_1": {
                        "vsOutputClasses": "suitability",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "calculate_suitability",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "priority": 1
                },
                "class": "proc-node single-species",
                "html": "<div class ='title'>Calculate Suitability</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "60",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "69",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_3": {
                        "connections": [
                            {
                                "node": "70",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "67",
                                "output": "input_2"
                            },
                            {
                                "node": "65",
                                "output": "input_3"
                            }
                        ]
                    }
                },
                "pos_x": 682,
                "pos_y": 367
            },
            "64": {
                "id": 64,
                "name": "Reproduction Ricker",
                "data": {
                    "input_1": {
                        "vsInputClasses": "abundance",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_2": {
                        "vsInputClasses": "reproduction_rate",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_3": {
                        "vsInputClasses": "carrying_capacity",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "abundance",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "ricker_model",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "priority": 3
                },
                "class": "proc-node single-species",
                "html": "<div class ='title'>Reproduction Ricker</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "55",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "56",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_3": {
                        "connections": [
                            {
                                "node": "67",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "65",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 1193,
                "pos_y": 59
            },
            "65": {
                "id": 65,
                "name": "Dispersal",
                "data": {
                    "input_1": {
                        "vsInputClasses": "abundance",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_2": {
                        "vsInputClasses": "dispersal_distance",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "input_3": {
                        "vsInputClasses": "suitability",
                        "optional": true,
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "abundance",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "dispersal",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "priority": 4
                },
                "class": "proc-node single-species",
                "html": "<div class ='title'>Dispersal</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "64",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "57",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_3": {
                        "connections": [
                            {
                                "node": "63",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "66",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 1409,
                "pos_y": 141
            },
            "66": {
                "id": 66,
                "name": "Plot",
                "data": {
                    "info": "plot",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "priority": 5,
                    "input_1": {
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "vsInputClasses": "abundance",
                        "canChange": true
                    }
                },
                "class": "proc-node",
                "html": "<div class ='title'>Plot</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "65",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {},
                "pos_x": 1606,
                "pos_y": 142
            },
            "67": {
                "id": 67,
                "name": "Multiply With",
                "data": {
                    "info": "multiply",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true,
                    "priority": 2,
                    "input_1": {
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "vsInputClasses": "carrying_capacity",
                        "canChange": true
                    },
                    "output_1": {
                        "vsSpeciesName": "Species_e5a9f",
                        "vsOutputClasses": "carrying_capacity"
                    },
                    "input_2": {
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true,
                        "vsInputClasses": "suitability",
                        "canChange": true
                    }
                },
                "class": "proc-node multi-species",
                "html": "<div class ='title'>Multiply With</div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "61",
                                "input": "output_1"
                            }
                        ]
                    },
                    "input_2": {
                        "connections": [
                            {
                                "node": "63",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "64",
                                "output": "input_3"
                            }
                        ]
                    }
                },
                "pos_x": 941,
                "pos_y": 148
            },
            "68": {
                "id": 68,
                "name": "Carrying Capacity",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "carrying_capacity",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Carrying Capacity</div><div class='input-container'><p><input type=\"number\" name=\"carrying_capacity\" min=\"10\" max=\"1000\" value=\"100\"/>initial value</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "61",
                                "output": "input_1"
                            }
                        ]
                    }
                },
                "pos_x": 349,
                "pos_y": 156
            },
            "69": {
                "id": 69,
                "name": "Env. Preferences Temperature",
                "data": {
                    "input_1": {
                        "vsInputClasses": "traits",
                        "vsSpeciesName": "Species_e5a9f",
                        "upstreamConnected": true
                    },
                    "output_1": {
                        "vsOutputClasses": "env_preferences",
                        "vsSpeciesName": "Species_e5a9f"
                    },
                    "info": "trait",
                    "vsSpeciesName": "Species_e5a9f",
                    "upstreamConnected": true
                },
                "class": "trait-node",
                "html": "<div class ='title'>Env. Preferences Temperature</div><div class='input-container'><p><input type=\"number\" name=\"max_temperature\" min=\"240\" max=\"320\" value=\"315\" data-nodetype=\"temp\" data-inputtype=\"max\"/>max</p><p><input type=\"number\" name=\"optim_temperature\" min=\"240\" max=\"315\" value=\"280\" data-nodetype=\"temp\" data-inputtype=\"optim\"/>optim</p><p><input type=\"number\" name=\"min_temperature\" min=\"240\" max=\"315\" value=\"244\" data-nodetype=\"temp\" data-inputtype=\"min\"/>min</p></div>",
                "typenode": false,
                "inputs": {
                    "input_1": {
                        "connections": [
                            {
                                "node": "54",
                                "input": "output_1"
                            }
                        ]
                    }
                },
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "63",
                                "output": "input_2"
                            }
                        ]
                    }
                },
                "pos_x": 314,
                "pos_y": 454
            },
            "70": {
                "id": 70,
                "name": "Temperature",
                "data": {
                    "output_1": {
                        "vsOutputClasses": "env_values temperature"
                    },
                    "info": "environment",
                    "upstreamConnected": true
                },
                "class": "env-node",
                "html": "<div class='title'>Temperature</div>",
                "typenode": false,
                "inputs": {},
                "outputs": {
                    "output_1": {
                        "connections": [
                            {
                                "node": "63",
                                "output": "input_3"
                            },
                            {
                                "node": "61",
                                "output": "input_3"
                            }
                        ]
                    }
                },
                "pos_x": 341,
                "pos_y": 607
            }
        }
    }
}
});
    if (drawflowContainer && window.Drawflow) {
        editor = new window.Drawflow(drawflowContainer);
        editor.start();
        editor.import(storage.get("example1"));


        var allNodes = new Set();
        var startNodes = new Set();
        

        function applyDataAfterImport () {
            const importedNodeIDs = Object.values(editor.drawflow.drawflow[editor.module].data).map(node => node.id);
            importedNodeIDs.forEach((nodeID) => {
                applyNodeData(editor, nodeID, allNodes, startNodes);
            });
            updateNodes(editor, allNodes, startNodes);
        }
        applyDataAfterImport();     


        const exportButton = document.getElementById("vs-export");
        exportButton.addEventListener("click", () => {
            const exportedData = editor.export();
            copyToClipboard(JSON.stringify(exportedData, null, 4), exportButton)
        });
        const quicksaveButton = document.getElementById("vs-quicksave");
        quicksaveButton.addEventListener("click", () => {
            const exportedData = editor.export();
            const quicksavename = new Date(Date.now()).toLocaleString();
            storage.set(quicksavename, exportedData);
            const loadMenu = document.querySelector(".vs-load-menu");
            const newMenuItem = document.createElement("div");
            newMenuItem.className = "vs-menu-item clickable";
            newMenuItem.textContent = quicksavename;
            newMenuItem.addEventListener("click", () => {
                editor.clearModuleSelected();
                allNodes.clear();
                startNodes.clear();
                editor.import(storage.get(newMenuItem.textContent));
                applyDataAfterImport();
                updateCodePanel(editor, allNodes, startNodes);
            });
            loadMenu.prepend(newMenuItem);
            
            quicksaveButton.textContent  = "Saved!";
            setTimeout(() => {
                quicksaveButton.textContent  = "Quicksave";
            }, 2000);
        });


        const clearButton = document.querySelector(".vs-clear");
        clearButton.addEventListener("click", () => {
            editor.clearModuleSelected();
            allNodes.clear();
            startNodes.clear();
            codeOutputElem.innerHTML = "# Generated code will appear here based on the nodes.";
        });
        const example1Button = document.querySelector(".vs-example1");
        example1Button.addEventListener("click", () => {
            editor.clearModuleSelected();
            allNodes.clear();
            startNodes.clear();
            editor.import(storage.get("example1"));
            applyDataAfterImport();
            updateCodePanel(editor, allNodes, startNodes);
        });
        const example2Button = document.querySelector(".vs-example2");
        example2Button.addEventListener("click", () => {
            editor.clearModuleSelected();
            allNodes.clear();
            startNodes.clear();
            editor.import(storage.get("example2"));
            applyDataAfterImport();
            updateCodePanel(editor, allNodes, startNodes);
        });

        const loadJsonButton = document.getElementById("load-json");
        loadJsonButton.addEventListener("click", () => {
            const userInput = prompt("Paste the JSON here:");
            if (userInput) {
                try {
                    const jsonData = JSON.parse(userInput);
                    editor.clearModuleSelected();
                    allNodes.clear();
                    startNodes.clear();
                    editor.import(jsonData);
                    applyDataAfterImport();
                    updateCodePanel(editor, allNodes, startNodes);
                } catch (e) {
                    alert("Invalid JSON.");
                }
            }
        });

        
        editor.on("nodeSelected", (nodeID) => {
            if (editor.isCodePanelSmall) {return};
            if (!editor.shouldHighlightCode) {return};
            const highlightButton = document.getElementById("vs-code-highlight");
            highlightButton.dataset.hint = "disable highlighting here";
            const node = editor.drawflow.drawflow[editor.module].data[nodeID];
            let textID   = node.id;
            if (node.name === "Species") {
                textID = "species";
            }
            if (node.name === "Temperature") {
                textID = "temperature";
            }
            if (node.name === "Precipitation") {
                textID = "precipitation";
            }
            if (node.name === "Resource") {
                textID = "resource";
            }

            const codetextPosition = document.getElementById(textID);
            if (codetextPosition) {
                codetextPosition.scrollIntoView({ behavior: 'smooth', block: 'start' });
                codetextPosition.classList.add("highlight");
                setTimeout(() => {
                    codetextPosition.classList.remove("highlight");
                    highlightButton.dataset.hint = "";
                }, 700);
            }
        });

        editor.on("nodeUnselected", (node) => {
            editor.isSomethingSelected = false;
            setTimeout(() => {
                if (!editor.isSomethingSelected) {
                    updateCodePanel(editor, allNodes, startNodes);
                    const infoPanel = document.getElementById("node-info-panel");
                    const infoTitle = infoPanel.querySelector(".title span");
                    const infoContent = infoPanel.querySelector(".body");
                    
                    infoTitle.innerText = "Information";
                    infoContent.textContent  = "Click on any node to see more information.";
                }
            }, 250);
        });

        editor.on("nodeCreated", (nodeID) => {
            applyNodeData(editor, nodeID, allNodes, startNodes);
            updateCodePanel(editor, allNodes, startNodes);
        });


        editor.on("nodeRemoved", (node) => {
            allNodes.delete(parseInt(node));
            startNodes.delete(parseInt(node));
            updateCodePanel(editor, allNodes, startNodes);
        });


        // check onnections
        editor.on("connectionCreated", (connection) => {
        // make sure single connections only
            const inputNode = editor.getNodeFromId(connection.input_id);
            const outputNode = editor.getNodeFromId(connection.output_id);

            if (inputNode.inputs[connection.input_class].connections.length > 1) {
                editor.removeSingleConnection(
                    connection.output_id,
                    connection.input_id,
                    connection.output_class,
                    connection.input_class,
                );
                return;
            }

            const conenctedToMoreThanOnePrimaryOutput = outputNode.outputs[connection.output_class].connections.filter(
                (con) => con.output === "input_1"
            ).length > 1;

            if (outputNode.outputs[connection.output_class].connections.length > 1 && outputNode.name !== "Species" && conenctedToMoreThanOnePrimaryOutput) {
                editor.removeSingleConnection(
                    connection.output_id,
                    connection.input_id,
                    connection.output_class,
                    connection.input_class,
                );
                return;
            }
            // check only nodes of compatible input /output types can be connected
            const connection_output = outputNode.data[connection.output_class];
            const connection_input = inputNode.data[connection.input_class];
            
            if (!connection_input.canChange && (!connection_input.vsInputClasses || !connection_output.vsOutputClasses)) {
                editor.removeSingleConnection(
                    connection.output_id,
                    connection.input_id,
                    connection.output_class,
                    connection.input_class,
                );
                return;
            }

            if (!connection_input.canChange) {
                const testClassNames = connection_input.vsInputClasses.split(" ");
                if (
                    !connection_output.vsOutputClasses ||
                    !connection_output.vsOutputClasses.split(" ").some(inClass => testClassNames.includes(inClass))
                ) {
                    editor.removeSingleConnection(
                        connection.output_id,
                        connection.input_id,
                        connection.output_class,
                        connection.input_class,
                    );
                }
            }

            if (outputNode.traits !== undefined) {
                if (outputNode.traits.has(inputNode.name)) {
                    editor.removeSingleConnection(
                        connection.output_id,
                        connection.input_id,
                        connection.output_class,
                        connection.input_class,
                    );
                }
            }

            if (Object.hasOwn(outputNode.data, 'vsSpeciesName')) {
                // if input node has a different species_name remove all other input connections
                const currentSpeciesName = inputNode.data.vsSpeciesName;
                if (currentSpeciesName && currentSpeciesName !== outputNode.data.vsSpeciesName && inputNode.class.includes("single-species")) {
                    for (const input in inputNode.inputs) {
                        if (input === connection.input_class) {
                            continue;
                        }

                        if (inputNode.inputs[input].connections.length === 0) {
                            continue;
                        }
                        editor.removeSingleConnection(
                            inputNode.inputs[input].connections[0].node,
                            connection.input_id, 
                            inputNode.inputs[input].connections[0].input,
                            input
                        );
                    }
                }
            }

            if (inputNode.name === "Metabolic Scaling" &&
                connection_output.vsOutputClasses !== "reproduction_rate" &&
                connection_output.vsOutputClasses !== "carrying_capacity" &&
                connection.input_class === "input_1"
            ) {
                editor.removeSingleConnection(
                    connection.output_id,
                    connection.input_id,
                    connection.output_class,
                    connection.input_class,
                );
                return;
            }


            if ((inputNode.name === "Multiply With") &&
                (connection_output.vsOutputClasses === "env_preferences" || connection_output.vsOutputClasses === "dispersal_distance") ||
                (connection_output.vsOutputClasses && connection_output.vsOutputClasses.includes("env_values") && connection.input_class === "input_1")
            ) {
                editor.removeSingleConnection(
                    connection.output_id,
                    connection.input_id,
                    connection.output_class,
                    connection.input_class,
                );
                return;
            }

            updateNodes(editor, allNodes, startNodes);
            updateCodePanel(editor, allNodes, startNodes);

        });

        editor.on("connectionRemoved", (connection) => {
            const nodeDownstream = editor.drawflow.drawflow[editor.module].data[connection.input_id];
            if (!Object.hasOwn(nodeDownstream.data, connection.input_class)) {
                console.log("No data for input class: " + connection.input_class);
                console.log(nodeDownstream);
                return;
            }
            delete nodeDownstream.data[connection.input_class].vsSpeciesName;
            delete nodeDownstream.data[connection.input_class].upstreamConnected;
            if (nodeDownstream.data[connection.input_class].canChange === true) {
                delete nodeDownstream.data[connection.input_class].vsInputClasses;
            }
            if (connection.input_class === "input_1" && Object.hasOwn(nodeDownstream.data, "output_1")) {
                delete nodeDownstream.data["output_1"].vsSpeciesName;
                if (nodeDownstream.data["input_1"].canChange === true) {
                    delete nodeDownstream.data["output_1"].vsOutputClasses;
                    if (nodeDownstream.outputs.output_1.connections[0]) {
                        editor.removeSingleConnection(
                            nodeDownstream.id,
                            parseInt(nodeDownstream.outputs.output_1.connections[0].node),
                            "output_1",
                            nodeDownstream.outputs.output_1.connections[0].output
                        );
                    }
                }
            }

            if (editor.drawflow.drawflow[editor.module].data[connection.output_id].traits !== undefined) {
                editor.drawflow.drawflow[editor.module].data[connection.output_id].traits.delete(
                    nodeDownstream.name
                );
            }
            propagateDisconnect(editor, connection.input_id, connection.input_class);
            updateNodes(editor, allNodes, startNodes);
            updateCodePanel(editor, allNodes, startNodes);
        });



        // Drag-and-drop node creation from menu
        document.querySelectorAll(".vs-menu-item").forEach((item) => {
            item.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData(
                    "node-type",
                    this.dataset.nodeType
                );
            });
        });
        drawflowContainer.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        drawflowContainer.addEventListener("drop", function (e) {
            e.preventDefault();
            const nodeType = e.dataTransfer.getData("node-type")
            if (nodeType) {
                const conf = structuredClone(nodeConfig[nodeType]);
                if (conf) {
                    const x = -80  + e.clientX * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
                    const y = -40 +e.clientY * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
                    editor.addNode(
                        conf.name,
                        conf.inputs,
                        conf.outputs,
                        x,
                        y,
                        conf.className,
                        conf.data,
                        conf.html
                    );
                }
            }
        });
        updateCodePanel(editor, allNodes, startNodes);
    }



    editor.shouldHighlightCode = true;
    const codeHighlightToggle = document.getElementById("vs-code-highlight");
    codeHighlightToggle.addEventListener("click", function () {
        if (editor.shouldHighlightCode) {
            editor.shouldHighlightCode = false;
            codeHighlightToggle.classList.remove("enabled");
        } else {
            editor.shouldHighlightCode = true; 
            codeHighlightToggle.classList.add("enabled");
        }
    });

    const codeToggle = document.getElementById("vs-code-toggle");

    codeToggle.addEventListener("click", function () {
        const vsContainer = document.querySelector(".visual-scripting-container");
        const codeArea = document.getElementById("code-area");
        if (editor.isCodePanelSmall) {
            codeToggle.classList.remove("small");
            editor.isCodePanelSmall = false;
            vsContainer.style.gridTemplateRows = "1fr 7px 1fr";
        } else {
            codeToggle.classList.add("small");
            editor.isCodePanelSmall = true;
            codeArea.scrollTop = 0;
            vsContainer.style.gridTemplateRows = "1fr 7px 0.1fr";
        }
    });


    // const inputToggle = document.getElementById("vs-input-toggle");
    // inputToggle.addEventListener("click", function () {
    //     const inputs = document.querySelectorAll(
    //         ".drawflow-node .input-container",
    //     );

    //     if (inputToggle.dataset.hidden === "true") {
    //         inputToggle.dataset.hidden = "false";
    //         inputs.forEach((input) => {
    //             input.classList.remove("hidden");
    //         });
    //     } else {
    //         inputToggle.dataset.hidden = "true";
    //         inputs.forEach((input) => {
    //             input.classList.add("hidden");
    //         });
    //     }
    //     const allNodes = document.querySelectorAll(
    //         "#drawflow .drawflow-node",
    //     );
    //     allNodes.forEach((node) => {
    //         editor.updateConnectionNodes(node.id);
    //     });
    // });

    const zoomInButton = document.getElementById("vs-zoom-in");
    zoomInButton.addEventListener("click", function () {
        editor.zoom_in();
    });
    const zoomOutButton = document.getElementById("vs-zoom-out");
    zoomOutButton.addEventListener("click", function () {
        editor.zoom_out();
    });

    const helpButton = document.getElementById("vs-help");
    helpButton.addEventListener("click", function () {
        const InstuctionsTab = document.querySelector(
            'ul[role="tablist"] li:nth-child(2) a',
        );
        InstuctionsTab.click();
    });

    const tablist = document.querySelector('ul[role="tablist"]');
    tablist.addEventListener("click", function () {
        const codeToggle = document.getElementById("vs-code-toggle");
        if (editor.isCodePanelSmall) {
            codeToggle.click();
        } 
    });
});