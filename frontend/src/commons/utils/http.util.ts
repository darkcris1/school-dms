/* transform a list of strings into url path
 * separated by trailing slash
 */

import { objIsEmpty } from "./helpers.util";

export let urlEncode = (params: any[] = [], queries: any = {}): string => {
  params = params.map((param) => param.toString().replace(/\/$/, ''));
  return encodeURL(params.join('/') + '/', queries);
};
/* transform an object data into URLencoded string
  */
export let encodeURL = (url: string, data: any): string => {

  if (objIsEmpty(data)) { return url }

  for (let key in data){
    data[key] ?? delete data[key]
  } 
  let params = new URLSearchParams(data);

  return `${url}?${params.toString()}`;
}


export const queryChanger = (obj?: any, pushState=false)=> {
  const href = new URL(location.href);
  obj && Object.keys(obj).forEach(key=>{
    const item = obj[key]
    if (item === '' || item === null || item === undefined || (Array.isArray(item) && !item.length)) {
      href.searchParams.delete(key)
      return
    } 
    href.searchParams.set(key,encodeURI(obj[key]))
  })

  if (pushState) {
    history.pushState({},"",href.toString())
  }else {
    history.replaceState(null,"",href.toString())
  }
}