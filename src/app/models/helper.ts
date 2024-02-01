




export function getShortTextFromArticle(article: any): string {
    if (article["kurztext"].length) 
      return article["kurztext"][0]["text"]
    else 
        return ""
  }

  export function getLongTextFromArticle(article: any): string[] {
    if (article["langtext"].length) 
      return article["langtext"].map((line: any) => line["text"])
    else
        return []
  }

  export function getTextFromProperty(property: any): string {
    if (property["text"]) 
      return property.text.text
    else
        return ""
  }
