import useStartMsg from "../ScreenMsgsHooks/StartMsg/useStartMsg"
import useStartTurnMsgs from "../ScreenMsgsHooks/StartTurnMsgs/useStartTurnMsgs"
import useScoresMsg from "../ScreenMsgsHooks/ScoresMsg/useScoresMsg"
import useEndMsg from "../ScreenMsgsHooks/EndMsg/useEndMsg"

const ScreenMsgsFunctions = () => {
  
    useStartMsg()
    useStartTurnMsgs()
    useScoresMsg()
    useEndMsg()

    return (
    <></>
  )
}

export default ScreenMsgsFunctions