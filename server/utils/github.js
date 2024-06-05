import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function authenticateGitHub(sshKeyPath) {
  try {
    await execAsync(`gh auth login --with-ssh-key ${sshKeyPath}`);
    console.log("GitHub authentication successful");
  } catch (error) {
    console.error("GitHub authentication failed:", error);
    throw error;
  }
}

export async function createProject(name, description) {
  try {
    await execAsync(`gh repo create ${name} --description "${description}"`);
    console.log(`Project "${name}" created successfully`);
  } catch (error) {
    console.error(`Failed to create project "${name}":`, error);
    throw error;
  }
}

export async function connectToProject(url) {
  try {
    await execAsync(`gh repo clone ${url}`);
    console.log(`Connected to project at ${url}`);
  } catch (error) {
    console.error(`Failed to connect to project at ${url}:`, error);
    throw error;
  }
}

// TODO
export async function createIssue() {}
