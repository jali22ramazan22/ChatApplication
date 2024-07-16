export function computeImgPath(imgPath: string, fullPath?: string): string {

  if(!imgPath.endsWith('.png')){
    if(!imgPath.endsWith('.jpg')){
      imgPath += '.png';
    }
  }
  if(fullPath == null || fullPath === '') {
    return 'assets/img/' + imgPath;
  }
  if(fullPath.endsWith('/')) {
    return fullPath + imgPath;
  }

  return fullPath + '/' + imgPath
}
