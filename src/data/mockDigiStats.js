import { faker } from '@faker-js/faker';

const createRandomStat = () => {
  const jobs = faker.number.int({ min: 5, max: 20 });
  const tjobs = jobs + faker.number.int({ min: 0, max: 10 });
  const parcels = faker.number.int({ min: 50, max: 250 });
  const tparcels = parcels + faker.number.int({ min: 0, max: 50 });

  return {
    StatNameDig: faker.person.fullName(),
    team: `Team ${faker.helpers.arrayElement(['1', '2', '3', 'Quality'])}`,
    startdate: faker.date.recent({ days: 7 }).toISOString().split('T')[0],
    jobs: jobs,
    parcels: parcels,
    tjobs: tjobs,
    tparcels: tparcels,
    fails: faker.number.int({ min: 0, max: 5 }),
    sec: faker.number.int({ min: 3600, max: 28800 }), // 1 to 8 hours
    qjobs: faker.number.int({ min: 0, max: 3 }),
  };
};

export const mockLiveDigiStats = Array.from({ length: 20 }, createRandomStat);
