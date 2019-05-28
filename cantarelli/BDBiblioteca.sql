CREATE TABLE socios
(
    id SMALLINT    NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT PK_socios PRIMARY KEY (id),
    CONSTRAINT CK_socios_id check(id > 0)
);

CREATE TABLE libros
(
    id SMALLINT NOT NULL,
    titulo  VARCHAR(100) NOT NULL,
    cantidad INTEGER NOT NULL,
    CONSTRAINT PK_libros PRIMARY KEY (id),
    CONSTRAINT CK_libros_id check(id > 0),
    CONSTRAINT CK_libros_cantidad check(cantidad > 0)
);

CREATE TABLE prestamos
(
    id          SMALLINT NOT NULL,
    idLibro     SMALLINT NOT NULL,
    idSocio     SMALLINT NOT NULL,
    fechaVencimiento INTEGER NOT NULL,
    CONSTRAINT PK_prestamos PRIMARY KEY (id),
    CONSTRAINT FK_prestamos_libro FOREIGN KEY (idLibro) REFERENCES libros(id),
    CONSTRAINT FK_prestamos_socio FOREIGN KEY (idSocio) REFERENCES socios(id),
    CONSTRAINT CK_prestamos_id check(id > 0)
);