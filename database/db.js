import eventsData from "./events.json";

export const initDB = () => Promise.resolve();

export const getEventsWithDetails = () => {
  return new Promise((resolve) => {
    resolve(eventsData);
  });
};
