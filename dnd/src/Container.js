import React, { Component } from 'react';
import update from 'react/lib/update';
import List from './List';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const style = {
  display: 'flex',
  justifyContent: 'space-between',
  width: 900,
  height: '100%',
  padding: '10px',
  border: '1px solid black'
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveCardInList = this.moveCardInList.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library',
        status: 1
      }, {
        id: 2,
        text: 'Make it generic enough',
        status: 1
      }, {
        id: 3,
        text: 'Write README',
        status: 1
      }, {
        id: 4,
        text: 'Create some examples',
        status: 2
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        status: 2
      }, {
        id: 6,
        text: '???',
        status: 1
      }, {
        id: 7,
        text: 'PROFIT',
        status: 2
      }]
    };
  }

  getIndexByCardId(cardId) {
    const { cards } = this.state;
    for (let i = 0; i < cards.length; ++i)
      if (cards[i].id === cardId)
        return i;

    return -1;
  }

  moveCardInList(dragCardId, newStatus) {
    const { cards } = this.state;
    const dragIndex = this.getIndexByCardId(dragCardId);
    let dragCard = update(cards[dragIndex], {
      status: {$set: newStatus}
    });

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [cards.length, 0, dragCard]
        ]
      }
    }));  
  }

  moveCard(dragCardId, hoverCardId, newStatus, insertAfter) {
    const { cards } = this.state;
    const dragIndex = this.getIndexByCardId(dragCardId);
    let hoverIndex = this.getIndexByCardId(hoverCardId);
    let dragCard = cards[dragIndex];

    if (newStatus) {
      dragCard = update(cards[dragIndex], {
        status: {$set: newStatus}
      });

      if (hoverIndex > dragIndex) {
        if (!insertAfter)
          hoverIndex--;
      }
      else {
        if (insertAfter)
          hoverIndex++;
      }
    }

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));  
  }

  render() {
    const { cards } = this.state;
    const list1 = 1;
    const list2 = 2;

    return (
      <div style={style}>
        <List
          listId={list1}
          cards={cards.filter((card) => card.status === list1)}
          moveCard={this.moveCard}
          moveCardInList={this.moveCardInList}
        />

        <List
          listId={list2}
          cards={cards.filter((card) => card.status === list2)}
          moveCard={this.moveCard}
          moveCardInList={this.moveCardInList}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
