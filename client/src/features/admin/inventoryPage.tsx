import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {useGetMyProductsQuery} from "./adminApi.ts";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination.tsx";
import {setPageNumber} from "../catalog/catalogSlice.ts";
import {useState} from "react";
import ProductForm from "./ProductForm.tsx";
import {Product} from "../../app/models/product.ts";
import {useDeleteProductMutation} from "./adminApi.ts";

export default function inventoryPage() {
    const productParams = useAppSelector(state => state.catalog);
    const {data, refetch, isLoading, error} = useGetMyProductsQuery(productParams);
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteProduct] = useDeleteProductMutation();
    
    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditMode(true);
    }
    
    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            refetch();
        } catch (error) {
            console.log(error);
        }
    }
    
    if (editMode) return <ProductForm 
        setEditMode={setEditMode} 
        product={selectedProduct}
        refetch={refetch}
        setSelectedProduct={setSelectedProduct}
    />
    
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading products</div>
    
    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Typography sx={{p: 2}} variant="h4">Inventory</Typography>
                <Button onClick={() => setEditMode(true)} sx={{m: 2}} size="large" variant='contained'>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.items && data.items.length > 0 ? data.items.map((product: Product) => (
                            <TableRow 
                                key={product.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0}
                                }}
                            >
                                <TableCell component='th' scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="left">
                                    <img 
                                        src={product.pictureUrl} 
                                        alt={product.name}
                                        style={{height: 50, width: 50, marginRight: 10, verticalAlign: 'middle'}}
                                    />
                                    {product.name}
                                </TableCell>
                                <TableCell align="center">{product.type}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => handleSelectProduct(product)} startIcon={<Edit />} />
                                    <Button onClick={() => handleDeleteProduct(product.id)} startIcon={<Delete />} color="error" />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1">No products found. Create your first product!</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Box sx={{p: 3}}>
                    {data?.pagination && data.items.length > 0 && (
                        <AppPagination
                            metadata={data.pagination}
                            onPageChange={(page: number) => dispatch(setPageNumber(page))}
                        />
                    )}
                </Box>
            </TableContainer>
        </>
    );
}
