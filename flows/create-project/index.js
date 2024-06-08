import { createProject } from "../../server/utils/github.js";

export default async ({ config }) => {
  try {
    const projectUrl = await createProject(config);
    console.log("Project created:", { projectUrl });
  } catch (error) {
    console.log({ error });
  }
};
