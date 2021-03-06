import { combineReducers } from 'redux'
import {
  REQUEST_LISTS, RECEIVE_LISTS,
  REQUEST_CARDS, RECEIVE_CARDS,
  ADDING_CARD, POSTED_CARD,
  ADDING_LIST, POSTED_LIST,
  REVOKE_ADDING, SHOW_CARD,
  CLOSE_CARD, EDITING_CARD_DESC,
  SAVING_CARD_DESC, SAVED_CARD_DESC,
  OPEN_LIST_POPOVER, CLOSE_LIST_POPOVER,
  OPEN_ALERT_MODAL, CLOSE_ALERT_MODAL,
  DELETE_LIST, CHANGE_POSITION_LIST
} from '../actions'

function lists(state = {
        isFetching: false,
        didInvalidate: false,
        items: []
      }, action  ) {
    switch (action.type) {
      case REQUEST_LISTS:
        return Object.assign({}, state, {
                    isFetching: true,
                    didInvalidate: true })
      case RECEIVE_LISTS:
        return Object.assign({}, state, {
                  isFetching: false,
                  didInvalidate: false,
                  items: action.lists
        })
      case POSTED_LIST:
        return Object.assign({}, state, {
                  isFetching: false,
                  didInvalidate: false,
                  items: state.items.concat([action.list])
        })
      case DELETE_LIST:
        return Object.assign({}, state, {
              isFetching: false,
              didInvalidate: false,
              items: state.items.filter(({_id}) => _id != action.listId)
          })
      case CHANGE_POSITION_LIST:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: state.items.map(list => {
              if(list._id === action.fromList.id){
                list.position = Number(action.toList.position)
              }
              if(list._id === action.toList.id){
                list.position = Number(action.fromList.position)
              }
              return list
            }).sort( (a,b) => Number(a.position) - Number(b.position) )
          })
      default:
        return state
    }
}

function cards(state = [], action) {
  switch (action.type) {
    case POSTED_LIST:
      return state.concat([{
        isFetching: true,
        didInvalidate: false,
        listId: action.list._id,
        items: []
      }])
    case REQUEST_CARDS:
      return state.concat([{
        isFetching: true,
        didInvalidate: false,
        listId: action.listId,
        items: []
      }])
    case RECEIVE_CARDS:
      return state.map( (card) => {
          if(card.listId === action.listId){
            card = Object.assign({}, card, {isFetching: false, didInvalidate: false, items: action.cards })
          }
          return card
      })
    case POSTED_CARD:
      return state.map( (card) => {
          if(card.listId === action.card.listId){
            card.items = card.items.concat([action.card])
          }
          return card
      })
    case SAVING_CARD_DESC:
      return state.map( (card) => {
          if(card.listId === action.card.listId){
            card.items = card.items.map( (c) => {
              if(c._id === action.card._id){
                c.desc = action.card.desc
              }
              return c
            })
          }
          return card
      })
    default:
      return state
  }
}

function add_cards(state = null, action) {
  switch (action.type) {
    case ADDING_CARD:
      return action.listId
    case REVOKE_ADDING:
    case POSTED_CARD:
      return null
    default:
      return state
  }
}

function addingList(state = false, action) {
  switch (action.type) {
    case ADDING_LIST:
      return true
    case REVOKE_ADDING:
    case POSTED_LIST:
      return false
    default:
      return state
  }
}

function currentCard(state = { id: null, editingDesc: false }, action) {
  switch (action.type) {
    case SAVED_CARD_DESC:
      return Object.assign({}, state, { editingDesc : false })
    case SHOW_CARD:
      return Object.assign({}, state, { id : action.cardId, editingDesc : false })
    case EDITING_CARD_DESC:
       return Object.assign({}, state, { editingDesc : true })
    case CLOSE_CARD:
      return Object.assign({}, state, { id: null, editingDesc : false })
    default:
      return state
  }
}

function listPopover(state = { status: 'close', listId: null, position: {top: null, left: null} }, action) {
  switch (action.type) {
    case CLOSE_LIST_POPOVER:
      return Object.assign({}, state, { status: 'close' } )
    case OPEN_LIST_POPOVER:
      return Object.assign({}, state, { status: 'open',
                                        listId: action.popover.listId,
                                        position: {top: action.popover.position.top, left: action.popover.position.left} })
    default:
      return state
  }
}

function alertModal(state = { status: 'close', desc: '', response: false, triggeredBy: null, item: null}, action) {
  switch (action.type) {
    case OPEN_ALERT_MODAL:
      return Object.assign({}, state, { status: 'open', desc: action.desc, response: null, triggeredBy: action.triggeredBy, item: action.item})
    case CLOSE_ALERT_MODAL:
      return Object.assign({}, state, { status: 'close', desc: '', response: action.response, triggeredBy: action.triggeredBy, item: action.item})
    default:
      return state
  }
}


const rootReducer = combineReducers({
  lists,
  cards,
  addingCardTo: add_cards,
  addingList,
  currentCard,
  listPopover,
  alertModal
})

export default rootReducer
