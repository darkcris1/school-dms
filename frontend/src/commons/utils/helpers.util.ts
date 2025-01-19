import dayjs from "dayjs";

export const objIsEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
}

export function removeTrailingSlash(url: string) {
  // Split the URL into the path and query parts
  const [path, query] = url.split('?');

  // Remove the trailing slash from the path if it exists
  const newPath = path.endsWith('/') ? path.slice(0, -1) : path;

  // Reconstruct the URL
  return query ? `${newPath}?${query}` : newPath;
}

export const isImage = (url: string)=> {
  return /[\/.](webp|jpg|jpeg|png|svg|gif|heic|heif)$/i.test(url)
}

export const isVideo = (url: string)=> {
  return /[\/.](mkv|mov|mp4|webm|avi|swf|mog|ogg|m4v|hevc)$/i.test(url)
}

export function isDocs(str: string){
  const DOCS_EXT = ['docx','odt','doc']
  return DOCS_EXT.includes(str.split('.').pop()?.toLowerCase() || '') 
}

export function isPDF(str: string){
  const PDF_EXT = ['pdf']
  return PDF_EXT.includes(str.split('.').pop()?.toLowerCase() || '') 
}


export async function pathToFile(path: string, fileName: string){
  const blob = await fetch(path).then(r => r.blob());
  return new File([blob], fileName, { type: blob.type });
}

export async function getBase64ImageFromUrl(imageUrl: string) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject('error');
    };
    reader.readAsDataURL(blob);
  })
}

export const objectToFormData = (data: any)=> {
  const toFormData = ((f) => f(f))(
    (h: any) => (f: any) => f((x: any) => h(h)(f)(x))
  )((f: any) => (fd = new FormData()) => (pk: any) => (d: any) => {
    if (d instanceof Object) {
      Object.keys(d).forEach((k) => {
        const v = d[k];
        if (pk) k = `${pk}[${k}]`;
        if (v instanceof Object && !(v instanceof Date) && !(v instanceof File)) {
          return f(fd)(k)(v);
        } else {
          fd.append(k, v ?? "");
        }
      });
    }
    return fd;
  })()();

  return toFormData(data)
}

export function dataURLtoFile(dataurl: string, filename: string): File {
  const [header, base64Data] = dataurl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || '';

  // Decode base64 to binary string
  const binaryString = atob(base64Data);
  const length = binaryString.length;

  // Create a Uint8Array to hold the binary data
  const uint8Array = new Uint8Array(length);

  // Fill the Uint8Array with the binary string data
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the Uint8Array
  const blob = new Blob([uint8Array], { type: mime });

  // Return a new File object from the Blob
  return new File([blob], filename, { type: mime });
}


export const capitalize = (s: string): string => {
  return s
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function isString(str: any){
    return typeof str === 'string' || str instanceof String;
}

export function timeFormat(str: any){
  if (isString(str)) {
    console.log('1/1/1991 '+ str)
    return dayjs('1/1/1991 '+ str).format('H:mm')
  }

  return dayjs(str).format('H:mm')
}