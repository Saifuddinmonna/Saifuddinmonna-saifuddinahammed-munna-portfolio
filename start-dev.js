const { spawn } = require("child_process");
const path = require("path");

// Start the server
const server = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  shell: true,
});

// Start the client
const client = spawn("npm", ["start"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

// Handle process termination
process.on("SIGINT", () => {
  server.kill();
  client.kill();
  process.exit();
});
