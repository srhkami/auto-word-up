export type Response<T> = {
  status: number,
  message: string,
  data: T,
}

export type VersionCheckData = {
  app_version: string,
  whats_new: string,
  download_link: string,
}

export type TVersionObject = {
  version: string,
  date: string,
  logs: Array<{ color: 'new' | 'info' | 'fix', text: string }>,
}

export type base64Image = {
  base64: string,
  width: number,
  height: number,
  remark: string,
  rotation?: 0 | 90 | 180 | 270,
}