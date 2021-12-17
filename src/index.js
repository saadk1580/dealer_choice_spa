const axios = require("axios");
const passengers = document.querySelector("#passengers-list");
const dest = document.querySelector("#departure-list");
const arrival = document.querySelector("#arrival-list");
const id = document.querySelector("#id-list");
const del = document.querySelector("#delete-list");
const add = document.querySelector("#add");
const fake = require("faker");

const getPassengers = async () => {
  let res = await axios.get("/api/passengers");
  console.log(res.data);
  let pas = res.data
    .map((i) => {
      return `<li>${i.name}</li>`;
    })
    .join("");
  let getId = res.data
    .map((_, idx) => {
      return `<li>${idx + 1}</li>`;
    })
    .join("");
  let getDep = res.data
    .map((i) => {
      return `<li>${i.departure}</li>`;
    })
    .join("");
  let getDest = res.data
    .map((i) => {
      return `<li>${
        i.destination[0] !== undefined
          ? i.destination[0].cityName
          : "Not available"
      }</li>`;
    })
    .join("");
  let deleteItem = res.data
    .map((i) => {
      return `<li id=${i.id}>X</li>`;
    })
    .join("");

  passengers.innerHTML = pas;
  id.innerHTML = getId;
  dest.innerHTML = getDep;
  arrival.innerHTML = getDest;
  del.innerHTML = deleteItem;
};

del.addEventListener("click", async (ev) => {
  const id = ev.target.getAttribute("id");
  console.log(id);
  await axios.delete(`/api/passengers/${id}`);
  getPassengers();
});

add.addEventListener("click", async () => {
  const obj = {
    name: fake.name.findName(),
    departure: fake.address.city(),
    arrival: fake.address.city(),
    phoneNumber: fake.phone.phoneNumber(),
    age: Math.floor(Math.random() * 100),
  };

  await axios.post("/api/passengers/", {
    name: obj.name,
    age: obj.age,
    departure: obj.departure,
    phone: obj.phoneNumber,
  });

  await axios.post("/api/destination/", {
    cityName: obj.arrival,
  });

  getPassengers();
});

getPassengers();
