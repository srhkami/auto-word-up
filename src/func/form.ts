export default function showFormError(err: any, setError: any) {
  console.log(err);
  const errorData = err.response.data; //取得後端回傳的錯誤訊息
  for (const [key, value] of Object.entries(errorData)) {
    setError(key, {message: value})
  }
}