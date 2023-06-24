import { Client, Entity, Schema, Repository } from 'redis-om';

const client = new Client();

// Only open connection if it is not already open
async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
};

class Car extends Entity {}

// textSearch: true enables full text search on the description field with fuzzy matchingq
let schema = new Schema(
  Car,
  {
    make: { type: 'string' },
    model: { type: 'string' },
    image: { type: 'string' },
    description: { type: 'string', textSearch: true },
  },
  {
    dataStructure: 'JSON',
  }
);

export async function createCar(data) {
  await connect();

  const repository = client.fetchRepository(schema);

  const car = repository.createEntity(data);

  const id = await repository.save(car);

  return id;
};

export async function createIndex() {
  await connect();

  const repository = client.fetchRepository(schema);

  await repository.createIndex();
}

export async function searchCars(query) {
  await connect();

  const repository = client.fetchRepository(schema);

  const cars = await repository.search()
    .where('make').eq(query)
    .or('model').eq(query)
    .or('description').matches(query)
    .return.all();

  return cars;
};
