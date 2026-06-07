import { generateText, Output } from 'ai'
import { z } from 'zod'
import { songs } from '@/lib/music-data'

export const maxDuration = 30

const MOODS = [
  'happy',
  'sad',
  'stressed',
  'calm',
  'energetic',
  'motivated',
  'lonely',
  'focused',
  'night',
  'sleep',
  'uplifting',
] as const

const schema = z.object({
  emotion: z
    .string()
    .describe('A single primary emotion label, e.g. "Stressed" or "Hopeful"'),
  intensity: z
    .number()
    .min(1)
    .max(10)
    .describe('Emotional intensity from 1 (mild) to 10 (intense)'),
  summary: z
    .string()
    .describe('One warm, empathetic sentence reflecting what the user feels'),
  therapyApproach: z
    .string()
    .describe(
      'One sentence describing how music will gently guide them toward a better state',
    ),
  moodTags: z
    .array(z.enum(MOODS))
    .describe('2-4 mood tags from the allowed list that match the recommended music'),
  energyTarget: z
    .number()
    .min(0)
    .max(100)
    .describe('Target energy level for the session, 0 calm to 100 high energy'),
})

export async function POST(req: Request) {
  const { text } = await req.json()

  if (!text || typeof text !== 'string') {
    return Response.json({ error: 'Missing text' }, { status: 400 })
  }

  // Fallback mock analyzer in case OpenAI API Key is missing or generation fails
  const analyzeMockMood = () => {
    const t = text.toLowerCase()
    
    let emotion = 'Thoughtful'
    let intensity = 6
    let summary = 'You are seeking a moment of reflection and deep connection with sound.'
    let therapyApproach = 'We will curate a balanced flow to elevate your mind and bring focus.'
    let moodTags: (typeof MOODS)[number][] = ['calm', 'focused']
    let energyTarget = 50

    if (t.includes('tired') || t.includes('exhaust') || t.includes('sleep') || t.includes('burnout')) {
      emotion = 'Exhausted'
      intensity = 8
      summary = 'It sounds like you have put in a lot of energy and your mind is seeking rest.'
      therapyApproach = 'This selection starts with calming ambient textures to release tension, easing you into deep relaxation.'
      moodTags = ['calm', 'sleep', 'night']
      energyTarget = 20
    } else if (t.includes('sad') || t.includes('lonely') || t.includes('depress') || t.includes('down') || t.includes('blue')) {
      emotion = 'Melancholic'
      intensity = 7
      summary = 'You are carrying a quiet sadness, looking for a comforting presence.'
      therapyApproach = 'We will begin with reflective, warm acoustic songs that validate your space, slowly transitioning to gentle, uplifting hooks.'
      moodTags = ['sad', 'calm']
      energyTarget = 35
    } else if (t.includes('workout') || t.includes('run') || t.includes('motiv') || t.includes('energetic') || t.includes('hype')) {
      emotion = 'Determined'
      intensity = 9
      summary = 'You are ready to lock in, raise your pulse, and charge through your session.'
      therapyApproach = 'A high-tempo, driving selection of EDM and trap anthems to sync with your movement and fuel your focus.'
      moodTags = ['energetic', 'motivated', 'happy']
      energyTarget = 90
    } else if (t.includes('anxious') || t.includes('stress') || t.includes('nervous') || t.includes('worry')) {
      emotion = 'Anxious'
      intensity = 8
      summary = 'You are feeling a sense of overwhelm or tension in your body right now.'
      therapyApproach = 'We will play grounding lo-fi beats with stable, predictable structures to settle your breathing and lower stress.'
      moodTags = ['calm', 'focused', 'relaxed' as any] // fallback mapping
      if (!moodTags.every(tg => MOODS.includes(tg as any))) {
        moodTags = ['calm', 'focused']
      }
      energyTarget = 40
    } else if (t.includes('happy') || t.includes('good') || t.includes('great') || t.includes('excited')) {
      emotion = 'Joyful'
      intensity = 7
      summary = 'You are feeling radiant, lighthearted, and in sync with positive vibes.'
      therapyApproach = 'A shimmery indie-pop set designed to amplify your mood and keep your spirits floating high.'
      moodTags = ['happy', 'uplifting']
      energyTarget = 75
    }

    // Map mood tags to concrete songs from the catalog
    const matched = songs
      .map((s) => ({
        song: s,
        score: s.mood.filter((m) => moodTags.includes(m as any)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.song.id)

    const songIds = (matched.length > 0 ? matched : songs.map((s) => s.id)).slice(0, 5)

    return {
      emotion,
      intensity,
      summary,
      therapyApproach,
      moodTags,
      energyTarget,
      songIds
    }
  }

  const catalog = songs
    .map((s) => `${s.id}: "${s.title}" by ${s.artist} [${s.mood.join(', ')}]`)
    .join('\n')

  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(analyzeMockMood())
    }

    const { experimental_output } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system:
        'You are MuseAI, a warm, perceptive AI music therapist. You read how a person feels from their words and respond with genuine empathy, then choose music that meets them where they are and gently guides them toward a healthier emotional state. Never be clinical or cold. Never diagnose.',
      prompt: `The user said: "${text}"\n\nAvailable songs:\n${catalog}\n\nAnalyze their emotional state and choose mood tags that fit a healing/uplifting session.`,
      experimental_output: Output.object({ schema }),
    })

    const out = experimental_output

    // Map mood tags to concrete songs from the catalog
    const matched = songs
      .map((s) => ({
        song: s,
        score: s.mood.filter((m) => out.moodTags.includes(m as never)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.song.id)

    const songIds = (matched.length > 0 ? matched : songs.map((s) => s.id)).slice(
      0,
      5,
    )

    return Response.json({ ...out, songIds })
  } catch (err) {
    console.log('[MuseAI Therapist] analyze error:', (err as Error).message)
    // Return mock on error
    return Response.json(analyzeMockMood())
  }
}
