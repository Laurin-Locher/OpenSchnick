import Ai from "./ai.js"

const ai = new Ai()

ai.ask('Tomato', 'Banana', 'en', (output) => {
    console.log(output)
})
