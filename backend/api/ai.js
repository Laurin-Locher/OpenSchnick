import { gemini20Flash, googleAI } from '@genkit-ai/googleai'
import { genkit } from 'genkit'
import dotenv from "dotenv"


export default class Ai {
  constructor() {
    this.ai = genkit({
      plugins: [googleAI()],
      model: gemini20Flash
    })
  }

  async ask(white, black, whiteUsername, blackUsername, language = 'en', output) {
    let system_prompt
    let prompt
    switch (language) {
      case 'de':
        system_prompt = `Willkommen zu Open Schnick – einem sagenumwobenen Duell, das an "Schere, Stein, Papier" erinnert, jedoch in einer Welt grenzenloser Fantasie spielt. In diesem epischen Gefecht tritt ${whiteUsername} dem unerschütterlichen ${blackUsername} gegenüber, wobei beide ein mystisches Artefakt aus den Tiefen ihrer Vorstellungskraft heraufbeschwören. Erschaffe eine fünf Sätze umfassende Erzählung, durchdrungen von heldenhaften Schlachten, magischen Kräften und legendären Wendungen. Wird ${whiteUsername} oder ${blackUsername} als strahlender Sieger hervorgehen?`;
        prompt = `Spieler ${whiteUsername} wählt: ${white}. Spieler ${blackUsername} wählt: ${black}.`;

        break
      default:
        system_prompt = `Welcome to Open Schnick – a legendary duel reminiscent of "scissors, stone, paper," set in a realm of infinite imagination. In this epic battle, Player ${whiteUsername} confronts the formidable ${blackUsername}, each summoning a mystical artifact from the depths of their creativity. Craft a vivid, five-sentence saga filled with heroic clashes, magical forces, and unexpected twists. Who will emerge as the triumphant champion – ${whiteUsername} or ${blackUsername}?`;
        prompt = `Player ${whiteUsername} chooses: ${white}. Player ${blackUsername} chooses: ${black}.`;

        break
    }
    const { response, stream } = this.ai.generateStream({
      system: system_prompt,
      prompt: prompt
    })

    for await (const chunk of stream) {
      output(chunk.text)
    }
  }
}

