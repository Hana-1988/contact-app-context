import React, { useContext, useState } from 'react';
import styles from "./ContactsList.module.css";
import { ContactContext } from './ContactContext';

function ContactsList({ onEdit }) {
    const { contacts, deleteContact } = useContext(ContactContext);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);    

    const handleDelete = (id) => {
        setContactToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        deleteContact(contactToDelete);
        setShowConfirmModal(false);
    };

    const handleSelect = (id) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        selectedContacts.forEach(id => deleteContact(id));
        setSelectedContacts([]);
    };

    return (
        <div className={styles.contactsList}>
            <div className={styles.rightcontainer}>
                <h1>Contact List</h1>
                <hr />
                {contacts.length ? (
                    <>
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={selectedContacts.includes(contact.id)}
                                        onChange={() => handleSelect(contact.id)}
                                    />
                                    <p>{contact.name} {contact.lastname}</p>
                                    <p>{contact.phone}</p>
                                    <p>{contact.email}</p>
                                    <button className={styles.deleteBtn} onClick={() => onEdit(contact)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(contact.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <button
                            className={styles.bulkDeleteBtn}
                            onClick={handleDeleteSelected}
                            disabled={!selectedContacts.length}
                        >
                            Delete Selected
                        </button>
                    </>
                ) : <p>No contacts yet!</p>}
            </div>

            {showConfirmModal && (
                <div className={styles.confirmModal}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this contact?</p>
                        <button className={styles.modalBtn} onClick={confirmDelete}>Yes, Delete</button>
                        <button className={styles.modalBtn} onClick={() => setShowConfirmModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactsList;


