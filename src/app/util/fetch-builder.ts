
export class FetchBuilder {

  private _url: string = ""
  private _options: any = null
  private _throwError: boolean = false

  public throwError(_throwError: boolean) {
    this._throwError = _throwError
    return this
  }

  public url(_url: string) {
    this._url = _url
    return this
  }

  public options(_options: any) {
    this._options = _options
    return this
  }

  public build() {
    return {
      url: this._url,
      options: this._options,
      throwError: this._throwError,
    }
  }

}