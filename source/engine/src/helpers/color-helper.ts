import chalk from "chalk";

// Map between color codes and chalk functions (built in colors)
let colorMap = {
    "r": chalk.red,
    "g": chalk.green,
    "b": chalk.blue,
    "y": chalk.yellow,
    "m": chalk.magenta,
    "c": chalk.cyan,
    "w": chalk.white,
};


export interface ColorMap {
    [key: string]: chalk.Chalk;
}

export const parseColorScheme = (colorScheme): ColorMap => {
    if (!colorScheme) colorMap;

    colorScheme.forEach((color) => {
        colorMap[color.name] = chalk.hex(color.value);
    });

    return colorMap;
}