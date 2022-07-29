var doTask = (taskName) => {
  var begin = Date.now();
  return new Promise(function (resolve, reject) {
    console.log("");
    console.log("\x1b[31m", "[TASK] STARTING: " + taskName);
    setTimeout(function () {
      var end = Date.now();
      var timeSpent = end - begin + "ms";
      console.log(
        "\x1b[36m",
        "[TASK] FINISHED: " + taskName + " in " + timeSpent,
        "\x1b[0m"
      );
      resolve(true);
    }, Math.random() * 3200);
  });
};

// initializes the project with a new set of tasks , that are passed to the manageConcurrency function
async function init() {
  numberOfTasks = 30;
  const concurrencyMax = 4;
  const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join("")
  );
  const counter = 0;
  console.log("[init] Concurrency Algo Testing...");
  console.log("[init] Tasks to process: ", taskList.length);
  console.log("[init] Task list: " + taskList);
  console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n");
  await manageConcurrency(taskList, counter, concurrencyMax);
}

// the concurrency management works by creating a new temporary set of array that are mapped to the doTask function to create iterable promises.  then Promise.all will handle them concurrently.   i have considered other methods to solve this issue but some of them revolve around a callback hell so i chose to reject them
async function manageConcurrency(taskList, counter, concurrencyMax) {
  // This timer variable is used to simulate the local time
  var timer = 0;

  while (counter < taskList.length) {
    // a new temporary array is created and the size is set based on the concurrency max set
    const tempTaskList = taskList.slice(counter, concurrencyMax + counter);
    await Promise.all(tempTaskList.map(doTask));
    counter += concurrencyMax;

    // if the local time is between 3 and 5 the concurrency max will be set to 2 , else it will be 4
    if (timer >= 3 && timer <= 5) {
      concurrencyMax = 2;
      if (timer == 3) {
        console.log(`**** changing concurrency to ${concurrencyMax} ****`);
      }
    } else {
      concurrencyMax = 4;
      if (timer == 6) {
        console.log(`**** changing concurrency to ${concurrencyMax} ****`);
      }
    }

    timer++;
  }
}

init();
