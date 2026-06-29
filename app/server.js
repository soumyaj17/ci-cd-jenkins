const express = require("express");
const k8s = require("@kubernetes/client-node");
const app = express();
const PORT = 3000;






app.use(express.urlencoded({ extended: true }));
app.use(express.json());




const kc = new k8s.KubeConfig(); // created a k8s configuration object ---> eventually which have cluster, certificate, user
kc.loadFromDefault(); // load from my default location ~/.kube/config 




const k8sApi = kc.makeApiClient(k8s.CoreV1Api); // create a k8s client for corev1api
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api); // create a k8s client for appv1api bcoz pods belongs to /app/v1 apiversion 
const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);




app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        margin:0;
        font-family:Arial;
        flex-direction:column;
      ">
        <h1 style="
          font-size:60px;
          color:#007bff;
        ">
          Hello Soumya from AppPerfect
        </h1>

        <br>

        <a href="/controller">
          Open Kubernetes Controller
        </a>
      </body>
    </html>
  `);
});




app.get("/controller", (req, res) => {
  res.send(`
    <h1>Kubernetes Controller</h1>

    <ul>
            <li><a href="/controller/pods">Pods</a></li>
            <li><a href="/controller/deployments">Deployments</a></li>
            <li><a href="/controller/jobs">Jobs</a></li>
            <li><a href="/controller/pods/list">List Pods</a></li>
            <li><a href="/controller/deployments/list">List Deployments</a></li>
            <li><a href="/controller/jobs/list">List Jobs</a></li>
    </ul>
  `);
});





































app.get("/controller/pods", (req, res) => {
  res.send(`
    <h1>Create Pod</h1>

    <form method="POST" action="/controller/pods/create">

      <input
        type="text"
        name="podName"
        placeholder="Pod Name"
        required
      />

      <br><br>

      <input
        type="text"
        name="image"
        placeholder="image name"
        required
      />

      <br><br>

      <button type="submit">
        Create Pod
      </button>

    </form>

    <br>

    <a href="/controller">
      Back
    </a>
  `);
});

app.post("/controller/pods/create", async (req, res) => {
  const { podName, image } = req.body;

  const podManifest = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podName,
    },
    spec: {
      containers: [
        {
          name: podName,
          image: image,
        },
      ],
    },
  };

  try {
    await k8sApi.createNamespacedPod({
      namespace: "default",
      body: podManifest,
    });

    res.send(`
      <h1>Pod Created Successfully</h1>

      <p>Pod Name: ${podName}</p>
      <p>Image: ${image}</p>

      <br>

      <a href="/controller/pods">
        Create Another Pod
      </a>
    `);
  } catch (err) {
    console.error(err);

    res.send(`
      <h1>Failed To Create Pod</h1>

      <pre>
${err.body?.message || err.message}
      </pre>

      <br>

      <a href="/controller/pods">
        Back
      </a>
    `);
  }
});



app.get("/controller/pods/list", async (req, res) => {
  try {
    const response = await k8sApi.listNamespacedPod({
      namespace: "default",
    });

    let html = `
      <h1>Pods In Default Namespace</h1>
      <ul>
    `;

    response.items.forEach((pod) => {
      html += `
        <li>
          ${pod.metadata.name}
        </li>
      `;
    });

    html += `
      </ul>

      <br>  

      <a href="/controller">
        Back
      </a>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);

    res.send(`
      <h1>Error Listing Pods</h1>
      <pre>${err.message}</pre>
    `);
  }
});





































app.get("/controller/deployments", (req, res) => {
  res.send(`
    <h1>Create Deployment</h1>

    <form method="POST" action="/controller/deployments/create">

      <input
        type="text"
        name="deploymentName"
        placeholder="Deployment Name"
        required
      />

      <br><br>

      <input
        type="text"
        name="image"
        placeholder="image name"
        required
      />

      <br><br>

      <input
        type="number"
        name="replicas"
        placeholder="Replicas"
        value="No. of replica"
        required
      />

      <br><br>

      <input
        type="number"
        name="containerPort"
        placeholder="Container Port"
        value="container port"
        required
      />

      <br><br>

      <button type="submit">
        Create Deployment
      </button>

    </form>

    <br>

    <a href="/controller">
      Back
    </a>
  `);
});


