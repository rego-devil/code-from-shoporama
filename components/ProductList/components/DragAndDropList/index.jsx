import React from 'react';
import _ from 'lodash';
import { Container as DnDContainer, Draggable } from 'react-smooth-dnd';
import ProductListItem from '../ProductListItem';

class DragAndDropList extends React.Component {
  render() {
		const { productList, onChangeListOrder, onChangeQuantity, onRemoveListItem, onDublicateItem} = this.props;
		return (
			<DnDContainer
				lockAxis="y"
				dragHandleSelector=".column-drag-handle"
				onDrop={e => onChangeListOrder(e)}
			>
				{
					productList && productList.map((item, index) => ( 
						<Draggable key={item.id}>
							<ProductListItem data={item} onChangeQuantity={onChangeQuantity} onRemoveListItem={onRemoveListItem} onDublicateItem={onDublicateItem} />
						</Draggable>
					))
				}
			</DnDContainer>
		)
  }
}

export default DragAndDropList