import { faker } from '@faker-js/faker';

// These constants define the structure of the data tables.
const statuses = [
  { code: 'IN_VISUAL_CHECKING' },
  { code: 'UNASSINGED' },
  { code: 'ASSIGNED' },
  { code: 'IN_PROGRESS' },
  { code: 'TOTAL' },
  { code: 'IN_QC' },
  { code: 'INTERNAL_QUERY' },
  { code: 'IN_QUERY' },
  { code: 'COMPLETED' },
];
const slaStatuses = [
  { code: 'IN_VISUAL_CHECKING' },
  { code: 'UNASSINGED' },
  { code: 'ASSIGNED' },
  { code: 'IN_PROGRESS' },
  { code: 'TOTAL' },
  { code: 'IN_QC' },
  { code: 'IN_QUERY' },
];

/**
 * Generates a complete, realistic-looking mock data object that mimics the
 * response from the /api/prioritysheets endpoint.
 * @returns {{onlineSheets: object, slaSummary: object}}
 */
export const generateMockData = () => {
  const sheetNames = ['BPS_2023_1', 'BPS_2023_2', 'CS_2023_CF'];
  const onlineSheets = {};
  const slaSummary = {};

  sheetNames.forEach((name) => {
    onlineSheets[name] = {};
    // Use all statuses for the online sheets data.
    statuses.forEach(({ code }) => {
      if (code !== 'TOTAL') {
        onlineSheets[name][code] = {
          jobs: faker.number.int({ min: 0, max: 50 }),
          parcels: faker.number.int({ min: 0, max: 200 }),
        };
      }
    });

    slaSummary[name] = {};
    // Create 5 days of SLA data for each sheet.
    for (let i = 1; i <= 5; i++) {
      slaSummary[name][`Day ${i}`] = {};
      slaStatuses.forEach(({ code }) => {
        if (code !== 'TOTAL') {
          slaSummary[name][`Day ${i}`][code] = {
            jobs: faker.number.int({ min: 0, max: 10 }),
            parcels: faker.number.int({ min: 0, max: 40 }),
          };
        }
      });
    }
  });

  return { onlineSheets, slaSummary };
};
