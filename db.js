//+ pour recuperer la table comme js object
//+ interagir avec la datatabase
const typeorm = require('typeorm');
const { urlencoded } = require('express');

// + create a modal for creator
class Creator {
  constructor(id, name, img, ytURL) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.ytURL = ytURL;
  }
}
// creat a modal for top series
class TopSeries {
  constructor(id, name, img, link) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.link = link;
  }
}
class TopFilms {
  constructor(id, name, img, link) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.link = link;
  }
}

const EntitySchema = typeorm.EntitySchema;

const CreatorSchema = new EntitySchema({
  name: 'Creator',
  target: Creator,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    img: {
      type: 'text',
    },
    ytURL: {
      type: 'text',
    },
  },
});

const TopSeriesSchema = new EntitySchema({
  name: 'TopSeries',
  target: TopSeries,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    img: {
      type: 'text',
    },
    link: {
      type: 'text',
    },
  },
});
const TopFilmsSchema = new EntitySchema({
  name: 'TopFilms',
  target: TopFilms,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    img: {
      type: 'text',
    },
    link: {
      type: 'text',
    },
  },
});

// + Connect to database
async function getConnection() {
  const connection = await typeorm.createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'alexon23',
    database: 'top_10',
    synchronize: true,
    logging: false,
    entities: [CreatorSchema, TopSeriesSchema, TopFilmsSchema],
  });
  return connection;
  // return await typeorm.createConnection({
  //   type: 'mysql',
  //   host: 'localhost',
  //   port: 3306,
  //   username: 'root',
  //   password: 'alexon23',
  //   database: 'top_10',
  //   synchronize: true,
  //   logging: false,
  //   entities: [CreatorSchema],
  // });
}

async function getAllCreators() {
  const connection = await getConnection();
  const creatorRepo = connection.getRepository(Creator); //+ acces to the creator table
  // handle the entire table

  const creators = await creatorRepo.find();
  connection.close();
  return creators;
}

async function insertCreator(name, img, ytURL) {
  const connection = await getConnection();

  // create
  const creator = new Creator();
  creator.name = name;
  creator.img = img;
  creator.ytURL = ytURL;

  // save
  const creatorRepo = connection.getRepository(Creator);
  const res = await creatorRepo.save(creator);
  console.log('saved', res);

  // return new list
  const allCreators = await creatorRepo.find();
  connection.close();
  return allCreators;
}

async function pushData(name, img, url, table) {
  const connection = await getConnection();

  let currentTable;
  switch (table) {
    case 'TopSeries':
      currentTable = TopSeries;
    case 'TopFilms':
      currentTable = TopFilms;
    default:
      currentTable = TopSeries;
  }
  // create
  const serie = new currentTable();
  serie.name = name;
  serie.img = img;
  serie.link = url;

  // save
  const Repo = connection.getRepository(currentTable);
  const res = await Repo.save(serie);
  console.log('saved', res);

  // return new list
  const all = await Repo.find();
  connection.close();
  return all;
}

async function getAllData(table) {
  const connection = await getConnection();
  let currentTable;
  switch (table) {
    case 'TopSeries':
      currentTable = TopSeries;
    case 'TopFilms':
      currentTable = TopFilms;
    default:
      currentTable = TopSeries;
  }

  const Repo = connection.getRepository(currentTable); //+ acces to the creator table
  // handle the entire table

  const data = await Repo.find();

  connection.close();
  return data;
}

module.exports = {
  getAllCreators,
  insertCreator,
  pushData,
  getAllData,
};

// insertCreator(
//   'traversy media',
//   '.png',
//   'https://www.youtube.com/user/TechGuyWeb'
// );
