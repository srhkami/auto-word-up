import {TVersionObject} from "@/lib/type.ts";

export const CHANGELOG_LIST: Array<TVersionObject> = [
  {
    version: '1.0.0',
    date: '1150101',
    logs: [
      {color: "new", text: '完成基礎功能'},
    ]
  },
]

export const AppVersion = CHANGELOG_LIST[0].version
export const AppVersionText = `${CHANGELOG_LIST[0].version}（${CHANGELOG_LIST[0].date}）`