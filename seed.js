const { format } = require('date-fns');
require('dotenv').config();
const faker = require('@faker-js/faker');
const MongoClient = require('mongodb').MongoClient;

async function seedDB() {
  const uri = process.env.MONGO_URI;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
  });

  try {
    await client.connect();
    console.log('Connected correctly to server');

    const collection = client.db('odin-book').collection('users');

    let data = [];

    for (let i = 0; i < 10; i++) {
      let user = {
        facebook_id: faker.faker.datatype
          .number({
            min: 1000000000000000,
            max: 9006999999999999,
          })
          .toString(),
        email: faker.faker.internet.email(),
        hometown: `${faker.faker.address.city()}, ${faker.faker.address.country()}`,
        gender: faker.faker.name.gender(true),
        picture: faker.faker.image.avatar(),
        posts: [],
        friends: [],
        friendRequests: [],
        birthday: format(faker.faker.date.past(50), 'MM/dd/yyyy'),
      };
      data.push(user);
    }
    collection.insertMany(data);
    console.log('Database seeded!');
    // client.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();
