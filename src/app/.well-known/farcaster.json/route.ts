import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Return the Farcaster manifest as JSON
  const manifest = {
    frame: {
      name: "Zunno",
      homeUrl: "https://zunno.xyz",
      iconUrl: "https://zunno.xyz/logo.jpg",
      version: "1",
      subtitle: "leading game hub",
      description:
        "Zunno is a cutting-edge, multiplayer digital adaptation of the classic UNO game",
      splashImageUrl: "https://zunno.xyz/logo.jpg",
      primaryCategory: "games",
      splashBackgroundColor: "#0000a8",
      screenshotUrls: [
        "https://zunno.xyz/images/screenshot_1.png",
        "https://zunno.xyz/images/screenshot_2.png",
        "https://zunno.xyz/images/screenshot_3.png",
      ],
      tags: ["UNO", "mini-app", "base-app"],
      heroImageUrl: "https://zunno.xyz/images/hero-1.png",
      tagline: "UNO game on Blockchain",
      ogTitle: "Zunno",
      ogDescription:
        "Zunno is a cutting-edge, multiplayer digital adaptation of the classic UNO game",
      ogImageUrl: "https://zunno.xyz/images/hero-1.png",
    },
    accountAssociation: {
      header:
        "eyJmaWQiOjExNjkwMjQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1YTM4N2IwOTM1MDZDYjQzQjk2NWU4MTNmY0QyQzc4MTYwODUwMTQ0In0",
      payload: "eyJkb21haW4iOiJ1bm8tZ2FtZS1waS52ZXJjZWwuYXBwIn0",
      signature:
        "MHg0YTM4ZGEyZWY3ODRiZTBiZmNhYzM4NGVkY2RmOWFiOTM2NWM0NTk4YWVjZGU0YTkyODA0NDYwYWIzMzBlMDQ4NzhmNDZmOTY5MTc0NDU1MDBkM2U5NzZmZDk5ZjY0MjZiNDEwMmUzNTc4NWEyODJiMmE2OTkwYmM4MDczNzk3ZjFi",
    },
  };

  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
