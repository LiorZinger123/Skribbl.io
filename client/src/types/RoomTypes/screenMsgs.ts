export type Msg = {
    msg: string, 
    words?: Word[]
}

export type Word = {
    word: string, 
    length: string
}

export type score = {
    username: string,
    score: number
}