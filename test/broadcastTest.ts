import { Dog } from "../src/logic/dog.logic";
import { BirthEvent } from "../src/logic/event.logic";

const lola = new Dog("test-chip");
const birth = new BirthEvent({
  senderId: "sergi",
  comments: "very beautiful and friendly",
  parents: [],
  date: 100,
  location: "ES",
});
lola.sendEvent(birth).then(() => {
  console.log("event sent to address " + lola.account.plain());
});
