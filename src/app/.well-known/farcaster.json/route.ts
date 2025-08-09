import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Return the Farcaster manifest as JSON
  const manifest = {
    frame: {
      name: "Zunno",
      homeUrl: "https://uno-game-pi.vercel.app",
      iconUrl: "https://uno-game-pi.vercel.app/logo.jpg",
      version: "1",
      subtitle: "leading game hub",
      description:
        "Zunno is a cutting-edge, multiplayer digital adaptation of the classic UNO game",
      splashImageUrl: "https://uno-game-pi.vercel.app/logo.jpg",
      primaryCategory: "games",
      splashBackgroundColor: "#0000a8",
      screenshotUrls: [
        "https://uno-game-pi.vercel.app/images/screenshot_1.png",
        "https://uno-game-pi.vercel.app/images/screenshot_2.png",
        "https://uno-game-pi.vercel.app/images/screenshot_3.png",
      ],
      tags: ["UNO","mini-app","base-app"],
      heroImageUrl: "https://uno-game-pi.vercel.app/images/hero-1.png",
      tagline: "UNO game on Blockchain",
      ogTitle: "Zunno",
      ogDescription: "Zunno is a cutting-edge, multiplayer digital adaptation of the classic UNO game",
      ogImageUrl: "https://uno-game-pi.vercel.app/images/hero-1.png",
    },
    accountAssociation: {
      header:
        "",
      payload: "",
      signature:
        "",
    },
  };

  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
