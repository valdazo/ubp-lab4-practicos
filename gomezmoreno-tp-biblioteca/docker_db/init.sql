-- CREATE DATABASE IF NOT EXISTS bd_biblioteca;
USE bd_biblioteca;

-- drop table bd_biblioteca.libros;
-- drop table bd_biblioteca.socios;
-- drop table bd_biblioteca.prestamos;

create table bd_biblioteca.libros (
    id_Libro        varchar(9)      not null,
    titulo          varchar(255)    not null,
    cantidad        smallint        not null,
    primary key (id_Libro),
    check (cantidad > 0)
);

create table bd_biblioteca.socios (
    id_Socio    varchar(9)      not null,
    nombre      varchar(40)     not null,
    primary key (id_Socio)
);

create table bd_biblioteca.prestamos (
    idPrestamo          varchar(9)      not null,
    idSocio             varchar(9)      not null,
    idLibro             varchar(9)      not null,
    fechaVencimiento    bigint         not null,
    primary key (idPrestamo),
    foreign key (idLibro) references bd_biblioteca.libros(id_Libro),
    foreign key (idSocio) references bd_biblioteca.socios(id_Socio)
);