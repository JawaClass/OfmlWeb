
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
        public seen: boolean = false
    ) { }
    static fromJSON(json: any) {
        return new ArticleItem(
            json["articleNr"],
            json["series"],
            json["program"],
            json["shorttext"],
            json["pClasses"],
            json["artbaseItems"].map((item: any) => ArtbaseItem.fromJSON(item)),
            json["artbaseFetched"],
            json["articleNrAlias"],
            json["seen"]
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

    private _isActive: Set<ProgramString>

    private _articleItems: Map<ProgramString, Map<ArticleString, ArticleItem>>
    private _propertyItems: PropertyMap

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
        return Array.from(this.keys()).filter((program: ProgramString) => this.isActive(program))
    }

    getAllPrograms() {
        return Array.from(this.keys())
    }


}