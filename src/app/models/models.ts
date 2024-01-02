
export interface ErrorMessage {
    error: string,
    message: string
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
        console.log("Date :: fromJSON");
        
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

export interface ISession {
    id?: number,
    name: string,
    creationDate?: Date,
    editDate?: Date,
    isPublic: boolean,
    ownerId: number,
    articleInput: string
}

export interface SessionAndOwner {
    session: Session,
    owner: User
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
    ) {}
    
    static emptyOne(userId: number) {
        return new Session(
            undefined,
            "",
            undefined,
            undefined,
            true,
            userId,
            ""
        )
    }

    static fromJSON(json: any) {   
        return new Session(
            json["id"],
            json["name"],
            Date.fromJSON(json["creationDate"]),
            Date.fromJSON(json["editDate"]),
            json["isPublic"],
            json["ownerId"],
            json["articleInput"],
        )
    }

    public getInputTokens() {
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

export class PropValueItem {
    constructor(
        public value: string,
        public text: string,
        public active: boolean,
        public isArtbase: boolean,
    ) { }
    static fromJSON(json: any) {
        return new PropValueItem(
            json["value"],
            json["text"],
            json["active"],
            json["isArtbase"],
        )
    }
};

export interface PropertyAndValueItem {
    propertyItem: PropertyItem,
    propValueItem: PropValueItem
}

export class PropertyItem {

    constructor(
        public property: string,
        public propertyText: string,
        public values: PropValueItem[],
        public active: boolean,
        public pClass: string,
        public program: string,
    ) { }
    
    static fromJSON(json: any) {
        return new PropertyItem(
            json["property"],
            json["propertyText"],
            json["values"].map((item: any) => PropValueItem.fromJSON(item)),
            json["active"],
            json["pClass"],
            json["program"],
        )
    }

    public setAllActive(value: boolean = true) {
        this.active = value
        this.values.forEach(v => v.active = value)
        return this
    }

    public setAllArtbase(value: boolean = true) {
        this.values.forEach(v => v.isArtbase = value)
        return this
    }

    public getActiveValues() {
        return this.values.filter(a => a.active)
    }

    public getArtbaseValues() {
        return this.values.filter(a => a.isArtbase)
    }

    public toString = (): string => {
        return `PropertyItem (${this.property}, ${this.active})`;
    }

    jsonify() {
        return JSON.stringify(this)
    }

}

export class ArtbaseItem {
    constructor(
        public articleNr: string,
        public pClass: string,
        public property: string,
        public value: string,
    ) { }
    static fromJSON(json: any) {
        return new ArtbaseItem(
            json["articleNr"],
            json["pClass"],
            json["property"],
            json["value"],
        )
    }
}


export class ArticleItem {
    constructor(
        public articleNr: string,
        public series: string,
        public program: string,
        public shorttext: string,
        public pClasses: string[] = [],
        public artbaseItems: ArtbaseItem[] = [],
        public artbaseFetched: boolean = false,
        public articleNrAlias: string = articleNr,
        public seen: boolean = false,
        public edited: boolean = false,
        public shorttextEdited = true,
        public articleNrEdited = false,
    ) { }
    static fromJSON(json: any) {
        console.log("Article Item :: fromJSON", json)
         
        console.log("artbaseItems ::", json["artbaseItems"], json["articleNr"], json["program"]);
        
        
        return new ArticleItem(
            json["articleNr"],
            json["series"],
            json["program"],
            json["shorttext"],
            json["pClasses"],
            json["artbaseItems"].map((item: any) => ArtbaseItem.fromJSON(item)),
            json["artbaseFetched"],
            json["articleNrAlias"],
            json["seen"],
            json["edited"]
        )
    }
    jsonify() {
        return JSON.stringify(this)
    }
}

export class PropertyClass {
    constructor(
        public name: PropertyClassString,
        public articleItems: ArticleItem[],
        public seen: boolean = false,
        public edited: boolean = false,
    ) { }
}

type ProgramString = string

type PropertyClassString = string

type ArticleString = string

interface Duplicate {
    articleNr: ArticleString;
    duplicates: ArticleItem[];
}


class PropertyMap extends Map<ProgramString, Map<PropertyClassString, PropertyItem[]>> {

    jsonify(programs: ProgramString[]): Object {
        let json = Object()
        programs.forEach((program: string) => {
            json[program] = {}
            Array.from(this.get(program)!!.keys())!!.forEach((pClass: string) => {
                json[program][pClass] = this.get(program)!!.get(pClass)!!
            })
        })
        return json
    }

}

export class ProgramMap extends Map<ProgramString, Map<PropertyClassString, PropertyClass>> {

    clearEmptyPrograms() {
        const articlePrograms = new Set(this.getAllArticleRefs().map(item => item.program))
        this.getAllPrograms().forEach(p => {
          if (!articlePrograms.has(p)) this.delete(p)
        })
    }

    clearInActivePrograms() {
        this.getAllPrograms().forEach(program => {
            if (!this._isActive.has(program)) {
                this.delete(program)
                this._articleItems.delete(program)
                this._propertyItems.delete(program)
            }            
        })
    }

    private _isActive: Set<ProgramString>

    private _articleItems: Map<ProgramString, Map<ArticleString, ArticleItem>>
    private _propertyItems: PropertyMap

    getArticleItemsMap = () => this._articleItems

    updateWithItems(articleItems: ArticleItem[], propertyItems: PropertyItem[]) {
        this.clear()
        this._propertyItems.clear()
        this._articleItems.clear()
        this._isActive.clear()
        articleItems.forEach(item => {

            // program map 
            if (!this.get(item.program)) this.set(item.program, new Map())
            item.pClasses.forEach(pClass => {
                if (!this.get(item.program)!!.get(pClass)) this.get(item.program)!!.set(pClass,
                    new PropertyClass(pClass, [], false, false))
            })
            
            item.pClasses.forEach(pClass => {
                this.get(item.program)!!.get(pClass)?.articleItems.push(item)
            })

            // _articleItems
            if (!this._articleItems.get(item.program)) this._articleItems.set(item.program, new Map())
            this._articleItems.get(item.program)!!.set(item.articleNr, item)
            
            // _isActive
            this._isActive.add(item.program)
            
            // _propertyItems
            if (!this._propertyItems.get(item.program))
                this._propertyItems.set(item.program, new Map())

        })

        propertyItems.forEach(item => {
            if (!this._propertyItems.get(item.program)) this._propertyItems.set(item.program, new Map())
            if (!this._propertyItems.get(item.program)!!.get(item.pClass)) this._propertyItems.get(item.program)!!.set(item.pClass, [])
            this._propertyItems.get(item.program)!!.get(item.pClass)!!.push(item)

            this.get(item.program)!!.get(item.pClass)!!.seen = true
            this.get(item.program)!!.get(item.pClass)!!.edited = true
             
        })

    }

    constructor(input: any | null = null) {
        super()

        this._isActive = new Set()
        this._articleItems = new Map()
        this._propertyItems = new PropertyMap()

        if (input !== null)
            Object.keys(input!!).forEach((program: ProgramString) => {
                this.set(program, new Map<PropertyClassString, PropertyClass>)
                this._isActive.add(program)

                this._articleItems.set(program, new Map())
                this._propertyItems.set(program, new Map())

                Object.keys(input[program]).forEach((pClass: PropertyClassString) => {
                    this.get(program)!!.set(pClass, new PropertyClass(pClass, []))
                    
                    Array.from(input[program][pClass]).forEach((articleJson: any) => {
                        const articleNr = articleJson["article_nr"]
                        let articleItemRef = this.getArticleRef(program, articleNr)
                        const hasRef = Boolean(articleItemRef)
                        if (!hasRef) {
                            this._articleItems.get(program)?.set(
                                articleNr,
                                new ArticleItem(articleNr, articleJson["series"], program, articleJson["shorttext"])
                            )
                            articleItemRef = this.getArticleRef(program, articleNr)
                        }

                        articleItemRef?.pClasses.push(pClass)
                        this.get(program)!!.get(pClass)?.articleItems.push(articleItemRef!!)
                    })
                })
            })
    }

    jsonify(): Object {
        let json = Object(this.getAllActiveArticleRefs())
        return json
    }

    removeArticleItem(articleItem: ArticleItem) {
        //console.log("removeArticleItem", articleItem);
        // console.log("len1:", this.notUniqueArticles().keys().length);


        articleItem.pClasses.forEach((pClass: string) => {
            const idx = this.get(articleItem.program)!!.get(pClass)!!.articleItems.indexOf(articleItem)
            this.get(articleItem.program)!!.get(pClass)!!.articleItems.splice(idx, 1)
            //console.log("rem@", pClass);

        })
        this._articleItems.get(articleItem.program)!!.delete(articleItem.articleNr)
        // console.log("len2:", this.notUniqueArticles().length);
    }

    groupByArticleString() {
        let groupByArticleNrItems = new Map<ArticleString, ArticleItem[]>()
        this.getAllActiveArticleRefs().forEach((articleItem: ArticleItem) => {
            const k = articleItem.articleNr
            if (!groupByArticleNrItems.has(k))
                groupByArticleNrItems.set(k, [])
            groupByArticleNrItems.get(k)!!.push(articleItem)
        })
        return groupByArticleNrItems
    }

    notUniqueArticles(): Duplicate[] {
        /*
        returns a list of duplicates.
        Every duplicate consists of key ArticleString and its 2 or more duplicates as type ArticleItem
        */

        let a = Array.from(this.groupByArticleString().entries()).filter((x) => x[1].length > 1)
            .map(x => <Duplicate>{
                articleNr: x[0],
                duplicates: x[1]
            })

        return a.sort((a: Duplicate, b: Duplicate) => {
            if (a.articleNr > b.articleNr)
                return 1
            if (a.articleNr < b.articleNr)
                return -1
            return 0
        })
    }

    jsonifyProperties(): Object {
        return this._propertyItems.jsonify(this.getActivePrograms())
    }

    setPropItems(program: string, pClass: string, propItems: PropertyItem[]) {
        return this._propertyItems.get(program)!!.set(pClass, propItems)
    }

    getPropItems(program: string, pClass: string): PropertyItem[] | undefined {
        return this._propertyItems.get(program)?.get(pClass)
    }

    getArticleRef(program: string, articleNr: string): ArticleItem | undefined {
        return this._articleItems.get(program)?.get(articleNr)
    }

    getAllActiveArticleRefs(): ArticleItem[] {
        return this.getActivePrograms().flatMap((program: string) => Array.from(this._articleItems.get(program)!!.values()))
    }

    getAllArticleRefs(): ArticleItem[] {
        let refs: ArticleItem[] = []
        
        Array.from(this._articleItems.keys()).forEach(program => {
            refs = [...refs, ...this._articleItems.get(program)!!.values()]
        })
        return refs
    }

    isActive(program: ProgramString) {
        return this._isActive.has(program)
    }

    toggleActive(program: ProgramString) {
        this._isActive.has(program) ? this._isActive.delete(program) : this._isActive.add(program)
    }

    override set(key: string, value: Map<string, PropertyClass>): this {
        this._isActive.add(key)
        return super.set(key, value)
    }

    override delete(key: string): boolean {
        this._isActive.delete(key)
        return super.delete(key)
    }

    getPropClassesFromProgram(program: string): PropertyClass[] {
        return Array.from(this.get(program)!!.values())
    }

    getPropClass(program: string, pClass: string): PropertyClass | undefined {
        return this.get(program)?.get(pClass)
    }

    getArticlesFromPropClass(program: string, pClass: string): ArticleItem[] | undefined {
        return this.get(program)?.get(pClass)?.articleItems
    }


    getActivePrograms(): ProgramString[] {
        return Array.from(this.keys()).filter((program: ProgramString) => this.isActive(program)).sort(Utils.stringSorter)
    }

    getAllPrograms() {
        return Array.from(this.keys())
    }

    

}