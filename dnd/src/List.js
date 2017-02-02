import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import Card from './Card';

const style = {
  width: 400,
  minHeight: '100%',
  boxShadow: '0 0 0 1px green',
  backgroundColor: '#eee'
}

const listDropTarget = {
  hover(props, monitor, component) {
    if (monitor.isOver({ shallow: true })) {
      let item = monitor.getItem();
      if (item.status === props.listId)
        return;

      item.status = props.listId;
      global.draggedCardStatus = -1;
      item.index = props.cards.length;
      props.moveCardInList(item.id, props.listId);
    }
  }
};

function listDropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    draggedItem: monitor.getItem()
  }
}

class List extends Component {
  render() {
    const { connectDropTarget, draggedItem, isOver } = this.props;

    var cards = this.props.cards.map((card, i) => {
      return (
        <Card 
          key={card.id}
          index={i}
          status={card.status}
          id={card.id}
          text={card.text}
          moveCard={this.props.moveCard} 
        />
      );
    });

    let newStyle = Object.assign({}, style);
    if (draggedItem && draggedItem.status !== this.props.listId) {
      newStyle.backgroundColor = "#bbb";
    }

    return connectDropTarget(
      <div style={newStyle}>
        {cards}
      </div>
    );
  }
}

List.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
  draggedItem: PropTypes.object,
  listId: PropTypes.number.isRequired,
  cards: PropTypes.array.isRequired,
  moveCard: PropTypes.func.isRequired,
  moveCardInList: PropTypes.func.isRequired
};


var drop = DropTarget(ItemTypes.CARD, listDropTarget, listDropCollect)(List);
export default drop;