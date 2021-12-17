const { Sequelize, STRING, INTEGER } = require("sequelize");
const fake = require("faker");
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/travel_data"
);

const getData = (num = 15) => {
  let data = Array(num)
    .fill("")
    .map((_) => {
      const obj = {
        name: fake.name.findName(),
        departure: fake.address.city(),
        arrival: fake.address.city(),
        phoneNumber: fake.phone.phoneNumber(),
        age: Math.floor(Math.random() * 100),
      };
      return obj;
    });
  return data;
};

const Destination = conn.define("destination", {
  cityName: STRING,
});

const Passenger = conn.define("passenger", {
  name: STRING,
  age: INTEGER,
  departure: STRING,
  phone: STRING,
});

Passenger.hasMany(Destination, {
  as: "destination",
  foreignKey: "id",
});

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  let data = await getData();
  await Promise.all(
    data.map((obj) => [
      Passenger.create({
        name: obj.name,
        age: obj.age,
        departure: obj.departure,
        phone: obj.phoneNumber,
      }),
      Destination.create({
        cityName: obj.arrival,
      }),
    ])
  );
};

module.exports = {
  conn,
  syncAndSeed,
  model: {
    Destination,
    Passenger,
  },
};
