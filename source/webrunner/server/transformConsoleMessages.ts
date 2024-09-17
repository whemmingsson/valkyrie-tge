const regex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

const transformConsoleMessages = (rawMessages: string[]): string[] => {
    const messages: string[] = [];
    if (rawMessages.length === 0) {
        messages.push("\n");
        return messages;
    }

    for (let i = 0; i < rawMessages.length; i++) {
        const msg = rawMessages[i];
        if (typeof msg === 'string') {
            const split = msg.split('\n');
            split.forEach((message) => {
                if (regex.test(message)) {
                    const justText = message.replace(regex, '');
                    messages.push(justText);
                }
                else {
                    messages.push(message);
                }
            });
        }
        else {
            messages.push("Invalid system message: " + msg);
        }
    }

    return messages;
}

export default transformConsoleMessages;