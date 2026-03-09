import React from "react";
import { ytChannelId, ytUrl, googleApiKey } from "@/lib/constants";
import Image from "next/image";

export default async function YoutubePage() {
  const res = await fetch(`${ytUrl}?key=${googleApiKey}&id=${ytChannelId}&part=snippet`);
  const data = await res.json();

  const item = data?.items?.[0];
  const profileImg = item?.snippet?.thumbnails?.medium?.url;

  return (
    <div>
      <div className="container">
        <h1 className="h1">Youtube</h1>
        <Image src={profileImg} alt="profile" width={200} height={200} priority />
      </div>
    </div>
  );
}
