import React from 'react';
import _ from 'lodash';
import styles from './ProductListItem.scss';
import ToggleSwitchEmpty from 'components/ToggleSwitchEmpty';
import { Field } from 'redux-form';
import {required, onlyNumbers, isMaxLength, isMaxTextLength750} from 'utils/validators';
import Amount from './components/Amount';

class ProductListItem extends React.Component {
  render() {
		const { data: {images_attributes, name, unit_price, sale_price, id, slug, internal_sku}, onChangeQuantity, onRemoveListItem, onDublicateItem} = this.props;
		const defaultImage = _.find(images_attributes, (el) => el.default === true) || _.first(images_attributes);
		return (
			<div className={styles.productListItem}>
				<div className={`${styles.productListItem__dragZone} column-drag-handle`}><span /><span /></div>
				<div className={styles.productListItem__imageArea}>
					<a href={`/negozio/prodotti/modifica/${id}`}>
						<img src={defaultImage ? defaultImage.image : require('images/store/placeholder_no_product_.png')} alt={name || "Shop-o-rama prodotto"} />
					</a>
					<div className={styles.productListItem__name}>
						<a href={`/negozio/prodotti/modifica/${id}`}>{name}</a>
					</div>
				</div>
				<div className={styles.productListItem__amount}>
					<Field
						name={`quantity_${id}`}
						type="text"
						component={Amount}
						className={styles.productListItem__input}
						validate={[required]}
						normalize={onlyNumbers}
						placeholder="Quantità"
						onBlur={(event, newValue, previousValue, name) =>  {onChangeQuantity({newValue, id, type: 'num_in_stock'}) } }
					/>
				</div>
				<div className={styles.productListItem__price}>
					<div className={styles.productListItem__oldPrice}>{unit_price ? unit_price + '€' : 0}</div>
					<div>{sale_price ? sale_price + '€' : 0}</div>
				</div>
				<div className={styles.productListItem__publish}>
					<Field
						name={`is_active_${id}`}
						component={ToggleSwitchEmpty}
						validate={required}
						onChange={(event, newValue, previousValue, name) =>  onChangeQuantity({newValue, id, type: 'is_active'})}
					/>
				</div>
				<div className={styles.productListItem__mobile}>
					<div className={styles.productListItem__name}>{name}</div>
					<div className={styles.productListItem__oldPrice}>{unit_price ? unit_price + '€' : 0}</div>
					<div>{sale_price ? sale_price + '€' : 0}</div>
				</div>
				<div className={styles.productListItem__actionButtons}>
					<button className={styles.productListItem__button} onClick={() => onRemoveListItem(id)}>ELIMINA</button>
					<button className={styles.productListItem__button} onClick={() => onDublicateItem(id)}>DUPLICA</button>
					<a href={`/prodotti/${internal_sku}/${slug}`} target="_blank" className={styles.productListItem__button}>VISUALIZZA</a>
				</div>
			</div>
		)
  }
}

export default ProductListItem