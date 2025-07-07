
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product"
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {useAddBasketItemMutation} from "../basket/basketApi";
import {currencyFormat} from "../../lib/util.ts";

type Props = {
    product: Product
}
export default function ProductCard({product}: Props) {
    const [addBasketItem, {isLoading}] = useAddBasketItemMutation();
    return (
        <Card elevation={3} 
              sx={{width: 280, 
                   borderRadius: 2,
                   display: "flex", 
                   flexDirection: "column", 
                   justifyContent: "space-between"
              }}
        >
            <CardMedia sx={{height: 240, backgroundSize: "cover"}}
                       image={product.pictureUrl}
                       title={product.name}
            />
            <CardContent>
                <Typography 
                    gutterBottom 
                    sx={{textTransform: 'uppercase'}}
                    variant="subtitle2"
                >
                    {product.name}
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{color: 'secondary.main'}}
                >
                    {currencyFormat(product.price)}
                </Typography>
            </CardContent>
            <CardActions 
                sx={{justifyContent: "space-between"}}
            >
                <Button 
                    disabled={isLoading} //go limitira na 1 klik add to cart, dava loading na vtor i poise
                    onClick={() => addBasketItem({product, quantity: 1})} //product: product ne treba ako se so isto ime moze samo product
                >Add to cart</Button>
                <Button component={Link} to={`/catalog/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}