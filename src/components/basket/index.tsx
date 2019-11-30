import './index.scss'
import * as React from 'react'
import Axios from 'axios'
import {
    Modal,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Container
} from '@material-ui/core';

interface IProps {
    open: boolean,
    closeFunction: () => void
    items: Book[]
}

interface IState {
    newTotal: number
}

export class Basket extends React.Component<IProps, IState> {

    public constructor(props: IProps) {
        super(props);
        this.state = {
            newTotal: null
        }
    }

    componentDidMount(): void {
        !!this.props.items.length && this.getOffers(this.props.items.map((item) => item.isbn).join(','));
    }

    public render(): JSX.Element {
        return (
            <Modal open={this.props.open}
                   onClose={this.props.closeFunction}
                   className='basket'>
                <Container maxWidth={'md'}>
                    <Paper>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Count</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.items.map((item: Book, index: number) =>
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {item.title}
                                        </TableCell>
                                        <TableCell align="center">{1}</TableCell>
                                        <TableCell align="right">{item.price}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell component="th" scope="row">TOTAL</TableCell>
                                    <TableCell align="center">{this.props.items.length}</TableCell>
                                    <TableCell align="right">
                                    <span className={`total ${this.state.newTotal ? 'has-new-total' : ''}`}>
                                        {this.props.items.reduce((total, item) => item.price + total, 0)} €
                                    </span>
                                        {this.state.newTotal &&
                                        <span className='new-total'>{this.state.newTotal} €</span>}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </Modal>
        )
    }

    public getOffers(isbnList: string): void {
        Axios({
            method: 'GET',
            url: `http://henri-potier.xebia.fr/books/${isbnList}/commercialOffers`
        }).then(({data}: any) => {
            console.log(data);
            this.getBestOffer(data.offers)
        }).catch((error) => {
            console.log(error)
        })
    }

    public getBestOffer(offers: Offer[]): void {
        const total = this.props.items.reduce((total, item) => item.price + total, 0);
        let prices = [total];
        offers.map((offer) => {
            if (offer.type === 'percentage') {
                prices = [...prices, total * (100 - offer.value) / 100];
            } else if (offer.type === 'minus') {
                prices = [...prices, total - offer.value];
            } else if (offer.type === 'slice' && total > offer.sliceValue) {
                prices = [...prices, total - Math.floor(total / offer.sliceValue) * offer.value];
            }
        });
        this.setState({
            newTotal: prices.sort((a, b) => a - b)[0]
        })
    }
}
