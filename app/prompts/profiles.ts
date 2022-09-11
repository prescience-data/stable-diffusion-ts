const profiles = {
  "quality.fine": [
    "hyper-detailed",
    "insanely detailed",
    "fine detail",
    "realistic illustration"
  ],
  "quality.cinematic": [
    "cinematic lighting",
    "toned mapping",
    "realistic color",
    "cinematic",
    "good contrast",
    "sharp focus"
  ],
  "quality.clean": ["clean lines", "clean edges"],
  "styles.gritty": ["gritty art", "moody art", "bleak art"],
  "styles.2d": [
    "artstation 2d illustration",
    "artstation 2d matte",
    "artstation concept art",
    "artstation trending",
    "cgsociety 2d illustration",
    "deviantart 2d illustration",
    "digital 2d matte painting",
    "digital matte painting",
    "high quality digital art"
  ],
  "styles.environment": [
    "2d environment artist",
    "2d environment scene artstation",
    "far cry environment concept art",
    "panorama shot",
    "intricate and detailed environment"
  ]
}

export type Profile = keyof typeof profiles

export const getProfile = (key: Profile): string[] => profiles[key]
