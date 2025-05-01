import { Product } from "../../models/product";
import ProductList from "./ProductList";
import {useEffect, useState} from "react";
export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5004/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);
    
    return (
        <>
            <ProductList products={products}></ProductList>
        </>
   )
}