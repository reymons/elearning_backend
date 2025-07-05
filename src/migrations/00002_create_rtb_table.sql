CREATE TABLE refresh_token_blacklist (
    token varchar(512) NOT NULL,
    user_id serial NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rtb PRIMARY KEY (token),

    CONSTRAINT fk_rtb_userid
        FOREIGN KEY (user_id)
        REFERENCES app_user(id)
        ON DELETE CASCADE
);
