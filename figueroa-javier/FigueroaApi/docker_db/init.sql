Create table Libros
(
    id_libro         VARCHAR(10)       NOT NULL,
    cantidad         INTEGER       NOT NULL,
    titulo_libro     VARCHAR (250)      NOT NULL,
    CONSTRAINT PK__Libros__END
    PRIMARY KEY (id_libro),
    CONSTRAINT CK__LIBROS__cantidad__END
    CHECK (cantidad>0)

);


CREATE TABLE Socios
(
    nombre          VARCHAR(250)            NOT NULL,
    id_socio              VARCHAR(10)        NOT null,
    CONSTRAINT PK__Socios__END
    PRIMARY KEY (id_socio)
);

CREATE table Prestamos
(
    id_prestamo     	 VARCHAR (10)        not null,
    id_socio          	 VARCHAR(10)        not NULL,
    id_libro       	 VARCHAR(10)        NOT NULL,
    fecha_vencimiento 	 BIGINT              not null,
    CONSTRAINT PK__Prestamos__END
    PRIMARY KEY (id_prestamo),
    CONSTRAINT FK__Prestamos__Libros__END
    FOREIGN KEY (id_libro) REFERENCES Libros(id_libro),
    CONSTRAINT FK__Prestamos__Socios__END
    FOREIGN KEY (id_socio) REFERENCES Socios(id_socio)

);
