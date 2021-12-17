const {
  syncAndSeed,
  conn,
  model: { Destination, Passenger },
} = require("./db");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

app.use("/dist", express.static(path.join(__dirname, "dist")));

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.get("/api/passengers", async (req, res, next) => {
  try {
    res.send(
      await Passenger.findAll({
        include: [
          {
            model: Destination,
            as: "destination",
          },
        ],
      })
    );
  } catch (err) {
    next(err);
  }
});

app.get("/api/destinations", async (req, res, next) => {
  try {
    res.send(await Destination.findAll());
  } catch (err) {
    next(err);
  }
});

app.delete("/api/passengers/:id", async (req, res, next) => {
  try {
    const passenger = await Passenger.findByPk(req.params.id);
    await passenger.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/passengers/", async (req, res, next) => {
  try {
    const passenger = { ...req.body, userId: req.params.userId };
    res.status(201).send(await Passenger.create(passenger));
  } catch (err) {
    next(err);
  }
});

app.post("/api/destination/", async (req, res, next) => {
  try {
    const destination = { ...req.body, userId: req.params.userId };
    res.status(201).send(await Destination.create(destination));
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    await conn.authenticate();
    await syncAndSeed();
    const port = 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();
