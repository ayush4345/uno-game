import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Return the Farcaster manifest as JSON
  const manifest = {
    "frame": {
      "name": "Zunno",
      "homeUrl": "https://uno-game-pi.vercel.app",
      "iconUrl": "https://uno-game-pi.vercel.app/logo.jpg",
      "version": "1",
      "subtitle": "leading game hub",
      "description": "Zunno is a cutting-edge, multiplayer digital adaptation of the classic UNO game",
      "splashImageUrl": "https://uno-game-pi.vercel.app/logo.jpg",
      "primaryCategory": "games",
      "splashBackgroundColor": "#0000a8"
    },
    "accountAssociation": {
      "header": "eyJmaWQiOjExNTA4MjcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1OUM3QkM1ODUxZGFGQUM5ZmY5NWI5M2NGMzRhNTIwMDRFQ2MxREE2In0",
      "payload": "eyJkb21haW4iOiJ1bm8tZ2FtZS1waS52ZXJjZWwuYXBwIn0",
      "signature": "MHhiZjVmNjUyZWRkZWU2OWYzYmQ2NWEyYjhjZTAxMDQxMTQ4MDc0NWE5M2JhNzFkYzE1YTAzY2VlYzQyNjQ0ZTA1NWYzYWUzODAxMGY1NjA3NTNjOTViYTZmZTFhOGUxZjI1OWRjNjZiNTVlZTUyYTU0YTc4MWZlMmY4M2VjMjcyYzFi"
    }
  };

  return Response.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
