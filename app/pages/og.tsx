// pages/api/og.tsx

import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default function handler(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Retrieve the title from query parameters, default to 'Hello, World!' if not provided
    const title = searchParams.get('title') || 'Hello, World!';

    // Define your Open Graph image
    return new ImageResponse(
        (
            <div
                style={{
                    backgroundColor: 'lightblue',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                    color: 'black',
                }}
            >
                {title}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}