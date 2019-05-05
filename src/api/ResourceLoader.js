class ResourceLoader {
  load = path => {
    return `${process.env.REACT_APP_HOST}/bucket/${path}`
  }
}

export default new ResourceLoader()
