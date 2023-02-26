const Docker = require('dockerode');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os');

const docker = new Docker();

const PORT = 3000;


app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(bodyParser.json());


app.get('/containers', (req, res) => {
    docker.listContainers((error, containers) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({containers: containers});
    });
});

app.get('/performance', (req, res) => {
    const serverInfo = {
        loadAvg: os.loadavg(),
        cpuInfo: os.cpus(),
        uptime: os.uptime(),
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
        },
        network: os.networkInterfaces()
    };

    res.json(serverInfo);
});

app.get('/containers/images', (req, res) => {
    docker.listImages((error, images) => {
        if (error) {
            console.error(error);
            req.status(500).json({ error: error.message });
        } else {
            res.send({images: { imageNames: images.map(image => image.RepoTags[0]), imageIds: images.map(image => image.Id) }});
        }
    })
})

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('create-container', async containerParams => {
        const container = await docker.createContainer({
            Image: containerParams.image,
            name: containerParams.name,
            Tty: true,
            Cmd: ['/bin/bash'],
            AttachStdout: true,
            AttachStderr: true
        });

        await container.start();

        console.log(`Created container ${container.id} with name ${containerParams.name}`);
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

server.listen(PORT, () =>  {
    console.log(`Server running on port ${PORT}`);
});
