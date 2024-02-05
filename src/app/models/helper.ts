




export function getShortTextFromArticle(article: any): string {
  console.log("getShortTextFromArticle", article);
  
    if (article["kurztext"]) 
      return article["kurztext"]["text"]
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
