
export class UrlBuilder {

  private baseUrl: string = ""
  private resourcePath: string = ""
  private parameters: [string, string | number][] = []

  public param(key: string, value: string | number) {
    this.parameters.push([key, value])
    return this
  }

  public base(baseUrl: string) {
    this.baseUrl = baseUrl
    return this
  }

  public resource(resourcePath: string) {
    this.resourcePath = resourcePath
    return this
  }

  public build() {
    const searchParams = new URLSearchParams()
    for (const [key, value] of this.parameters) {
      searchParams.append(key, `${value}`)
    }

    if (searchParams.size)
      return `${this.baseUrl}/${this.resourcePath}?${searchParams.toString()}`
    else
      return `${this.baseUrl}/${this.resourcePath}`
  }

}