export type Track = {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number;
  videoId: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

export const playlists: Playlist[] = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    tracks: [
      { id: "gh1", title: "Babydoll", artist: "Dominic Fike", year: 2019, videoId: "nb8CnIo_-_A" },
      { id: "gh2", title: "Coffee", artist: "beabadoobee", year: 2017, videoId: "C6CeA6vRtW4" },
      { id: "gh3", title: "Glue Song", artist: "beabadoobee", year: 2023, videoId: "y1cBhJLNNXU" },
      { id: "gh4", title: "Lover Girl", artist: "Laufey", year: 2024, videoId: "obLSGG-oEyw" },
      { id: "gh5", title: "Stephanie", artist: "Nafeesisboujee", videoId: "3elVQh4hz3M" },
      { id: "gh6", title: "lights on", artist: "Emcee KB", videoId: "QhoynxfOABI" },
      { id: "gh7", title: "Love Letters", artist: "Alex White", videoId: "-g_pNrjsc4g" },
      { id: "gh8", title: "FLY", artist: "Jeremiah Miller", videoId: "ewtz2wwaRjo" },
    ],
  },
  {
    id: "heartbreak-static",
    name: "Heartbreak Static",
    tracks: [
      { id: "hs1", title: "this is what heartbreak feels like", artist: "JVKE", year: 2022, videoId: "OsrJf_a5170" },
      { id: "hs2", title: "worst case scenario (acoustic)", artist: "jayo", videoId: "YHpGZa0Sdp8" },
      { id: "hs3", title: "Crush", artist: "Marino, kiki wera", videoId: "P0MZ-NUwDgw" },
      { id: "hs4", title: "Lust", artist: "Marino, Alexandria", videoId: "sr_qh33LsKQ" },
      { id: "hs5", title: "I Can't Fit In", artist: "Marino", videoId: "c2l3e-SIsts" },
      { id: "hs6", title: "hideaway", artist: "Marino", videoId: "CFCTeIn9Wp0" },
      { id: "hs7", title: "Co2", artist: "Prateek Kuhad", year: 2021, videoId: "U2SVCCENLjE" },
      { id: "hs8", title: "i walk this earth all by myself", artist: "EKKSTACY", year: 2020, videoId: "uto7z_YEuaM" },
    ],
  },
  {
    id: "midnight-drives",
    name: "Midnight Drives",
    tracks: [
      { id: "md1", title: "Devil in Disguise", artist: "Marino", videoId: "DC-cqWO_GM0" },
      { id: "md2", title: "All In", artist: "Marino", videoId: "elRjusCwyPg" },
      { id: "md3", title: "Ride or Die", artist: "Marino", videoId: "UmyskaECzYM" },
      { id: "md4", title: "Love Me Not", artist: "NovaX, Seven", videoId: "oTZNpknJwgs" },
      { id: "md5", title: "NOW OR NEVER", artist: "TKANDZ, CXSPER", videoId: "A06UH4Batb8" },
      { id: "md6", title: "Confess Your Love", artist: "Jiandro, ola.wav", videoId: "LfHm50UJW6U" },
      { id: "md7", title: "I Ain't Worried", artist: "OneRepublic", film: "Top Gun: Maverick", year: 2022, videoId: "mNEUkkoUoIA" },
    ],
  },
];
