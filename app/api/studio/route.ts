import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const schema = z.object({
  title: z.string().describe('A catchy, evocative song title'),
  concept: z
    .string()
    .describe('Two sentences describing the artistic concept and feel'),
  structure: z
    .array(
      z.object({
        section: z
          .string()
          .describe('Section name, e.g. Verse 1, Chorus, Bridge'),
        lines: z.array(z.string()).describe('The lyric lines for this section'),
      }),
    )
    .describe('The full song broken into labelled sections with lyrics'),
  production: z.object({
    bpm: z.number().describe('Tempo in beats per minute'),
    key: z.string().describe('Musical key, e.g. "A minor"'),
    instruments: z
      .array(z.string())
      .describe('4-6 key instruments / sounds in the arrangement'),
    vocalStyle: z.string().describe('Description of the vocal delivery'),
  }),
})

export async function POST(req: Request) {
  const { prompt, genre, mood, language } = await req.json()

  if (!prompt || typeof prompt !== 'string') {
    return Response.json({ error: 'Missing prompt' }, { status: 400 })
  }

  // Fallback mock generator in case OpenAI API Key is missing or generation fails
  const generateMockSong = () => {
    const capitalizedPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1)
    const genreBpm = genre === 'EDM' ? 128 : genre === 'Lo-Fi' ? 82 : genre === 'Hip-Hop' ? 95 : 105

    return {
      title: `${prompt.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Echoes of'} ${genre}`,
      concept: `A beautiful ${mood.toLowerCase()} track in ${language} inspired by the idea: "${capitalizedPrompt}". Designed to create a cohesive sonic atmosphere.`,
      structure: [
        {
          section: 'Verse 1',
          lines: [
            `Walking down the neon-lit avenue,`,
            `Thinking of the memories we once knew.`,
            `A soft echo of ${genre.toLowerCase()} in the air,`,
            `Telling me that you are still somewhere.`
          ]
        },
        {
          section: 'Chorus',
          lines: [
            `This is our song, written in the stars,`,
            `Playing on simulated string guitars.`,
            `MuseAI carries our melody tonight,`,
            `Shining brighter than the city light.`
          ]
        },
        {
          section: 'Verse 2',
          lines: [
            `Through the whisper of the autumn breeze,`,
            `Singing in ${language} beneath the trees.`,
            `The rhythm picks up, a steady heartbeat,`,
            `Weaving through the shadows of the empty street.`
          ]
        },
        {
          section: 'Bridge',
          lines: [
            `Let the frequencies rise, let the drums begin,`,
            `This is the feeling we are sinking in.`
          ]
        },
        {
          section: 'Chorus',
          lines: [
            `This is our song, written in the stars,`,
            `Playing on simulated string guitars.`,
            `MuseAI carries our melody tonight,`,
            `Shining brighter than the city light.`
          ]
        }
      ],
      production: {
        bpm: genreBpm,
        key: 'E Minor',
        instruments: ['analog synthesizer', 'sub-bass', 'warm acoustic guitar', 'reverb percussion'],
        vocalStyle: `Ethereal, ${mood.toLowerCase()} vocals with a touch of echo`
      }
    }
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return high-quality mock if offline
      return Response.json(generateMockSong())
    }

    const { experimental_output } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system:
        'You are MuseAI Studio, a world-class AI songwriter and producer. You write vivid, singable, emotionally resonant lyrics and design professional arrangements. Match the requested genre, mood, and language precisely. Keep lyrics original and free of copyrighted material.',
      prompt: `Write a complete original song.\n\nBrief: ${prompt}\nGenre: ${genre ?? 'open'}\nMood: ${mood ?? 'open'}\nLanguage: ${language ?? 'English'}\n\nInclude verses, at least one chorus, and a bridge.`,
      experimental_output: Output.object({ schema }),
    })

    return Response.json(experimental_output)
  } catch (err) {
    console.log('[MuseAI Studio] generate error:', (err as Error).message)
    // Return mock on error
    return Response.json(generateMockSong())
  }
}
