export interface SuccessStory {
  id: string;
  src: string;
  alt: string;
}

export const SUCCESS_STORIES_BASE_PATH = "/assets/success-stories";

export const SUCCESS_STORY_COUNT = 360;

export const SUCCESS_STORY_FALLBACK_ASPECT_RATIO = 3 / 4;

// Images to display at the end
const LAST_SUCCESS_STORIES = [
  2, 15, 17, 21, 33, 34, 38, 56, 60, 62, 65, 67, 87, 91, 104, 106, 110, 115,
  116, 124, 129, 133, 135, 138, 143, 145, 146, 153, 154, 161, 180, 195, 199,
  201, 205, 207, 208, 209, 213, 223, 225, 242, 248, 251, 252, 267, 269, 273,
  275, 283, 285, 291, 293, 300, 310, 314, 321, 329, 331, 336, 343, 347, 348, 19,
  83, 97, 98, 130, 157, 158, 181, 194, 198, 206, 215, 256, 277, 286, 289, 311,
  313, 319, 323, 326, 328, 334, 335, 345,
];

const lastStoriesSet = new Set(LAST_SUCCESS_STORIES);

const createSuccessStory = (imageNumber: number): SuccessStory => ({
  id: String(imageNumber),
  src: `${SUCCESS_STORIES_BASE_PATH}/${Math.ceil(imageNumber / 10)}/${imageNumber}.webp`,
  alt: `UK Success Story ${imageNumber}`,
});

export const successStories: SuccessStory[] = [
  ...Array.from({ length: SUCCESS_STORY_COUNT }, (_, index) => index + 1)
    .filter((number) => !lastStoriesSet.has(number))
    .map(createSuccessStory),

  ...LAST_SUCCESS_STORIES.map(createSuccessStory),
];
