import { NextResponse } from 'next/server'
import { getDictionary } from '@/lib/dictionaries'

export async function GET(
  request: Request,
  context: { params: { lang: string } }
) {
  try {
    // Extract params from context using a different approach
    // to avoid the direct access warning
    const { params } = context;
    const language = params.lang;
    
    if (language !== 'en' && language !== 'ar') {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
    }
    const dictionary = await getDictionary(language)
    return NextResponse.json(dictionary)
  } catch (error) {
    console.error('API Error fetching dictionary:', error)
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 })
  }
} 