import { Dog } from "../src/logic/dog.logic";
import { BirthEvent } from "../src/logic/event.logic";

const lola = new Dog("test-chip");
lola.getEvents().then(events => {
  console.log("got events:", events.map(e => e.toJSON()));
})
