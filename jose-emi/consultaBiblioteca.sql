create table libros(
    id_libro    VARCHAR(10)    not NULL,
    titulo      VARCHAR(255)    not NULL,
    cantidad    INTEGER         not NULL,
    CONSTRAINT PK__libros__END 
        PRIMARY KEY (id_libro),
    CONSTRAINT CK__libros__cantidad__END 
        CHECK(cantidad>0)
);

create table socios(
    id_socio    VARCHAR(10)         not NULL,
    nombre      VARCHAR(100)         not NULL,
    CONSTRAINT PK__socios__END
        PRIMARY KEY (id_socio)
);

create table prestamos(
    id_prestamo VARCHAR(10)         not NULL,
    id_libro    VARCHAR(10)         not NULL,
    id_socio    VARCHAR(10)         not NULL,
    fecha_vto   BIGINT              not NULL,
    CONSTRAINT  PK__prestamos__END
        PRIMARY KEY (id_prestamo),
    CONSTRAINT  FK__prestamos__libros__END
        FOREIGN KEY (id_libro) REFERENCES libros(id_libro),
    CONSTRAINT  FK__prestamos__socios__END
        FOREIGN KEY (id_socio) REFERENCES socios(id_socio)
);

select *
    from libros l
    where l.id_libro = id_libro