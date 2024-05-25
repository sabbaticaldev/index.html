import { readFile } from "fs/promises";

const DATA_FOLDER = "./app/apps/allfortraveler/data/";
const TAGS_PATHS = {
  cities: DATA_FOLDER + "tags/cities.json",
  countries: DATA_FOLDER + "tags/countries.json",
  tags: DATA_FOLDER + "tags/tags.json",
};

export async function importTags() {
  try {
    const allTags = (
      await Promise.all(
        Object.entries(TAGS_PATHS).map(async ([key, path]) =>
          JSON.parse(await readFile(path, "utf8")).map((tag) => ({
            id: tag,
            [key]: true,
          })),
        ),
      )
    ).flat();

    return allTags;
  } catch (error) {
    console.error("Error importing tags:", error);
    throw error;
  }
}
