import React, { useContext, useState } from 'react';
import styles from "./AddContact.module.css";
import ContactsList from './ContactsList';
import { ContactContext } from './ContactContext';

const inputs = [
    { type: 'text', name: 'name', placeholder: 'Name' },
    { type: 'text', name: 'lastname', placeholder: 'Last Name' },
    { type: 'number', name: 'phone', placeholder: 'Phone' },
    { type: 'email', name: 'email', placeholder: 'Email' }
];

function AddContact() {
    const { addContact, editContact, searchContacts, searchTerm } = useContext(ContactContext);
    const [contact, setContact] = useState({
        id: "",
        name: "",
        lastname: "",
        phone: "",
        email: ""
    });
    const [errors, setErrors] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(() => () => {});

    const [searchInput, setSearchInput] = useState(searchTerm);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchClick = () => {
        searchContacts(searchInput);
    };

    const handleEditContact = (contactToEdit) => {
        setContact(contactToEdit);
    };

    function validateFields() {
        const newErrors = {};
        if (!contact.name) newErrors.name = "Please enter a name.";
        if (!contact.lastname) newErrors.lastname = "Please enter a last name.";
        if (!contact.phone) newErrors.phone = "Please enter a phone number.";
        if (!contact.email) newErrors.email = "Please enter an email.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) newErrors.email = "Please enter a valid email address.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function openConfirmModal() {
        if (validateFields()) {
            setConfirmAction(() => addOrEditContact);
            setShowConfirmModal(true);
        }
    }

    function addOrEditContact() {
        if (contact.id) {
            editContact(contact);
        } else {
            addContact(contact);
        }
        resetForm();
    }

    const resetForm = () => {
        setContact({
            id: "",
            name: "",
            lastname: "",
            phone: "",
            email: ""
        });
        setShowConfirmModal(false);
    };

    const handleModalConfirm = () => {
        confirmAction();
    };

    const handleModalCancel = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
            <div className={styles.main}>
                <div className={styles.mainLeft}>
                    <div className={styles.leftContainer}>
                        <h1>{contact.id ? 'Edit Contact' : 'Add Contact'}</h1>
                        <hr />
                        <div className={styles.inputs}>
                            {inputs.map((input, index) => (
                                <div key={index} className={styles.inputContainer}>
                                    <input
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        name={input.name}
                                        value={contact[input.name]}
                                        onChange={(e) => setContact({ ...contact, [input.name]: e.target.value })}
                                    />
                                    {errors[input.name] && <p className={styles.errorText}>{errors[input.name]}</p>}
                                </div>
                            ))}
                            <br />
                            <button className={styles.addContactBtn} onClick={openConfirmModal}>
                                {contact.id ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.leftContainer2}>
                        <h1>Search</h1>
                        <hr />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                        <button className={styles.searchtBtn} onClick={handleSearchClick}>Search</button>
                    </div>
                </div>
                <div className={styles.mainRight}>
                    <ContactsList onEdit={handleEditContact} />
                </div>
            </div>
            {showConfirmModal && (
                <div className={styles.confirmModal}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Information</h2>
                        <p>Are you sure you want to {contact.id ? 'update' : 'add'} the following contact?</p>
                        <p><strong>Name:</strong> {contact.name}</p>
                        <p><strong>Last Name:</strong> {contact.lastname}</p>
                        <p><strong>Phone:</strong> {contact.phone}</p>
                        <p><strong>Email:</strong> {contact.email}</p>
                        <button className={styles.modalBtn} onClick={handleModalConfirm}>Confirm</button>
                        <button className={styles.modalBtn} onClick={handleModalCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddContact;

