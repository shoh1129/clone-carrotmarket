export function cls(...className: string[]) {
  return className.join(' ');
}

export function getImageURL(id?: string, variants: string = 'public') {
  return `https://imagedelivery.net/7YEOC-sszDtWwnzxJoZssA/${id}/${variants}`
}

export function getBulrImageURL() {
  return getImageURL('8d6f0802-ffee-41bf-809f-235bbc2a9c00', 'blur');
}