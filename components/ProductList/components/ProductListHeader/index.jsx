import React from 'react';
import _ from 'lodash';
import styles from './ProductListHeader.scss';
import PropTypes from 'prop-types';

const ProductListHeader = (props) => {
	const {onSort, columns} = props;
	return (
		<div className={styles.productListHeader}>
			<div className={styles.productListHeader__emptyArea} />
			{
				columns.map((item, index) => (
					<div key={item.alias} className={styles['productListHeader__' + item.alias]} onClick={() => onSort(index, item)}>
						{item.label}
						<span className={styles['productListHeader__' + item.sortOrder]} />
					</div>
				))
			}
			<div className={styles.productListHeader__buttons} />
		</div>
	)
}

ProductListHeader.propTypes = {
	onSort: PropTypes.func.isRequired,
	columns: PropTypes.array.isRequired
}

export default ProductListHeader