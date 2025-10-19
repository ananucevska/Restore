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
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    
    // Function to translate type to Macedonian
    const translateType = (type: string) => {
        const typeParts = type.split(' - ');
        if (typeParts.length === 3) {
            // Format: "Category - Subcategory - Tag"
            const [category, subcategory, tag] = typeParts;
            return `${translateCategory(category)} - ${translateSubcategory(subcategory)} - ${translateTag(tag)}`;
        } else if (typeParts.length === 2) {
            // Format: "Category - Subcategory"
            const [category, subcategory] = typeParts;
            return `${translateCategory(category)} - ${translateSubcategory(subcategory)}`;
        } else {
            // Format: "Category"
            return translateCategory(type);
        }
    };
    
    const translateCategory = (category: string) => {
        switch (category) {
            case 'Furniture': return 'Мебел';
            case 'Appliances & Electronics': return 'Апарати и електроника';
            case 'Sports & Outdoors': return 'Спорт и надворешни активности';
            case 'Books & Media': return 'Книги и медиуми';
            case 'Baby & Kids': return 'Бебиња и деца';
            case 'Clothing & Accessories': return 'Облека и додатоци';
            case 'Technology & Electronics': return 'Технологија и електроника';
            case 'Home & Garden': return 'Дом и градина';
            case 'Health & Beauty': return 'Здравје и убавина';
            case 'Automotive': return 'Автомобили';
            default: return category;
        }
    };
    
    const translateSubcategory = (subcategory: string) => {
        switch (subcategory) {
            case 'Chairs': return 'Столици';
            case 'Tables': return 'Маси';
            case 'Sofas': return 'Каучи';
            case 'Beds': return 'Кревети';
            case 'Wardrobes': return 'Гардеробери';
            case 'Shelves': return 'Полици';
            case 'Kitchen Appliances': return 'Кујнски апарати';
            case 'Home Electronics': return 'Домашна електроника';
            case 'Exercise Equipment': return 'Спортска опрема';
            case 'Bicycles': return 'Велосипеди';
            case 'Camping Gear': return 'Камп опрема';
            case 'Books': return 'Книги';
            case 'Movies & TV': return 'Филмови и ТВ';
            case 'Music': return 'Музика';
            case 'Toys': return 'Играчки';
            case 'Strollers': return 'Колички';
            case 'Cribs': return 'Кревети за бебе';
            case 'Kids Clothes': return 'Детска облека';
            case 'Baby Clothes': return 'Бебешка облека';
            case 'Clothing': return 'Облека';
            case 'Shoes': return 'Чевли';
            case 'Bags': return 'Торби';
            case 'Accessories': return 'Додатоци';
            case 'Computers': return 'Компјутери';
            case 'Phones': return 'Телефони';
            case 'Audio': return 'Аудио';
            case 'TV': return 'ТВ';
            case 'Garden Tools': return 'Градинарски алатки';
            case 'Plants': return 'Растенија';
            case 'Outdoor Furniture': return 'Надворешен мебел';
            case 'Skincare': return 'Нега на кожата';
            case 'Makeup': return 'Шминка';
            case 'Hair Care': return 'Нега на косата';
            case 'Cars': return 'Автомобили';
            case 'Motorcycles': return 'Мотоцикли';
            case 'Auto Parts': return 'Авто делови';
            default: return subcategory;
        }
    };
    
    const translateTag = (tag: string) => {
        switch (tag) {
            case 'Male': return 'машки';
            case 'Female': return 'женски';
            default: return tag;
        }
    };
    
    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditMode(true);
    }
    
    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        
        try {
            await deleteProduct(productToDelete.id);
            refetch();
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };
    
    if (editMode) return <ProductForm 
        setEditMode={setEditMode} 
        product={selectedProduct}
        refetch={refetch}
        setSelectedProduct={setSelectedProduct}
    />
    
    if (isLoading) return <div>Се вчитува...</div>
    if (error) return <div>Грешка при вчитување на производите</div>
    
    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Button onClick={() => setEditMode(true)} sx={{mb: 2, mt: 4}} size="large" variant='contained'>Додај нов производ</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Производ</TableCell>
                            <TableCell align="center">Тип</TableCell>
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
                                <TableCell align="center">{translateType(product.type)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Уреди производ">
                                        <Button onClick={() => handleSelectProduct(product)} startIcon={<Edit />} />
                                    </Tooltip>
                                    <Tooltip title="Избриши производ">
                                        <Button onClick={() => handleDeleteClick(product)} startIcon={<Delete />} color="error" />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1">Немате додадено производи</Typography>
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
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Избриши го производот
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description">
                        Дали сте сигурни дека сакате да го избришете производот <strong>{productToDelete?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Откажи
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Избриши
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
