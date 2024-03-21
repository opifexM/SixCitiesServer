# Six Cities Server

The Six Cities Server is a Node.js-based platform offering affordable travel accommodations via REST API and CLI. It features user authentication, dynamic listings, comments, and favorites, utilizing MongoDB for data management. Designed for efficiency and ease of use, it caters to travelers seeking cost-effective stays.

## Description

The Six Cities Server project encompasses a comprehensive travel accommodation service platform, engineered to assist travelers in finding cost-effective rental options across six of the most sought-after urban destinations. At its core, the service facilitates the creation, editing, and deletion of rental offers, along with the ability to view detailed information about each listing, including premium options and favorites. Users can interact with the platform through both REST API and CLI interfaces, ensuring versatility and ease of use. Additionally, the project integrates a user authentication system, supporting registration, login, and logout functionalities, and features a dynamic comment system for community engagement. Premium listings and a favorites system enhance user experience by highlighting select offers and personalizing the search process. The backend is developed using Node.js and Express.js, with MongoDB serving as the database solution. The project also includes optional frontend integration, expanding its utility and user interface capabilities. Designed with scalability and user-friendliness in mind, the Six Cities Server aims to redefine how travelers approach accommodation booking, merging convenience with affordability.

## Features
- **New Offer Creation**: Users can create new rental offers.
- **Offer Management**: Users can edit or delete their offers.
- **Rental Listings**: Provides a list of rental offers available in selected cities.
- **Detailed Offer** Information: Access detailed information about each offer, including premium and favorite status.
- **Comment System**: Users can add comments to offers and view lists of comments.
- **User Authentication**: Supports user registration, login, and logout functionalities.
- **Premium Offers**: Displays premium offers for each city.
- **Favorites**: Allows users to add or remove offers from their favorites.

## Technologies
- **REST API and CLI Interfaces**: Offers both REST API and CLI interfaces for interacting with the service.
- **Frontend Integration**: Optional task to integrate backend services with a frontend application.
- **Node.js**: For server-side logic.
- **Express.js**: To handle HTTP requests.
- **MongoDB**: For database management.
- **Docker**: For easy deployment and environment setup.
- **TypeScript**: For type-safe code development.

## File Structure
- **src/**: Source code directory.
  - **api/**: Contains the REST API implementation.
  - **cli/**: Contains the CLI implementation.
  - **models/**: Data models and database schema definitions.
  - **services/**: Business logic and service layer.
- **specification/**: OpenAPI specification for the REST API.
- **.env.example**: An example environment configuration file.
- **docker-compose.yml**: Docker Compose file for setting up MongoDB.

## Installation
Ensure you have Node.js, Docker, and MongoDB installed on your machine. Clone the repository and set up the environment:

```bash
git clone https://github.com/user/six-cities.git
cd six-cities
cp .env-example .env
# Modify .env with your settings
npm install
```

### Running Containers
To start the container setup for the Six Cities project, use the following command:

```bash
docker compose --file ./docker-compose.yml --env-file ./.env --project-name "six-cities" up -d
```

To stop and remove the containers, execute:
```bash
docker compose --file ./docker-compose.yml --env-file ./.env --project-name "six-cities" down
```

To import data from a TSV file:

```bash
npm run ts -- ./src/main.cli.ts --import mocks/mock-data.tsv
```

To import data from multiple TSV files:
```bash
npm run ts -- ./src/main.cli.ts --import data1.tsv data2.tsv data3.tsv
```

To import data from a TSV file with database connection details:
- -db-user [database_login]
- -db-password [database_password]
- -db-host [database_server]
- -db-port [database_port]
- -db-name [database_name]
```bash
npm run ts -- ./src/main.cli.ts --import mocks/mock-data.tsv -u [user] -p [password] -h [host] -P [port] -n [dbname]
```

Generating mock data and saving it to a TSV file:
```bash
npm run ts -- ./src/main.cli.ts --generate 100 ./mocks/mock-offers.tsv http://localhost:3123/api
```

Starting a mock server:
```bash
npm run json-server ./mocks/mock-server-data.json --port 3123
```

## License

Six Cities Server is licensed under the MIT license, making it freely available for personal and commercial use.