app.post("/controller/deployments/create", async (req, res) => {

  const {
    deploymentName,
    image,
    replicas,
    containerPort
  } = req.body;

  const deploymentManifest = {
    apiVersion: "apps/v1",

    kind: "Deployment",

    metadata: {
      name: deploymentName
    },

    spec: {

      replicas: parseInt(replicas),

      selector: {
        matchLabels: {
          app: deploymentName
        }
      },

      template: {

        metadata: {
          labels: {
            app: deploymentName
          }
        },

        spec: {

          containers: [
            {
              name: deploymentName,

              image: image,

              ports: [
                {
                  containerPort: parseInt(containerPort)
                }
              ]
            }
          ]
        }
      }
    }
  };

  try {

    await appsV1Api.createNamespacedDeployment({
      namespace: "default",
      body: deploymentManifest
    });

    res.send(`
      <h1>Deployment Created Successfully</h1>

      <p>Name: ${deploymentName}</p>

      <p>Image: ${image}</p>

      <p>Replicas: ${replicas}</p>

      <a href="/controller/deployments">
        Create Another Deployment
      </a>
    `);

  } catch (err) {

    console.error(err);

    res.send(`
      <h1>Failed To Create Deployment</h1>

      <pre>
${err.body?.message || err.message}
      </pre>
    `);
  }
});


app.get("/controller/deployments/list", async (req, res) => {

  try {

    const response =
      await appsV1Api.listNamespacedDeployment({
        namespace: "default"
      });

    let html = `
      <h1>Deployments</h1>

      <ul>
    `;

    response.items.forEach((deployment) => {

      html += `
        <li>
          ${deployment.metadata.name}
          (${deployment.spec.replicas} replicas)
        </li>
      `;
    });

    html += `
      </ul>

      <br>

      <a href="/controller">
        Back
      </a>
    `;

    res.send(html);

  } catch (err) {

    console.error(err);

    res.send(`
      <h1>Error Listing Deployments</h1>

      <pre>
${err.message}
      </pre>
    `);
  }
});



































app.get("/controller/jobs", (req, res) => {
  res.send(`
    <h1>Create Job</h1>

    <form method="POST" action="/controller/jobs/create">

      <input
        type="text"
        name="jobName"
        placeholder="Job Name"
        required
      />

      <br><br>

      <input
        type="text"
        name="image"
        placeholder="Image Name"
        required
      />

      <br><br>

      <input
        type="text"
        name="command"
        placeholder="Command (e.g. echo Hello)"
        required
      />

      <br><br>

      <button type="submit">
        Create Job
      </button>

    </form>

    <br>

    <a href="/controller">
      Back
    </a>
  `);
});

app.post("/controller/jobs/create", async (req, res) => {

  const {
    jobName,
    image,
    command
  } = req.body;

  const jobManifest = {

    apiVersion: "batch/v1",

    kind: "Job",

    metadata: {
      name: jobName
    },

    spec: {

      template: {

        spec: {

          restartPolicy: "Never",

          containers: [
            {
              name: jobName,

              image: image,

              command: command.split(" ")
            }
          ]
        }
      }
    }
  };

  try {

    await batchV1Api.createNamespacedJob({
      namespace: "default",
      body: jobManifest
    });

    res.send(`
      <h1>Job Created Successfully</h1>

      <p>Name: ${jobName}</p>

      <p>Image: ${image}</p>

      <p>Command: ${command}</p>

      <a href="/controller/jobs">
        Create Another Job</a>
    `);

  } catch (err) {

    console.error(err);

    res.send(`
      <h1>Failed To Create Job</h1>

      <pre>
${err.body?.message || err.message}
      </pre>
    `);
  }
});

app.get("/controller/jobs/list", async (req, res) => {

  try {

    const response =
      await batchV1Api.listNamespacedJob({
        namespace: "default"
      });

    let html = `
      <h1>Jobs</h1>
      <ul>
    `;

    response.items.forEach((job) => {

      html += `
        <li>
          ${job.metadata.name}
        </li>
      `;
    });

    html += `
      </ul>

      <br>

      <a href="/controller">
        Back
      </a>
    `;

    res.send(html);

  } catch (err) {

    console.error(err);

    res.send(`
      <h1>Error Listing Jobs</h1>

      <pre>
${err.message}
      </pre>
    `);
  }
});








app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});