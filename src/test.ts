import { action, autorun, computed, observable, reaction, when } from "mobx";

interface IPerson {
  firstName: string;
  lastName: string;
}

// const waitForPromise = async () =>
//   new Promise((resolve) => setTimeout(resolve, 1000));

class Person {
  @observable
  firstName: string = "Mobx";

  @observable
  lastName: string = "React";

  @observable
  age: number = 27;

  @observable
  isAlive: boolean = true;

  @observable
  dollars: number = 5;

  constructor(props: IPerson) {
    Object.assign(this, props); //apply props to this  npr this.name = name;

    //reaction when
    when(
      () => this.age > 99,
      () => this.bury()
    );
  }

  @action
  bury() {
    this.isAlive = false;
  }

  @action
  setAge(age: number) {
    this.age = age;
  }

  @action
  updateFullName(name: string, lastname: string) {
    this.firstName = name;
    this.lastName = lastname;
  }

  @action
  withdrawal(amount: number) {
    this.dollars -= amount;
  }

  @computed
  get euros() {
    console.log("Calculating euros...");
    return this.dollars + 2;
  }
}

//create new instance of Person class
const ourPerson = new Person({ firstName: "Toni", lastName: "Diklic" });

//logging (reaction autorun)
autorun(() => {
  console.log(`${ourPerson.euros}`);
});

reaction(
  () => !ourPerson.isAlive,
  () => console.log("RIP")
);

//ourPerson.setAge(100);
ourPerson.withdrawal(1);

//call @action that is specified inside class Person
// ourPerson.updateFullName("John", "Doe");

export {};
