type ScreenMsgsType = {
    show: boolean,
    msg: string | Msg
}

type Msg = {
    msg: string, 
    words: Word[]
}

export type Word = {
    word: string, 
    length: string
}

export default ScreenMsgsType