import {Box, Button, Paper, Typography} from "@mui/material";
import Search from "./Search.tsx";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {resetParams, setBrands, setOrderBy, setTypes} from "./catalogSlice.ts";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons.tsx";

const sortOptions = [
      {value: 'name', label: 'Alphabetical'},
      {value: 'priceDesc', label: 'Price: High to low'},
      {value: 'price', label: 'Price: Low to high'}
]

type Props = {
    data: { brands: string[]; types: string[]; }
}

export default function Filters({data}: Props) {
      const {orderBy, types, brands} = useAppSelector(state => state.catalog);
      const dispatch = useAppDispatch();

      if (!data?.brands || !data.types) return <Typography>Loading...</Typography>

    return (
          <Box display='flex' flexDirection='column' gap={3}>
                <Paper>
                    <Search/>
                </Paper>
                <Paper sx={{p: 3}}>
                      <RadioButtonGroup 
                          options={sortOptions} 
                          onChange={e => dispatch(setOrderBy(e.target.value))} 
                          selectedValue={orderBy}
                      />
                </Paper>
                <Paper sx={{p: 3}}>
                    <CheckboxButtons 
                        items={data.brands} 
                        checked={brands}
                        onChange={(items: string[]) => dispatch(setBrands(items))}
                    />
                </Paper>
                <Paper sx={{p: 3}}>
                    <CheckboxButtons
                        items={data.types}
                        checked={types}
                        onChange={(items: string[]) => dispatch(setTypes(items))}
                    />
                </Paper>
              <Button onClick={()=> dispatch(resetParams())}>
                  Reset Filters
              </Button>
          </Box>
      )
}