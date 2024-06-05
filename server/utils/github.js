import { exec } from "child_process";
import util from "util";

import settings from "../settings.js";
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

export async function createIssue(title, description) {
  try {
    await execAsync(
      `gh issue create --title "${title}" --body "${description}"`,
    );
    console.log(`Issue "${title}" created successfully`);
  } catch (error) {
    console.error(`Failed to create issue "${title}":`, error);
    throw error;
  }
}

export async function closeIssue(issueNumber) {
  try {
    await execAsync(`gh issue close ${issueNumber}`);
    console.log(`Issue #${issueNumber} closed successfully`);
  } catch (error) {
    console.error(`Failed to close issue #${issueNumber}:`, error);
    throw error;
  }
}

export async function createPullRequest(
  title,
  description,
  head,
  base = "main",
) {
  try {
    await execAsync(
      `gh pr create --title "${title}" --body "${description}" --head ${head} --base ${base}`,
    );
    console.log(`Pull request "${title}" created successfully`);
  } catch (error) {
    console.error(`Failed to create pull request "${title}":`, error);
    throw error;
  }
}

export async function mergePullRequest(prNumber) {
  try {
    await execAsync(`gh pr merge ${prNumber} --merge`);
    console.log(`Pull request #${prNumber} merged successfully`);
  } catch (error) {
    console.error(`Failed to merge pull request #${prNumber}:`, error);
    throw error;
  }
}

export const sshKeyPath = `${settings.HOME}/.ssh/id_rsa`;
