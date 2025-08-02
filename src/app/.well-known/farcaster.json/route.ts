import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Return a 307 temporary redirect to the Farcaster Hosted Manifest URL
  return Response.redirect(
    'https://api.farcaster.xyz/miniapps/hosted-manifest/019869c1-86c6-2e9f-b9ff-a34ba3f8baaa',
    307
  );
}
