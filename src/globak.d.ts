/* 自訂的全局類別，用來定義API接口格式 */
declare global {
  interface Window {
    pywebview: {
      updateProgress: (progress: number) => void,
    }
  }
}