import {showToast} from "@/func";

export default function copyText(text: string) {
  showToast(
    navigator.clipboard.writeText(text),
    {
      success: '複製成功',
      error: '複製失敗'
    }
  ).catch(err => console.error(err,'複製文字錯誤'));
}