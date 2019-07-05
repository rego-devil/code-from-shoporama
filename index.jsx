import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {store} from './redux/store';
import {Provider} from 'react-redux';

import DashboardSideMenu from 'scenes/Shops/components/DashboardSideMenu';
import ProductList from './components/ProductList';

import styles2 from '../AddProductStyles.scss';

import TopBar from 'scenes/Shops/components/TopBar';


class ViewProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: true,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({menuOpen: !this.state.menuOpen});
  }

  render() {
    const {user, products} = this.props;
    const loading = false;

    return (
      <div className="sorSellerDashboard">

        <Grid>
          <TopBar showCancel={false} showSave={true} saveText="Nuovo Prodotto" user={user} onSave={() => {
            window.location = '/negozio/prodotti/aggiungi';
          }} />
          <Row>
            <Col md={3} lg={3} smHidden xsHidden>
              <DashboardSideMenu activePage="products" isVisible={this.state.menuOpen} routePath={this.props.routePath} />
            </Col>
            {/* quick style fix */}
            <Col md={9} lg={9} xs={12} sm={12} className={`${styles2.border}`} >

              <div className="row visible-xs visible-sm"> 
                <div className="col-xs-12 col-sm-12 ">
                  <a href="/negozio/dashboard" className={`sorSellerBackLink`} title="torna alla dashboard" >
                    <i className="fa fa-angle-left"></i> Indietro
                  </a>
                </div>
              </div>

              
              <h1 className={`sorH1 sorFontopenSans`}>I tuoi prodotti</h1>
              { 
                (products && products.length > 0) ? (
                  <ProductList
                    products={products}
                    loading={loading}
                    onDelete={this.deleteProduct}
                    onDublicate={this.dublicateProduct}
                  />
                ) : <a href="/negozio/prodotti/aggiungi" className={styles2.button}>Aggiungi prodotto</a>
              }

            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}


const addProviderHOC = (WrappedComponent) => {
  return (props) => (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  )
}

export default addProviderHOC(ViewProducts)