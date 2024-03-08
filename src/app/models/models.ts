

export interface ErrorMessage {
    error: string,
    message: string
}

export interface IArticleProgramTuple {
    article: string,
    program: string
  }

export interface IArticleDuplicate {
    article_nr: string,
    series: string,
    sql_db_program: string,
    ocd_artshorttext: string
}

export interface IDate {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
}

export class Date implements IDate {
    constructor(
       public year: number,
       public month: number,
       public day: number,
       public hour: number,
       public minute: number,
       public second: number,
    ) {}
    
    getYearMonthDay() {
        const day = this.day > 9 ?  `${this.day}`: `0${this.day}`
        const month = this.month > 9 ?  `${this.month}`: `0${this.month}`  
        return `${day}.${month}.${this.year}`
    }

    getHourMinSec() {
        const hour = this.hour > 9 ?  `${this.hour}`: `0${this.hour}`
        const minute = this.minute > 9 ?  `${this.minute}`: `0${this.minute}` 
        const second = this.second > 9 ?  `${this.second}`: `0${this.second}`  
        return `${hour}:${minute}:${second}`
    }

    static fromJSON(json: any) {
        return new Date(
            json["year"],
            json["month"],
            json["day"],
            json["hour"],
            json["minute"],
            json["second"],
        )
    }
}


export interface SessionAndOwner {
    session: Session,
    owner: User
}

export interface ISession {
    id?: number,
    name: string,
    creationDate?: Date,
    editDate?: Date,
    isPublic: boolean,
    ownerId: number,
    articleInput: string
}

export class Session implements ISession {
    constructor(
        public id: number | undefined,
        public name: string,
        public creationDate: Date | undefined,
        public editDate: Date | undefined,
        public isPublic: boolean,
        public ownerId: number,
        public articleInput: string,
        //public editUserId: number,
    ) {}
    
    static emptyOne(userId: number) {
        return new Session(
            undefined,
            "",
            undefined,
            undefined,
            true,
            userId,
            "",
            //userId
        )
    }

    static fromJSON(json: any) {   
        return new Session(
            json["id"],
            json["name"],
            Date.fromJSON(json["creation_date"]),
            Date.fromJSON(json["edit_date"]),
            json["is_public"],
            json["owner_id"],
            json["article_input"],
            //json["editUserId"],
        )
    }

    public getInputTokens(): string[] {
        const regex: RegExp = /[ ;\r?\n]+/
    
        let tokens = this.articleInput.split(regex)
        if (tokens.length > 0) {
          if (tokens[0] == "")
            tokens.splice(0, 1)
          if (tokens.length > 0) {
            if (tokens[tokens.length - 1] == "")
              tokens.splice(tokens.length - 1, 1)
          }
        }
        return tokens
      }
}


export interface User {
    id?: number,
    email: string,
    name: string,
    creationDate?: Date,
    editDate?: Date
}

class Utils {
   static stringSorter(a: string, b: string) {
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    }
}
 
   