/* 通用類型 */
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

/* 應用程式類型 */

export type Step = 1 | 2 | 3 | 4

export type Profile = {
  uid: string,
  token: string,
  client: string,
}

export type WordResult = {
  word: string,
  translations: string,
  description: string,
  sentences: string,
}

export type CreateCardsResponse = {
  deck_id: string,
  success_words: Array<string>,
  failed_words: Array<string>,
}