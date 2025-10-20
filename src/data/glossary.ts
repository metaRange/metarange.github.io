export const glossary = {
process: {
    title: "Process",
    text: [
        "A process in metaRange is fundamentally just a function that is attached to a species.",
        "This means it can fulfill various roles, depending on the needs of the user and is the reason the framework is adaptable to many ecological study questions.",
        "A typical ecological processes (i.e. mechanism) defines how a species interacts with its surroundings.",
        "This could be e.g reproduction, dispersal, mortality or any type of species interaction.",
        "But a process could also be used to automatically generate statistics while the simulation is running or to generate visual output like a map auf the current species distribution."
    ],
    see_also_link: "../../vignettes/A01_intro/#adding-processes",
    see_also_text: "How to add processes to a species"
},
species: {
    title: "Species",
    text: [
        "A species that (potentially) lives in the environment of the simulation.",
        "Each species can be imagined to consist of different populations, each of which can inhabit one grid cell of the simulation environment.",
        "In the context of metaRange the species has no default traits or ecological processes, so the user has complete control in defining how a species behaves in the simulation.",
        "Any type of information about the species is added to it via traits (data) and processes (how the data changes over time and in relation to external factors).",
        "A basic trait for a species could be e.g. the population size / abundance and a basic process could be reproduction.",
        "Any type of interaction the species has with time, other species and the environment must be defined by the user via said traits and processes.",
        "",
        "Note: The name of the species must be a valid R variable name."
    ],
    see_also_link: "../../vignettes/A01_intro/#adding-species-to-the-simulation",
    see_also_text: "How to add species to the simulation"
},
trait: {
    title: "Trait",
    text: [
        "In the context of metaRange, a trait is any type of data that is attached to a species to store information about it.",
        "This can be traits that fall under the classic ecological definition of a measurable characteristic on an organism level like height, dispersal distance and temperature tolerance but also traits that define population dynamics as the carrying capacity or the chance to be chance to interact with other species.",
        "Generally, most traits are stored on a population level, which means each population of a species has its own trait value to account for local differences.",
        "By default, a species has no trait at all to allow for maximum flexibility when creating a model.",
        "This also means that something like abundance / population size needs to be explicitly added by the user if that is somthing important for the specific model they want to create."
    ],
    see_also_link: "../../vignettes/A01_intro/#adding-traits-to-species",
    see_also_text: "How to add traits to a species"
},
environment: {
    title: "Environment",
    text: [
        "The environment in a simulation is the spatio-temporal context in which the species live.",
        "It can conatin an arbitrary numer of variabels, such as temperature, precipitation, resource availability or any custom environmental variable the user wants to include.",
        "On a computational level, each environmental variable is represented as a two dimensional grid (raster), who all have the same dimensions and spatial extent.",
        "Each grid cell of the environment corresponds to the habitat of a single population of a species.",
        "The environment can be static or change over time.",
        "In the latter case, each environmental variable is represented by a series of rasters, one for each time step of the simulation."
    ],
    see_also_link: "../../vignettes/A01_intro/#loading-the-landscape",
    see_also_text: "Intro on loading the environment"
},
ricker_model: {
    title: "Ricker Model",
    text: [
        "The Ricker model is a nonlinear discrete population model, i.e it calculates the number of individuals in the next timestep, based on the current number of individuals.",
        "Important parameter of the model are the intrinsic growth rate of a population and the local carrying capacity of the environment.",
        "Particularly noteworthy is that the model can describe overcompensatory dynamics, which means that populations can transiently exeed the carrying capacity, which then leads to a population crash in the next year.",
        "It is often used to describe populations with non-overlapping generations.",
    ],
    see_also_link: "../../reference/ricker_reproduction_model/",
    see_also_text: "Function and literature references of the Ricker model"
},
dispersal: {
    title: "Dispersal",
    text: [
        "In the context of metaRange, dispersal describes the movement of individuals from one population (i.e. grid cell) to another.",
        "Note: Since metaRange works on the abstraction level of populations, it does not actually track the movement of each individual, but rather uses dispersal kernels to calculate the likelihood and subsequently the number of individuals that move in each time step, between the grid cells of the environment."
    ],
    see_also_link: "../../vignettes/A04_dispersal/",
    see_also_text: "Intro to dispersal in metaRange"
},
plot: {
    title: "Plot",
    editorOnly: true,
    text: [
        "This node creates a plot of the connected trait value"
    ],
    see_also_link: "../../vignettes/A01_intro/#plotting-the-results",
    see_also_text: "How to create a plot of the simulation results"
},
save: {
    title: "Save",
    editorOnly: true,
    text: [
        "This node saves the connected trait value to a .tif file."
    ],
    see_also_link: "../../vignettes/A10_saving_results",
    see_also_text: "How to save the simulation results"
},
};