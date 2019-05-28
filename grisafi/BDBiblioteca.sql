create table socios
(
    id          SMALLINT    not null,
    nombre      VARCHAR(50) not null,
    CONSTRAINT PK__socios__END  PRIMARY KEY(id),
    CONSTRAINT CK__socios__idSocio__END CHECK(id>0)
);

create table libros
(
    id          SMALLINT        NOT NULL,
    titulo      VARCHAR(100)    NOT NULL,
    cantidad    SMALLINT        NOT NULL,
    CONSTRAINT  PK__libro__END  PRIMARY KEY (id),
    CONSTRAINT  CK__libro__id__END  CHECK (id>0)
);

create table prestamos
(
    id      SMALLINT not null,
    idSocio SMALLINT NOT NULL,
    idLibro SMALLINT not null,
    fechavencimiento INTEGER not null,
    CONSTRAINT PK__prestamos__END           PRIMARY KEY(id),
    CONSTRAINT FK__prestamos__libros__END   FOREIGN KEY(idLibro) REFERENCES libros(id),
    CONSTRAINT FK__prestamos__socios__END   FOREIGN KEY(idSocio) REFERENCES socios(id),
    CONSTRAINT CK__prestamos__id__END       CHECK(id>0)
);