export const trimList = (list: string[]): string[] => {
    let i = list.length - 1;
    let count = 0;

    // Reverse iterate to count consecutive empty/newline strings
    while (i >= 0 && (list[i] === "" || list[i] === "\n")) {
        count++;
        i--;
    }

    // If there are more than one, remove the excess
    if (count > 1) {
        list.splice(i + 2, count - 1);
    }

    return list;
};