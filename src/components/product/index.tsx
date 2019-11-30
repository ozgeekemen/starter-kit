import './index.scss'
import * as React from 'react'
import {
    Grid,
    IconButton,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    CardActions
} from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';

interface IProps {
    item: Book,
    toggleFunction: () => void
}

export const Product: React.FunctionComponent<IProps> = ({item, toggleFunction}) => {
    return (
        <Grid className={'product'} item xs={3}>
            <Card>
                <CardHeader title={item.title} subheader={`${item.price}€`}/>
                <CardMedia className="product-cover" image={item.cover} title={item.title}/>
                <CardContent>
                    <Typography className="product-snippet" variant="body2" color="textSecondary" component="p">
                        {item.synopsis[0]}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        aria-expanded={false}
                        aria-label="add to shopping cart"
                        color={item.checked ? "primary" : "secondary"}
                        onClick={toggleFunction}>
                        {!item.checked && <AddShoppingCartIcon/>}
                        {item.checked && <RemoveShoppingCartIcon/>}
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    )
};
