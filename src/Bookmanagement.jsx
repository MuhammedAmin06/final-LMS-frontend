// src/components/staff/BookManagement.js
import React, { useState, useEffect } from 'react';
import BookForm from './BookForm';
import BookList from './BookList';

const BookManagement = () => {
  // Mock data simulation - replace with real API later
  const mockBooks = [
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', copies: 5 },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', copies: 3 },
    { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', copies: 2 },
  ];

  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    copies: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API fetch with mock data
    // In future: fetch('/api/books').then(res => res.json()).then(setBooks).catch(handleError);
    setBooks(mockBooks);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.title || !formData.author || !formData.isbn || !formData.copies) {
      setError('All fields are required.');
      return;
    }

    const copiesNum = Number(formData.copies);
    if (isNaN(copiesNum) || copiesNum < 1) {
      setError('Number of copies must be a positive integer.');
      return;
    }

    // Check for duplicate ISBN (except when editing)
    const isbnExists = books.some(
      (book) => book.isbn === formData.isbn && book.id !== editingId
    );
    if (isbnExists) {
      setError('A book with this ISBN already exists.');
      return;
    }

    if (editingId) {
      // Simulate PUT API call
      // In future: fetch(`/api/books/${editingId}`, { method: 'PUT', body: JSON.stringify({ ...formData, copies: copiesNum }) });
      setBooks(
        books.map((book) =>
          book.id === editingId ? { ...book, ...formData, copies: copiesNum } : book
        )
      );
      setEditingId(null);
    } else {
      // Simulate POST API call
      // In future: fetch('/api/books', { method: 'POST', body: JSON.stringify({ ...formData, copies: copiesNum }) });
      const newBook = {
        id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
        ...formData,
        copies: copiesNum,
      };
      setBooks([...books, newBook]);
    }

    // Reset form
    setFormData({ title: '', author: '', isbn: '', copies: '' });
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies.toString(), // Convert to string for input
    });
    setEditingId(book.id);
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book record?')) {
      // Simulate DELETE API call
      // In future: fetch(`/api/books/${id}`, { method: 'DELETE' });
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', author: '', isbn: '', copies: '' });
    setEditingId(null);
    setError('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Book Records</h1>
      <BookForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        editingId={editingId}
        error={error}
      />
      <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BookManagement;

// src/components/staff/BookForm.js
import React from 'react';

const BookForm = ({ formData, onChange, onSubmit, onCancel, editingId, error }) => {
  return (
    <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title: </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g. JavaScript: The Good Parts"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Author: </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={onChange}
            placeholder="e.g. Douglas Crockford"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>ISBN: </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={onChange}
            placeholder="e.g. 978-0596517748"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Number of Copies: </label>
          <input
            type="number"
            name="copies"
            value={formData.copies}
            onChange={onChange}
            min="1"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', marginRight: '10px' }}>
          {editingId ? 'Update Book' : 'Add Book'}
        </button>

        {editingId && (
          <button type="button" onClick={onCancel} style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none' }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default BookForm;

// src/components/staff/BookList.js
import React from 'react';

const BookList = ({ books, onEdit, onDelete }) => {
  return (
    <>
      <h2>Current Book Records ({books.length})</h2>
      
      {books.length === 0 ? (
        <p>No books in the library yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f1f1' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Author</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>ISBN</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Copies</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.author}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.isbn}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.copies}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button onClick={() => onEdit(book)} style={{ marginRight: '8px', padding: '5px 10px' }}>
                    Edit
                  </button>
                  <button onClick={() => onDelete(book.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default BookList;