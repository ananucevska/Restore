import { Button, Typography, Box } from '@mui/material';
import { Message } from '@mui/icons-material';
import { Product } from '../../app/models/product';
import { useUserInfoQuery } from '../account/accountApi';

type Props = {
    product: Product;
}

export default function DebugMessageButton({ product }: Props) {
    const { data: user, isLoading: userLoading, error: userError } = useUserInfoQuery();

    return (
        <Box sx={{ p: 2, border: '1px solid red', margin: 1 }}>
            <Typography variant="h6" color="error">DEBUG INFO</Typography>
            <Typography>Product ID: {product.id}</Typography>
            <Typography>Product Name: {product.name}</Typography>
            <Typography>Product UserId: {product.userId || 'NULL'}</Typography>
            <Typography>Product Creator: {product.creatorName || 'NULL'}</Typography>
            <Typography>User Loading: {userLoading ? 'true' : 'false'}</Typography>
            <Typography>User Error: {userError ? 'true' : 'false'}</Typography>
            <Typography>User ID: {user?.id || 'NULL'}</Typography>
            <Typography>User Name: {user?.name || 'NULL'}</Typography>
            <Typography>User Email: {user?.email || 'NULL'}</Typography>
            <Button
                variant="contained"
                startIcon={<Message />}
                disabled={!product.userId || !user}
                onClick={() => console.log('Debug button clicked')}
            >
                Debug Message Button
            </Button>
        </Box>
    );
}
