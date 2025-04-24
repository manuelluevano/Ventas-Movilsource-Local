// * fake data's
import { faker } from "@faker-js/faker";
import { listReports } from "./API/events";

const response = await listReports();
// console.log("Datos", response.reporte);

export function CreateRandomUser() {
  return response.reporte;
}

export const USERS = faker.helpers.multiple(CreateRandomUser, {
  count: 10,
});
