export const countComment = (kids: Array<unknown>) => {
  if (kids?.length <= 1)
    return `${kids?.length} Comment`
  else if (kids?.length >= 1)
    return `${kids?.length} Comments`
  else return '0 Comment'
}

export const getDomainName = (url: string) => {
  if (url) {
    const spUrl = url.split('/')
    if (spUrl.length >= 3)
      return spUrl[2]
  }
  return ''
}
