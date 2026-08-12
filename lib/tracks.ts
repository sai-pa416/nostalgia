export type Track = {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number;
  /** YouTube video id of an upload you have the right to embed
   *  (your own upload, or the rights holder's channel with embedding enabled).
   *  Empty string = track is parked; the player skips it and shows a hint. */
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

/*
 * PARKED TRACKS — paste a videoId to bring one back (one line per song).
 * Only use uploads you have the right to embed (your own, or the rights
 * holder's own channel with embedding enabled).
 *
  { id: "p1", title: "Love Me Not", artist: "Ravyn Lenae", videoId: "" },
  { id: "p2", title: "Headlights (feat. KIDDO) - Slowed", artist: "Alok, Alan Walker, KIDDO", videoId: "" },
  { id: "p3", title: "I Wanna Be Yours", artist: "Arctic Monkeys", videoId: "" },
  { id: "p4", title: "People", artist: "Libianca", videoId: "" },
  { id: "p5", title: "Ghost of Chicago", artist: "Noah Floersch", videoId: "" },
  { id: "p6", title: "Golden Brown - Sped Up Version", artist: "The Stranglers", videoId: "" },
  { id: "p7", title: "this is what winter feels like", artist: "JVKE", videoId: "" },
  { id: "p8", title: "Notion", artist: "The Rare Occasions", videoId: "" },
  { id: "p9", title: "back to friends", artist: "sombr", videoId: "" },
  { id: "p10", title: "The Night We Met", artist: "Lord Huron", videoId: "" },
  { id: "p11", title: "Attention", artist: "Charlie Puth", videoId: "" },
  { id: "p12", title: "Sailor Song", artist: "Gigi Perez", videoId: "" },
  { id: "p13", title: "Dernière danse", artist: "Indila", videoId: "" },
  { id: "p14", title: "blue", artist: "yung kai", videoId: "" },
  { id: "p15", title: "We Don't Talk Anymore (feat. Selena Gomez)", artist: "Charlie Puth, Selena Gomez", videoId: "" },
  { id: "p16", title: "this is what autumn feels like", artist: "JVKE", videoId: "" },
  { id: "p17", title: "Those Eyes", artist: "New West", videoId: "" },
  { id: "p18", title: "No Lie", artist: "Sean Paul, Dua Lipa", videoId: "" },
  { id: "p19", title: "Dandelions", artist: "Ruth B.", videoId: "" },
  { id: "p20", title: "No One Noticed", artist: "The Marías", videoId: "" },
  { id: "p21", title: "Counting Stars", artist: "OneRepublic", videoId: "" },
  { id: "p22", title: "WILDFLOWER", artist: "Billie Eilish", videoId: "" },
  { id: "p23", title: "Heat Waves - Slowed", artist: "Glass Animals", videoId: "" },
  { id: "p24", title: "Love Story", artist: "Indila", videoId: "" },
  { id: "p25", title: "Numb Little Bug - Piano Version", artist: "Em Beihold", videoId: "" },
  { id: "p26", title: "Come Home", artist: "Jace June", videoId: "" },
  { id: "p27", title: "I Thought I Saw Your Face Today", artist: "She & Him", videoId: "" },
  { id: "p28", title: "From The Start", artist: "Laufey", videoId: "" },
  { id: "p29", title: "her", artist: "JVKE", videoId: "" },
  { id: "p30", title: "double take", artist: "Dhruv", videoId: "" },
  { id: "p31", title: "Until I Found You (with Em Beihold)", artist: "Stephen Sanchez, Em Beihold", videoId: "" },
  { id: "p32", title: "If We Have Each Other", artist: "Alec Benjamin", videoId: "" },
 */