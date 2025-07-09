CREATE TABLE app_user (
    id serial,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password bytea NOT NULL,
    date_of_birth date NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_appuser PRIMARY KEY (id),
    CONSTRAINT uq_appuser_email UNIQUE (email)
);
