import path from 'path'
import { pathToFileURL } from 'url'

/**
 * ESM compatible relative file loader!
 */
export function getFilePath(filePath) {
  const __dirname = pathToFileURL(import.meta.url).toString().split(':')[1];
  // console.log('__dirname', __dirname)
  const dataPath = path.resolve('..', filePath)
  // console.log('dataPath', dataPath)
  return dataPath
}
