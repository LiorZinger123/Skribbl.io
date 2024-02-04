import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface userInfoState {
    username: string,
    room: string
}

const initialState: userInfoState = {
    username: '',
    room: ''
}

export const userInfoSlice = createSlice({
    name: 'userInfoReducer',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setRoomId: (state, action: PayloadAction<string>) => {
            state.room = action.payload
        }
    }
})

export default userInfoSlice.reducer
export const { setUsername, setRoomId } = userInfoSlice.actions