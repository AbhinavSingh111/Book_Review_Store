# Book Review Store

This project is a simple web application for managing book reviews. Users can view and submit book reviews, providing details such as ISBN, title, date, about, notes, and rating.

## Features

- Display a list of book reviews.
- View detailed information about a specific book.
- Add new book reviews.
- Edit existing book reviews.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (pg library)
- HTML / EJS (Embedded JavaScript)
- CSS
- JavaScript

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Book_Review_Store.git

2. Install dependencies:

   ```bash
   npm install

3. Set up your PostgreSQL database:

   Update the connection details in index.js.

4. Run the application:

    ```bash
    npm start

5. Access the application:

    Open your browser and navigate to
    ```bash
    http://localhost:4000

## Database Schema

The application uses a PostgreSQL database with the following schema:

  ```sql
  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    about TEXT NOT NULL,
    notes TEXT NOT NULL,
    rating INTEGER NOT NULL
    ;
```
## Usage

  Navigate to the homepage to view a list of book reviews.
  
  Click on a specific book to view detailed information.
  
  Use the "Add Review" button to submit a new book review.
  
  Click the "Edit" button on a review to modify its details.
## Contributing
  Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.

## License
This project is licensed under the MIT License.


