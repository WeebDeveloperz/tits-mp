export class Subject {
  constructor() {
    this.id = null;
    this.code = "";
    this.name = "";
    this.sem = 0;
    this.branch = "";
  }
}

export class File {
  constructor() {
    this.id = null;
    this.subject = new Subject();
    this.name = "";
    this.path = "";
  }
}
