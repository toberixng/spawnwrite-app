// app/api/posts/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET: Fetch posts for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Get or create the user
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ username, email: `${username}@example.com` })
        .select('id')
        .single();

      if (createError) {
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
      }
      user = newUser;
    }

    // Fetch posts for this user
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new post
export async function POST(request: Request) {
  const { username, content, is_paid } = await request.json();

  if (!username || !content) {
    return NextResponse.json({ error: 'Username and content are required' }, { status: 400 });
  }

  try {
    // Get or create the user
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ username, email: `${username}@example.com` })
        .select('id')
        .single();

      if (createError) {
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
      }
      user = newUser;
    }

    // Save the post
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content,
      is_paid: is_paid || false,
    });

    if (error) {
      return NextResponse.json({ error: 'Error publishing post' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post published successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}