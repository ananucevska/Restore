import { Product } from "../../app/models/product"
import {Box} from "@mui/material";
import ProductCard from "./ProductCard";

type Props = {
    products: Product[]
}
export default function ProductList({products}: Props) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'flex-start'
            }}
        > 
            {products.map((product) => (
                <Box 
                    key={product.id}
                    sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 20px)' },
                        flexShrink: 0
                    }}
                >
                    <ProductCard product={product}/>
                </Box>
            ))}
        </Box>
    )
}