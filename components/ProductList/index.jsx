import React from 'react';
import _ from 'lodash';
import { reduxForm, getFormValues, getFormSubmitErrors, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { sorting } from 'utils/utils';
import { removeItemAction, updateQuantityAction, dublicateItemAction, initializeDataAction, saveListOrderAction } from '../../redux/actions';

import DragAndDropList from './components/DragAndDropList';
import ProductListHeader from './components/ProductListHeader';

import { DUBLICATE_PROPERTIES } from './dublicate-properties';
import { TABLE_COLUMNS } from './table-colomns';

import ConfirmModal from 'components/ConfirmModal';
import DublicateModalContent from './components/DublicateModalContent';
import Pagination from 'components/Pagination';


class ProductList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalDeleteState: false,
      modalDublicateState: false,
      selectedProduct: undefined,
      productList: this.props.products,
      sortOrderColumns: TABLE_COLUMNS,
      dublicationFields: null,
      paginationValues: {
        currentPage: 1,
        countPerPage: 5,
        totalPages: Math.ceil(this.props.products.length / 5)
      },
    }
  }


  componentWillMount() {
    this.props.initializeData(this.props.products);
  }

  initializeFormElements = () => {
    const { productList } = this.state;
    let initData = productList.reduce((res, el, index) => ({
      ...res,
      ['quantity_' + el.id]: el.num_in_stock || '1',
      ['is_active_' + el.id]: el.is_active
    }), {});

    initData = DUBLICATE_PROPERTIES.reduce((res, el) => ({
      ...res,
      ['toogle_' + el.id]: true
    }), initData)

    this.props.initialize(initData);
  }

  mappingForProductList = (productList, sortOrdesIDs) => {
    if (!sortOrdesIDs || _.isEmpty(sortOrdesIDs)) return false;

    return sortOrdesIDs.map((item) => productList.find(obj => obj.id === item));
  }

  handleChangeListOrder = (e) => {
    const { productList, paginationValues: { currentPage, countPerPage } } = this.state;

    const { removedIndex, addedIndex, payload } = e;

    const result = [...productList];

    if (removedIndex === null && addedIndex === null) return false;

    let itemToAdd;
    const removeGlobalIndex = (currentPage - 1) * countPerPage + removedIndex;
    const addedGlobalIndex = (currentPage - 1) * countPerPage + addedIndex;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removeGlobalIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedGlobalIndex, 0, itemToAdd);
    }

    this.props.saveListOrder({ id: result[removeGlobalIndex].id, position: result[addedGlobalIndex].position });

    this.setState({ productList: result })
  }

  handleSortProductList = (index, sortItem) => {
    const { sortOrderColumns, productList } = this.state;

    let currentSortMethod;

    switch (sortItem['sortOrder']) {
      case 'default':
        currentSortMethod = 'asc';
        break;
      case 'asc':
        currentSortMethod = 'desc';
        break;
      case 'desc':
        currentSortMethod = 'asc';
        break;
      default:
        currentSortMethod = 'asc';
    }

    const changedColumns = sortOrderColumns.map((item, i) => ({
      ...item, sortOrder: i === index ? currentSortMethod : 'default'
    }));

    const newProductList = [...productList];
    this.sortColumn(newProductList, changedColumns);

    this.setState({
      sortOrderColumns: changedColumns,
      productList: newProductList
    });
  }

  sortColumn = (production, sortByColumns) => {

    let sortBy, type, multiplier = -1;

    sortByColumns && sortByColumns.forEach((item) => {

      if (item.sortOrder != 'default') {
        sortBy = item.sortBy;
        type = item.type;

        if (item.sortOrder === 'asc') {
          multiplier = 1;
        }
      }
    });

    production.sort(sorting(sortBy, multiplier, type));
  }

  handleChangeQuantity = ({ newValue, id, type }) => {
    const { dispatch, change } = this.props;

    if (!newValue && type === 'num_in_stock') {
      dispatch(change('quantity_' + id, 0));
    }

    const newProductList = [...this.state.productList];
    const index = newProductList.findIndex((obj) => obj.id == id);

    const value = type === 'num_in_stock' ? parseInt(newValue) || 1 : Boolean(newValue);

    newProductList[index][type] = value;

    this.props.updateQuantity({ productItem: newProductList[index], id, type });
  }

  handleRemoveListItem = (id) => {
    this.setState({ modalDeleteState: true, selectedProduct: id });
  }

  handleModalAcceptRequest = () => {

    this.props.removeItem(this.state.selectedProduct);
    this.handleModalClose(); // and close the modal
  }

  // close the modal
  handleModalClose = () => {
    this.setState({ modalDeleteState: false, modalDublicateState: false });
  }

  handleDublicateItem = (id) => {
    const { dispatch, change } = this.props;

    DUBLICATE_PROPERTIES.forEach(({ id }) => {
      dispatch(change('toogle_' + id, true));
    })

    this.setState({ modalDublicateState: true, selectedProduct: id });
  }

  handleModalAcceptDuplication = () => {
    const { selectedProduct, dublicationFields, productList } = this.state;

    const findedItem = _.find(productList, (o) => o.id === selectedProduct);
    const currentChangedObject = { ...findedItem };


    //prepare object for dublication
    dublicationFields && Object.keys(dublicationFields).forEach((item) => {

      if (!dublicationFields[item]) {

        if (typeof currentChangedObject[item] === 'string') {
          currentChangedObject[item] = item === 'name' ? '--' : '';
        }

        else if ((item === 'Composizione' || item === 'Allergeni') && !_.isEmpty(currentChangedObject['details_attributes'])) {

          const index = _.findIndex(currentChangedObject['details_attributes'], (o) => o.name === item);
          if (index !== undefined) {
            currentChangedObject['details_attributes'].splice(index, 1);
          }
        }

        else if (Array.isArray(currentChangedObject[item])) {
          currentChangedObject[item] = [];
        }

      }
    })

    currentChangedObject['created_at'] = null;
    currentChangedObject['internal_sku'] = null;
    // currentChangedObject['slug'] = null;
    currentChangedObject['updated_at'] = null;
    currentChangedObject['id'] = null;
    currentChangedObject['deleted'] = null;
    currentChangedObject['images_attributes'] = null;

    currentChangedObject['shipping_options_attributes'] = currentChangedObject['shipping_options_attributes'] && currentChangedObject['shipping_options_attributes'].map(attr => ({ ...attr, id: null }));
    currentChangedObject['details_attributes'] = currentChangedObject['details_attributes'] && currentChangedObject['details_attributes'].map(attr => ({ ...attr, id: null }));
    currentChangedObject['variations_attributes'] = currentChangedObject['variations_attributes'] && currentChangedObject['variations_attributes'].map(attr => ({ ...attr, id: null }));
    currentChangedObject['product_categories_attributes'] = currentChangedObject['product_categories_attributes'] && currentChangedObject['product_categories_attributes'].map(attr => ({ ...attr, id: null, slug: null }));

    this.props.dublicateItem({ currentChangedObject, selectedProduct });
    this.handleModalClose();
  }

  handleChangeFieldsForDublication = ({ newValue, name, id }) => {
    const currentItem = _.find(DUBLICATE_PROPERTIES, (o) => o.id == id);
    let dublicationFields;

    if (currentItem.properties) {
      dublicationFields = currentItem.properties.reduce((res, item) => (
        {
          ...res,
          [item]: newValue
        }
      ), this.state.dublicationFields)
    }
    this.setState({ dublicationFields: dublicationFields })
  }

  handleChangePagination = (value) => {
    this.setState({
      paginationValues: { ...this.state.paginationValues, currentPage: value }
    });
    window.scrollTo && window.scrollTo(0, 0);
  }



  componentWillReceiveProps(nextProps) {

    if (this.props.productsFromStore !== nextProps.productsFromStore) {

      //apply sort order before render method
      // const sortOrdesIDs = localStorage && JSON.parse(localStorage.getItem("listOrder"));
      // const sortedArray = nextProps.productsFromStore && this.mappingForProductList(nextProps.productsFromStore, sortOrdesIDs);

      const { paginationValues: { currentPage, countPerPage, totalPages } } = this.state;

      this.setState({
        // productList: sortedArray || nextProps.productsFromStore,
        productList: nextProps.productsFromStore,
        paginationValues: {
          ...this.state.paginationValues,
          currentPage: nextProps.productsFromStore.length % countPerPage == 0 ? nextProps.productsFromStore.length / countPerPage : currentPage,
          totalPages: Math.ceil(nextProps.productsFromStore.length / countPerPage)
        }
      }, this.initializeFormElements);
    }

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('this.state', this.state);
  //   console.log('nextState', nextState);
  //   return true;
  // }

  render() {
    const { products, loading } = this.props;
    const { productList, sortOrderColumns, paginationValues: { currentPage, totalPages, countPerPage } } = this.state;
    console.log('productList', productList);
    return (
      <div>
        {
          productList && productList.length ? (
            <React.Fragment>
              <ProductListHeader
                onSort={this.handleSortProductList}
                columns={sortOrderColumns}
              />
              <DragAndDropList
                productList={productList.slice(countPerPage * (currentPage - 1), countPerPage * currentPage)}
                onChangeListOrder={this.handleChangeListOrder}
                onRemoveListItem={this.handleRemoveListItem}
                onChangeQuantity={this.handleChangeQuantity}
                onDublicateItem={this.handleDublicateItem}
              />
              {
                productList.length > countPerPage ? (
                  <Pagination
                    last={totalPages}
                    currentPage={currentPage}
                    onChange={this.handleChangePagination}
                  />
                ) : null
              }

            </React.Fragment>
          ) : null
        }

        {
          this.state.modalDeleteState ? (
            <ConfirmModal
              titleOfModal="Vuoi eliminare questo prodotto?"
              textOfModal="Sei sicuro di voler eliminare questo prodotto?"
              modalVisibility={this.state.modalDeleteState}
              onAccept={this.handleModalAcceptRequest}
              onClose={this.handleModalClose}
              acceptText="Conferma"
              closeText="Annulla"
            />
          ) : null
        }

        {
          this.state.modalDublicateState ? (
            <ConfirmModal
              titleOfModal="Vuoi dublicare questo prodotto?"
              textOfModal={<DublicateModalContent onChangeFieldsForDublication={this.handleChangeFieldsForDublication} />}
              modalVisibility={this.state.modalDublicateState}
              onAccept={this.handleModalAcceptDuplication}
              onClose={this.handleModalClose}
              acceptText="Conferma"
              closeText="Annulla"
            />
          ) : null
        }
      </div>
    );
  };
}

const mapStateToProps = (state, props) => ({
  formValues: getFormValues(props.form)(state),
  productsFromStore: state.tableList.data
})

const mapDispatchToProps = (dispatch) => ({
  removeItem: (data) => dispatch(removeItemAction(data)),
  updateQuantity: (data) => dispatch(updateQuantityAction(data)),
  dublicateItem: (data) => dispatch(dublicateItemAction(data)),
  initializeData: (data) => dispatch(initializeDataAction(data)),
  saveListOrder: (data) => dispatch(saveListOrderAction(data))
})


export default reduxForm({
  form: 'productList',
  // enableReinitialize: true,
  // keepDirtyOnReinitialize: true
})(
  connect(mapStateToProps, mapDispatchToProps)(ProductList)
);

