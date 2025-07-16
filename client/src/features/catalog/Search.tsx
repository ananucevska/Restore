import {debounce, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {setSearchTerm} from "./catalogSlice.ts";
import {useEffect, useState} from "react";

export default function Search() {
    const {searchTerm} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    //search not after every letter but when user stops typing
    const [term, setTerm] = useState(searchTerm); // store value of input in local component state
    
    useEffect(() => {
        setTerm(searchTerm)
    }, [searchTerm]);
    
    const debouncedSearch = debounce(event => {
        dispatch(setSearchTerm(event.target.value))
    }, 500);
  return (
      <TextField
          label='Search Products'
          variant="outlined"
          fullWidth
          type='search'
          value={term}
          onChange={e => {
              setTerm(e.target.value)
              debouncedSearch(e);
          }}
      />
  )
}