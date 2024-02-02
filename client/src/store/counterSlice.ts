import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface InfoState {
    username: string,
    room: string
}

const initialState: InfoState = {
    username: '',
    room: ''
}