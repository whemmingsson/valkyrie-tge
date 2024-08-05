import ps from "prompt-sync";
import history from 'prompt-sync-history';

const prompt = ps({ sigint: true, history: history("hist", 10) });


export default prompt;