import React, { createContext, useReducer, useEffect } from 'react';

export const ContactContext = createContext();

const initialState = {
    contacts: [],
    searchTerm: ""
};

function contactReducer(state, action) {
    switch (action.type) {
        case 'SET_CONTACTS':
            return { ...state, contacts: action.payload };
        case 'ADD_CONTACT':
            return { ...state, contacts: [...state.contacts, action.payload] };
        case 'DELETE_CONTACT':
            return { ...state, contacts: state.contacts.filter(contact => contact.id !== action.payload) };
        case 'EDIT_CONTACT':
            return {
                ...state,
                contacts: state.contacts.map(contact => contact.id === action.payload.id ? action.payload : contact)
            };
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        default:
            return state;
    }
}

export function ContactProvider({ children }) {
    const [state, dispatch] = useReducer(contactReducer, initialState);

    useEffect(() => {
        fetch('http://localhost:8000/contacts')
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'SET_CONTACTS', payload: data });
            })
            .catch(error => console.error(error));
    }, []);

    const addContact = (contact) => {
        fetch('http://localhost:8000/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
            dispatch({ type: 'ADD_CONTACT', payload: data });
        })
        .catch(error => console.error(error));
    };

    const deleteContact = (id) => {
        fetch(`http://localhost:8000/contacts/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            dispatch({ type: 'DELETE_CONTACT', payload: id });
        })
        .catch(error => console.error(error));
    };

    const editContact = (contact) => {
        fetch(`http://localhost:8000/contacts/${contact.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
            dispatch({ type: 'EDIT_CONTACT', payload: data });
        })
        .catch(error => console.error(error));
    };

    const searchContacts = (term) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: term });
    };
 
    const filteredContacts = state.contacts.filter(contact =>
        contact.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        contact.lastname.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        contact.phone.includes(state.searchTerm)  
    );
    return (
        <ContactContext.Provider value={{
            contacts: filteredContacts,  
            addContact,
            deleteContact,
            editContact,
            searchContacts,
            searchTerm: state.searchTerm
        }}>
            {children}
        </ContactContext.Provider>
    );
}

