import fs from "fs";
import readline from "readline";

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(["yes", "y", "1"].includes(answer.trim().toLowerCase()));
    });
  });
}

export async function checkAndExecute({description, filePath, operation, prompt}) {
  let attempt = 0;
  while (true) {
    if (prompt && !filePath) {
      const confirm = await promptUser(`Proceed with ${description}? (yes/no): `);
      if (!confirm) {
        console.log(`Operation ${description} was skipped by the user.`);
        return;
      }
    } 
    if (fs.existsSync(filePath)) {
      let redo;
      if(prompt) {
        redo = await promptUser(`File ${filePath} exists. Redo ${description}? (yes/no): `);
      }
      
      if (!redo) {
        if (filePath.endsWith(".json")) {
          const fileContent = fs.readFileSync(filePath, "utf8");
          return JSON.parse(fileContent);
        }
        return filePath;
      }
    }

    try {
      console.log("Running operation:", description);
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`Error during ${description}:`, error);
      attempt++;
      if(prompt) {
        const retry = await promptUser(`Attempt ${attempt} failed. Retry ${description}? (yes/no): `);
        if (!retry) {
          throw new Error(`User decided not to retry ${description} after failure.`);
        }
      }
    }
  }
}

export async function executeTasks({ tasks: taskList, prompt, deps }) {
  try {
    for (const task of taskList) {
      if (task.dependencies) {
        await Promise.all(task.dependencies.map(dep => deps[dep]));
      }    
      const result = await checkAndExecute({ ...task, prompt });
      if(task.key) {
        deps[task.key] = result;
      }
    }
  }
  catch(error) {
    console.error({error});
  }
  finally {
    rl.close();
  }
}