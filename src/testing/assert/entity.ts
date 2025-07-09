import { PersonalUser, User } from "@/models/user";
import { faker } from "@faker-js/faker";

function define<T>({ mock, match }: { 
    mock?: () => T;
    match?: () => T;
}) {
    return {
        mock: (obj?: Partial<T>) => ({ ...mock?.(), ...obj }) as T,
        match: (obj?: Partial<T>) => ({ ...match?.(), ...obj }) as T,
    };
}

function mockId() {
    return faker.number.int({ min: 1 });
}

function expectId() {
    return expect.any(Number);
}

export const entity = {
    user: define<User>({
        mock: () => ({
            id: mockId(),
            password: faker.internet.password(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            date_of_birth: faker.date.birthdate().toDateString(),
            created_at: faker.date.recent().toISOString()
        })
    }),
    personalUser: define<PersonalUser>({
        match: () => ({
            id: expectId(),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            date_of_birth: expect.any(String),
            created_at: expect.any(String),
        })
    })
}

