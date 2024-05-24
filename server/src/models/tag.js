
import { readFile } from "fs/promises";
const DATA_FOLDER = "./app/apps/allfortraveler/data/";
const CITIES_JSON = DATA_FOLDER + "tags/cities.json";
const COUNTRIES_JSON = DATA_FOLDER + "tags/countries.json";
const TAGS_JSON = DATA_FOLDER + "tags/tags.json";
export async function importTags() {
  try {
    const cities = JSON.parse(await readFile(CITIES_JSON, "utf8"));
    const countries = JSON.parse(await readFile(COUNTRIES_JSON, "utf8"));
    const tags = JSON.parse(await readFile(TAGS_JSON, "utf8"));
    const allTags = [];
    
    // Process cities
    cities.forEach(city => {
      allTags.push({ id: city, city: true });
    });
    
    // Process countries
    countries.forEach(country => {
      allTags.push({ id: country, country: true });
    });
    
    // Process other tags
    tags.forEach(tag => {
      allTags.push({ id: tag });
    });
    
    return allTags; // Return the array with all tags
  } catch (error) {
    console.error("Error importing tags:", error);
    throw error; // Rethrow error for handling in Express
  }
}