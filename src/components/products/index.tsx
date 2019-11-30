import './index.scss'
import * as React from 'react'
import Axios from 'axios'
import {
    AppBar,
    Toolbar,
    InputBase,
    Badge,
    Container,
    Grid,
    IconButton
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import {Basket} from "../basket";
import {Product} from "../product";

interface IState {
    items: Book[],
    isModalOpen: boolean,
    searchKeys: string[]
}

export class Products extends React.Component<{}, IState> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            items: [],
            isModalOpen: false,
            searchKeys: []
        }
    }

    componentDidMount(): void {
        this.getProducts()
    }

    public render(): JSX.Element {
        return (
            <Container maxWidth={'lg'}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Grid container direction="row" justify='space-between' spacing={2}>
                            <InputBase className={'search-box'} placeholder="Search…"
                                       inputProps={{'aria-label': 'search'}}
                                       onChange={(event) => this.search(event)}/>
                            <IconButton onClick={() => this.setModalStatus(true)}>
                                <Badge badgeContent={this.state.items.filter((item) => item.checked).length}
                                       color="secondary">
                                    <ShoppingBasketIcon/>
                                </Badge>
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
                    {this.filter(this.state.items, this.state.searchKeys).map((item: Book, index: number) =>
                        <Product key={index} item={item} toggleFunction={() => this.toggleBasket(item.isbn)}/>
                    )}
                </Grid>
                {this.state.isModalOpen &&
                <Basket open={this.state.isModalOpen}
                        closeFunction={() => this.setModalStatus(false)}
                        items={this.state.items.filter((item) => item.checked)}/>}
            </Container>
        )
    }

    public getProducts(): void {
        Axios({
            method: 'GET',
            url: 'http://henri-potier.xebia.fr/books'
        }).then(({data}: any) => {
            this.setState({
                items: data
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    public toggleBasket(isbn: string): void {
        this.setState({
            items: this.state.items.map((item) => {
                if (item.isbn === isbn) {
                    item.checked = !item.checked;
                }
                return item;
            }, [])
        })
    }

    public setModalStatus(status): void {
        this.setState({
            isModalOpen: status
        })
    }

    public search(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            searchKeys: event.currentTarget.value.trim().split(' ')
        })
    }

    public filter(items: Book[], query: string[]): Book[] {
        if (!query.length) {
            return items
        }
        return items.filter((item) => {
            let isFound = true;
            query.forEach((key) => {
                const searchRegExp = new RegExp(key, "gi");
                const hasInTitle = searchRegExp.test(item.title);
                isFound = hasInTitle && isFound
            });
            return isFound
        })
    }
}
