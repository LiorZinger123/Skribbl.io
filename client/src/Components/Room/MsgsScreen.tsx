import { useEffect, useState } from "react"

const MsgsScreen = () => {

  const [msg, setMsg] = useState<string>('')

  useEffect

  return (
    <div>{msg}</div>
  )
}

export default MsgsScreen