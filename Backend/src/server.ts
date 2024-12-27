import cluster from "cluster";
import os from "os";
import app from './app';

const PORT = process.env.PORT || 3000;
const totalCPUs = 2 //os.cpus().length;

if (cluster.isPrimary) {

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else{
  
  app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT} with Process ID: ${process.pid}`);
  });
}
