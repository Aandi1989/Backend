class SuperUser {

    constructor( name) {
      this.name = name;
    }
  
    sayHi() {
      alert(this.name);
    }
  
}

export class User {
    constructor(
        login,
        email,
        passwordHash,
        passwordSalt,
        recoveryCode
    ) {
        this._id = new ObjectId(),
        this.accountData = {
            id: (+new Date()).toString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        },
        this.codeRecoveryInfo = {
            recoveryCode: '',
            expirationDate: new Date(),
            isConfirmed: false
        }
    }; 
}

/* in Type Script 
export class User {
    constructor ( public _id: ObjectId,
                  public userName: string,
                  public bio: string,
                  public addedAt: Date,
        ){}
}

let user = new User (new ObjectId(), 'Alex', 'Some bio', new Date)

class Person {
    name: string;
    constructor(name: string, age: number){
        this.name = name;
    }
}
*/ 