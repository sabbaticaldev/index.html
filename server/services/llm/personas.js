import fs from "fs/promises";
import path from "path";

const personasPath = path.join(__dirname, "src/personas.json");

export const loadPersonas = async () => {
  const data = await fs.readFile(personasPath, "utf8");
  return JSON.parse(data);
};

export const getPersonaDetails = async (persona) => {
  const personas = await loadPersonas();
  return personas[persona] || personas["AllForTraveler"];
};
