create table members
(
    id          SMALLINT    not null AUTO_INCREMENT,
    name        VARCHAR(50) not null,
    CONSTRAINT PK__members__END  PRIMARY KEY(id),
    CONSTRAINT CK__members__id__END CHECK(id>0)
);

create table books
(
    id          SMALLINT        NOT NULL AUTO_INCREMENT,
    title       VARCHAR(100)    NOT NULL,
    amount      SMALLINT        NOT NULL,
    CONSTRAINT  PK__books__END  PRIMARY KEY (id),
    CONSTRAINT  CK__books__id__END  CHECK (id>0)
);

create table loans
(
    id           SMALLINT not null AUTO_INCREMENT,
    memberId     SMALLINT NOT NULL,
    bookId       SMALLINT not null,
    expiracyDate INTEGER not null,
    CONSTRAINT PK__loans__END           PRIMARY KEY(id),
    CONSTRAINT FK__loans__books__END    FOREIGN KEY(bookId) REFERENCES books(id),
    CONSTRAINT FK__loans__members__END  FOREIGN KEY(memberId) REFERENCES members(id),
    CONSTRAINT CK__loans__id__END       CHECK(id>0)
);