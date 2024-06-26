# Checkmark Backend
This beginner-friendly project is primarly the backend part of the Checkmark (To-Do list) project. It gives users the feature to add and manage various daily tasks. Moreover, it is highly suitable for beginners to jumpstart their opensource journey. 

## Fork the Repository on GitHub
Go to the repository page of Checkmark on GitHub: https://github.com/LJOSC/checkmark-backend.
Click on the "Fork" button at the top-right corner of the page.
Then clone the repository to your local system.

## Setup
Follow these steps to set up and run the Checkmark project locally:

### Prerequisites
Before you begin, ensure you have the following installed on your machine:

+ **Node.js (version 20.x or later)**
+ **npm (Node Package Manager)**

### Quick Setup

Run the following commands in your terminal to set up and run the Checkmark project:

```bash

# Clone the repository 
git clone https://github.com/your-username/checkmark-backend.git
cd checkmark

# Install dependencies that will be mentioned after this quick setup section
npm install

# Copy env.example to .env and edit with your variables
cp env.example .env
sed -i 's/your_mongodb_uri/<your_actual_mongodb_uri>/' .env

# Start the development server
npm run dev
```

## Technologies Used

- **TypeScript**: 96% of the codebase is written in TypeScript, ensuring type safety and better development experience.
- **JavaScript**: The remaining 4% is in JavaScript.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Winston**: A logger for just about everything.
- **Dotenv**: Loads environment variables from a `.env` file into `process.env`.

## Contributing
We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## Code of Conduct
Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.
Please see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on Code of Coonduct.

## License
This project is licensed under the terms of the MIT license. See [LICENSE](LICENSE) for more details.

