import { Octokit } from "@octokit/rest";

import settings from "../settings.js";

const octokit = new Octokit({
  auth: settings.GITHUB_ACCESS_TOKEN,
});

export async function createProject(name, description) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: true,
    });
    return response.data.clone_url;
  } catch (error) {
    console.error(`Failed to create project "${name}":`, error);
    throw error;
  }
}

export async function connectToProject(url) {
  try {
    const repoName = url.split("/").pop().split(".")[0];
    console.log(`Connected to project ${repoName}`);
  } catch (error) {
    console.error(`Failed to connect to project at ${url}:`, error);
    throw error;
  }
}

export async function createIssue(title, description) {
  try {
    const response = await octokit.issues.create({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      title,
      body: description,
      labels: ["TODO"],
    });

    console.log(`Issue "${title}" created successfully`);
    return response.data.number;
  } catch (error) {
    console.error(`Failed to create issue "${title}":`, error);
    throw error;
  }
}

export async function closeIssue(issueNumber) {
  try {
    await octokit.issues.update({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      issue_number: issueNumber,
      state: "closed",
    });
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
    const response = await octokit.pulls.create({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      title,
      body: description,
      head,
      base,
    });

    console.log(`Pull request "${title}" created successfully`);
    return response.data.number;
  } catch (error) {
    console.error(`Failed to create pull request "${title}":`, error);
    throw error;
  }
}

export async function addComment(issueNumber, body) {
  try {
    await octokit.issues.createComment({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      issue_number: issueNumber,
      body,
    });
    console.log(`Comment added to issue #${issueNumber} successfully`);
  } catch (error) {
    console.error(`Failed to add comment to issue #${issueNumber}:`, error);
  }
}

export async function mergePullRequest(prNumber) {
  try {
    await octokit.pulls.merge({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      pull_number: prNumber,
      merge_method: "merge",
    });
    console.log(`Pull request #${prNumber} merged successfully`);
  } catch (error) {
    console.error(`Failed to merge pull request #${prNumber}:`, error);
    throw error;
  }
}
export async function fetchOpenIssues({ labels }) {
  try {
    const response = await octokit.issues.listForRepo({
      owner: settings.GITHUB_OWNER,
      repo: settings.GITHUB_REPO,
      labels: labels.join(","),
      state: "open",
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch open issues:", error);
    throw error;
  }
}

export const sshKeyPath = `${settings.HOME}/.ssh/id_rsa`;
