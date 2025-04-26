import { configureStore } from "@reduxjs/toolkit";

import searchSlice from "./course/search-slice";

const store = configureStore({
    reducer: {


        CourseSearch: searchSlice,



    },
});

export default store;